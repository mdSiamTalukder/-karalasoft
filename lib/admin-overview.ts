/**
 * ------------------------------------------------------------------------------------
 * Admin dashboard overview — real content counts
 * ------------------------------------------------------------------------------------
 * Backs the `/admin` summary cards. Every number here is derived from the same live CMS
 * collections the public site already reads, using the existing cached server fetchers:
 *
 *   projects → fetchProjectsFromApi()   (lib/projects.ts)
 *   products → fetchProductsFromApi()   (lib/products.ts)
 *   team     → fetchTeamMembersFromApi()(lib/team.ts)
 *   services → fetchServicesFromApi()   (lib/services.ts)
 *
 * No new endpoints and no admin-scoped write APIs are introduced — these are the same
 * public read endpoints the site already depends on, so the counts cannot drift from what
 * is actually published.
 *
 * `null` means **unknown**, not zero. A collection is only `0` when the API answered
 * successfully and returned nothing; a failed request yields `null` so the UI can show an
 * honest "No data available" state instead of a misleading empty-looking card.
 */

/** Read-only catalogue endpoints, keyed by the label shown on the dashboard. */
export type AdminCollection = 'projects' | 'products' | 'team' | 'services' | 'messages';

export interface AdminCollectionStatus {
  /** `null` when the count is unknown (request failed or no source exists). */
  readonly count: number | null;
  /** Populated when this collection could not be read. */
  readonly error: string | null;
}

export type AdminOverview = Record<AdminCollection, AdminCollectionStatus>;

/**
 * There is no messages endpoint on the CMS — `GET /api/messages` responds 404 — so no
 * message count can be read and none is invented. The dashboard renders the card in its
 * "no data available" state until such an endpoint exists.
 */
export const MESSAGES_UNAVAILABLE =
  'No messages endpoint is published by the CMS, so this count cannot be read.';

type Counter = () => Promise<number>;

const READERS: Record<Exclude<AdminCollection, 'messages'>, Counter> = {
  projects: async () => (await import('@/lib/projects')).fetchProjectsFromApi().then((r) => r.length),
  products: async () => (await import('@/lib/products')).fetchProductsFromApi().then((r) => r.length),
  team: async () =>
    (await import('@/lib/team')).fetchTeamMembersFromApi().then((r) => r.length),
  services: async () => (await import('@/lib/services')).fetchServicesFromApi().then((r) => r.length),
};

/** Read every collection concurrently; one failure never blocks the others. */
export async function loadAdminOverview(): Promise<AdminOverview> {
  const keys = Object.keys(READERS) as (keyof typeof READERS)[];

  const settled = await Promise.allSettled(keys.map((key) => READERS[key]()));

  const overview = {} as AdminOverview;

  keys.forEach((key, index) => {
    const result = settled[index];
    if (!result) {
      overview[key] = { count: null, error: 'Could not be read from the CMS just now.' };
      return;
    }
    overview[key] =
      result.status === 'fulfilled'
        ? { count: result.value, error: null }
        : { count: null, error: 'Could not be read from the CMS just now.' };
  });

  overview.messages = { count: null, error: MESSAGES_UNAVAILABLE };

  return overview;
}
