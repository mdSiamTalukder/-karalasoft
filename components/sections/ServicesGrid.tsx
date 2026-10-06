import Link from 'next/link';
import { createElement } from 'react';
import { ArrowRight, Check } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { TiltCard } from '@/components/motion/TiltCard';
import { getServiceIcon } from '@/lib/services';
import type { Service } from '@/lib/services';

/**
 * Service icon badge.
 *
 * Mirrors the shared `IconBadge` (same gradient, radius and border) but takes a Lucide
 * component rather than a decorative glyph, because the CMS identifies each service by an
 * icon *name* instead of the character glyphs the marketing site uses.
 */
function ServiceIcon({ iconKey }: { iconKey: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center rounded-[15px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan transition-transform duration-300 ease-out group-hover/svc:-translate-y-0.5"
    >
      {/* createElement: the icon is looked up from a CMS-supplied name during render,
          which React lint treats as creating a component inside a render pass. */}
      {createElement(getServiceIcon(iconKey), { className: 'size-[22px]', strokeWidth: 1.5 })}
    </span>
  );
}

/**
 * ------------------------------------------------------------------------------------
 * Detailed services — `/services` only.
 * ------------------------------------------------------------------------------------
 * Every service published in the CMS, in `order_index` order. Titles, descriptions and
 * capability bullets all come from the CMS record; nothing here is written by hand.
 *
 * Server component: the CMS icon names are resolved here and rendered directly, so no
 * component function ever crosses the server → client boundary.
 *
 * Motion is entrance-only (`Reveal`) plus a small hover lift from `TiltCard`. Nothing on
 * these cards animates continuously.
 */
export function ServicesGrid({ services }: { services: readonly Service[] }) {
  return (
    <Section labelledBy="services-catalogue-heading">
      <Container>
        <SectionHead
          id="services-catalogue-heading"
          eyebrow="DETAILED SERVICES"
          title={
            <>
              Everything we
              <br />
              build and maintain.
            </>
          }
          description="Each practice below lists what it actually covers — no filler, and no service we do not publish."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2 lg:gap-[18px]">
          {services.map((service, index) => (
            <li key={service.id} className="h-full">
              <TiltCard className="h-full">
                <Card
                  tilt={false}
                  delay={(index % 2) * 0.06}
                  className="group/svc h-full"
                >
                  {/* Index · icon · title */}
                  <div className="flex items-start gap-4">
                    <ServiceIcon iconKey={service.iconKey} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="m-0 text-[20px] leading-tight sm:text-[22px]">
                          {service.title}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 font-mono text-[12px] text-muted-soft tabular-nums"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-muted">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Capability bullets */}
                  {service.features.length > 0 ? (
                    <ul className="mt-5 m-0 grid list-none gap-2 border-t border-line pt-4 p-0">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-[15px] text-paper-2"
                        >
                          <Check
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-cyan"
                            strokeWidth={2}
                          />
                          <span className="min-w-0">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {/* Action affordance — links to the real enquiry flow. */}
                  <Link
                    href="/contact"
                    aria-label={`Discuss ${service.title} with KaralaSoft`}
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-[10px] text-[15px] font-semibold text-on-surface transition-colors duration-300 hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                  >
                    Discuss this service
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover/svc:translate-x-1"
                    />
                  </Link>
                </Card>
              </TiltCard>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}