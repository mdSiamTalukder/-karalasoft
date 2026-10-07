/**
 * ------------------------------------------------------------------------------------
 * Contact page — presentation copy
 * ------------------------------------------------------------------------------------
 * Every claim here is either a description of how the engagement works, or a restatement
 * of something already recorded in this repository.
 *
 * Deliberately absent, because nothing in the project supports them:
 *   • response or turnaround times
 *   • client counts, testimonials, ratings, awards or certifications
 *   • pricing, rates, budgets or minimum engagement sizes
 *   • headcount, office addresses or a countries-served figure
 *
 * Service names used in the FAQ are the real catalogue titles from `lib/services.ts`
 * (`SERVICE_GROUPS`); nothing is invented.
 */

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export const CONTACT_HERO = {
  eyebrow: 'Contact',
  title: 'Let’s build something',
  highlight: 'worth shipping.',
  lead: 'A short project brief is enough to start. KaralaSoft can help shape the scope, architecture, experience and delivery plan for the product you have in mind.',
  primary: { label: 'Start with the brief', href: '#project-brief' },
  secondary: { label: 'Browse our work', href: '/projects' },
} as const;

/* -------------------------------------------------------------------------- */
/*  Project brief — form framing                                              */
/* -------------------------------------------------------------------------- */

/**
 * Copy around the existing form. The field names, validation and submission in
 * `components/contact/ContactForm.tsx` are unchanged — this only labels the form better.
 */
export const CONTACT_BRIEF = {
  eyebrow: 'Project brief',
  title: 'Start with the idea.',
  description:
    'Tell us what you are building, who it is for and what you want it to do. Everything else — scope, architecture, delivery — we can work through together afterwards.',
} as const;

/**
 * Helper text shown under the message textarea.
 * Asks only for information the team can actually act on, and makes no promise about
 * timelines or outcomes.
 */
export const CONTACT_MESSAGE_HINT =
  'Useful to include: what you are building, who it is for, the main goal, any must-have requirements, and a rough timeline if you have one. At least 20 characters.';

/* -------------------------------------------------------------------------- */
/*  What happens next                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Description of the engagement workflow. These are process descriptions, not performance
 * claims — note there is no timeframe attached to any step.
 */
export const CONTACT_NEXT_STEPS = {
  eyebrow: 'What happens next',
  title: 'After you send the brief.',
  description:
    'The same four stages apply to every enquiry, whatever the size of the project. What we discuss first is scope and direction — not price.',
  steps: [
    {
      index: '01',
      title: 'Review',
      description: 'We read through the brief and the requirements you have set out.',
    },
    {
      index: '02',
      title: 'Clarify',
      description:
        'We discuss scope, priorities and the technical direction that fits what you are building.',
    },
    {
      index: '03',
      title: 'Plan',
      description: 'We define a practical path forward, including what to build first.',
    },
    {
      index: '04',
      title: 'Start',
      description: 'Once everything is aligned, development can begin.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Direct contact                                                            */
/* -------------------------------------------------------------------------- */

/** Heading only. The actual addresses come from `contactChannels` in `lib/about.ts`. */
export const CONTACT_DIRECT = {
  eyebrow: 'Direct contact',
  title: 'Prefer to write directly?',
  description:
    'The email and phone number below are the fastest way to reach us. Both are the same details published across this site.',
} as const;

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Optional FAQ — included because every answer is answerable from the existing
 * service catalogue and process documentation. Nothing here states a policy, a price, a
 * timeframe or a guarantee.
 */
export const CONTACT_FAQ = {
  eyebrow: 'Questions',
  title: 'Before you write in.',
  items: [
    {
      question: 'What kind of projects do you take on?',
      answer:
        'Software development, web development, mobile development and MVP development, plus API, database and desktop work, software modernization, IT staff augmentation and outsourcing, and ongoing IT support and application maintenance.',
    },
    {
      question: 'We already have a product. Can you work on it?',
      answer:
        'Yes. Software modernization, application maintenance and IT support are established parts of the catalogue, so improving or maintaining an existing system is normal work rather than an exception.',
    },
    {
      question: 'Do you build from scratch or improve existing work?',
      answer:
        'Both. New products start from discovery through to release, while existing systems usually begin with a review of what is already in place before anything is changed.',
    },
    {
      question: 'What do you need from me to get started?',
      answer:
        'A short brief covering what you are building, who it is for and what it needs to do. The form on this page is enough to open the conversation.',
    },
  ],
} as const;