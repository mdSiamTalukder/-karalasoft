/**
 * ------------------------------------------------------------------------------------
 * Products page — presentation copy.
 * ------------------------------------------------------------------------------------
 * Only the copy the CMS does not already provide. Product names, taglines, descriptions,
 * features, imagery and live links all come from `lib/products.ts`, so nothing here can
 * contradict the catalogue.
 *
 * NO statistics, customer names, testimonials or awards appear on this page — none are
 * verifiable from the CMS.
 */

/** Hero. */
export const PRODUCTS_HERO = {
  eyebrow: 'Products',
  title: 'Powering smarter business',
  highlight: 'operations with modern software.',
  lead: 'KaralaSoft builds and ships operational software — platforms for people, attendance and point-of-sale teams that run on real data instead of spreadsheets. Every product below is live, with its own dashboard and documentation.',
  primary: { label: 'Start a Project', href: '/contact' },
  secondary: { label: 'See our work', href: '/projects' },
} as const;

/**
 * “Built for real operations” — four areas, each traceable to a capability the products
 * already publish (Employee Management, Geo-fenced Attendance, Automated Onboarding and
 * Admin Dashboard). No invented functionality.
 */
export interface ProductOperation {
  readonly iconKey: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export const PRODUCT_OPERATIONS: readonly ProductOperation[] = [
  {
    iconKey: 'Users',
    label: 'People',
    title: 'One record per employee',
    description:
      'NID, salary structures, custom fields and full profiles live in one place, so HR stops reconciling spreadsheets.',
  },
  {
    iconKey: 'MapPin',
    label: 'Attendance',
    title: 'Clock-ins verified by location',
    description:
      'Geo-fenced validation checks distance before an employee can clock in, so attendance data can be trusted.',
  },
  {
    iconKey: 'Mail',
    label: 'Automation',
    title: 'Onboarding without the follow-up',
    description:
      'Account creation and email notifications are handled by the platform, so new hires are not left waiting.',
  },
  {
    iconKey: 'LayoutDashboard',
    label: 'Insights',
    title: 'Live figures, not month-end surprises',
    description:
      'Real-time statistics, attendance monitoring and department insight are on the dashboard, not in a report you run later.',
  },
];

/**
 * Architecture layers shown on the products page. Each row maps to a capability the
 * products already publish, so the diagram describes the real product rather than an
 * idealised one.
 */
export interface ProductLayer {
  readonly iconKey: string;
  readonly label: string;
  readonly detail: string;
}

/** Single-column spine (top to bottom). */
export const PRODUCT_ARCHITECTURE_TOP: readonly ProductLayer[] = [
  { iconKey: 'LayoutDashboard', label: 'Dashboard', detail: 'The interface your team works in' },
  { iconKey: 'Plug', label: 'API layer', detail: 'Documented contracts between screens and services' },
];

/** The three capabilities that sit beside each other under the API layer. */
export const PRODUCT_ARCHITECTURE_BRANCH: readonly ProductLayer[] = [
  { iconKey: 'ScanFace', label: 'Authentication', detail: 'Face recognition and role-based access' },
  { iconKey: 'Users', label: 'Business logic', detail: 'Profiles, attendance and payroll rules' },
  { iconKey: 'Network', label: 'Integrations', detail: 'SMTP email and GPS validation' },
];

/** Single-column spine (bottom). */
export const PRODUCT_ARCHITECTURE_BOTTOM: readonly ProductLayer[] = [
  { iconKey: 'Database', label: 'Database', detail: 'Employee records, attendance history' },
  { iconKey: 'CloudCog', label: 'Cloud', detail: 'Hosted, deployed and monitored' },
];

/**
 * “Why it matters” — outcomes, deliberately written without figures. Each item restates a
 * capability the products already publish; none introduces a new claim.
 */
export interface ProductValue {
  readonly iconKey: string;
  readonly title: string;
  readonly description: string;
}

export const PRODUCT_VALUES: readonly ProductValue[] = [
  {
    iconKey: 'Box',
    title: 'Operations in one place',
    description: 'People, attendance and access stop living in separate tools and separate files.',
  },
  {
    iconKey: 'Shield',
    title: 'Control by role',
    description:
      'Admin, HR Manager and Employee each see the parts of the system their work requires.',
  },
  {
    iconKey: 'MapPin',
    title: 'Attendance you can trust',
    description: 'Location checks mean the numbers reflect where people actually are.',
  },
  {
    iconKey: 'Workflow',
    title: 'Less manual work',
    description: 'Account creation, notifications and access are handled by the platform.',
  },
  {
    iconKey: 'Gauge',
    title: 'Decisions on live data',
    description: 'Department and attendance insight is available while it is still useful.',
  },
  {
    iconKey: 'Settings',
    title: 'Built to extend',
    description:
      'Custom fields and structured records mean the product grows with your process instead of against it.',
  },
];