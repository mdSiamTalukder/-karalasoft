/**
 * ------------------------------------------------------------------------------------
 * Product suite — public data source.
 * ------------------------------------------------------------------------------------
 * Mirrors the architecture already used by `lib/projects.ts`: the products shown on this
 * page are read from the same KaralaSoft CMS that backs the admin panel, rather than being
 * hardcoded, so a product added in the CMS appears here without a code change.
 *
 * ENDPOINT: https://admin.karalasoft.com/api/products  (public, no auth)
 * PROXY:     /api/products  -> app/api/products/route.ts  (same-origin, avoids CORS)
 *
 * FIELDS WE USE: `id`, `name`, `tagline`, `description`, `image_url`, `live_link`,
 * `order_index`, `features[] { icon, title, description }`.
 *
 * `price` and the CMS `created_at` / `updated_at` metadata are deliberately NOT read:
 * the products page does not display a price, and timestamps are internal CMS bookkeeping.
 *
 * Two real-world quirks this module normalises:
 *  1. `image_url` arrives site-relative and is served by the CMS host, not the public one:
 *       https://karalasoft.com/uploads/hrm-63264d4c557c.png -> 404
 *       https://admin.karalasoft.com/uploads/hrm-63264d4c557c.png -> 200
 *     so `/uploads/*` paths resolve against `PRODUCT_IMAGE_ORIGIN`.
 *  2. `icon` is a Lucide icon NAME (a string) coming from the CMS, so it is resolved
 *     through a fixed allow-list — an unknown name falls back to a neutral icon rather
 *     than reaching the DOM as a component name.
 * ------------------------------------------------------------------------------------
 */

import {
  Box,
  Building2,
  CalendarCheck,
  CloudCog,
  CreditCard,
  Database,
  Fingerprint,
  Gauge,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  Network,
  Package,
  ScanFace,
  Server,
  Settings,
  Shield,
  Sparkles,
  Store,
  Tags,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

import { normalizeLiveUrl } from './projects';

/**
 * One capability row attached to a product.
 *
 * `iconKey` is the CMS-provided Lucide icon NAME, kept as a string on purpose: these
 * records are handed from a server component to a client component, and a React component
 * function is not serialisable across that boundary. `getFeatureIcon()` resolves the name
 * to an actual icon on the client.
 */
export interface ProductFeature {
  /** CMS icon name, e.g. `"ScanFace"`. Never a component. */
  readonly iconKey: string;
  readonly title: string;
  readonly description: string;
}

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly imageUrl: string | null;
  /** Real destination from the API, or `null` when the product has none. */
  readonly liveUrl: string | null;
  readonly orderIndex: number;
  readonly features: readonly ProductFeature[];
}

/**
 * Public CMS endpoint that backs this page. Server-side only — see the proxy.
 * Overridable so the data layer can be exercised against a stub without touching the real
 * catalogue; it has no effect in normal operation.
 */
export const PRODUCT_API_URL =
  process.env.PRODUCTS_API_URL?.trim() || 'https://admin.karalasoft.com/api/products';

/** Same-origin route the browser calls (`app/api/products/route.ts`). */
export const PRODUCT_PROXY_URL = '/api/products';

/** Host that actually serves `/uploads/*` product imagery. */
export const PRODUCT_IMAGE_ORIGIN = 'https://admin.karalasoft.com';

/**
 * Resolve a CMS `image_url` into something `next/image` will load.
 * Absolute URLs pass through untouched.
 */
