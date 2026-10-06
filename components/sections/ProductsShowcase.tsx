'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

import { PREVIEW_HIGHLIGHTS, getFeatureIcon } from '@/lib/products';
import type { Product } from '@/lib/products';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';

/** Brand-consistent gradient rotation for the feature cards, keyed by the CMS icon name. */
const FEATURE_GRADIENTS = [
  'from-[rgba(88,236,255,0.20)] to-[rgba(83,119,255,0.18)]',
  'from-[rgba(83,119,255,0.20)] to-[rgba(156,100,255,0.18)]',
  'from-[rgba(156,100,255,0.20)] to-[rgba(255,91,189,0.16)]',
  'from-[rgba(255,91,189,0.16)] to-[rgba(88,236,255,0.20)]',
] as const;

function gradientFor(iconKey: string): string {
  let hash = 0;
  for (let i = 0; i < iconKey.length; i += 1) {
    hash = (hash * 31 + iconKey.charCodeAt(i)) | 0;
  }
  return FEATURE_GRADIENTS[Math.abs(hash) % FEATURE_GRADIENTS.length] ?? FEATURE_GRADIENTS[0];
}

/**
 * ------------------------------------------------------------------------------------
 * Product suite showcase.
 * ------------------------------------------------------------------------------------
 * The suite is already loaded on the server (see `app/products/page.tsx`) and handed down
 * as props, so the full content is present in the initial HTML for search engines and the
 * page is never blank before hydration. The only client state is *which* product is
 * selected — the reference site behaves the same way, with the first product featured by
 * default.
 * ------------------------------------------------------------------------------------
 */
