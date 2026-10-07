import { createElement } from 'react';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { getFeatureIcon } from '@/lib/products';
import {
  PRODUCT_ARCHITECTURE_BOTTOM,
  PRODUCT_ARCHITECTURE_BRANCH,
  PRODUCT_ARCHITECTURE_TOP,
} from '@/lib/product-page';
import type { ProductLayer } from '@/lib/product-page';

/**
 * ------------------------------------------------------------------------------------
 * Product architecture — `/products` only.
 * ------------------------------------------------------------------------------------
 * A restrained glass diagram: a top spine (Dashboard → API), the three capabilities that
 * sit side by side, then a bottom spine (Database → Cloud).
 *
 * Every layer maps to something the products already publish — face recognition and
 * role-based access, employee/attendance logic, SMTP and GPS integrations, employee
 * records, hosted deployment. No unsupported architecture is implied.
 *
 * Connectors are thin static rules. There is no canvas, no WebGL and no scroll listener.
 */
function LayerRow({ layer, wide = false }: { layer: ProductLayer; wide?: boolean }) {
  const Icon = getFeatureIcon(layer.iconKey);
  return (
    <div
      className={`flex items-center gap-3 rounded-[16px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] px-3.5 py-3 backdrop-blur-[18px] ${
        wide ? 'sm:justify-center sm:text-center' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid size-9 shrink-0 place-items-center rounded-[11px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan`}
      >
        {createElement(Icon, { className: 'size-[18px]', strokeWidth: 1.6 })}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] leading-tight font-semibold">{layer.label}</span>
        <span className="mt-0.5 block text-[12px] leading-[1.45] text-muted-soft">
          {layer.detail}
        </span>
      </span>
    </div>
  );
}

/** A short vertical rule between full-width spine rows. */
function SpineConnector() {
  return (
    <span
      aria-hidden="true"
      className="mx-auto block h-3 w-px bg-[linear-gradient(180deg,var(--t-flow-from),var(--t-flow-to))] opacity-55"
    />
  );
}

export function ProductArchitecture() {
  return (
    <Section labelledBy="products-architecture-heading">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <SectionHead
            id="products-architecture-heading"
            eyebrow="PRODUCT ARCHITECTURE"
            title={
              <>
                A product is
                <br />
                more than a UI.
              </>
            }
            description="Behind every screen sits a layered platform — access control, business rules, integrations and a database that stays consistent. This is the shape we build to, so the product is still maintainable after launch."
          />

          <Reveal>
            <div className="mx-auto w-full max-w-[460px] rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-3 backdrop-blur-[18px] sm:p-4">
              <p className="mb-3 px-1 text-[11px] tracking-[0.14em] text-muted-soft uppercase">
                Product platform
              </p>

              {/* Top spine */}
              <div className="grid list-none gap-0 p-0">
                {PRODUCT_ARCHITECTURE_TOP.map((layer) => (
                  <div key={layer.label}>
                    <LayerRow layer={layer} wide />
                    <SpineConnector />
                  </div>
                ))}
              </div>

              {/* Branch — three capabilities side by side */}
              <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-3">
                {PRODUCT_ARCHITECTURE_BRANCH.map((layer) => (
                  <li key={layer.label} className="h-full">
                    <LayerRow layer={layer} />
                  </li>
                ))}
              </ul>

              <SpineConnector />

              {/* Bottom spine */}
              <div className="grid list-none gap-0 p-0">
                {PRODUCT_ARCHITECTURE_BOTTOM.map((layer) => (
                  <div key={layer.label}>
                    <LayerRow layer={layer} wide />
                    {layer.label !== PRODUCT_ARCHITECTURE_BOTTOM.at(-1)?.label ? (
                      <SpineConnector />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}