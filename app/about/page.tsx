import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { CTA } from '@/components/sections/CTA';
import { TeamMembers } from '@/components/sections/TeamMembers';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import {
  aboutLead,
  aboutLocationDescription,
  aboutLocationTitle,
  aboutStats,
  aboutStory,
  coreValues,
  solutionAreas,
  teamIntro,
} from '@/lib/about';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Founded in 2020, KaralaSoft is a dedicated team of engineers, designers and strategists delivering world-class software from Dhaka, Bangladesh to clients in 12+ countries.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | KaralaSoft',
    description:
      'Founded in 2020, KaralaSoft is a dedicated team of engineers, designers and strategists delivering world-class software from Dhaka, Bangladesh to clients in 12+ countries.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT KARALASOFT"
        headingId="about-heading"
        title="Building the"
        highlight="Future"
        lead={aboutLead}
      />

      {/* Headline figures */}
      <Container>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
          {aboutStats.map((stat) => (
            <li
              key={stat.label}
              className="rounded-[22px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-4 py-6 text-center backdrop-blur-[18px] sm:px-6 sm:py-7"
            >
              <strong className="block bg-[linear-gradient(90deg,#fff,var(--color-cyan)_45%,var(--color-violet))] bg-clip-text text-[34px] leading-none tracking-[-0.04em] text-transparent sm:text-[42px]">
                {stat.value}
              </strong>
              <span className="mt-2 block text-[13px] text-muted">{stat.label}</span>
            </li>
          ))}
        </ul>
      </Container>

      {/* What we do today */}
      <Section labelledBy="story-heading">
        <Container>
          <SectionHead
            id="story-heading"
            title={
              <>
                Global delivery.
                <br />
                Personal partnership.
              </>
            }
            description={aboutStory}
          />

          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
            {solutionAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <li key={area.title}>
                  <Card delay={(index % 4) * 0.07}>
                    <span
                      role="img"
                      aria-label={area.title}
                      className="grid size-12 shrink-0 place-items-center rounded-[15px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]"
                    >
                      <Icon aria-hidden="true" className="size-5 text-cyan" strokeWidth={2} />
                    </span>
                    <h3 className="mt-5 mb-2 text-[19px]">{area.title}</h3>
                    <p className="m-0 text-[15px] text-muted">{area.description}</p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Core values */}
      <Section alt labelledBy="values-heading">
        <Container>
          <SectionHead
            id="values-heading"
            eyebrow="OUR CORE VALUES"
            title="Built on six principles."
          />

          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <li key={value.title}>
                  <Card delay={(index % 3) * 0.08}>
                    <span
                      role="img"
                      aria-label={value.title}
                      className="grid size-12 shrink-0 place-items-center rounded-[15px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]"
                    >
                      <Icon aria-hidden="true" className="size-5 text-cyan" strokeWidth={2} />
                    </span>
                    <h3 className="mt-5 mb-2 text-[22px]">{value.title}</h3>
                    <p className="m-0 text-muted">{value.description}</p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Team */}
      <Section labelledBy="team-heading">
        <Container>
          <SectionHead
            id="team-heading"
            eyebrow="THE TEAM"
            title="Meet our talented team."
            description={teamIntro}
          />

          <TeamMembers />
        </Container>
      </Section>

      {/* Location + closing CTA */}
      <Section alt>
        <Container>
          <div className="mb-8 flex flex-col items-start gap-5 lg:mb-9 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>GLOBAL DELIVERY</Eyebrow>
              <h2 className="mt-2.5 mb-0 text-[clamp(30px,4.5vw,48px)] leading-none tracking-[-0.05em] text-balance">
                {aboutLocationTitle}
              </h2>
              <p className="mt-3 mb-0 max-w-[620px] text-[17px] text-muted">
                {aboutLocationDescription}
              </p>
            </div>
          </div>

          <CTA
            eyebrow="WORK WITH US"
            title="Have a product in mind?"
            description="Tell us what you want to build and we’ll help shape the scope, architecture, experience and delivery plan."
            action={{ label: 'Start the conversation', href: '/contact' }}
          />
        </Container>
      </Section>
    </>
  );
}