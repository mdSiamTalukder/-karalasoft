import {
  Award,
  Globe,
  Handshake,
  Heart,
  Layers,
  Lightbulb,
  MessageSquareText,
  Monitor,
  Rocket,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

import type { ContactChannel, CoreValue } from './types';

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

/** Opening statement shown under the page heading. */
export const aboutLead =
  'KaralaSoft was founded in 2020 with a vision to deliver world-class software solutions. We’re a dedicated team of engineers, designers, and strategists who combine elite technical expertise with personalized service.';

/** What the company does today. */
export const aboutStory =
  'Today, we partner with forward-thinking startups and enterprises to build scalable web applications, mobile solutions, desktop software, and enterprise platforms that drive real business growth.';

/**
 * The four solution areas named in the company story, given their own cards so the
 * section carries visual weight instead of a single paragraph.
 */
export const solutionAreas: readonly CoreValue[] = [
  {
    icon: Globe,
    title: 'Web Applications',
    description: 'Scalable web products built for real users and real load.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Solutions',
    description: 'Mobile experiences that stay fast and dependable in the field.',
  },
  {
    icon: Monitor,
    title: 'Desktop Software',
    description: 'Native desktop tooling for teams that work without a browser.',
  },
  {
    icon: Layers,
    title: 'Enterprise Platforms',
    description: 'Connected platforms that drive genuine business growth.',
  },
];

/** Roster intro. */
export const teamIntro =
  'A passionate group of engineers, designers, and business professionals dedicated to delivering exceptional results for every client.';

export const coreValues: readonly CoreValue[] = [
  {
    icon: Award,
    title: 'Excellence First',
    description:
      'We hold ourselves to the highest standards of code quality, security, and performance. Every line matters.',
  },
  {
    icon: Rocket,
    title: 'Move Fast',
    description:
      'Agile development without sacrificing quality. We ship features weekly and iterate based on data.',
  },
  {
    icon: Handshake,
    title: 'True Partnership',
    description:
      'We’re not just vendors—we’re an extension of your team, invested in your long-term success.',
  },
  {
    icon: Heart,
    title: 'Client Obsessed',
    description:
      'Your success is our success. We go above and beyond to exceed expectations on every engagement.',
  },
  {
    icon: ShieldCheck,
    title: 'Security First',
    description:
      'Enterprise-grade security practices baked into every project from day one. No shortcuts.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description:
      'We stay at the cutting edge of technology, bringing the latest best practices to every project.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Contact                                                                   */
/* -------------------------------------------------------------------------- */

export const projectNeeds: readonly string[] = [
  'What do you need?',
  'Software Development',
  'MVP Development',
  'Web Development',
  'Mobile Development',
  'API Development',
  'IT Staff Augmentation',
];

export const contactChannels: readonly ContactChannel[] = [
  {
    eyebrow: 'EMAIL',
    title: 'contact@karalasoft.com',
    description: 'For projects, partnerships and general inquiries.',
    href: 'mailto:contact@karalasoft.com',
  },
  {
    eyebrow: 'PHONE',
    title: '+1 (718) 737-3202',
    description: 'New York, USA',
    href: 'tel:+17187373202',
  },
  {
    eyebrow: 'DELIVERY',
    title: 'Dhaka · New York · Remote',
    description: 'Software engineering for clients worldwide.',
  },
];

export const contactFormIcon = MessageSquareText;