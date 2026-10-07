import {
  Boxes,
  Compass,
  Crosshair,
  Eye,
  Gauge,
  Layers,
  MessageSquareText,
  Monitor,
  Palette,
  Rocket,
  Scale,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

/**
 * ------------------------------------------------------------------------------------
 * About page — presentation copy
 * ------------------------------------------------------------------------------------
 * Every factual statement here is traceable to something that already exists in this
 * repository or its CMS:
 *
 *   • Founded 2020            → `siteConfig.foundedYear` (lib/site.ts)
 *   • Team of 12, role titles  → /api/team
 *   • 10 published projects   → /api/projects
 *   • Dhaka, Bangladesh       → existing `aboutLocationTitle`
 *   • New York · Dhaka · Remote → `siteConfig.locations`
 *   • Web / mobile / desktop / enterprise → existing `solutionAreas`
 *
 * There are deliberately NO invented figures here — no client counts, country counts,
 * revenue, awards or outcomes. Numeric facts on the page are derived at render time from
 * the two CMS endpoints (see `AboutStats`), never hard-coded, so they cannot drift from
 * the real data.
 */

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export const ABOUT_HERO = {
  eyebrow: 'About KaralaSoft',
  title: 'We engineer',
  highlight: 'digital products.',
  lead: 'KaralaSoft is a software and product engineering company. Since 2020 we have designed, built and maintained web applications, mobile apps, desktop software and connected enterprise platforms for organisations that need dependable systems rather than prototypes.',
  primary: { label: 'Start a project', href: '/contact' },
  secondary: { label: 'See our work', href: '/projects' },
} as const;

/** Short capability strip under the hero lead. Mirrors the verified solution areas. */
export const ABOUT_HERO_DISCIPLINES: readonly { label: string; icon: LucideIcon }[] = [
  { label: 'Product engineering', icon: Boxes },
  { label: 'Web applications', icon: Layers },
  { label: 'Mobile apps', icon: Smartphone },
  { label: 'Desktop software', icon: Monitor },
];

/* -------------------------------------------------------------------------- */
/*  Who we are                                                                */
/* -------------------------------------------------------------------------- */

export const ABOUT_WHO = {
  eyebrow: 'Who we are',
  title: 'A product engineering\ncompany, not a body shop.',
  description:
    'We are engineers, designers and strategists working as one team. That means the person shaping the interface is in the same room as the person writing the schema — so the product stays coherent from the first sketch to the release that follows it.',
  points: [
    {
      title: 'Software development',
      description:
        'Full-stack product work: front ends, back ends, APIs, integrations and the databases underneath them.',
    },
    {
      title: 'Digital products',
      description:
        'Turning an idea into something usable, maintainable and worth operating as a real product.',
    },
    {
      title: 'Business solutions',
      description:
        'Operational software shaped around how a team actually works — finance, inventory, reservations, support and back office.',
    },
    {
      title: 'Product engineering',
      description:
        'Architecture, code review and delivery practices designed so the system still makes sense a year later.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Why KaralaSoft                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Written as working principles, not achievement claims.
 * Each one describes how we work — nothing here asserts a metric, a client count or an
 * outcome that is not already recorded in the project data.
 */
export const ABOUT_WHY = {
  eyebrow: 'Why KaralaSoft',
  title: 'How we think\nabout the work.',
  principles: [
    {
      icon: Crosshair,
      title: 'Product-minded engineering',
      description:
        'Every technical decision is weighed against what it does for the product. We pick the approach a team can reason about six months from now, not the one that demos best today.',
    },
    {
      icon: Layers,
      title: 'Scalable architecture',
      description:
        'Data models and service boundaries are designed to absorb growth, so a feature added later does not require a rewrite to support it.',
    },
    {
      icon: MessageSquareText,
      title: 'Transparent collaboration',
      description:
        'Scope, trade-offs and progress are stated plainly. If something is at risk, you hear it from us before you notice it.',
    },
    {
      icon: Compass,
      title: 'Long-term product thinking',
      description:
        'We design for the second and third version, not only the launch — because most product decisions are really maintenance decisions in disguise.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Our story                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately NOT a timeline.
 *
 * The only verified historical fact in this repository is the founding year (2020, from
 * `siteConfig.foundedYear`). There is no recorded milestone history, so this stays a short
 * professional statement rather than an invented sequence of dated events.
 */
export const ABOUT_STORY = {
  eyebrow: 'Our story',
  title: 'Founded in 2020,\nstill engineering.',
  paragraphs: [
    'KaralaSoft started in 2020 in Dhaka, Bangladesh with a straightforward idea: that a software team should be judged on the systems it maintains, not only the ones it launches.',
    'The work has stayed broad — marketplaces, operational platforms, commerce, backend systems and applied AI — but the approach has not changed. Understand the problem, model it properly, build it carefully, and stay accountable for what runs afterwards.',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  How we work                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Process descriptions, not claims. Four phases passed to the shared `ProcessSection`,
 * which is already used by the home and services pages.
 */
export const ABOUT_PROCESS = {
  eyebrow: 'How we work',
  title: 'From first conversation\nto running in production.',
  description:
    'The same four phases across every engagement. What changes is the scope — not the discipline.',
  steps: [
    {
      index: '01',
      phase: 'DISCOVER',
      title: 'Understand the problem',
      description:
        'Who uses this, what they are trying to finish, what already exists and what the constraints really are.',
    },
    {
      index: '02',
      phase: 'DESIGN',
      title: 'Shape the solution',
      description:
        'Data model, service boundaries and interface structure agreed before implementation starts.',
    },
    {
      index: '03',
      phase: 'BUILD',
      title: 'Engineer the product',
      description:
        'Application, API and database built together, reviewed as it goes, and tested against real usage.',
    },
    {
      index: '04',
      phase: 'LAUNCH',
      title: 'Ship and support it',
      description:
        'Deployment, monitoring and handover — then staying reachable for whatever the system needs next.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Principles                                                                */
/* -------------------------------------------------------------------------- */

/** Reframed from the previous "core values" into engineering/product principles. */
export const ABOUT_PRINCIPLES = {
  eyebrow: 'Our principles',
  title: 'Six principles we\nactually work by.',
  values: [
    {
      icon: ShieldCheck,
      title: 'Build with purpose',
      description:
        'Code exists to serve a product decision. If a requirement has no reason behind it, we would rather discuss it than implement it.',
    },
    {
      icon: Gauge,
      title: 'Keep it scalable',
      description:
        'Structures, queries and interfaces are chosen so the next stage of growth does not require starting over.',
    },
    {
      icon: Rocket,
      title: 'Ship with ownership',
      description:
        'A release is not the end of our involvement. What we hand over is something we are willing to be called back about.',
    },
    {
      icon: Palette,
      title: 'Design for people',
      description:
        'Interfaces are judged by whether the person using them can finish their task — not by how the screens look in isolation.',
    },
    {
      icon: Eye,
      title: 'Stay technically honest',
      description:
        'We would rather flag a risk, a limitation or a hard trade-off now than discover it after launch.',
    },
    {
      icon: Scale,
      title: 'Write to be maintained',
      description:
        'Named clearly, tested where it matters and documented where it saves someone time. Code is read far more often than it is written.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Selected work                                                             */
/* -------------------------------------------------------------------------- */

export const ABOUT_WORK = {
  eyebrow: 'Selected work',
  title: 'Real products,\nshipped and running.',
  description:
    'Drawn from the same published catalogue that backs every case study on this site — real titles, real descriptions and real stacks, straight from our project data.',
} as const;

/* -------------------------------------------------------------------------- */
/*  Global delivery                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Location claims are limited to what the repository actually records:
 *   • aboutLocationTitle → "Based in Dhaka, Bangladesh"
 *   • siteConfig.locations → "New York · Dhaka · Remote"
 *
 * No country counts, no "clients in 12+ countries", no international-presence claims.
 */
export const ABOUT_DELIVERY = {
  eyebrow: 'Global delivery',
  title: 'Based in Dhaka, Bangladesh.',
  description:
    'KaralaSoft is based in Dhaka, Bangladesh and works remotely, with listed locations in New York and Dhaka. Engagements are delivered online, which keeps the team close to the product regardless of where each project is run from.',
} as const;

/* -------------------------------------------------------------------------- */
/*  Closing CTA                                                               */
/* -------------------------------------------------------------------------- */

export const ABOUT_CTA = {
  eyebrow: 'Work with us',
  title: 'Have a product in mind?',
  description:
    'Tell us what you are trying to build — a web application, a mobile app, business software or a platform that has outgrown its current tooling. We will help you get to the right scope, architecture and delivery plan.',
  action: { label: 'Start the conversation', href: '/contact' },
} as const;
