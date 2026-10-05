import { z } from 'zod';

/**
 * ------------------------------------------------------------------------------------
 * Server-side contact form contract.
 * ------------------------------------------------------------------------------------
 * IMPORTANT: this mirrors the EXISTING form fields in `components/contact/ContactForm.tsx`
 * — `name`, `email`, `company`, `need`, `message`. The form has no `subject` input; the
 * `need` select (service type) plays that role and is required, exactly as on the client.
 *
 * This module is SERVER-ONLY (imported solely by `app/api/contact/route.ts`).
 * The browser keeps its own lightweight validation in `lib/contact.ts` so that Zod is
 * never bundled to the client — this file is the single source of truth at the boundary.
 * ------------------------------------------------------------------------------------
 */

/**
 * Honeypot field name. Hidden from humans and assistive tech; automated fillers that
 * complete every input are caught here. A genuine submission always sends `''`.
 *
 * NOTE: this field lives inside the single request object on purpose. Building it as a
 * separate schema combined with `.and()` silently disables the parent's `.strict()` key
 * rejection in Zod v4, which would let unknown fields through unvalidated.
 */
export const HONEYPOT_FIELD = 'website';

export const contactRequestSchema = z
  .object({
    name: z
      .string({ error: 'Name is required.' })
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(120, 'Name must be 120 characters or fewer.'),

    email: z
      .string({ error: 'Email is required.' })
      .trim()
      .min(1, 'Email is required.')
      .max(254, 'Email must be 254 characters or fewer.')
      // Zod v4 top-level email validator, applied after trimming.
      .pipe(z.email('Enter a valid email address.')),

    company: z
      .string()
      .trim()
      .max(160, 'Company must be 160 characters or fewer.')
      .optional()
      .default(''),

    /** Service interest — the form's stand-in for a "subject". */
    need: z
      .string({ error: 'Please choose what you need.' })
      .trim()
      .min(1, 'Please choose what you need.')
      .max(120, 'Please choose a shorter option.'),

    message: z
      .string({ error: 'Message is required.' })
      .trim()
      .min(20, 'Message must be at least 20 characters.')
      .max(5000, 'Message must be 5000 characters or fewer.'),

    /**
     * Spam trap. Bots fill this in; humans never see it.
     *
     * Deliberately NOT constrained to be empty here — a filled honeypot must parse
     * successfully so the route can answer with a harmless success-like response.
     * Enforcing "must be empty" in the schema would turn it into a 400, which both
     * breaks the intended behaviour and lets a bot infer that a trap exists.
     * The route checks `isHoneypotTripped()` and silently discards the submission.
     */
    [HONEYPOT_FIELD]: z
      .string()
      .max(200, 'Request rejected.')
      .optional()
      .or(z.literal('')),
  })
  // Reject any key the server does not know about.
  .strict();

export type ContactRequest = z.infer<typeof contactRequestSchema>;

/** The visitor-supplied fields, minus the honeypot. */
export type ContactFields = Omit<ContactRequest, typeof HONEYPOT_FIELD>;

/**
 * Maximum accepted request body size. Anything larger is rejected before parsing so a
 * malicious client cannot force a large allocation.
 */
export const MAX_BODY_BYTES = 16 * 1024;

/** Thrown for bodies over {@link MAX_BODY_BYTES}; distinct from validation failure. */
export class PayloadTooLargeError extends Error {
  constructor() {
    super('Request body too large');
    this.name = 'PayloadTooLargeError';
  }
}

/**
 * Parse and validate an untrusted request body.
 * Throws {@link PayloadTooLargeError}, `SyntaxError` for malformed JSON, or a `ZodError`.
 */
export async function parseContactRequest(raw: string): Promise<ContactRequest> {
  if (raw.length > MAX_BODY_BYTES) throw new PayloadTooLargeError();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new SyntaxError('Request body is not valid JSON');
  }

  return contactRequestSchema.parse(parsed);
}

/** `true` when the submission tripped the honeypot. */
export function isHoneypotTripped(submission: ContactRequest): boolean {
  return Boolean(submission[HONEYPOT_FIELD]);
}

/**
 * Field-level messages for server-side logging only.
 * Never returned to the browser — the API answers with a generic 400.
 */
export function describeIssues(error: z.ZodError): Record<string, string> {
  const output: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_root';
    output[key] ??= issue.message;
  }
  return output;
}