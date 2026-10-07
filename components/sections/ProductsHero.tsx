import Image from 'next/image';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { getFeatureIcon, resolveProductImageUrl } from '@/lib/products';
import type { Product } from '@/lib/products';
import { PRODUCTS_HERO } from '@/lib/product-page';

/**
 * ------------------------------------------------------------------------------------
 * Products hero — `/products` only.
 * ------------------------------------------------------------------------------------
 * Left: the page's copy and calls to action.
 * Right: the featured product's REAL dashboard screenshot inside a browser-style frame,
 * with two small capability chips labelled using the product's OWN feature titles — no
 * invented metrics, counts or "active users" figures.
 *
 * Server component. The only motion is `Reveal` plus the existing `pulseDot` keyframe on
 * one status dot; nothing floats continuously and nothing glows on a timer.
 */
function DashboardFrame({ product }: { product: Product }) {
  const src = resolveProductImageUrl(product.imageUrl);

  // Chips use real feature titles rather than fabricated numbers.
  const chips = product.features.slice(0, 2);

  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
      {/* Soft edge highlight — one pass, no animation. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-[34px] bg-[radial-gradient(circle_at_60%_10%,rgba(88,236,255,0.10),transparent_60%)]"
      />

      <div className="relative overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] shadow-[0_28px_70px_var(--t-shadow-card)] backdrop-blur-[18px]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-pink/70" />
            <span className="size-2.5 rounded-full bg-lime/60" />
            <span className="size-2.5 rounded-full bg-cyan/60" />
          </span>
          <span className="ml-2 min-w-0 flex-1 truncate rounded-md border border-line bg-veil/[0.03] px-2.5 py-1 text-[11px] text-muted-soft">
            {product.liveUrl ? product.liveUrl.replace(/^https?:\/\//, '') : product.name}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-veil/[0.035] px-2 py-1 text-[11px] text-paper-3">
            <span className="inline-block size-1.5 rounded-full bg-lime shadow-[0_0_10px_var(--color-lime)] [animation:pulseDot_2.4s_ease-in-out_infinite]" />
            live
          </span>
        </div>

        {/* Real dashboard screenshot */}
        {src ? (
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-veil/[0.03]">
            <Image
              src={src}
              alt={`${product.name} admin dashboard`}
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover object-top"
              priority
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(180deg,transparent,var(--t-panel))]"
            />
          </div>
        ) : (
          <div className="grid aspect-[3/2] w-full place-items-center bg-veil/[0.03] text-[14px] text-muted-soft">
            Preview unavailable
          </div>
        )}
      </div>

      {/* Capability chips — real feature titles */}
      <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
        {chips.map((feature) => {
          const Icon = getFeatureIcon(feature.iconKey);
          return (
            <li
              key={feature.title}
              className="flex items-center gap-2.5 rounded-[16px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] px-3.5 py-3 backdrop-blur-[18px]"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0 text-cyan" strokeWidth={1.6} />
              <span className="min-w-0 truncate text-[13px] text-paper-2">{feature.title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProductsHero({ featured }: { featured: Product | null }) {
  return (
    <div className="pt-16 pb-9 sm:pt-20 lg:pt-[84px] lg:pb-[42px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Reveal>
              <Eyebrow dot>{PRODUCTS_HERO.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="products-page-heading"
                className="mt-5 mb-4 max-w-[720px] text-[clamp(38px,5.6vw,68px)] leading-[0.98] tracking-[-0.06em] max-sm:text-[42px]"
              >
                {PRODUCTS_HERO.title} <GradientText>{PRODUCTS_HERO.highlight}</GradientText>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lead max-w-[62ch]">{PRODUCTS_HERO.lead}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href={PRODUCTS_HERO.primary.href} variant="primary">
                  {PRODUCTS_HERO.primary.label} <span aria-hidden="true">→</span>
                </ButtonLink>
                <ButtonLink href={PRODUCTS_HERO.secondary.href}>
                  {PRODUCTS_HERO.secondary.label}
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {featured ? (
            <Reveal delay={0.1} direction="none">
              <DashboardFrame product={featured} />
            </Reveal>
          ) : null}
        </div>
      </Container>
    </div>
  );
}