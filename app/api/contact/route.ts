import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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
 * Validates the submission with Zod, then emails it to the site owner over Hostinger SMTP
 * via Nodemailer. Nothing is persisted — no database, no file writes, no auth.
 *
 * Credentials come only from server-side environment variables: `HOSTINGER_EMAIL_PASSWORD`
 * (the password for the contact@karalasoft.com mailbox). None of them are referenced from a
 * client component, so they cannot leak into the browser bundle. The password is never
 * logged — only booleans describing what was present.
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

/* ------------------------------------------------------------ failure diagnosis */

/**
 * Turn an SMTP/Nodemailer failure into a one-line, actionable hint for the server log.
 *
 * The client always receives only GENERIC_FAILURE, so without this the sole record of *why*
 * a send failed is an opaque 500. SMTP failures are usually configuration, so each branch
 * names the specific variable or setting to check.
 *
 * Returns `null` when nothing specific can be said — the raw error is logged either way.
 */
function explainSmtpFailure(error: {
  code?: string;
  command?: string;
  responseCode?: number;
  response?: string;
}): string | null {
  const code = error.code ?? '';
  const message = (error.response ?? '').toLowerCase();

  if (code === 'EAUTH' || message.includes('authentication') || message.includes('535')) {
    return (
      'SMTP authentication failed. Check HOSTINGER_EMAIL_PASSWORD is the correct password for ' +
      'the contact@karalasoft.com mailbox (not a Gmail or hosting-panel password), and that the ' +
      'account has SMTP enabled in Hostinger.'
    );
  }

  if (code === 'ECONNECTION' || code === 'ETIMEDOUT' || code === 'ECONNREFUSED') {
    return (
      `Could not reach the SMTP server (${error.code}). Check outbound SMTP is allowed on port ` +
      '465 for this server/host.'
    );
  }

  if (code === 'ETLS' || message.includes('certificate') || message.includes('ssl')) {
    return 'TLS handshake failed on the secure SMTP connection. Port 465 expects implicit TLS (secure: true).';
  }

  if (error.responseCode === 550 || message.includes('550')) {
    return 'SMTP server rejected the recipient (550). Confirm the mailbox exists and can receive mail.';
  }

  if (error.responseCode === 552 || message.includes('552') || message.includes('message size')) {
    return 'SMTP server rejected the message body (552). The message may exceed the server size limit.';
  }

  if (code === 'EENVELOPE' || message.includes('from')) {
    return 'SMTP server rejected the sender address. Confirm CONTACT_FROM_EMAIL is a mailbox on this SMTP account.';
  }

  return null;
}

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
  const password = process.env.HOSTINGER_EMAIL_PASSWORD?.trim();
  const host = process.env.SMTP_HOST?.trim() || 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT?.trim() || '465');
  const account = process.env.SMTP_USER?.trim() || 'contact@karalasoft.com';
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || account;
  // Enquiries go to the contact mailbox unless a different recipient is configured.
  const to = process.env.CONTACT_RECEIVER_EMAIL?.trim() || account;

  if (!password) {
    console.error('[contact] missing server configuration', {
      missing: ['HOSTINGER_EMAIL_PASSWORD'],
      hint: 'Set HOSTINGER_EMAIL_PASSWORD in .env.local to the contact@karalasoft.com mailbox password, then restart the dev server.',
    });
    return serverError();
  }

  // 5. Send.
  try {
    const email = renderContactEmail(submission);

    const transporter = nodemailer.createTransport({
      host,
      port,
      // Port 465 is implicit TLS: the connection is encrypted from the first byte, so no
      // STARTTLS upgrade is negotiated.
      secure: port === 465,
      auth: { user: account, pass: password },
    });

    // Nodemailer rejects on failure rather than returning an error object, so this
    // catch is where SMTP problems surface.
    const info = await transporter.sendMail({
      from,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      // Lets the site owner reply straight to the visitor. The visitor's address is
      // deliberately NOT used as `from`.
      replyTo: submission.email,
    });

    if (!info?.messageId) {
      console.error('[contact] SMTP transport returned no message id', { from, to });
      return serverError();
    }

    console.log('[contact] message sent', {
      messageId: info.messageId,
      topic: submission.need,
      accepted: info.accepted?.length ?? 0,
    });
    return json(
      { success: true, message: "Thanks! Your message has been sent successfully. We'll get back to you soon." },
      200,
    );
  } catch (error) {
    // Auth, TLS, connection or recipient rejection. Log the actionable detail for
    // developers while the client keeps receiving only GENERIC_FAILURE. The password is
    // never logged, and neither is the visitor's message.
    const smtpError = error as { code?: string; command?: string; responseCode?: number; response?: string };
    const hint = explainSmtpFailure(smtpError);
    console.error('[contact] SMTP send failed', {
      code: smtpError.code,
      command: smtpError.command,
      responseCode: smtpError.responseCode,
      response: smtpError.response,
      message: error instanceof Error ? error.message : String(error),
      host,
      port,
      from,
      to,
      ...(hint ? { hint } : {}),
    });
    return serverError();
  }
}

/** Explicit 405 so a misdirected GET is unambiguous. */
export async function GET() {
  return json({ success: false, message: 'Method not allowed. Use POST.' }, 405);
}