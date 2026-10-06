/**
 * ------------------------------------------------------------------------------------
 * Services — data source for the /services page.
 * ------------------------------------------------------------------------------------
 * Mirrors the architecture already established by `lib/projects.ts` and `lib/products.ts`:
 * the services shown on this page are read from the same KaralaSoft CMS that backs the
 * admin panel, rather than being hardcoded, so a service added in the CMS appears here
 * without a code change.
 *
 * ENDPOINT: https://admin.karalasoft.com/api/services  (public, no auth)
 *
 * FIELDS WE USE: `id`, `title`, `description`, `features[]`, `icon`, `order_index`.
 *
 * `details`, `color`, `icon_color`, `border_color` and the CMS `created_at` / `updated_at`
 * metadata are deliberately NOT used: `details` is null for every current record, the three
 * colour fields are emerald/teal Tailwind classes that belong to the reference site's
 * palette rather than this design system, and timestamps are internal CMS bookkeeping.
 * Icon colour here is derived from the brand tokens instead.
 *
 * Two real-world quirks this module normalises:
 *  1. `icon` is a Lucide icon NAME (a string) coming from the CMS, so it is resolved
 *     through a fixed allow-list in the client — an unknown name falls back to a neutral
 *     icon rather than reaching the DOM as a component name.
 *  2. Records without a `title` would produce a meaningless card, so they are dropped.
 * ------------------------------------------------------------------------------------
 */

import {
  Building2,
  CloudCog,
  Code2,
  Database,
  Globe,
  Grid2x2,
  Headphones,
  Layers,
  Lock,
  Monitor,
  Network,
  Plug,
  RefreshCcw,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** One service as published in the CMS. */
export interface Service {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  /** Capability bullet points, in the order the CMS lists them. */
  readonly features: readonly string[];
  /**
   * CMS-provided Lucide icon NAME, kept as a string on purpose: these records are handed
   * from a server component to a client component, and a React component function is not
   * serialisable across that boundary. `getServiceIcon()` resolves it on the client.
   */
  readonly iconKey: string;
  readonly orderIndex: number;
}

/**
 * Public CMS endpoint that backs this page. Server-side only.
 * Overridable so the data layer can be exercised against a stub; it has no effect in
 * normal operation.
 */
export const SERVICE_API_URL =
  process.env.SERVICES_API_URL?.trim() || 'https://admin.karalasoft.com/api/services';

/**
 * CMS icon names we are willing to render. Anything outside this list resolves to
 * `Sparkles`, so an unrecognised value can never break rendering.
 */
const SERVICE_ICONS: Readonly<Record<string, LucideIcon>> = {
  Code2,
  Rocket,
  Globe,
  Smartphone,
  Monitor,
  Plug,
  Database,
  RefreshCcw,
  Users,
  Building2,
  Headphones,
  Wrench,
};

/** Normalise an untrusted CMS icon value into a non-empty key. */
function serviceIconKey(icon: unknown): string {
  const key = typeof icon === 'string' ? icon.trim() : '';
  return key || 'Sparkles';
}

/**
 * Resolve a CMS icon name to a Lucide component. Call this in the client, not while
 * building a server payload.
 */
export function getServiceIcon(iconKey: string): LucideIcon {
  return SERVICE_ICONS[iconKey] ?? Sparkles;
}

/**
 * Extended icon set used by the /services sections (architecture diagram, capability
 * groups, deliverables). These are generic engineering glyphs, not technology claims.
 * Unknown keys fall back to `Sparkles` so a typo degrades instead of breaking the page.
 */
const SERVICES_UI_ICONS: Readonly<Record<string, LucideIcon>> = {
  ...SERVICE_ICONS,
  CloudCog,
  Code2,
  Grid2x2,
  Headphones,
  Layers,
  Lock,
  Monitor,
  Network,
  Shield,
  Sparkles,
};

export function serviceIcon(iconKey: string): LucideIcon {
  return SERVICES_UI_ICONS[iconKey] ?? Sparkles;
}

/** Coerce one untrusted record into a `Service`, or `null` if unusable. */
function toService(record: unknown): Service | null {
  if (!record || typeof record !== 'object') return null;
  const raw = record as Record<string, unknown>;

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null; // an untitled card would be meaningless

  const features = Array.isArray(raw.features)
    ? raw.features
        .filter((f): f is string => typeof f === 'string')
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  const order =
    typeof raw.order_index === 'number'
      ? raw.order_index
      : typeof raw.orderIndex === 'number'
        ? raw.orderIndex
        : Number.MAX_SAFE_INTEGER;

  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    title,
    description: typeof raw.description === 'string' ? raw.description.trim() : '',
    features,
    iconKey: serviceIconKey(raw.icon),
    orderIndex: order,
  };
}

