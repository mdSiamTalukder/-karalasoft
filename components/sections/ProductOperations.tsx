import { createElement } from 'react';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { getFeatureIcon } from '@/lib/products';
import { PRODUCT_OPERATIONS } from '@/lib/product-page';

/**
 * ------------------------------------------------------------------------------------
 * “Built for real operations” — `/products` only.
 * ------------------------------------------------------------------------------------
 * Four practical areas, each traceable to a capability the products already publish
 * (Employee Management, Geo-fenced Attendance, Automated Onboarding, Admin Dashboard).
 * Icons reuse the product feature icons rather than inventing new ones.
 *
 * Motion is entrance-only. Nothing glows continuously.
 */
export function ProductOperations() {
  return (
    <Section labelledBy="products-operations-heading">
      <Container>
        <SectionHead
          id="products-operations-heading"
          eyebrow="BUILT FOR REAL OPERATIONS"
          title={
            <>
              The work behind
              <br />
              the dashboard.
            </>
          }
          description="Each product exists because a team was doing the same job by hand. These are the four problems they were built to remove."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[14px]">
          {PRODUCT_OPERATIONS.map((operation, index) => (
            <Reveal as="li" key={operation.label} delay={(index % 4) * 0.06} className="h-full">
              <div className="group/op relative h-full overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-5 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/25 sm:p-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[70px] -right-[70px] size-[150px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.10),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/op:opacity-100"
                />
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-[13px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan"
                  >
                    {createElement(getFeatureIcon(operation.iconKey), {
                      className: 'size-[18px]',
                      strokeWidth: 1.6,
                    })}
                  </span>
                  <span className="text-[12px] font-bold tracking-[0.14em] text-muted-soft uppercase">
                    {operation.label}
                  </span>
                </div>
                <h3 className="mt-4 mb-2 text-[17px] leading-tight transition-colors duration-300 group-hover/op:text-cyan">
                  {operation.title}
                </h3>
                <p className="m-0 text-[14px] leading-[1.6] text-muted">
                  {operation.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}