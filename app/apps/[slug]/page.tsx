
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Layers3,
  Sparkles,
} from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';

import { APPS } from '../apps-data';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getApp(slug: string) {
  return APPS.find(
    (item) => item.id === slug || item.href === `/apps/${slug}`,
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);

  if (!app) {
    return {
      title: 'App Not Found',
      description: 'The requested application could not be found.',
    };
  }

  return {
    title: app.name,
    description: app.shortDescription,
    alternates: {
      canonical: `/apps/${slug}`,
    },
    openGraph: {
      title: `${app.name} | KaralaSoft`,
      description: app.shortDescription,
      url: `/apps/${slug}`,
    },
  };
}

export default async function AppDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getApp(slug);

  if (!app) {
    return (
      <Section>
        <Container>
          <div className="mx-auto max-w-[680px] rounded-[28px] border border-line glass px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#5377FF]/20 bg-[#5377FF]/[0.07] text-[#5377FF]">
              <Layers3 size={28} strokeWidth={1.5} aria-hidden="true" />
            </div>

            <Eyebrow className="mt-6 mb-4">
              Application unavailable
            </Eyebrow>

            <h1 className="m-0 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              We couldn&apos;t find this app.
            </h1>

            <p className="mx-auto mt-4 mb-0 max-w-[440px] text-sm leading-relaxed text-muted sm:text-base">
              This application may not exist or may not be published yet.
              Explore our collection to discover available applications.
            </p>

            <div className="mt-8 flex justify-center">
              <ButtonLink href="/apps" variant="primary">
                <ArrowLeft size={16} aria-hidden="true" />
                Back to Apps
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section>
        <Container>
          <div className="mx-auto max-w-[1000px]">
            <Link
              href="/apps"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-[#5377FF]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to all apps
            </Link>

            <div className="relative isolate overflow-hidden rounded-[28px] border border-line glass px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgba(83,119,255,0.12),transparent_70%)]"
              />

              <div className="relative max-w-[760px]">
                <div className="mb-7 flex size-14 items-center justify-center rounded-2xl border border-[#5377FF]/20 bg-[#5377FF]/[0.08] text-[#5377FF]">
                  <Layers3 size={27} aria-hidden="true" />
                </div>

                <Eyebrow className="mb-5">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles size={14} aria-hidden="true" />
                    {app.category}
                  </span>
                </Eyebrow>

                <h1 className="m-0 text-[clamp(38px,7vw,68px)] font-semibold leading-[1.02] tracking-[-0.06em]">
                  {app.name}
                </h1>

                <p className="mt-6 mb-0 max-w-[620px] text-base leading-relaxed text-muted sm:text-lg">
                  {app.shortDescription}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {app.websiteUrl && (
                    <ButtonLink href={app.websiteUrl} variant="primary">
                      Visit App
                      <ExternalLink size={16} aria-hidden="true" />
                    </ButtonLink>
                  )}

                  <ButtonLink href="/contact">
                    Contact our team
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section alt>
        <Container>
          <div className="mx-auto grid max-w-[1000px] gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
            <div>
              <Eyebrow className="mb-4">
                About this application
              </Eyebrow>

              <h2 className="m-0 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                Built with purpose.
              </h2>

              <p className="mt-5 mb-0 text-[15px] leading-7 text-muted">
                {app.description}
              </p>
            </div>

            <div className="rounded-[24px] border border-line glass p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-[#5377FF]/20 bg-[#5377FF]/[0.08] text-[#5377FF]">
                  <Sparkles size={19} aria-hidden="true" />
                </div>

                <h2 className="m-0 text-xl font-semibold tracking-[-0.035em]">
                  Key features
                </h2>
              </div>

              <ul className="mt-6 mb-0 space-y-4 p-0">
                {app.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#5377FF]"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
