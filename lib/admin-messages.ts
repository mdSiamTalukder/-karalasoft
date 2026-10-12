/**
 * ------------------------------------------------------------------------------------
 * Admin messages — reading real contact submissions
 * ------------------------------------------------------------------------------------
 * The CMS stores contact-form submissions and exposes them to authenticated admins. The
 * read routes respond `401 {"detail":"Invalid or expired token"}` without a valid bearer
 * token, so they exist and are gated — they are NOT missing. `GET /api/messages` and
 * `GET /api/settings` answer `404`, which is what an absent route looks like, and is how
 * this was told apart from these two.
 *
 * The admin session already holds exactly that credential: `lib/admin-session.ts` keeps the
 * bearer token in the `karala_admin_token` httpOnly cookie, and `lib/admin-api.ts` sends it
 * as `Authorization: Bearer` for every other admin read (projects, products, team…). This
 * module reuses that same token, so messages are never exposed publicly.
 *
 * ## Why the field mapping is tolerant
 *
 * The upstream response shape has not been confirmed against live data, so `normalizeMessage`
 * accepts the documented submission fields (`name`, `email`, `company`, `need`, `message` —
 * see `lib/contact-schema.ts`) plus the common aliases a REST backend may use, and tolerates
 * both a bare array and a wrapped envelope. It never invents content: any field that is not
 * present comes back `null` and the UI says so rather than showing a placeholder value.
 */

import { AdminApiError } from '@/lib/admin-api';

/** A single contact submission, normalised to the fields the UI renders. */
export interface AdminMessage {
  /** Stable identifier from the API, used for the details route. */
  readonly id: string;
  readonly name: string | null;
  readonly email: string | null;
  readonly company: string | null;
  /** The "what do you need" choice from the contact form. */
  readonly need: string | null;
  /** Present only if the stored record has one — the public form has no subject field. */
  readonly subject: string | null;
  /** Profile photo, only if the record genuinely carries one. Normally `null`. */
  readonly avatarUrl: string | null;
  /**
   * Optional sender details the Project Brief form does **not** collect.
   *
   * Always `null` for records created by the public form. They are mapped only so that a
   * record which genuinely carries one is shown rather than silently dropped — never
   * inferred, and never rendered as an empty placeholder.
   */
  readonly phone: string | null;
  readonly website: string | null;
  /** The complete body. Never truncated. */
  readonly message: string | null;
  readonly createdAt: string | null;
  /** `null` when the API exposes no read/unread flag, so the UI omits it. */
  readonly isRead: boolean | null;
}

type Json = Record<string, unknown>;

/** Read-only candidates, most specific first. Both confirmed to exist (401 when unauthenticated). */
const LIST_PATHS = ['/api/contact', '/api/contact/messages'] as const;

