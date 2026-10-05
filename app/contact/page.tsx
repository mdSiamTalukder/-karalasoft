import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { contactChannels } from '@/lib/about';
import type { ContactChannel } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'A short project brief is enough to start. KaralaSoft can help shape the scope, architecture, experience and delivery plan.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | KaralaSoft',
    description:
      'A short project brief is enough to start. KaralaSoft can help shape the scope, architecture, experience and delivery plan.',
    url: '/contact',
  },
};

function ChannelTitle({ channel }: { channel: ContactChannel }) {
  if (!channel.href) return <h3 className="mt-4 mb-2 text-xl">{channel.title}</h3>;

  return (
    <h3 className="mt-4 mb-2 text-xl">
      <a
        href={channel.href}
        className="rounded-md transition-colors duration-300 hover:text-cyan"
      >
        {channel.title}
      </a>
    </h3>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        headingId="contact-page-heading"
        title="Tell us what you want to"
        highlight="build next."
        lead="A short project brief is enough to start. KaralaSoft can help shape the scope, architecture, experience and delivery plan."
      />

      <Section alt labelledBy="contact-form-heading">
        <Container className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[22px]">
          <Card>
            <h2 id="contact-form-heading" className="mt-0 mb-6 text-[clamp(30px,5vw,42px)] leading-none">
              Start with the idea.
            </h2>
            <ContactForm />
          </Card>

          {/* `self-start` keeps this column content-height instead of stretching to the
              tall form card. Without it each `Card` below resolves its `h-full` against
              the stretched row height, stacks ~3× and pushes the footer off the page. */}
          <div className="self-start">
            {contactChannels.map((channel, index) => (
              <Card key={channel.eyebrow} delay={index * 0.08} className={index > 0 ? 'mt-[18px]' : ''}>
                <Eyebrow>{channel.eyebrow}</Eyebrow>
                <ChannelTitle channel={channel} />
                <p className="m-0 text-muted">{channel.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}