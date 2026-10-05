/**
 * ------------------------------------------------------------------------------------
 * Project showcase — public data source.
 * ------------------------------------------------------------------------------------
 * The public site (https://karalasoft.com/projects) renders its showcase from a CMS
 * endpoint, so we read the same endpoint rather than inventing projects.
 *
 * PUBLIC FIELDS WE USE: `id`, `title`, `category`, `year`, `description`, `tags`,
 * `image_url`, `live_link`, `order_index`.
 * The endpoint also returns `created_at` / `updated_at` — internal CMS metadata that is
 * deliberately NOT read, stored or displayed.
 *
 * Two real-world quirks this module normalises:
 *  1. `image_url` is site-relative and served by the PUBLIC host:
 *       https://admin.karalasoft.com/images/projects/x.png -> 404
 *       https://karalasoft.com/images/projects/x.png       -> 200
 *     Paths are therefore resolved against `PROJECT_IMAGE_ORIGIN`.
 *  2. Only one of the ten records currently carries a `live_link`. Projects without one
 *     are rendered as plain cards — we never fabricate a destination URL.
 * ------------------------------------------------------------------------------------
 */

export interface Project {
  readonly id: number;
  readonly title: string;
  readonly category: string;
  readonly year: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly imageUrl: string | null;
  /** Real destination from the API, or `null` when the project has none. */
  readonly liveUrl: string | null;
  readonly orderIndex: number;
}

/** Public CMS endpoint that backs the showcase. Server-side only — see the proxy. */
export const PROJECT_API_URL = 'https://admin.karalasoft.com/api/projects';

/** Same-origin route the browser calls (`app/api/projects/route.ts`). */
export const PROJECT_PROXY_URL = '/api/projects';

/** Host that actually serves the project imagery. */
export const PROJECT_IMAGE_ORIGIN = 'https://karalasoft.com';

/** Turn a relative or absolute `image_url` into something `next/image` accepts. */
export function resolveProjectImageUrl(imageUrl: string | null | undefined): string | null {
  if (typeof imageUrl !== 'string') return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${PROJECT_IMAGE_ORIGIN}${trimmed}`;
  return null;
}

/**
 * Accept a `live_link` only when it is a genuine absolute http(s) URL.
 * Returns `null` otherwise so we never render a guessed or broken destination.
 */
export function normalizeLiveUrl(liveUrl: string | null | undefined): string | null {
  if (typeof liveUrl !== 'string') return null;
  const trimmed = liveUrl.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/** Coerce one untrusted record into a `Project`, or `null` if unusable. */
function toProject(record: unknown): Project | null {
  if (!record || typeof record !== 'object') return null;
  const raw = record as Record<string, unknown>;

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null; // an untitled card would be meaningless

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    : [];

  const order =
    typeof raw.orderIndex === 'number'
      ? raw.orderIndex
      : typeof raw.order_index === 'number'
        ? raw.order_index
        : Number.MAX_SAFE_INTEGER;

  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    title,
    category: typeof raw.category === 'string' ? raw.category.trim() : '',
    year: typeof raw.year === 'string' ? raw.year.trim() : '',
    description: typeof raw.description === 'string' ? raw.description.trim() : '',
    tags,
    imageUrl: resolveProjectImageUrl(
      typeof raw.imageUrl === 'string' ? raw.imageUrl : typeof raw.image_url === 'string' ? raw.image_url : null,
    ),
    liveUrl: normalizeLiveUrl(typeof raw.liveUrl === 'string' ? raw.liveUrl : typeof raw.live_link === 'string' ? raw.live_link : null),
    orderIndex: order,
  };
}

function normalise(records: unknown[]): Project[] {
  return records
    .map(toProject)
    .filter((project): project is Project => project !== null)
    .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
}

/**
 * SERVER-SIDE: read the showcase straight from the public CMS endpoint.
 * Used by `app/api/projects/route.ts`.
 */
export async function fetchProjectsFromApi(): Promise<Project[]> {
  const response = await fetch(PROJECT_API_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Upstream projects API responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Upstream projects API returned an unexpected payload');
  }

  return normalise(payload);
}

/**
 * CLIENT-SIDE: read the showcase from our own same-origin proxy, which calls
 * `fetchProjectsFromApi()` server-side. Same-origin, so no CORS involved.
 */
export async function fetchProjects(signal?: AbortSignal): Promise<Project[]> {
  const response = await fetch(PROJECT_PROXY_URL, {
    headers: { Accept: 'application/json' },
    ...(signal ? { signal } : {}),
  });

  if (!response.ok) {
    throw new Error(`Projects proxy responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object') {
    throw new Error('Projects proxy returned an unexpected payload');
  }

  const { projects } = payload as { projects?: unknown };
  if (!Array.isArray(projects)) {
    throw new Error('Projects proxy payload is missing a projects array');
  }

  return normalise(projects);
}