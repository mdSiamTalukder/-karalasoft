import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { IconBadge, TagList } from '@/components/ui/IconBadge';
import { Section } from '@/components/ui/Section';
import { CTA } from '@/components/sections/CTA';
import { servicesPageCards } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Software development, MVP development, web, mobile, API and IT staff augmentation services from KaralaSoft.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | KaralaSoft',
    description:
      'Software development, MVP development, web, mobile, API and IT staff augmentation services from KaralaSoft.',
    url: '/services',
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="SERVICES"
        headingId="services-page-heading"
        title="Engineering services built to turn"
        highlight="ideas into products."
        lead="Each service page can use motion-led diagrams, code-to-interface transitions and real product screenshots so visitors immediately understand what KaralaSoft actually builds."
      />

      <Section labelledBy="services-page-grid">
        <Container>
          <h2 id="services-page-grid" className="sr-only">
            Service catalogue
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
            {servicesPageCards.map((service, index) => (
              <li key={service.title}>
                <Card delay={(index % 3) * 0.08}>
                  <IconBadge glyph={service.glyph} label={service.title} />
                  <h3 className="mt-5 mb-2 text-[22px]">{service.title}</h3>
                  <p className="m-0 text-muted">{service.description}</p>
                  <TagList items={service.tags} />
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section alt>
        <Container>
          <CTA
            eyebrow="BETTER SERVICE PAGES"
            title="Every service should answer: “What will you build for me?”"
            description="Instead of generic descriptions, use interactive examples, architecture visuals, project outcomes, timelines and a clear CTA specific to that service."
            action={{ label: 'Start the conversation', href: '/contact' }}
          />
        </Container>
      </Section>
    </>
  );
}