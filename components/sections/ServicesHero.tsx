import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SERVICES_HERO } from '@/lib/services';

/**
 * Services hero — `/services` only.
 *
 * A dedicated component rather than the shared `PageHero` because this hero carries
 * primary and secondary calls to action, and `PageHero` has no action slot (it is shared
 * by /about, /projects and /contact, which must not change).
 *
 * Rendered on the server so the H1 and lead are in the initial HTML.
 */
export function ServicesHero() {
  return (
    <div className="pt-16 pb-9 sm:pt-20 lg:pt-[84px] lg:pb-[42px]">
      <Container>
        <div className="mx-auto max-w-[900px] text-center">
          <Reveal>
            <Eyebrow dot>{SERVICES_HERO.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h1
              id="services-page-heading"
              className="mt-5 mb-4 text-[clamp(42px,7vw,84px)] leading-[0.92] tracking-[-0.065em] max-sm:text-[46px]"
            >
              {SERVICES_HERO.title} <GradientText>{SERVICES_HERO.highlight}</GradientText>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="lead">{SERVICES_HERO.lead}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact" variant="primary">
                Start a Project <span aria-hidden="true">→</span>
              </ButtonLink>
              <ButtonLink href="/projects">See our work</ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}