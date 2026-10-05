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

/**
 * ------------------------------------------------------------------------------------
 * Curated live URLs.
 * ------------------------------------------------------------------------------------
 * The CMS `live_link` field is only populated for one of the ten projects, so these are
 * the confirmed public destinations for the remaining projects, keyed by project title.
 *
 * Applied in `toProject()` as an override of the API value; anything absent from this map
 * keeps whatever the API returned (so "POS System with Admin" is unaffected).
 *
 * Every value is validated by `normalizeLiveUrl()` before it can reach a card, so a
 * non-http(s) scheme could never be rendered as a link.
 * ------------------------------------------------------------------------------------
 */
const PROJECT_LIVE_URLS: Readonly<Record<string, string>> = {
  'garirhat': 'https://garirhat.com/',
  'wingsblast': 'https://www.wingsblast.com/',
  'ai chat bot':
    'https://aws.amazon.com/?nc2=h_home&refid=8b3736ea-3d32-47c9-b37e-0b328c6d92bc',
  'finance management system': 'https://www.odoo.com/',
  'e-commerce platform':
    'https://ads.google.com/intl/en_all/start/overview/?subid=bd-en-gdn-awa-pr-a-pmx!o3~CjwKCAjwlY3WBhANEiwApsNrLQ3fXqBUWdiP4PUO6s7AoiI35FW9BXeMs8XrVsG1CW5aZQ1cQUeDmhoCnDQQAvD_BwE~~~21215869349~&gclsrc=aw.ds&gad_source=1&gad_campaignid=21215869850&gclid=CjwKCAjwlY3WBhANEiwApsNrLQ3fXqBUWdiP4PUO6s7AoiI35FW9BXeMs8XrVsG1CW5aZQ1cQUeDmhoCnDQQAvD_BwE',
  'hotel management system': 'https://orbitasmartlock.com/',
  'ticket management system':
    'https://elevenlabs.io/conversational-ai?utm_source=google&utm_medium=cpc&utm_campaign=t3_nonbrandsearch_conversationalai_english&utm_id=22916818293&utm_term=customer%20service%20voice&utm_content=conversational_ai_-_call_and_support&gad_source=1&gad_campaignid=22916818293&gbraid=0AAAAA_PU6FayDH8QUylWku8Fg_0Po-OvN&gclid=CjwKCAjwlY3WBhANEiwApsNrLU61m2jWSZqK32vOCI7GxBFimNQnfe3Xo-3z_-B2WH4G1Qx1H-PrGhoCLPAQAvD_BwE',
  'database management system': 'https://www.solarwinds.com/',
  'e-commerce landing page':
    'https://www.bitrix24.com/crm/crm-alternative.php?utm_source=google&utm_medium=cpc&utm_campaign=20768088199-158300317089&gad_source=1&gad_campaignid=20768088199&gbraid=0AAAAADJNAbIQS2EeyynMhi--jI3-NUnJZ&gclid=CjwKCAjwlY3WBhANEiwApsNrLZiukI8LC8aMkX0cCIE2uHiHgu7L7GCqEpjaVbtFMt1mUUzj7RQhiBoCw90QAvD_BwE',
};

/** Case/whitespace-insensitive lookup key for a project title. */
function liveUrlKey(title: string): string {
  return title.trim().toLowerCase();
}

/**
 * The curated destination for a project title, or `null` when the project has no
 * confirmed URL. Runs through the same scheme validation as any other link.
 */
export function curatedLiveUrl(title: string): string | null {
  const candidate = PROJECT_LIVE_URLS[liveUrlKey(title)];
  return candidate === undefined ? null : normalizeLiveUrl(candidate);
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
    // Curated destination wins; otherwise fall back to the API's own `live_link`.
    // Projects in neither list (e.g. "POS System with Admin") keep the API value.
    liveUrl:
      curatedLiveUrl(title) ??
      normalizeLiveUrl(
        typeof raw.liveUrl === 'string' ? raw.liveUrl : typeof raw.live_link === 'string' ? raw.live_link : null,
      ),
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