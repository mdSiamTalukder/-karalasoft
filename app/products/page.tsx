import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { IconBadge } from '@/components/ui/IconBadge';
import { Section } from '@/components/ui/Section';
import { productCards } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'SaaS platforms, business systems, AI-enabled tools and mobile products engineered by KaralaSoft.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Products | KaralaSoft',
    description:
      'SaaS platforms, business systems, AI-enabled tools and mobile products engineered by KaralaSoft.',
    url: '/products',
  },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        headingId="products-page-heading"
        title="Turn your product portfolio into a"
        highlight="visual showroom."
        lead="Use motion, device mockups and short benefit statements so visitors can understand each product in seconds."
      />

      <Section labelledBy="products-page-grid">
        <Container>
          <h2 id="products-page-grid" className="sr-only">
            Product categories
          </h2>

          {/* `.bento` — the feature card spans both columns. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-[18px]">
            <Card className="sm:col-span-2 sm:min-h-[260px]">
              <Eyebrow>Product Experience</Eyebrow>
              <h2 className="my-5 mb-3 text-[clamp(32px,6vw,48px)] leading-none">Show the product in motion.</h2>
              <p className="lead">
                Animate dashboards, mobile screens, workflow steps and live metrics. Each product card
                should have one striking visual, one clear promise and one direct action.
              </p>
            </Card>

            {productCards.map((product, index) => (
              <Card key={product.title} delay={(index % 2) * 0.08}>
                <IconBadge glyph={product.glyph} label={product.title} />
                <h3 className="mt-5 mb-2 text-[22px]">{product.title}</h3>
                <p className="m-0 text-muted">{product.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}