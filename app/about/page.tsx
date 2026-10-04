import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { IconBadge } from '@/components/ui/IconBadge';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { aboutValues } from '@/lib/about';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Founded in 2020, KaralaSoft brings engineering, design and product thinking together for clients around the world.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | KaralaSoft',
    description:
      'Founded in 2020, KaralaSoft brings engineering, design and product thinking together for clients around the world.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About KaralaSoft"
        headingId="about-page-heading"
        title="A software company that should feel like a"
        highlight="product company."
        lead={`Founded in ${siteConfig.foundedYear}, KaralaSoft brings engineering, design and product thinking together for clients around the world.`}
      />

      <Section alt labelledBy="about-values-heading">
        <Container>
          <SectionHead
            id="about-values-heading"
            title={
              <>
                Global delivery.
                <br />
                Personal partnership.
              </>
            }
            description="Based in Dhaka, Bangladesh with global client delivery and remote collaboration."
          />

          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
            {aboutValues.map((value, index) => (
              <li key={value.title}>
                <Card delay={index * 0.08}>
                  <IconBadge glyph={value.glyph} label={value.title} />
                  <h3 className="mt-5 mb-2 text-[22px]">{value.title}</h3>
                  <p className="m-0 text-muted">{value.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}