function normalise(records: unknown[]): Service[] {
  return records
    .map(toService)
    .filter((service): service is Service => service !== null)
    .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
}

/**
 * SERVER-SIDE: read the service catalogue straight from the public CMS endpoint.
 * Called directly by `app/services/page.tsx`, so the full content is present in the
 * initial HTML.
 */
export async function fetchServicesFromApi(): Promise<Service[]> {
  const response = await fetch(SERVICE_API_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Upstream services API responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Upstream services API returned an unexpected payload');
  }

  return normalise(payload);
}

/* -------------------------------------------------------------------------- */
/*  Page copy                                                                 */
/*  Only the copy the reference page does not already provide. Service names, */
/*  descriptions and features all come from the CMS above.                      */
/* -------------------------------------------------------------------------- */

/** Hero, matching the reference page's wording. */
export const SERVICES_HERO = {
  eyebrow: 'What we do',
  title: 'Engineering that holds up',
  highlight: 'in production.',
  lead: 'End-to-end software solutions tailored to your vision. We combine technical expertise with strategic thinking to deliver products that scale.',
} as const;

/** Short introduction between the hero and the catalogue. */
export const SERVICES_INTRO = {
  eyebrow: 'Overview',
  title: 'Built to ship, not to stall',
  lead: 'KaralaSoft designs and engineers the software a business actually runs on — web platforms, mobile products, APIs, databases and the systems that hold them together. We work with founders validating a first release and with enterprises replacing legacy infrastructure.',
  points: [
    'One team from architecture through launch — no handoff between design, frontend and backend vendors.',
    'Modern, documented code that another engineer can pick up and extend.',
    'Responsive, accessible interfaces that hold up on a phone and on a desktop.',
  ],
} as const;

/**
 * “Why KaralaSoft” — concrete engineering value only.
 * Deliberately contains no statistics, client names, awards or certifications, because
 * none are verifiable from the CMS.
 */
export interface ServiceStrength {
  readonly iconKey: string;
  readonly title: string;
  readonly description: string;
}

export const SERVICE_STRENGTHS: readonly ServiceStrength[] = [
  {
    iconKey: 'Code2',
    title: 'Modern technology',
    description:
      'React, Next.js, TypeScript, Node, Python and cloud services — chosen for maintainability, not novelty.',
  },
  {
    iconKey: 'Plug',
    title: 'Scalable architecture',
    description:
      'Layered services, clean API contracts and infrastructure that survives a sudden jump in traffic.',
  },
  {
    iconKey: 'Database',
    title: 'Data done properly',
    description:
      'Schema design, indexing, migration and backup strategy treated as first-class work, not an afterthought.',
  },
  {
    iconKey: 'Smartphone',
    title: 'Responsive UX',
    description:
      'Layouts engineered for every breakpoint, with keyboard support and real accessibility built in from the start.',
  },
  {
    iconKey: 'RefreshCcw',
    title: 'Reliable delivery',
    description:
      'Version control, code review, CI/CD and a release process you can roll back without panic.',
  },
  {
    iconKey: 'Users',
    title: 'Clear communication',
    description:
      'Direct access to the people building your product, with regular progress updates in plain language.',
  },
];

