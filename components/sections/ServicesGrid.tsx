import { Check } from 'lucide-react';
import { createElement } from 'react';

import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { TiltCard } from '@/components/motion/TiltCard';
import { getServiceIcon } from '@/lib/services';
import type { Service } from '@/lib/services';

/**
 * Brand-tinted icon badge sized for the service catalogue.
 *
 * Mirrors `IconBadge` (same gradient, same radius, same border), but takes a Lucide
 * component instead of a decorative glyph — the CMS identifies each service by icon NAME
 * rather than by the character glyphs the marketing site uses.
 *
 * The icon is rendered with `createElement` rather than `const Icon = …; <Icon />` because
 * the lookup happens during render and React lint rightly rejects creating a component
 * inside a render pass.
 */
function ServiceIcon({ iconKey, title }: { iconKey: string; title: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-14 shrink-0 place-items-center rounded-[16px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))] text-cyan"
    >
      {createElement(getServiceIcon(iconKey), {
        className: 'size-6',
        strokeWidth: 1.5,
        'aria-label': title,
      })}
    </span>
  );
}

/**
 * Service catalogue — every service published in the CMS, in `order_index` order.
 *
 * Server component: the CMS icon names are resolved here and rendered directly, so no
 * component function ever crosses a client boundary.
 */
export function ServicesGrid({ services }: { services: readonly Service[] }) {
  return (
    <Section labelledBy="services-catalogue-heading">
      <Container>
        <SectionHead
          id="services-catalogue-heading"
          eyebrow="SERVICES"
          title={
            <>
              Everything we
              <br />
              build and maintain.
            </>
          }
          description="Twelve practices covering the whole lifecycle — from the first architecture sketch to long-term support after launch."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2 lg:gap-[18px]">
          {services.map((service, index) => (
            <li key={service.id} className="h-full">
              <TiltCard className="h-full">
                <Card tilt={false} delay={(index % 2) * 0.08}>
                  {/* icon + heading share a row so the card reads as one block */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <ServiceIcon iconKey={service.iconKey} title={service.title} />
                    <div className="min-w-0">
                      <h3 className="m-0 text-[22px] leading-tight">{service.title}</h3>
                      <p className="mt-2.5 mb-0 text-muted">{service.description}</p>
                    </div>
                  </div>

                  {service.features.length > 0 ? (
                    <ul className="mt-5 m-0 grid list-none gap-2 p-0">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-[15px] text-paper-2">
                          <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan" />
                          <span className="min-w-0">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Card>
              </TiltCard>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}