function isJson(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

/** Look up the first present key across a list of aliases. */
function pick(source: Json, keys: readonly string[]): unknown {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function pickStr(source: Json, keys: readonly string[]): string | null {
  return str(pick(source, keys));
}

/** Sender details may be flat on the record or nested under a sender/contact/user object. */
function nestedSender(source: Json): Json | null {
  const nested = pick(source, ['sender', 'contact', 'visitor', 'user', 'from', 'submitter']);
  return isJson(nested) ? nested : null;
}

/** `from` is often `Name <email@example.com>`; recover whichever part is usable. */
function splitFromValue(value: string): { name: string | null; email: string | null } {
  const angle = /<([^>]+)>/.exec(value);
  if (angle) {
    const email = angle[1]?.trim() ?? null;
    const name = value.slice(0, value.indexOf('<')).trim().replace(/^["']|["']$/g, '');
    return { name: name.length > 0 ? name : null, email };
  }
  return { name: null, email: /@/.test(value) ? value.trim() : null };
}

function readFlag(source: Json): boolean | null {
  const raw = pick(source, ['is_read', 'isRead', 'read', 'unread', 'status', 'state', 'read_at', 'readAt']);
  if (raw === undefined) return null;

  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') {
    const value = raw.trim().toLowerCase();
    if (value === 'read') return true;
    if (value === 'unread' || value === 'new') return false;
    return null;
  }
  // A non-null timestamp means it has been read.
  if (typeof raw === 'number' && raw > 0) return true;
  return null;
}

/**
 * Convert one raw record into an `AdminMessage`, or `null` if it is not an object at all.
 * Unknown fields are simply absent — never filled with invented text.
 */
export function normalizeMessage(raw: unknown, fallbackIndex: number): AdminMessage | null {
  if (!isJson(raw)) return null;

  const nested = nestedSender(raw);
  const merged: Json = { ...(nested ?? {}), ...raw };

  const fromRaw = pickStr(raw, ['from', 'sender']);

  const id =
    pickStr(raw, ['id', 'message_id', 'messageId', 'uuid', '_id', 'contact_id']) ??
    `index-${fallbackIndex}`;

  const need = pickStr(raw, ['need', 'topic', 'subject', 'inquiry_type', 'category', 'type']);
  const subject = pickStr(raw, ['subject', 'title']);

  return {
    id,
    name: pickStr(merged, ['name', 'sender_name', 'senderName', 'full_name', 'fullName', 'contact_name']) ??
      splitFromValue(fromRaw ?? '').name,
    email:
      pickStr(merged, ['email', 'sender_email', 'senderEmail', 'contact_email', 'reply_to', 'replyTo']) ??
      splitFromValue(fromRaw ?? '').email,
    company: pickStr(merged, ['company', 'organisation', 'organization', 'company_name']),
    need,
    subject,
    avatarUrl: pickStr(raw, [
      'avatar_url',
      'avatar',
      'image_url',
      'imageUrl',
      'photo_url',
      'photo',
      'profile_image',
      'picture',
    ]),
    phone: pickStr(raw, [
      'phone',
      'phone_number',
      'phoneNumber',
      'telephone',
      'mobile',
      'contact_number',
      'contactNumber',
    ]),
    website: pickStr(raw, [
      'website',
      'website_url',
      'websiteUrl',
      'web_url',
      'webUrl',
      'homepage',
      'site_url',
    ]),
    message: pickStr(merged, ['message', 'body', 'content', 'text', 'description']),
    createdAt: pickStr(merged, [
      'created_at',
      'createdAt',
      'submitted_at',
      'submittedAt',
      'created',
      'sent_at',
      'date',
      'timestamp',
      'created_date',
    ]),
    isRead: readFlag(raw),
  };
}

/** Accept a bare array or the usual envelope shapes, returning the records inside. */
function extractList(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!isJson(payload)) return null;

  for (const key of ['results', 'messages', 'contacts', 'items', 'data', 'submissions']) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
  }
  return null;
}

/**
 * Fetch every stored contact submission for the signed-in admin.
 *
 * Tries each known read path in turn and returns the first that succeeds. Throws
 * `AdminApiError` when none succeed, so the page can show a real error state instead of an
 * empty-looking inbox.
 */
export async function listAdminMessages(
  token: string,
  signal?: AbortSignal,
): Promise<AdminMessage[]> {
  let lastError: AdminApiError | null = null;

  for (const path of LIST_PATHS) {
    let payload: unknown;

    try {
      payload = await fetchMessagesFrom(path, token, signal);
    } catch (error) {
      if (error instanceof AdminApiError) {
        lastError = error;
        continue;
      }
      throw error;
    }

    const records = extractList(payload);
    if (records === null) continue;

    return records
      .map((record, index) => normalizeMessage(record, index))
      .filter((message): message is AdminMessage => message !== null);
  }

  throw (
    lastError ??
    new AdminApiError(404, 'The admin service exposes no readable messages endpoint.')
  );
}

/* Re-declared locally to avoid a circular import with `lib/admin-api.ts`. */
async function fetchMessagesFrom(path: string, token: string, signal?: AbortSignal): Promise<unknown> {
  const { ADMIN_API_BASE } = await import('@/lib/admin-api');

  const response = await fetch(`${ADMIN_API_BASE}${path}`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
    ...(signal ? { signal } : {}),
  });

  if (!response.ok) {
    throw new AdminApiError(response.status, `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return [];

  return response.json();
}

/** Newest first. Undated records sort last, then by id for a stable order. */
export function sortMessagesByDate(messages: readonly AdminMessage[]): AdminMessage[] {
  return [...messages].sort((a, b) => {
    const left = a.createdAt ? Date.parse(a.createdAt) : Number.NaN;
    const right = b.createdAt ? Date.parse(b.createdAt) : Number.NaN;
    if (Number.isFinite(left) && Number.isFinite(right) && left !== right) return right - left;
    if (Number.isFinite(left) !== Number.isFinite(right)) return Number.isFinite(left) ? -1 : 1;
    return a.id.localeCompare(b.id);
  });
}

/** Short preview for the inbox list — the details view always shows the full body. */
export function previewOf(message: AdminMessage, max = 140): string {
  const body = (message.message ?? '').replace(/\s+/g, ' ').trim();
  if (!body) return '';
  return body.length <= max ? body : `${body.slice(0, max).trimEnd()}…`;
}

/** Format an ISO timestamp, returning `null` when absent or unparseable. */
export function formatMessageDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return new Date(parsed).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }) + ' UTC';
}

/**
 * Hosts already permitted by `images.remotePatterns` in `next.config.ts`.
 *
 * `next/image` throws at render time for a remote host that is not configured, so a photo
 * on any other origin must never reach it. Rather than widening the image config for a
 * field the contact form does not collect, unknown hosts resolve to `null` and the avatar
 * falls back to initials.
 */
const ALLOWED_IMAGE_HOSTS = new Set(['karalasoft.com', 'admin.karalasoft.com']);

/** Resolve a stored photo to an absolute URL, or `null` when it is absent/unusable. */
export async function safeAvatarUrl(raw: string | null): Promise<string | null> {
  if (!raw) return null;
  const { resolveMediaUrl } = await import('@/lib/admin-api');
  const resolved = resolveMediaUrl(raw);
  if (!resolved) return null;
  try {
    const url = new URL(resolved);
    return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * A `mailto:` link that opens the admin's mail client with the original message quoted.
 *
 * This only builds a link — it sends nothing and exposes nothing, because the browser hands
 * the draft to the user's own mail client. Returns `null` when there is no sender address,
 * so the UI can omit the action entirely instead of rendering a dead button.
 */
export function replyMailto(message: AdminMessage): string | null {
  if (!message.email) return null;

  const subject = message.subject ?? message.need ?? 'Your message';
  const quoted = (message.message ?? '').trim();
  const when = formatMessageDate(message.createdAt);

  const body = [
    '',
    '',
    '--- Original message ---',
    ...(when ? [`Received: ${when}`] : []),
    ...(message.name ? [`From: ${message.name}`] : []),
    ...(message.company ? [`Company: ${message.company}`] : []),
    ...(message.need ? [`Interested in: ${message.need}`] : []),
    '',
    quoted,
  ].join('\n');

  return `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${subject}`)}&body=${encodeURIComponent(body)}`;
}