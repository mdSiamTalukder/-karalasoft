import type { Metadata } from 'next';
import Link from 'next/link';

import { fetchProductsFromApi } from '@/lib/products';
import { ProductsHero } from '@/components/sections/ProductsHero';
import { ProductsShowcase } from '@/components/sections/ProductsShowcase';
import { ProductOperations } from '@/components/sections/ProductOperations';
import { ProductArchitecture } from '@/components/sections/ProductArchitecture';
import { ProductValue } from '@/components/sections/ProductValue';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Explore the KaralaSoft product suite: HRM and Point of Sale platforms with AI-powered face recognition, geo-fenced attendance, dashboards and role-based access.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Products | KaralaSoft',
    description:
      'Explore the KaralaSoft product suite: HRM and Point of Sale platforms with AI-powered face recognition, geo-fenced attendance, dashboards and role-based access.',
    url: '/products',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | KaralaSoft',
    description:
      'Explore the KaralaSoft product suite: HRM and Point of Sale platforms with AI-powered face recognition, geo-fenced attendance, dashboards and role-based access.',
  },
};

/** Re-read the CMS at most once an hour, matching the rest of the public data layer. */
export const revalidate = 3600;

/* -------------------------------------------------------------------------- */
/*  Fallback states                                                           */
/*  Both are rendered on the server, so a CMS outage still produces a real page     */
/*  rather than a blank shell.                                                    */
/* -------------------------------------------------------------------------- */

function ProductsError() {
  return (
    <Section>
      <Container>
        <div
          role="alert"
          className="relative overflow-hidden rounded-[26px] glass px-6 py-12 text-center sm:px-10"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[90px] -right-[90px] size-[180px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.12),transparent_70%)]"
          />
          <Eyebrow className="mb-5">Temporarily unavailable</Eyebrow>
          <h1 className="m-0 mb-4 text-[clamp(30px,5vw,56px)] leading-none tracking-[-0.05em]">
            The product suite is offline for a moment
          </h1>
          <p className="mx-auto mb-8 max-w-[54ch] text-[18px] text-muted">
            We could not reach the product catalogue just now. Everything else on the site is
            unaffected — or get in touch and we will demo it for you directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/contact" variant="primary">
              Contact us
            </ButtonLink>
            <ButtonLink href="/projects">See our work</ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ProductsEmpty() {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-[26px] glass px-6 py-12 text-center sm:px-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[90px] -right-[90px] size-[180px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.12),transparent_70%)]"
          />
          <Eyebrow className="mb-5">Products</Eyebrow>
          <h1 className="m-0 mb-4 text-[clamp(30px,5vw,56px)] leading-none tracking-[-0.05em]">
            No products published yet
          </h1>
          <p className="mx-auto mb-8 max-w-[54ch] text-[18px] text-muted">
            The suite is being prepared. In the meantime, browse the work we have already shipped
            or tell us what you need built.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/projects" variant="primary">
              See our work
            </ButtonLink>
            <ButtonLink href="/contact">Contact us</ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The suite is fetched on the server (straight from the public CMS, the same call
 * `/api/products` makes for the browser) so the complete content is in the initial HTML
 * for search engines and for visitors with JavaScript disabled. The client component
 * then only owns the "which product is selected" interaction.
 */
export default async function ProductsPage() {
  let products;
  try {
    products = await fetchProductsFromApi();
  } catch (error) {
    console.error('[products] page fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
    return <ProductsError />;
  }

  if (products.length === 0) return <ProductsEmpty />;

  // The hero frames the first (lowest `order_index`) product; the suite below owns the
  // switching interaction for every product.
  const featured = products[0] ?? null;

  return (
    <>
      <ProductsHero featured={featured} />

      {/* Our products — switcher, key features, in-product preview, final CTA */}
      <ProductsShowcase products={products} />

      <ProductOperations />

      <ProductArchitecture />

      <ProductValue />

      <Section labelledBy="products-more-heading">
        <Container>
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 id="products-more-heading" className="m-0 text-[22px] leading-snug">
              Want the detail behind these products?
            </h2>
            <p className="mx-auto m-0 max-w-[54ch] text-[17px] text-muted">
              The case studies show the decisions, constraints and outcomes behind systems like
              these.
            </p>
            <Link
              href="/projects"
              className="text-[16px] font-semibold text-cyan underline-offset-4 hover:underline"
            >
              Read the case studies
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}