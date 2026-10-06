import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { HeroVisual } from '@/components/sections/HeroVisual';
import { heroCapabilities } from '@/lib/content';
import { Code2, Globe, Plug, Sparkles } from 'lucide-react';

/** Capability-strip icons, keyed by the `iconKey` in `heroCapabilities`. */
const capabilityIcons: Record<string, typeof Sparkles> = {
  Code2,
  Sparkles,
  Globe,
  Plug,
};

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex min-h-[86vh] items-center pt-[62px] pb-10 min-[920px]:pt-[88px] min-[920px]:pb-[42px] max-[619px]:min-h-0"
    >
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-[60px]">
        <div>
          <Eyebrow dot>Product engineering for ambitious teams</Eyebrow>

          <h1
            id="hero-heading"
            className="my-6 max-w-[900px] text-[clamp(44px,7vw,96px)] leading-[0.92] tracking-[-0.065em] max-sm:text-[50px]"
          >
            We build{' '}
            <GradientText>digital products people remember.</GradientText>
          </h1>

          <p className="lead">
            Strategy, design and engineering under one roof — from MVPs and web platforms to mobile
            apps, APIs and AI-enabled software.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 lg:mt-[30px]">
            <ButtonLink href="/contact" variant="primary">
              Tell us what you want to build <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink href="/projects" variant="ghost">
              Explore our work
            </ButtonLink>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2.5 p-0 lg:mt-10">
            {heroCapabilities.map((capability) => {
              const Icon = capabilityIcons[capability.iconKey] ?? Sparkles;
              return (
                <Reveal as="li" key={capability.label} className="m-0">
                  <span className="inline-flex items-center gap-2.5 rounded-[14px] border border-line bg-veil/[0.035] px-4 py-3 text-[15px] text-paper-2 transition-colors duration-300 hover:border-cyan/30 hover:text-on-surface">
                    <Icon aria-hidden="true" className="size-[18px] text-cyan" strokeWidth={1.6} />
                    {capability.label}
                  </span>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}