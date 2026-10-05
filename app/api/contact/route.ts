import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ZodError } from 'zod';

import {
  MAX_BODY_BYTES,
  PayloadTooLargeError,
  describeIssues,
  isHoneypotTripped,
  parseContactRequest,
} from '@/lib/contact-schema';
import type { ContactRequest } from '@/lib/contact-schema';
import { renderContactEmail } from '@/lib/contact-email';

/**
 * ------------------------------------------------------------------------------------
 * POST /api/contact
 * ------------------------------------------------------------------------------------
 * Validates the submission with Zod, then emails it to the site owner via Resend.
 * Nothing is persisted — no database, no file writes, no auth.
 *
 * The Resend API key is read from the server-only `RESEND_API_KEY` variable and is never
 * referenced from any client component, so it cannot leak into the browser bundle.
 * ------------------------------------------------------------------------------------
 */

export const runtime = 'nodejs';

/** Generic client-facing messages — never leak internals. */
const GENERIC_VALIDATION = 'Please check your form information.';
const GENERIC_FAILURE = 'Something went wrong while sending your message. Please try again.';
/** Returned to bots that trip the honeypot, so the protection is not disclosed. */
const HONEYPOT_ACCEPTED = 'Thanks! Your message has been sent successfully.';

/* -------------------------------------------------------------- rate limiting */

// Best-effort, per-instance throttle. Deliberately in-memory: it needs no database and
// no extra dependency. On serverless/multi-instance deploys each instance keeps its own
// counter, so treat this as a light abuse brake rather than a hard guarantee.
// 10/minute tolerates shared office / carrier NAT IPs while still stopping scripted bursts;
// the honeypot is the primary spam defence.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitHits = new Map<string, number[]>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateLimitHits.get(key) ?? []).filter((at) => now - at < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitHits.set(key, recent);
    return true;
  }
  recent.push(now);
  rateLimitHits.set(key, recent);
  return false;
}

/* ------------------------------------------------------------------ responses */

function json(body: { success: boolean; message: string }, status: number) {
  return NextResponse.json(body, { status });
}

const badRequest = () => json({ success: false, message: GENERIC_VALIDATION }, 400);
const serverError = () => json({ success: false, message: GENERIC_FAILURE }, 500);

export async function POST(request: Request) {
  const ip = clientKey(request);
  if (isRateLimited(ip)) {
    // Deliberately 429 with a clean body; the raw limiter message is not exposed.
    console.warn('[contact] rate limit exceeded');
    return json({ success: false, message: GENERIC_FAILURE }, 429);
  }

  // 1. Reject oversized bodies before reading/parsing them.
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ success: false, message: GENERIC_FAILURE }, 413);
  }

  // 2. Read and parse the body.
  let submission: ContactRequest;
  try {
    submission = await parseContactRequest(await request.text());
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return json({ success: false, message: GENERIC_FAILURE }, 413);
    }
    if (error instanceof SyntaxError) {
      console.warn('[contact] invalid JSON body');
      return badRequest();
    }
    if (error instanceof ZodError) {
      // Field detail is logged for developers but deliberately not returned.
      console.warn('[contact] validation failed', describeIssues(error));
      return badRequest();
    }
    throw error;
  }

  // 3. Honeypot — silently accept, never send, never reveal the protection.
  if (isHoneypotTripped(submission)) {
    console.warn('[contact] honeypot triggered — message discarded');
    return json({ success: true, message: HONEYPOT_ACCEPTED }, 200);
  }

  // 4. Server-only configuration.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_RECEIVER_EMAIL?.trim();
  // Falls back to Resend's shared onboarding sender so the first test works before a
  // custom domain is verified. Set CONTACT_FROM_EMAIL once your domain is verified.
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || 'onboarding@resend.dev';

  if (!apiKey || !to) {
    console.error('[contact] missing server configuration', {
      hasApiKey: Boolean(apiKey),
      hasReceiver: Boolean(to),
    });
    return serverError();
  }

  // 5. Send.
  try {
    const resend = new Resend(apiKey);
    const email = renderContactEmail(submission);

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      // Lets the site owner reply straight to the visitor. The visitor's address is
      // deliberately NOT used as `from`.
      replyTo: submission.email,
    });

    if (error) {
      console.error('[contact] Resend rejected the message', {
        name: error.name,
        statusCode: error.statusCode,
        message: error.message,
      });
      return serverError();
    }

    if (!data?.id) {
      console.error('[contact] Resend returned no message id');
      return serverError();
    }

    console.log('[contact] message sent', { id: data.id, topic: submission.need });
    return json(
      { success: true, message: "Thanks! Your message has been sent successfully. We'll get back to you soon." },
      200,
    );
  } catch (error) {
    // Network fault, DNS failure, invalid key, etc. Log the detail, return a clean 500.
    console.error('[contact] unexpected error while sending', error);
    return serverError();
  }
}

/** Explicit 405 so a misdirected GET is unambiguous. */
export async function GET() {
  return json({ success: false, message: 'Method not allowed. Use POST.' }, 405);
}