export function ProductsShowcase({ products }: { products: readonly Product[] }) {
  const [activeId, setActiveId] = useState<number | null>(products[0]?.id ?? null);
  const reduceMotion = useReducedMotion();

  const active = useMemo(
    () => products.find((product) => product.id === activeId) ?? products[0] ?? null,
    [products, activeId],
  );

  if (!active) return null;

  const heroEyebrow = products.length > 1 ? 'Featured product' : 'Product';

  return (
    <>
      {/* ---------------------------------------------------------- Featured hero */}
      <Section labelledBy="products-featured-heading">
        <Container>
          <div className="text-center">
            <Reveal>
              <Eyebrow className="mb-6" dot>
                <Sparkles aria-hidden="true" className="size-4 text-cyan" />
                {heroEyebrow}
              </Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="products-featured-heading"
                className="m-0 mb-6 text-[clamp(40px,8vw,84px)] leading-[0.95] tracking-[-0.06em]"
              >
                <GradientText>{active.name}</GradientText>
              </h1>
            </Reveal>

            {active.tagline ? (
              <Reveal delay={0.12}>
                <p className="mx-auto mb-4 max-w-[760px] text-[clamp(19px,2.4vw,26px)] leading-[1.4] text-paper-2">
                  {active.tagline}
                </p>
              </Reveal>
            ) : null}

            {active.description ? (
              <Reveal delay={0.18}>
                <p className="mx-auto mb-10 max-w-[680px] text-[17px] leading-[1.6] text-muted">
                  {active.description}
                </p>
              </Reveal>
            ) : null}

            <Reveal delay={0.24}>
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                {active.liveUrl ? (
                  <ButtonLink
                    href={active.liveUrl}
                    variant="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check demo
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-[18px] transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                    />
                  </ButtonLink>
                ) : null}
                <ButtonLink href="/contact">Learn more</ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------- Suite / selector grid */}
      {products.length > 1 ? (
        <Section labelledBy="products-suite-heading">
          <Container>
            <div className="mb-11 text-center">
              <Reveal>
                <h2
                  id="products-suite-heading"
                  className="m-0 mb-4 text-[clamp(32px,5vw,62px)] leading-none tracking-[-0.05em]"
                >
                  Explore our <GradientText>product suite</GradientText>
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mx-auto m-0 max-w-[560px] text-[18px] text-muted">
                  Select a product to explore its features and capabilities.
                </p>
              </Reveal>
            </div>

            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => {
                const isActive = product.id === active.id;
                const Icon = getFeatureIcon(product.features[0]?.iconKey ?? '');

                return (
                  <Reveal as="li" key={product.id} delay={(index % 3) * 0.07} className="h-full">
                    <TiltCard className="h-full">
                      <button
                        type="button"
                        onClick={() => setActiveId(product.id)}
                        aria-pressed={isActive}
                        aria-label={`Show ${product.name}`}
                        className={`group/card relative h-full w-full cursor-pointer overflow-hidden rounded-[26px] border p-6 text-left transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.28)] sm:p-7 ${
                          isActive
                            ? 'border-cyan/40 bg-cyan/[0.045] shadow-[0_24px_64px_rgba(88,236,255,0.12)]'
                            : 'border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] hover:border-cyan/30'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-[80px] -right-[80px] size-[170px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.14),transparent_70%)] transition-transform duration-300 ease-out group-hover/card:scale-140"
                        />
                        <span
                          aria-hidden="true"
                          className="mb-5 grid size-14 place-items-center rounded-[16px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))] text-cyan"
                        >
                          <Icon className="size-7" strokeWidth={1.5} />
                        </span>
                        <span className="block text-[21px] leading-tight font-bold">{product.name}</span>
                        <span className="mt-2 mb-4 block text-[15px] leading-[1.6] text-muted">
                          {product.description}
                        </span>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.09] px-3 py-1 text-[12px] font-semibold text-cyan">
                            <Sparkles aria-hidden="true" className="size-3" />
                            Active
                          </span>
                        ) : null}
                      </button>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------- Key features */}
      {active.features.length > 0 ? (
        <Section labelledBy="products-features-heading">
          <Container>
            <div className="mb-14 text-center">
              <Reveal>
                <Eyebrow className="mb-4" dot>
                  Key features
                </Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2
                  id="products-features-heading"
                  className="m-0 mb-4 text-[clamp(30px,5vw,58px)] leading-none tracking-[-0.05em]"
                >
                  Everything <GradientText>{active.name}</GradientText> offers
                </h2>
              </Reveal>
              {active.tagline ? (
                <Reveal delay={0.1}>
                  <p className="mx-auto m-0 max-w-[680px] text-[18px] text-muted">{active.tagline}</p>
                </Reveal>
              ) : null}
            </div>

            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
              {active.features.map((feature, index) => {
                const Icon = getFeatureIcon(feature.iconKey);
                return (
                  <Reveal
                    as="li"
                    key={`${active.id}-${feature.title}`}
                    delay={(index % 3) * 0.07}
                    className="h-full"
                  >
                    <div className="group/feature relative h-full overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] p-6 transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/30 hover:shadow-[0_28px_70px_rgba(0,0,0,0.25)] sm:p-7">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-[80px] -right-[80px] size-[170px] rounded-full bg-[radial-gradient(circle,rgba(156,100,255,0.12),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/feature:opacity-100"
                      />
                      <span
                        aria-hidden="true"
                        className={`mb-5 grid size-14 place-items-center rounded-[16px] border border-white/10 bg-gradient-to-br ${gradientFor(feature.iconKey)} transition-transform duration-300 group-hover/feature:scale-110`}
                      >
                        <Icon className="size-7 text-paper-5" strokeWidth={1.5} />
                      </span>
                      <h3 className="mt-0 mb-3 text-[20px] leading-tight transition-colors duration-300 group-hover/feature:text-cyan">
                        {feature.title}
                      </h3>
                      <p className="m-0 text-[15px] leading-[1.65] text-muted">{feature.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* ----------------------------------------------------------- Product preview */}
      {active.imageUrl ? (
        <Section labelledBy="products-preview-heading">
          <Container>
            <div className="mb-14 text-center">
              <Reveal>
                <Eyebrow className="mb-4" dot>
                  Product preview
                </Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2
                  id="products-preview-heading"
                  className="m-0 mb-4 text-[clamp(30px,5vw,58px)] leading-none tracking-[-0.05em]"
                >
                  Inside the <GradientText>admin dashboard</GradientText>
                </h2>
              </Reveal>
              {active.tagline ? (
                <Reveal delay={0.1}>
                  <p className="mx-auto m-0 max-w-[680px] text-[18px] text-muted">{active.tagline}</p>
                </Reveal>
              ) : null}
            </div>

            <Reveal>
              <motion.figure
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                className="m-0 overflow-hidden rounded-[30px] border border-line bg-white/[0.02] shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
              >
                <Image
                  src={active.imageUrl}
                  alt={`${active.name} admin dashboard`}
                  width={1440}
                  height={900}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px"
                  className="h-auto w-full object-cover"
                />
              </motion.figure>
            </Reveal>

            <ul className="mt-8 m-0 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
              {PREVIEW_HIGHLIGHTS.map((highlight, index) => (
                <Reveal as="li" key={highlight.label} delay={(index % 4) * 0.06}>
                  <div className="rounded-[18px] border border-line bg-white/[0.035] px-4 py-4 text-center transition-colors duration-300 hover:border-cyan/25">
                    <p className="m-0 text-[15px] leading-snug text-paper-3">{highlight.label}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------------- CTA */}
      <Section labelledBy="products-cta-heading">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[34px] border border-line bg-[radial-gradient(circle_at_15%_20%,rgba(88,236,255,0.17),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(156,100,255,0.18),transparent_32%),linear-gradient(145deg,#0a1729,#09111e)] px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-14 lg:py-16">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 size-[280px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.14),transparent_70%)] blur-[90px]"
              />
              <h2
                id="products-cta-heading"
                className="m-0 mb-6 text-[clamp(30px,5vw,58px)] leading-[1.02] tracking-[-0.05em]"
              >
                Ready to explore <GradientText>{active.name}</GradientText>?
              </h2>
              {active.tagline ? (
                <p className="mx-auto mb-8 max-w-[680px] text-[18px] text-muted">{active.tagline}</p>
              ) : null}
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                {active.liveUrl ? (
                  <ButtonLink
                    href={active.liveUrl}
                    variant="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check demo
                    <ArrowUpRight aria-hidden="true" className="size-[18px]" />
                  </ButtonLink>
                ) : null}
                <ButtonLink href="/contact">Learn more</ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}