export function resolveProductImageUrl(imageUrl: string | null | undefined): string | null {
  if (typeof imageUrl !== 'string') return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${PRODUCT_IMAGE_ORIGIN}${trimmed}`;
  return null;
}

/**
 * CMS icon names we are willing to render. Anything outside this list resolves to
 * `Sparkles`, so an unrecognised value can never break rendering.
 */
const FEATURE_ICONS: Readonly<Record<string, LucideIcon>> = {
  ScanFace,
  MapPin,
  Users,
  Mail,
  LayoutDashboard,
  Shield,
  Store,
  Package,
  Tags,
  Building2,
  Server,
  Database,
  CloudCog,
  Workflow,
  Network,
  Settings,
  Gauge,
  CreditCard,
  Fingerprint,
  Lock,
  CalendarCheck,
  Box,
};

/** Normalise an untrusted CMS icon value into a non-empty key. */
function featureIconKey(iconName: unknown): string {
  const key = typeof iconName === 'string' ? iconName.trim() : '';
  return key || 'Sparkles';
}

/**
 * Resolve a CMS icon name to a Lucide component. Anything outside the allow-list falls back
 * to `Sparkles`, so an unknown value can never break rendering.
 * Call this in the client, not while building server payloads.
 */
export function getFeatureIcon(iconKey: string): LucideIcon {
  return FEATURE_ICONS[iconKey] ?? Sparkles;
}

/** Coerce one untrusted feature record. */
function toFeature(record: unknown): ProductFeature | null {
  if (!record || typeof record !== 'object') return null;
  const raw = record as Record<string, unknown>;

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null; // a feature card with no heading is meaningless

  return {
    iconKey: featureIconKey(raw.icon),
    title,
    description: typeof raw.description === 'string' ? raw.description.trim() : '',
  };
}

/** Coerce one untrusted record into a `Product`, or `null` if unusable. */
function toProduct(record: unknown): Product | null {
  if (!record || typeof record !== 'object') return null;
  const raw = record as Record<string, unknown>;

  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name) return null;

  const features = Array.isArray(raw.features)
    ? raw.features.map(toFeature).filter((f): f is ProductFeature => f !== null)
    : [];

  const order =
    typeof raw.order_index === 'number'
      ? raw.order_index
      : typeof raw.orderIndex === 'number'
        ? raw.orderIndex
        : Number.MAX_SAFE_INTEGER;

  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    name,
    tagline: typeof raw.tagline === 'string' ? raw.tagline.trim() : '',
    description: typeof raw.description === 'string' ? raw.description.trim() : '',
    imageUrl: resolveProductImageUrl(
      typeof raw.imageUrl === 'string'
        ? raw.imageUrl
        : typeof raw.image_url === 'string'
          ? raw.image_url
          : null,
    ),
    // Reuses the projects validator, so a non-http(s) scheme can never be rendered.
    liveUrl: normalizeLiveUrl(
      typeof raw.liveUrl === 'string' ? raw.liveUrl : typeof raw.live_link === 'string' ? raw.live_link : null,
    ),
    orderIndex: order,
    features,
  };
}

function normalise(records: unknown[]): Product[] {
  return records
    .map(toProduct)
    .filter((product): product is Product => product !== null)
    .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
}

/**
 * SERVER-SIDE: read the suite straight from the public CMS endpoint.
 * Used by `app/api/products/route.ts`.
 */
export async function fetchProductsFromApi(): Promise<Product[]> {
  const response = await fetch(PRODUCT_API_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Upstream products API responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Upstream products API returned an unexpected payload');
  }

  return normalise(payload);
}

/**
 * CLIENT-SIDE: read the suite from our own same-origin proxy, which calls
 * `fetchProductsFromApi()` server-side. Same-origin, so no CORS involved.
 */
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCT_PROXY_URL, {
    headers: { Accept: 'application/json' },
    ...(signal ? { signal } : {}),
  });

  if (!response.ok) {
    throw new Error(`Products proxy responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object') {
    throw new Error('Products proxy returned an unexpected payload');
  }

  const { products } = payload as { products?: unknown };
  if (!Array.isArray(products)) {
    throw new Error('Products proxy payload is missing a products array');
  }

  return normalise(products);
}

/**
 * Four capability highlights shown under the product preview image.
 * These are fixed statements about what the dashboard screenshot demonstrates, so they
 * describe the imagery rather than an individual product record.
 */
export const PREVIEW_HIGHLIGHTS: readonly { readonly label: string }[] = [
  { label: 'Real-time Dashboard' },
  { label: 'Attendance Reports' },
  { label: 'Employee Directory' },
  { label: 'Department Analytics' },
];