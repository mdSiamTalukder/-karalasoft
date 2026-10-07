import { Boxes, Layers, Sparkles, Store } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { PROJECTS_HERO } from '@/lib/projects-page';

/**
 * ------------------------------------------------------------------------------------
 * Projects hero — `/projects` only.
 * ------------------------------------------------------------------------------------
 * A dedicated component rather than the shared `PageHero`, because this hero needs a
 * supporting visual and a different copy hierarchy. `PageHero` is shared by /about and
 * /contact and must not change.
 *
 * The right-hand visual is built from CSS only — no images, no invented screenshots and
 * no numbers. Every label is a capability theme that appears on the page further down, so
 * nothing here claims something the portfolio does not contain.
 */
const THEMES = [
  { icon: Store, label: 'Commerce' },
  { icon: Boxes, label: 'Operations' },
  { icon: Layers, label: 'Backend' },
  { icon: Sparkles, label: 'Applied AI' },
];

export function ProjectsHero() {
  return (
    <div className="pt-16 pb-9 sm:pt-20 lg:pt-[84px] lg:pb-[42px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <Reveal>
              <Eyebrow>{PROJECTS_HERO.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="projects-page-heading"
                className="mt-5 mb-4 max-w-[760px] text-[clamp(38px,5.6vw,68px)] leading-[0.98] tracking-[-0.06em] max-sm:text-[42px]"
              >
                {PROJECTS_HERO.title} <GradientText>{PROJECTS_HERO.highlight}</GradientText>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lead max-w-[62ch]">{PROJECTS_HERO.lead}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href={PROJECTS_HERO.primary.href} variant="primary">
                  {PROJECTS_HERO.primary.label} <span aria-hidden="true">→</span>
                </ButtonLink>
                <ButtonLink href={PROJECTS_HERO.secondary.href}>
                  {PROJECTS_HERO.secondary.label}
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {/*
            Capability panel. Static geometry — no continuous animation and no glow loop,
            consistent with the restraint used across the rest of the site.
          */}
          <Reveal delay={0.1} direction="none">
            <div
              aria-hidden="true"
              className="mx-auto w-full max-w-[400px] rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-5 backdrop-blur-[18px] sm:p-6 lg:max-w-none"
            >
              <p className="m-0 mb-4 text-[11px] tracking-[0.14em] text-muted-soft uppercase">
                What we build
              </p>
              <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                {THEMES.map((theme) => (
                  <li
                    key={theme.label}
                    className="flex items-center gap-3 rounded-[14px] border border-line bg-veil/[0.035] px-3.5 py-3"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-[11px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan">
                      <theme.icon className="size-[18px]" strokeWidth={1.5} />
                    </span>
                    <span className="text-[15px] leading-tight text-paper-2">{theme.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
