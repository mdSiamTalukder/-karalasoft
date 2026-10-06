import { createElement } from 'react';

import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { getServiceIcon } from '@/lib/services';
import { SERVICE_STRENGTHS } from '@/lib/services';

/**
 * “Why KaralaSoft” — concrete engineering reasons to work with the studio.
 *
 * Content comes from `SERVICE_STRENGTHS` in `lib/services.ts`. Nothing here is a
 * statistic, client name, award or certification.
 */
export function ServicesStrengths() {
  return (
    <Section alt labelledBy="services-why-heading">
      <Container>
        <SectionHead
          id="services-why-heading"
          eyebrow="WHY KARALASOFT"
          title={
            <>
              Engineering you can
              <br />
              build on afterwards.
            </>
          }
          description="The measure of our work is what it looks like six months later, after it has been extended by a different engineer on a different day."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {SERVICE_STRENGTHS.map((strength, index) => (
            <li key={strength.title} className="h-full">
              <Card delay={(index % 3) * 0.08}>
                <span
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-[15px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))] text-cyan"
                >
                  {/* createElement: the icon is resolved during render. */}
                  {createElement(getServiceIcon(strength.iconKey), {
                    className: 'size-[22px]',
                    strokeWidth: 1.5,
                  })}
                </span>
                <h3 className="mt-5 mb-2 text-[20px] leading-tight">{strength.title}</h3>
                <p className="m-0 text-muted">{strength.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}