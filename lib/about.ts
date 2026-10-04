import {
  CircleDot,
  MessageSquareText,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react';

import type { ContactChannel, ValueCard } from './types';

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

export const aboutValues: readonly ValueCard[] = [
  {
    glyph: '01',
    icon: ShieldCheck,
    title: 'Engineering quality',
    description: 'Maintainable, testable and scalable systems built for real users.',
  },
  {
    glyph: '02',
    icon: MessagesSquare,
    title: 'Clear communication',
    description: 'Visible progress, honest tradeoffs and frequent demos.',
  },
  {
    glyph: '03',
    icon: CircleDot,
    title: 'Product thinking',
    description: 'We care about what should be built, not only what can be coded.',
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