import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/Button';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { CTA } from '@/components/sections/CTA';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { ServicesHero } from '@/components/sections/ServicesHero';
import { ServicesStrengths } from '@/components/sections/ServicesStrengths';
import { ServicesWork } from '@/components/sections/ServicesWork';
import {
  SERVICES_CTA,
  SERVICES_FEATURED_PROJECT_IDS,
  SERVICES_INTRO,
  SERVICES_PROCESS,
  fetchServicesFromApi,
} from '@/lib/services';
import { fetchProjectsFromApi } from '@/lib/projects';
import type { Project } from '@/lib/projects';
import type { ProcessStep } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Software development, MVP development, web, mobile, desktop, API, database, modernisation, IT augmentation, outsourcing, support and maintenance services from KaralaSoft.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | KaralaSoft',
    description:
      'Software development, MVP development, web, mobile, desktop, API, database, modernisation, IT augmentation, outsourcing, support and maintenance services from KaralaSoft.',
    url: '/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | KaralaSoft',
    description:
      'Software development, MVP development, web, mobile, desktop, API, database, modernisation, IT augmentation, outsourcing, support and maintenance services from KaralaSoft.',
  },
};

/** One hour, matching the rest of the public data layer. */
export const revalidate = 3600;

/* -------------------------------------------------------------------------- */
/*  Fallback states                                                           */
/*  Both render server-side, so a CMS outage still produces a real page.        */
/* -------------------------------------------------------------------------- */

function ServicesUnavailable() {
  return (
    <Section>
      <Container>
        <div
          role="alert"
          className="relative overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-6 py-12 text-center sm:px-10"
        >
          <Eyebrow className="mb-5">Temporarily unavailable</Eyebrow>
          <h1 className="m-0 mb-4 text-[clamp(30px,5vw,56px)] leading-none tracking-[-0.05em]">
            The service catalogue is offline for a moment
          </h1>
          <p className="mx-auto mb-8 max-w-[54ch] text-[18px] text-muted">
            We could not reach the services feed just now. Everything else on the site is
            unaffected — or tell us what you need and we will answer directly.
          </p>
          <ButtonLink href="/contact" variant="primary">
            Start a Project <span aria-hidden="true">→</span>
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

function ServicesEmpty() {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-6 py-12 text-center sm:px-10">
          <Eyebrow className="mb-5">Services</Eyebrow>
          <h1 className="m-0 mb-4 text-[clamp(30px,5vw,56px)] leading-none tracking-[-0.05em]">
            No services published yet
          </h1>
          <p className="mx-auto mb-8 max-w-[54ch] text-[18px] text-muted">
            The catalogue is being updated. In the meantime, browse the work we have already
            shipped or tell us what you need built.
          </p>
          <ButtonLink href="/projects" variant="primary">
            See our work <span aria-hidden="true">→</span>
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/** Pick the curated projects, skipping any id the CMS no longer returns. */
function selectFeaturedProjects(all: readonly Project[]): Project[] {
  return SERVICES_FEATURED_PROJECT_IDS.map((id) => all.find((p) => p.id === id)).filter(
    (p): p is Project => p !== undefined,
  );
}

export default async function ServicesPage() {
  let services;
  try {
    services = await fetchServicesFromApi();
  } catch (error) {
    console.error('[services] catalogue fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
    return <ServicesUnavailable />;
  }

  if (services.length === 0) return <ServicesEmpty />;

  // Selected work is supporting content: a failure here must not take the page down.
  let featured: Project[] = [];
  try {
    featured = selectFeaturedProjects(await fetchProjectsFromApi());
  } catch (error) {
    console.error('[services] selected work fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
  }

  return (
    <>
      <ServicesHero />

      {/* ------------------------------------------------------- Introduction */}
      <Section labelledBy="services-intro-heading">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div>
              <Reveal>
                <Eyebrow>{SERVICES_INTRO.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2
                  id="services-intro-heading"
                  className="mt-5 mb-0 text-[clamp(30px,5vw,56px)] leading-[1.02] tracking-[-0.05em]"
                >
                  {SERVICES_INTRO.title}
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div>
                <p className="mt-0 mb-6 text-[18px] leading-[1.65] text-muted">
                  {SERVICES_INTRO.lead}
                </p>
                <ul className="m-0 grid list-none gap-3.5 p-0">
                  {SERVICES_INTRO.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[16px] leading-[1.6]">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_12px_var(--color-cyan)]"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------- Service catalogue */}
      <ServicesGrid services={services} />

      {/* --------------------------------------------------- Why KaralaSoft */}
      <ServicesStrengths />

      {/* ---------------------------------------------------------- Process */}
      <ProcessSection
        eyebrow={SERVICES_PROCESS.eyebrow}
        title={SERVICES_PROCESS.title}
        description={SERVICES_PROCESS.description}
        steps={SERVICES_PROCESS.steps as readonly ProcessStep[]}
        alt={false}
      />

      {/* --------------------------------------------------- Selected work */}
      {featured.length > 0 ? <ServicesWork projects={featured} /> : null}

      {/* --------------------------------------------------------------- CTA */}
      <Section alt labelledBy="services-cta-heading">
        <Container>
          <CTA
            eyebrow={SERVICES_CTA.eyebrow}
            title={SERVICES_CTA.title}
            description={SERVICES_CTA.description}
            action={SERVICES_CTA.action}
          />
        </Container>
      </Section>
    </>
  );
}