/** Final CTA, matching the reference page's wording. */
export const SERVICES_CTA = {
  eyebrow: 'Start a project',
  title: 'Ready to start your project?',
  description:
    'Tell us what you are trying to build and we will come back with the shortest credible path to it.',
  action: { label: 'Start a project', href: '/contact' },
} as const;

/* -------------------------------------------------------------------------- */
/*  Selected work                                                            */
/* -------------------------------------------------------------------------- */

/**
 * “Selected work” selection, referenced by CMS project id and resolved against the
 * projects already fetched by `lib/projects.ts` — no project content is duplicated here.
 *
 * One larger featured project plus supporting cards:
 *   • Garirhat (1) — a real marketplace build with a working live URL.
 *   • Finance Management System (4) and Hotel Management System (6) — a business system and
 *     an enterprise platform, which is what the catalogue above describes.
 *
 * Ids that no longer exist in the CMS are skipped rather than breaking the section.
 *
 * Note: “POS System with Admin” (12) is deliberately excluded — its `image_url` is an
 * `/uploads/*` path that only resolves on the admin host, so its preview 404s publicly.
 * “E-Commerce Platform” (5) is excluded because its curated `live_link` resolves to an
 * ad-tracking URL rather than a real destination.
 */
export const SERVICES_FEATURED_PROJECT_ID = 1;
export const SERVICES_SUPPORTING_PROJECT_IDS: readonly number[] = [4, 6];

/* -------------------------------------------------------------------------- */
/*  Process                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Reuses the shared `ProcessStep` type and the shared `ProcessSection` component, with
 * Services-specific wording. The home page keeps its own six steps via the component's
 * defaults, so this list only affects /services.
 */
