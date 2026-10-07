import { createElement } from 'react';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { getFeatureIcon } from '@/lib/products';
import { PRODUCT_VALUES } from '@/lib/product-page';

/**
 * ------------------------------------------------------------------------------------
 * Product value — `/products` only.
 * ------------------------------------------------------------------------------------
 * Why a business adopts one of these products. Deliberately free of figures, customer
 * names, testimonials and awards — each entry restates a capability the products already
 * publish rather than promising an outcome we cannot evidence.
 */
export function ProductValue() {
  return (
    <Section alt labelledBy="products-value-heading">
      <Container>
        <SectionHead
          id="products-value-heading"
          eyebrow="WHY IT MATTERS"
          title={
            <>
              Less firefighting.
              <br />
              More operating.
            </>
          }
          description="The point of a system like this is not more screens — it is fewer questions about who is present, who can do what, and where the numbers came from."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[14px]">
          {PRODUCT_VALUES.map((value, index) => (
            <Reveal as="li" key={value.title} delay={(index % 3) * 0.06} className="h-full">
              <div className="group/val relative flex h-full gap-3.5 rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-5 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/25">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-[13px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan"
                >
                  {createElement(getFeatureIcon(value.iconKey), {
                    className: 'size-[18px]',
                    strokeWidth: 1.6,
                  })}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 mb-1.5 text-[17px] leading-tight transition-colors duration-300 group-hover/val:text-cyan">
                    {value.title}
                  </h3>
                  <p className="m-0 text-[14px] leading-[1.6] text-muted">
                    {value.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}