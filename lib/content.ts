import {
  ArrowLeftRight,
  CircleDot,
  Command,
  Grid2x2,
  LayoutGrid,
  Plus,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

import type { MarqueeItem, Metric, ProcessStep, ProductCard, ShowcaseGrid, ServiceCard, TechItem } from './types';

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export const heroMetrics: readonly Metric[] = [
  { value: '50+', label: 'Projects delivered' },
  { value: '12+', label: 'Countries served' },
  { value: '5+ yrs', label: 'Product engineering' },
];

export const rotatingWords: readonly string[] = [
  'SaaS Platforms',
  'Mobile Apps',
  'AI Products',
  'Web Systems',
  'APIs & Integrations',
];

/* -------------------------------------------------------------------------- */
/*  Marquee                                                                   */
/* -------------------------------------------------------------------------- */

export const marqueeLabels: readonly MarqueeItem[] = [
  { label: 'SOFTWARE DEVELOPMENT' },
  { label: 'MVP DEVELOPMENT' },
  { label: 'WEB APPLICATIONS' },
  { label: 'MOBILE APPS' },
  { label: 'APIs & INTEGRations' },
  { label: 'AI-ENABLED PRODUCTS' },
];

/* -------------------------------------------------------------------------- */
/*  Home — “What we do”                                                       */
/* -------------------------------------------------------------------------- */

export const homeServices: readonly ServiceCard[] = [
  {
    glyph: '◫',
    icon: LayoutGrid,
    title: 'Custom Software',
    description: 'Purpose-built platforms, dashboards, workflows, CRM/ERP and operational systems.',
    tags: [{ label: 'Architecture' }, { label: 'Frontend' }, { label: 'Backend' }],
    tilt: true,
  },
  {
    glyph: '⚡',
    icon: Zap,
    title: 'MVP Development',
    description:
      'Move from idea to real user feedback quickly — without building a throwaway prototype.',
    tags: [{ label: 'Discovery' }, { label: 'UX' }, { label: 'Rapid Build' }],
    tilt: true,
  },
  {
    glyph: '✦',
    icon: Sparkles,
    title: 'AI Product Engineering',
    description: 'Turn AI into useful product features, intelligent workflows and automation.',
    tags: [{ label: 'LLM' }, { label: 'Automation' }, { label: 'Data' }],
    tilt: true,
  },
  {
    glyph: '⌘',
    icon: Command,
    title: 'Web Development',
    description:
      'High-performance SaaS apps, portals, marketplaces and modern digital experiences.',
    tags: [],
    tilt: true,
  },
  {
    glyph: '◉',
    icon: CircleDot,
    title: 'Mobile Apps',
    description: 'Fast and intuitive mobile products for iOS and Android, backed by scalable APIs.',
    tags: [],
    tilt: true,
  },
  {
    glyph: '＋',
    icon: Plus,
    title: 'Team Extension',
    description: 'Add experienced engineers to your team while keeping your roadmap moving.',
    tags: [],
    tilt: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Services page                                                             */
/* -------------------------------------------------------------------------- */

export const servicesPageCards: readonly ServiceCard[] = [
  {
    glyph: '◫',
    icon: LayoutGrid,
    title: 'Software Development',
    description:
      'Custom business platforms, dashboards, portals, automation and scalable backend systems.',
    tags: [{ label: 'Architecture' }, { label: 'Frontend' }, { label: 'Backend' }],
  },
  {
    glyph: '⚡',
    icon: Zap,
    title: 'MVP Development',
    description:
      'Focused first releases that test the right assumptions and create a strong technical foundation.',
    tags: [{ label: 'Product Strategy' }, { label: 'UX' }, { label: 'Launch' }],
  },
  {
    glyph: '⌘',
    icon: Command,
    title: 'Web Development',
    description:
      'High-performance websites, SaaS products, marketplaces, portals and rich web applications.',
    tags: [{ label: 'React' }, { label: 'Next.js' }, { label: 'CMS' }],
  },
  {
    glyph: '◉',
    icon: CircleDot,
    title: 'Mobile Development',
    description:
      'Native and cross-platform mobile products with thoughtful UX and reliable backend integration.',
    tags: [{ label: 'iOS' }, { label: 'Android' }, { label: 'Flutter' }],
  },
  {
    glyph: '↔',
    icon: ArrowLeftRight,
    title: 'API Development',
    description:
      'Secure APIs, system integrations, payments, CRM connections and third-party services.',
    tags: [{ label: 'REST' }, { label: 'GraphQL' }, { label: 'Integration' }],
  },
  {
    glyph: '＋',
    icon: Plus,
    title: 'IT Staff Augmentation',
    description:
      'Extend your engineering capacity with experienced developers who can integrate quickly.',
    tags: [{ label: 'Dedicated Talent' }, { label: 'Flexible Scale' }],
  },
];

/* -------------------------------------------------------------------------- */
/*  Products page — bento                                                     */
/* -------------------------------------------------------------------------- */

export const productCards: readonly ProductCard[] = [
  {
    glyph: '▦',
    icon: Grid2x2,
    title: 'SaaS Platforms',
    description: 'Subscription products, dashboards, portals and operational tools.',
  },
  {
    glyph: '⌁',
    icon: Command,
    title: 'Business Systems',
    description: 'CRM, ERP, workflow, reporting and internal productivity software.',
  },
  {
    glyph: '✦',
    icon: Sparkles,
    title: 'AI-enabled Tools',
    description: 'Assistants, automation, knowledge workflows and intelligent features.',
  },
  {
    glyph: '◎',
    icon: Target,
    title: 'Mobile Products',
    description: 'Customer-facing applications and field-operation experiences.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Showcase grids (home + projects)                                          */
/* -------------------------------------------------------------------------- */

export const homeShowcase: ShowcaseGrid = {
  feature: {
    eyebrow: 'CASE STUDY TEMPLATE',
    title: 'Enterprise Operations Platform',
    meta: 'Strategy · UX · Engineering · Cloud',
    size: 'large',
  },
  stack: [
    {
      title: 'AI Workflow Product',
      meta: 'MVP · AI · API',
      size: 'small',
    },
    {
      title: 'Mobile Customer Experience',
      meta: 'iOS · Android · Backend',
      size: 'small',
    },
  ],
};

export const projectsShowcase: ShowcaseGrid = {
  feature: {
    eyebrow: 'CASE STUDY TEMPLATE',
    title: 'Fintech / Enterprise Platform',
    meta: 'Problem → Product → Engineering → Result',
    size: 'large',
  },
  stack: [
    {
      title: 'AI / SaaS Product',
      meta: 'Strategy · MVP · Scale',
      size: 'small',
    },
    {
      title: 'Operations Platform',
      meta: 'Workflow · Dashboard · API',
      size: 'small',
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Process                                                                   */
/* -------------------------------------------------------------------------- */

export const processSteps: readonly ProcessStep[] = [
  {
    index: '01',
    phase: 'DISCOVER',
    title: 'Understand the opportunity',
    description: 'Goals, users, constraints, priorities and roadmap.',
  },
  {
    index: '02',
    phase: 'DESIGN',
    title: 'Make complexity feel simple',
    description: 'UX flows, interface system, prototype and product logic.',
  },
  {
    index: '03',
    phase: 'ENGINEER',
    title: 'Build for the real world',
    description: 'Clean code, scalable backend, integrations and CI/CD.',
  },
  {
    index: '04',
    phase: 'TEST',
    title: 'Break it before users do',
    description: 'Functional, integration, device and performance testing.',
  },
  {
    index: '05',
    phase: 'LAUNCH',
    title: 'Release with confidence',
    description: 'Deployment, monitoring, analytics and operational readiness.',
  },
  {
    index: '06',
    phase: 'GROW',
    title: 'Keep improving',
    description: 'Support, experimentation, optimization and new features.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Tech stack                                                                */
/* -------------------------------------------------------------------------- */

export const techStack: readonly TechItem[] = [
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'TypeScript' },
  { name: 'Vue' },
  { name: 'Angular' },
  { name: 'Node.js' },
  { name: 'Python' },
  { name: 'Go' },
  { name: 'Java' },
  { name: '.NET' },
  { name: 'Flutter' },
  { name: 'React Native' },
  { name: 'Swift' },
  { name: 'Kotlin' },
  { name: 'AWS' },
  { name: 'Azure' },
  { name: 'GCP' },
  { name: 'Docker' },
  { name: 'Kubernetes' },
  { name: 'PostgreSQL' },
  { name: 'MongoDB' },
  { name: 'Redis' },
  { name: 'OpenAI' },
  { name: 'PyTorch' },
];