export const SERVICES_PROCESS = {
  eyebrow: 'How we work',
  title: 'A process you can follow',
  description:
    'Six stages, visible from the first call. You always know what is being worked on, what it needs from you, and what happens next.',
  steps: [
    {
      index: '01',
      phase: 'Discover',
      title: 'Understand the problem',
      description:
        'Goals, users, constraints and the systems you already run. We write it down before writing any code.',
    },
    {
      index: '02',
      phase: 'Plan',
      title: 'Agree the scope',
      description:
        'A realistic roadmap, a fixed first milestone and an honest answer on what fits in it.',
    },
    {
      index: '03',
      phase: 'Design',
      title: 'Make it usable',
      description:
        'Interface, flows and the underlying product logic, prototyped early enough to change cheaply.',
    },
    {
      index: '04',
      phase: 'Develop',
      title: 'Build in the open',
      description:
        'Iterative sprints on a shared environment, with a working build you can click at any point.',
    },
    {
      index: '05',
      phase: 'Test',
      title: 'Break it first',
      description:
        'Functional, integration, device and performance testing before your users find the edges.',
    },
    {
      index: '06',
      phase: 'Launch',
      title: 'Ship and hand over',
      description:
        'Deployment, monitoring, documentation and a walkthrough so your team owns what we built.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Capability grouping                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Services grouped into four engineering categories.
 *
 * `titles` reference service titles that already exist in the CMS — nothing here
 * introduces a service the catalogue does not publish. `ServicesCapabilities` resolves
 * each title against the fetched services, so a title that no longer exists is skipped
 * rather than rendered as an empty row, and an ungrouped service is appended to a
 * catch-all group so the grid can never silently drop a service.
 *
 * Note: "Cloud / DevOps" is deliberately absent — it is not a published service.
 */
export interface ServiceGroup {
  readonly key: string;
  readonly label: string;
  readonly summary: string;
  readonly iconKey: string;
  readonly titles: readonly string[];
}

export const SERVICE_GROUPS: readonly ServiceGroup[] = [
  {
    key: 'product',
    label: 'Product Engineering',
    summary: 'Discovery through release — interface, application and first version.',
    iconKey: 'Layers',
    titles: ['Software Development', 'Web Development', 'Mobile Development', 'MVP Development'],
  },
  {
    key: 'infrastructure',
    label: 'Engineering & Infrastructure',
    summary: 'The systems a product runs on: APIs, data, clients and migrations.',
    iconKey: 'Server',
    titles: [
      'API Development',
      'Database Development',
      'Desktop Development',
      'Software Modernization',
    ],
  },
  {
    key: 'delivery',
    label: 'Delivery & Team',
    summary: 'Capacity that plugs into your roadmap without slowing it down.',
    iconKey: 'Users',
    titles: ['IT Staff Augmentation', 'IT Outsourcing'],
  },
  {
    key: 'longterm',
    label: 'Long-Term Engineering',
    summary: 'Keeping what we shipped healthy after it goes live.',
    iconKey: 'Shield',
    titles: ['IT Support', 'Application Maintenance'],
  },
];

/** Group used for any published service not named in a category above. */
export const UNCATEGORISED_GROUP: Omit<ServiceGroup, 'titles'> & { titles: readonly string[] } = {
  key: 'other',
  label: 'Additional Services',
  summary: 'Other engineering practices from the catalogue.',
  iconKey: 'Grid2x2',
  titles: [],
};

/* -------------------------------------------------------------------------- */
/*  Deliverables — "What you get"                                              */
/* -------------------------------------------------------------------------- */

/**
 * Practical engineering outcomes. Every item maps to a capability the CMS services
 * already publish (QA & testing, CI/CD, OpenAPI documentation, rate limiting, data
 * migration, backup planning, cloud-native transformation, monitoring and incident
 * response), so no new promise is introduced here.
 */
export interface ServiceDeliverable {
  readonly iconKey: string;
  readonly title: string;
  readonly description: string;
}

export const SERVICE_DELIVERABLES: readonly ServiceDeliverable[] = [
  {
    iconKey: 'Code2',
    title: 'Production-ready code',
    description: 'Documented, reviewed and structured so another engineer can own it.',
  },
  {
    iconKey: 'Shield',
    title: 'Quality assurance & testing',
    description: 'Functional, integration and performance testing before release.',
  },
  {
    iconKey: 'Rocket',
    title: 'CI/CD delivery',
    description: 'Automated integration and deployment you can roll back.',
  },
  {
    iconKey: 'Plug',
    title: 'Documented APIs',
    description: 'RESTful and GraphQL contracts delivered with OpenAPI documentation.',
  },
  {
    iconKey: 'Lock',
    title: 'Rate limiting & security',
    description: 'Throttling, access control and hardening applied at the boundary.',
  },
  {
    iconKey: 'Database',
    title: 'Database design & migration',
    description: 'Schema design, performance tuning and safe data migration.',
  },
  {
    iconKey: 'CloudCog',
    title: 'Cloud-native transformation',
    description: 'Microservices and containerised deployment on AWS, Azure or GCP.',
  },
  {
    iconKey: 'Headphones',
    title: 'Monitoring & incident response',
    description: 'System monitoring and a defined path for handling incidents.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Architecture visual — hero right                                            */
/* -------------------------------------------------------------------------- */

/**
 * The stack diagram shown beside the hero. These are engineering *layers*, not services
 * or products, and each icon is a generic Lucide glyph rather than a technology claim.
 */
export interface ArchitectureLayer {
  readonly iconKey: string;
  readonly label: string;
  readonly detail: string;
}

export const ARCHITECTURE_LAYERS: readonly ArchitectureLayer[] = [
  { iconKey: 'Monitor', label: 'Frontend', detail: 'Responsive interfaces' },
  { iconKey: 'Plug', label: 'API', detail: 'REST · GraphQL · WebSocket' },
  { iconKey: 'Server', label: 'Backend', detail: 'Business logic & auth' },
  { iconKey: 'Database', label: 'Database', detail: 'SQL · NoSQL' },
  { iconKey: 'Network', label: 'Integrations', detail: 'Payments · email · AI' },
  { iconKey: 'CloudCog', label: 'Cloud', detail: 'Containerised deployment' },
];
