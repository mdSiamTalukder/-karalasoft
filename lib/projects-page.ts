/**
 * ------------------------------------------------------------------------------------
 * Projects page — presentation copy.
 * ------------------------------------------------------------------------------------
 * Only the copy the CMS does not provide. Project titles, categories, years,
 * descriptions, images, technologies and links all come from `lib/projects.ts`.
 *
 * There are deliberately NO statistics here beyond what is derived from the fetched
 * projects at render time (counts, categories, technologies). No client names,
 * testimonials, awards, revenue, budgets or timelines are claimed anywhere.
 */

/** Hero. */
export const PROJECTS_HERO = {
  eyebrow: 'Selected work',
  title: 'Products we’ve designed,',
  highlight: 'built, and shipped.',
  lead: 'KaralaSoft builds real digital products — marketplaces, operational platforms, commerce and AI systems. These are live builds with the code, the stack and the engineering behind them.',
  primary: { label: 'Start a Project', href: '/contact' },
  secondary: { label: 'Our services', href: '/services' },
} as const;

/**
 * Capability themes for “what we build”.
 *
 * `categories` lists the CMS category strings each theme summarises. They are matched
 * against the fetched projects at render time so the count shown beside each theme is
 * derived from real data, never invented. Categories the CMS does not publish are simply
 * ignored, and a theme with no matching project is not rendered.
 */
export interface ProjectCapability {
  readonly index: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly categories: readonly string[];
}

export const PROJECT_CAPABILITIES: readonly ProjectCapability[] = [
  {
    index: '01',
    label: 'Commerce & marketplaces',
    title: 'Marketplaces and storefronts',
    description:
      'Listing management, carts, checkout and the listing workflows a marketplace needs to stay usable.',
    categories: ['Car Buy & Sell Platform', 'Web Application', 'Marketing Website'],
  },
  {
    index: '02',
    label: 'Business operations',
    title: 'Operational platforms',
    description:
      'Finance, reservations, ticketing and CRM workflows built around how a team already operates.',
    categories: ['Business & Accounting', 'Support & CRM', 'Enterprise Solution'],
  },
  {
    index: '03',
    label: 'Data & backend',
    title: 'Backend systems',
    description:
      'The database and service layer underneath — modelled, containerised and ready to grow with load.',
    categories: ['Enterprise Backend System'],
  },
  {
    index: '04',
    label: 'Applied AI',
    title: 'Intelligent products',
    description:
      'AI features integrated as working product behaviour rather than a demo bolted onto a page.',
    categories: ['Artificial Intelligence'],
  },
];

/** Final CTA. */
export const PROJECTS_CTA = {
  eyebrow: 'Have a product in mind?',
  titleBefore: 'Let’s build something',
  titleAccent: 'worth shipping.',
  description:
    'Tell us what you are trying to build and we will come back with the shortest credible path to it.',
  primary: { label: 'Start a Project', href: '/contact' },
  secondary: { label: 'See our services', href: '/services' },
} as const;