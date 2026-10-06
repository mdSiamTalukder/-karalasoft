import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/Button';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { CTA } from '@/components/sections/CTA';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ServicesCapabilities } from '@/components/sections/ServicesCapabilities';
import { ServicesDeliverables } from '@/components/sections/ServicesDeliverables';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { ServicesHero } from '@/components/sections/ServicesHero';
import { ServicesStrengths } from '@/components/sections/ServicesStrengths';
import { ServicesTech } from '@/components/sections/ServicesTech';
import { ServicesWork } from '@/components/sections/ServicesWork';
import {
  SERVICES_CTA,
  SERVICES_FEATURED_PROJECT_ID,
  SERVICES_SUPPORTING_PROJECT_IDS,
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
          className="relative overflow-hidden rounded-[26px] glass px-6 py-12 text-center sm:px-10"
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
        <div className="relative overflow-hidden rounded-[26px] glass px-6 py-12 text-center sm:px-10">
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

/**
 * Featured / supporting split for Selected Work.
 *
 * Ids are resolved against the projects already fetched from the CMS, so a removed project
 * is skipped rather than rendered as an empty card. `featured` is Garirhat — a real
 * marketplace build with a working live URL; the supporting cards sit either side of it.
 */
function selectWork(all: readonly Project[]): { featured: Project | null; supporting: Project[] } {
  const byId = (id: number) => all.find((p) => p.id === id) ?? null;
  const featured = byId(SERVICES_FEATURED_PROJECT_ID);
  const supporting = SERVICES_SUPPORTING_PROJECT_IDS.map(byId).filter(
    (p): p is Project => p !== null,
  );
  return { featured, supporting };
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
  let work: { featured: Project | null; supporting: Project[] } = {
    featured: null,
    supporting: [],
  };
  try {
    work = selectWork(await fetchProjectsFromApi());
  } catch (error) {
    console.error('[services] selected work fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
  }

  return (
    <>
      <ServicesHero />

      {/* ---------------------------------------- Engineering capabilities */}
      <ServicesCapabilities services={services} />

      {/* --------------------------------------------- Detailed services */}
      <ServicesGrid services={services} />

      {/* ------------------------------------------------------ Technologies */}
      <ServicesTech />

      {/* ------------------------------------------------------ What you get */}
      <ServicesDeliverables />

      {/* --------------------------------------------------- Why KaralaSoft */}
      <ServicesStrengths />

      {/* ---------------------------------------------------------- Process */}
      <ProcessSection
        eyebrow={SERVICES_PROCESS.eyebrow}
        title={SERVICES_PROCESS.title}
        description={SERVICES_PROCESS.description}
        steps={SERVICES_PROCESS.steps as readonly ProcessStep[]}
        alt={false}
        variant="flow"
      />

      {/* --------------------------------------------------- Selected work */}
      <ServicesWork featured={work.featured} supporting={work.supporting} />

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