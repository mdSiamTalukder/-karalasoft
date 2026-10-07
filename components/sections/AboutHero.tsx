import { ArrowUpRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { ABOUT_HERO, ABOUT_HERO_DISCIPLINES } from '@/lib/about-page';

/**
 * ------------------------------------------------------------------------------------
 * About hero
 * ------------------------------------------------------------------------------------
 * Built on the shared `PageHero` layout — same spacing scale, same gradient headline, same
 * eyebrow and lead treatments — so the page keeps the existing visual identity. The only
 * addition is a short discipline strip and a pair of actions, which sharpen the positioning
 * from "who we are" to "what kind of company this is".
 *
 * Dedicated to `/about` so the shared `PageHero` (used by /contact) stays untouched.
 */
export function AboutHero() {
  return (
    <div className="pt-16 pb-9 sm:pt-20 lg:pt-[84px] lg:pb-[42px]">
      <Container>
        <Eyebrow>{ABOUT_HERO.eyebrow}</Eyebrow>

        <h1
          id="about-heading"
          className="mt-5 mb-4 max-w-[900px] text-[clamp(42px,7vw,84px)] leading-[0.92] tracking-[-0.065em] max-sm:text-[46px]"
        >
          {ABOUT_HERO.title} <GradientText>{ABOUT_HERO.highlight}</GradientText>
        </h1>

        <p className="lead max-w-[68ch]">{ABOUT_HERO.lead}</p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href={ABOUT_HERO.primary.href} variant="primary">
            {ABOUT_HERO.primary.label} <span aria-hidden="true">→</span>
          </ButtonLink>
          <ButtonLink href={ABOUT_HERO.secondary.href}>
            {ABOUT_HERO.secondary.label}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>

        {/*
          Discipline strip. Each label is a service area the company already documents —
          nothing here is a metric or a claim.
        */}
        <Reveal delay={0.1}>
          <ul className="m-0 mt-10 flex list-none flex-wrap gap-2.5 border-t border-line pt-8 p-0">
            {ABOUT_HERO_DISCIPLINES.map((discipline) => (
              <li key={discipline.label}>
                <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-veil/[0.035] px-3.5 py-2 text-[14px] text-paper-3">
                  <discipline.icon aria-hidden="true" className="size-4 text-cyan" strokeWidth={1.6} />
                  {discipline.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </div>
  );
}