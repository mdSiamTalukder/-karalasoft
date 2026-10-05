/**
 * ------------------------------------------------------------------------------------
 * Team roster — public data source.
 * ------------------------------------------------------------------------------------
 * The public site (https://karalasoft.com/about) renders its team section from a CMS
 * endpoint. We read the same public endpoint so names, roles and photos are real
 * rather than hardcoded.
 *
 * PUBLIC FIELDS WE USE: `id`, `name`, `position`, `image_url`, `order_index`.
 * The endpoint also returns `bio`, `created_at` and `updated_at` — internal CMS
 * metadata that is intentionally NOT read, stored or displayed.
 *
 * `image_url` arrives as a site-relative path (e.g. "/team/abu_ahmmed.png") and is
 * served by the PUBLIC site host, not the admin API host:
 *   https://admin.karalasoft.com/team/abu_ahmmed.png  -> 404
 *   https://karalasoft.com/team/abu_ahmmed.png        -> 200 image/png
 * ------------------------------------------------------------------------------------
 */

export interface TeamMember {
  readonly id: number;
  readonly name: string;
  readonly position: string;
  readonly imageUrl: string | null;
  readonly orderIndex: number;
}

/** Public CMS endpoint that backs the team roster. Server-side only — see the proxy. */
export const TEAM_API_URL = 'https://admin.karalasoft.com/api/team';

/** Same-origin route the browser calls (`app/api/team/route.ts`). */
export const TEAM_PROXY_URL = '/api/team';

/** Host that actually serves `/team/*` image assets. */
export const TEAM_IMAGE_ORIGIN = 'https://karalasoft.com';

/**
 * Turn the API's `image_url` into an absolute URL we can hand to `next/image`.
 * Returns `null` for missing/blank values so the caller can render a fallback.
 */
export function resolveTeamImageUrl(imageUrl: string | null | undefined): string | null {
  if (typeof imageUrl !== 'string') return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;

  // Already absolute — leave it alone.
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // Site-relative path — resolve against the public site origin.
  if (trimmed.startsWith('/')) return `${TEAM_IMAGE_ORIGIN}${trimmed}`;

  // Anything else is not a usable asset reference.
  return null;
}

/**
 * Initials for the no-photo fallback.
 *
 * Uses the first letter of the first two words, which handles the "MD <Name>" honorific
 * used across the roster naturally: "MD Siam Talukder" -> "MS", "Abu Ahmmed" -> "AA".
 */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? parts[1]?.[0] ?? '' : '';
  return (first + second).toUpperCase() || '?';
}

/** Coerce one untrusted record into a `TeamMember`, or `null` if unusable.
 *
 * Accepts both shapes:
 *  - the raw CMS record  — `{ name, position, image_url, order_index }`
 *  - our proxy's output  — `{ name, position, imageUrl, orderIndex }`
 */
function toTeamMember(record: unknown): TeamMember | null {
  if (!record || typeof record !== 'object') return null;
  const raw = record as Record<string, unknown>;

  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name) return null; // a nameless card would be meaningless

  // Already normalised by the proxy?
  const imageUrl =
    typeof raw.imageUrl === 'string'
      ? resolveTeamImageUrl(raw.imageUrl)
      : resolveTeamImageUrl(typeof raw.image_url === 'string' ? raw.image_url : null);

  const order =
    typeof raw.orderIndex === 'number'
      ? raw.orderIndex
      : typeof raw.order_index === 'number'
        ? raw.order_index
        : Number.MAX_SAFE_INTEGER;

  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    name,
    position: typeof raw.position === 'string' ? raw.position.trim() : '',
    imageUrl,
    orderIndex: order,
  };
}

/**
 * SERVER-SIDE: read the roster straight from the public CMS endpoint.
 * Used by `app/api/team/route.ts`. Never call this from a client component — the API
 * sends no `Access-Control-Allow-Origin`, so browsers cannot reach it cross-origin.
 *
 * Throws on failure or an unexpected payload so the caller can surface an error state.
 */
export async function fetchTeamMembersFromApi(): Promise<TeamMember[]> {
  const response = await fetch(TEAM_API_URL, {
    headers: { Accept: 'application/json' },
    // Roster changes rarely — let the platform serve a fresh copy hourly.
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Upstream team API responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Upstream team API returned an unexpected payload');
  }

  return normalise(payload);
}

/**
 * CLIENT-SIDE: read the roster from our own same-origin proxy, which calls
 * `fetchTeamMembersFromApi()` on the server. Same-origin, so no CORS involved.
 *
 * Throws on failure or an unexpected payload so the caller can render an error state.
 */
export async function fetchTeamMembers(signal?: AbortSignal): Promise<TeamMember[]> {
  const response = await fetch(TEAM_PROXY_URL, {
    headers: { Accept: 'application/json' },
    ...(signal ? { signal } : {}),
  });

  if (!response.ok) {
    throw new Error(`Team proxy responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object') {
    throw new Error('Team proxy returned an unexpected payload');
  }

  const { members } = payload as { members?: unknown };
  if (!Array.isArray(members)) {
    throw new Error('Team proxy payload is missing a members array');
  }

  return normalise(members);
}

/** Drop unusable records and order the roster. */
function normalise(records: unknown[]): TeamMember[] {
  return records
    .map(toTeamMember)
    .filter((member): member is TeamMember => member !== null)
    .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
}