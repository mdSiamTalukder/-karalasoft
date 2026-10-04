import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { HeroVisual } from '@/components/sections/HeroVisual';
import { heroMetrics } from '@/lib/content';

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

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-5 max-sm:gap-x-5 lg:mt-10 lg:gap-x-[34px]">
            {heroMetrics.map((metric) => (
              <div key={metric.label} className="min-w-[96px]">
                <dt className="sr-only">{metric.label}</dt>
                <dd className="m-0">
                  <strong className="block text-[26px]">{metric.value}</strong>
                  <span className="text-[13px] text-muted">{metric.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}