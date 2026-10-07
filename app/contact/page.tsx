import type { Metadata } from 'next';

import { ContactHero } from '@/components/sections/ContactHero';
import { ContactNextSteps } from '@/components/sections/ContactNextSteps';
import { ContactDirect } from '@/components/sections/ContactDirect';
import { ContactFaq } from '@/components/sections/ContactFaq';
import { ContactForm } from '@/components/contact/ContactForm';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { CONTACT_BRIEF } from '@/lib/contact-page';

const DESCRIPTION =
  'A short project brief is enough to start. KaralaSoft can help shape the scope, architecture, experience and delivery plan.';

export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | KaralaSoft',
    description: DESCRIPTION,
    url: '/contact',
  },
};

/**
 * Page order:
 *
 *   Hero → Project brief (form + next steps) → Direct contact → FAQ
 *
 * Notes on what did and did not change:
 *   • `ContactForm` is the same component with the same field names, validation, honeypot
 *     and `POST /api/contact` submission. Only labels, helper text, field rhythm and a
 *     live character counter were added, so the API contract is untouched.
 *   • The `need` select now derives its options from `SERVICE_GROUPS` in `lib/services.ts`,
 *     so the form can only ever offer services the site actually documents. The server
 *     validates `need` as a plain string, not an enum, so this is presentation-only.
 *   • `ContactDirect` renders the existing `contactChannels` untouched — same addresses,
 *     same `mailto:` / `tel:` hrefs.
 *   • The FAQ answers are drawn from the existing service catalogue and documented process.
 *     No pricing, policy, timeline or guarantee is stated anywhere on the page.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <Section alt id="project-brief" labelledBy="contact-form-heading">
        <Container className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[22px]">
          <Card>
            <Eyebrow>{CONTACT_BRIEF.eyebrow}</Eyebrow>
            <h2
              id="contact-form-heading"
              className="mt-4 mb-3 text-[clamp(30px,5vw,42px)] leading-none"
            >
              {CONTACT_BRIEF.title}
            </h2>
            <p className="mt-0 mb-7 text-[16px] leading-relaxed text-muted">
              {CONTACT_BRIEF.description}
            </p>

            <ContactForm />
          </Card>

          {/*
            The next-steps panel sits alongside the form rather than below it, so a visitor
            sees what happens after submitting before they start typing.

            `self-start` keeps this column content-height instead of stretching to the tall
            form card. Without it the content resolves its `h-full` against the stretched
            row height and stacks, pushing the footer off the page.
          */}
          <div className="self-start">
            <ContactNextSteps />
          </div>
        </Container>
      </Section>

      <ContactDirect />

      <ContactFaq />
    </>
  );
}