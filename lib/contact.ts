import type { ContactErrors, ContactValues, SubmitResult } from './types';

/**
 * ------------------------------------------------------------------------------------
 * Contact form integration point.
 * ------------------------------------------------------------------------------------
 * There is intentionally **no backend** in this project. Set
 * `NEXT_PUBLIC_CONTACT_ENDPOINT` to a real endpoint (your own Next.js Route Handler,
 * an API gateway, Formspree, a CRM webhook, …) and the form will POST to it as JSON:
 *
 *   { "name": string, "email": string, "company": string, "need": string, "message": string }
 *
 * While the variable is empty the form runs in *preview mode*: it validates, shows the
 * loading and success states, and clearly labels the result as a preview.
 * ------------------------------------------------------------------------------------
 */
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '';

const PREVIEW_LATENCY_MS = 900;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_MIN = 2;
const MESSAGE_MIN = 20;

/** `true` when a real endpoint has been provided via `NEXT_PUBLIC_CONTACT_ENDPOINT`. */
export function isContactEndpointConfigured(): boolean {
  return CONTACT_ENDPOINT.length > 0;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const emptyContactValues: ContactValues = {
  name: '',
  email: '',
  company: '',
  need: '',
  message: '',
};

/** Client-side validation. Returns a field -> message map (empty when valid). */
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

/**
 * Submit the brief.
 * Resolves with a result object — network failures are converted into
 * `ok: false` results so callers never need a try/catch.
 */
export async function submitContactBrief(values: ContactValues): Promise<SubmitResult> {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    need: values.need,
    message: values.message.trim(),
  };

  if (!isContactEndpointConfigured()) {
    await delay(PREVIEW_LATENCY_MS);
    return { ok: true, preview: true };
  }

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await readErrorDetail(response);
      return {
        ok: false,
        preview: false,
        message:
          detail ??
          `The server responded with ${response.status}. Please try again or email us directly.`,
      };
    }

    return { ok: true, preview: false };
  } catch {
    return {
      ok: false,
      preview: false,
      message: 'We could not reach the server. Check your connection and try again.',
    };
  }
}

async function readErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === 'object' && 'message' in data) {
      const { message } = data as { message?: unknown };
      if (typeof message === 'string' && message.trim()) return message;
    }
  } catch {
    /* Response had no JSON body — fall back to the generic status message. */
  }
  return undefined;
}