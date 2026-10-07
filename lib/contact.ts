import type { ContactErrors, ContactValues, SubmitResult } from './types';

/**
 * ------------------------------------------------------------------------------------
 * Browser-side contact submission.
 * ------------------------------------------------------------------------------------
 * Client-safe by design: no Resend, no Zod, no server-only environment variables.
 * Posts to the Route Handler at `/api/contact`, which performs the authoritative
 * server-side validation and sends the email.
 *
 * Field names match `lib/contact-schema.ts` exactly:
 *   { name, email, company, need, message, website }
 * `website` is a honeypot — the visible form never asks for it, so real users send ''.
 * ------------------------------------------------------------------------------------
 */
export const CONTACT_ENDPOINT = '/api/contact';

/** Kept in step with the server schema so messages match before a round trip. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_MIN = 2;

/**
 * Exported so the form's live character counter reads the same constant the validation
 * enforces, rather than duplicating the number in the UI.
 */
export const MESSAGE_MIN = 20;

export const emptyContactValues: ContactValues = {
  name: '',
  email: '',
  company: '',
  need: '',
  message: '',
};

/** Immediate feedback only. The server re-validates and is authoritative. */
export function validateContactValues(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = 'Please tell us your name.';
  else if (name.length < NAME_MIN) errors.name = `Name must be at least ${NAME_MIN} characters.`;

  const email = values.email.trim();
  if (!email) errors.email = 'A work email is required so we can reply.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address.';

  if (!values.need) errors.need = 'Select what you need.';

  const message = values.message.trim();
  if (!message) errors.message = 'Add a short brief so we know what you want to build.';
  else if (message.length < MESSAGE_MIN)
    errors.message = `Brief must be at least ${MESSAGE_MIN} characters (currently ${message.length}).`;

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}

const FALLBACK_ERROR = 'Something went wrong while sending your message. Please try again.';

interface ApiResponse {
  success?: boolean;
  message?: string;
}

/**
 * POST the brief to `/api/contact`.
 *
 * `honeypot` MUST be the live value of the hidden `website` input. Hard-coding it to
 * `''` would make the honeypot useless against browser-driven bots, which fill every
 * input they can find — the server can only spot them if the client actually forwards
 * what they typed. A real visitor never sees the field, so it is always empty.
 *
 * Never throws: network and non-2xx responses are converted into a `SubmitResult`.
 */
export async function submitContactBrief(
  values: ContactValues,
  honeypot = '',
): Promise<SubmitResult> {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    need: values.need,
    message: values.message.trim(),
    website: honeypot,
  };

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    let body: ApiResponse = {};
    try {
      body = (await response.json()) as ApiResponse;
    } catch {
      /* Non-JSON response — fall through to the generic message. */
    }

    if (!response.ok || !body.success) {
      // 400 is a field problem the inline validation already surfaces, so show the
      // server's clean generic message rather than leaking anything internal.
      return { ok: false, message: body.message || FALLBACK_ERROR };
    }

    return { ok: true, message: body.message };
  } catch {
    return { ok: false, message: FALLBACK_ERROR };
  }
}