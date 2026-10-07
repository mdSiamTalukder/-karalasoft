import { ArrowUpRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { PROJECTS_CTA } from '@/lib/projects-page';

/**
 * ------------------------------------------------------------------------------------
 * Closing CTA — projects-specific.
 * ------------------------------------------------------------------------------------
 * Deliberately no metrics, client names, testimonials or response-time claims. The copy
 * describes only an action the visitor can take.
 */
export function ProjectCta() {
  return (
    <div className="pt-[56px] pb-[72px] sm:pt-[64px] sm:pb-20 lg:pt-[80px] lg:pb-[95px]">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(140deg,var(--t-glass-top),var(--t-glass-bottom))] px-6 py-14 text-center backdrop-blur-[18px] sm:px-10 sm:py-16">
            {/*
              Static light source, not an animated gradient. `pointer-events-none` plus
              `aria-hidden` keeps it purely decorative so it cannot affect layout or be
              announced.
            */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-1/2 left-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(83,119,255,0.20),transparent_72%)]"
            />

            <div className="relative mx-auto max-w-[62ch]">
              <Eyebrow as="p">{PROJECTS_CTA.eyebrow}</Eyebrow>

              <h2 className="mt-5 mb-3.5 text-[clamp(28px,4.2vw,46px)] leading-[1.03] tracking-[-0.05em] text-balance">
                {PROJECTS_CTA.titleBefore} <GradientText>{PROJECTS_CTA.titleAccent}</GradientText>
              </h2>

              <p className="m-0 text-[16px] leading-relaxed text-muted sm:text-[17px]">
                {PROJECTS_CTA.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href={PROJECTS_CTA.primary.href} variant="primary">
                  {PROJECTS_CTA.primary.label} <span aria-hidden="true">→</span>
                </ButtonLink>
                <ButtonLink href={PROJECTS_CTA.secondary.href}>
                  {PROJECTS_CTA.secondary.label}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}