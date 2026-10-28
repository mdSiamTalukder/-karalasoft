
import type { Metadata } from 'next';
import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  Layers3,
  MonitorSmartphone,
  Sparkles,
} from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';

import { AppsListing } from './AppsListing';

const DESCRIPTION =
  'Explore KaralaSoft applications, digital products and tools designed to make everyday work simpler.';

export const metadata: Metadata = {
  title: 'Apps',
  description: DESCRIPTION,
  alternates: { canonical: '/apps' },
  openGraph: {
    title: 'Apps | KaralaSoft',
    description: DESCRIPTION,
    url: '/apps',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apps | KaralaSoft',
    description: DESCRIPTION,
  },
};

function AppsPageHero() {
  return (
    <Section>
      <Container>
        <div className="relative isolate overflow-hidden rounded-[28px] border border-line glass px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[340px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.16),transparent_70%)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 -left-20 -z-10 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(83,119,255,0.13),transparent_70%)]"
          />

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <Eyebrow className="mb-6">
                <span className="inline-flex items-center gap-2">
                  <Sparkles aria-hidden="true" size={14} />
                  The KaralaSoft App Hub
                </span>
              </Eyebrow>

              <h1 className="m-0 max-w-[760px] text-[clamp(42px,7vw,76px)] font-semibold leading-[0.98] tracking-[-0.065em]">
                Great ideas.
                <br />
                <span className="text-muted">Useful apps.</span>
                <br />
                Built to work.
              </h1>

              <p className="mt-6 mb-0 max-w-[540px] text-[16px] leading-relaxed text-muted sm:text-[18px]">
                Discover the digital products and applications we build to
                simplify workflows, solve real problems and create better
                everyday experiences.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" variant="primary">
                  Have an idea?
                  <ArrowUpRight aria-hidden="true" size={17} />
                </ButtonLink>

                <ButtonLink href="/projects">
                  Explore our work
                  <ArrowUpRight aria-hidden="true" size={17} />
                </ButtonLink>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[var(--color-accent,#58ecff)]" />
                  Thoughtful design
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[var(--color-accent,#58ecff)]" />
                  Modern engineering
                </span>
              </div>
            </div>

            <div
              aria-label="KaralaSoft product studio illustration"
              className="relative mx-auto w-full max-w-[440px]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(88,236,255,0.12),transparent_65%)] blur-2xl"
              />

              <div className="relative overflow-hidden rounded-[28px] border border-line bg-veil/[0.035] p-4 shadow-[0_24px_80px_rgba(40,120,180,0.08)] backdrop-blur-xl sm:p-5">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.13),transparent_70%)]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-[radial-gradient(circle,rgba(145,108,255,0.12),transparent_70%)]"
                />

                <div className="relative flex items-center justify-between gap-3 border-b border-line pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/[0.09] text-cyan-500">
                      <Layers3 size={21} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <p className="m-0 text-[14px] font-semibold tracking-[-0.02em]">
                        Product studio
                      </p>
                      <p className="m-0 mt-1 text-[12px] text-muted">
                        Ideas into experiences
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-cyan-600 dark:text-cyan-300">
                    <span className="size-1.5 rounded-full bg-cyan-400" />
                    APP HUB
                  </span>
                </div>

                <div className="relative grid grid-cols-2 gap-3 py-4">
                  <div className="group rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.09] to-transparent p-4 transition-colors duration-300 hover:border-cyan-400/35">
                    <div className="mb-7 flex size-11 items-center justify-center rounded-[14px] border border-cyan-400/20 bg-cyan-400/[0.09] text-cyan-600 dark:text-cyan-300">
                      <MonitorSmartphone size={21} aria-hidden="true" />
                    </div>

                    <p className="m-0 text-[14px] font-semibold tracking-[-0.02em]">
                      Web apps
                    </p>

                    <p className="m-0 mt-1.5 text-[12px] text-muted">
                      Built for the web
                    </p>

                    <div className="mt-4 h-1 w-10 rounded-full bg-cyan-400/50 transition-all duration-300 group-hover:w-16" />
                  </div>

                  <div className="group rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-400/[0.10] to-transparent p-4 transition-colors duration-300 hover:border-violet-400/35">
                    <div className="mb-7 flex size-11 items-center justify-center rounded-[14px] border border-violet-400/20 bg-violet-400/[0.09] text-violet-600 dark:text-violet-300">
                      <Code2 size={21} aria-hidden="true" />
                    </div>

                    <p className="m-0 text-[14px] font-semibold tracking-[-0.02em]">
                      Smart tools
                    </p>

                    <p className="m-0 mt-1.5 text-[12px] text-muted">
                      Made to solve
                    </p>

                    <div className="mt-4 h-1 w-10 rounded-full bg-violet-400/50 transition-all duration-300 group-hover:w-16" />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-line bg-veil/[0.035] p-4 sm:p-5">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.10),transparent_70%)]"
                  />

                  <div className="relative flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-600 dark:text-cyan-300">
                      <Sparkles size={19} aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[14px] font-semibold tracking-[-0.02em]">
                        Designed around people
                      </p>

                      <p className="m-0 mt-2 text-[12px] leading-relaxed text-muted">
                        Useful features. Clear experiences. Reliable software.
                      </p>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="shrink-0 text-muted"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="text-[11px] tracking-wide text-muted">
                    Built with intention.
                  </span>

                  <span className="inline-flex items-center gap-2 text-[11px] text-muted">
                    Crafted with care
                    <span className="flex size-7 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-600 dark:text-cyan-300">
                      <ArrowDownRight size={15} aria-hidden="true" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function AppsPage() {
  return (
    <>
      <AppsPageHero />
      <AppsListing />
    </>
  );
}
