import { createElement } from 'react';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { SERVICE_DELIVERABLES, serviceIcon } from '@/lib/services';

/**
 * ------------------------------------------------------------------------------------
 * “What you get” — `/services` only.
 * ------------------------------------------------------------------------------------
 * Practical engineering outcomes. Every entry traces back to a capability the CMS already
 * publishes (QA & testing, CI/CD, OpenAPI documentation, rate limiting, data migration,
 * cloud-native transformation, monitoring and incident response) — see
 * `SERVICE_DELIVERABLES` in `lib/services.ts`. No new promise is introduced.
 *
 * Deliberately restrained: one soft corner accent per card, no continuous glow, and
 * entrance-only reveal.
 */
export function ServicesDeliverables() {
  return (
    <Section labelledBy="services-deliverables-heading">
      <Container>
        <SectionHead
          id="services-deliverables-heading"
          eyebrow="WHAT YOU GET"
          title={
            <>
              Engineering outcomes,
              <br />
              not promises.
            </>
          }
          description="What lands in your repository and your infrastructure when a project with us is finished."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[14px]">
          {SERVICE_DELIVERABLES.map((item, index) => (
            <Reveal as="li" key={item.title} delay={(index % 4) * 0.06} className="h-full">
              <div className="group/del relative h-full overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-5 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/25 sm:p-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[70px] -right-[70px] size-[150px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.10),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/del:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-[14px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan"
                >
                  {createElement(serviceIcon(item.iconKey), {
                    className: 'size-5',
                    strokeWidth: 1.6,
                  })}
                </span>
                <h3 className="mt-4 mb-2 text-[17px] leading-tight transition-colors duration-300 group-hover/del:text-cyan">
                  {item.title}
                </h3>
                <p className="m-0 text-[14px] leading-[1.6] text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}