import type { ReactNode } from 'react';

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { processSteps } from '@/lib/content';
import type { ProcessStep } from '@/lib/types';

/**
 * Six-step “how we build” process.
 * Each `.step` carries a top hairline that wipes in with a cyan→violet gradient on hover.
 *
 * Shared by the home page and /services. Every prop is optional and defaults to the
 * original home-page content, so `<ProcessSection />` renders exactly as before; /services
 * passes its own wording and steps.
 */
export function ProcessSection({
  eyebrow = 'HOW WE BUILD',
  title = (
    <>
      Momentum without
      <br />
      the chaos.
    </>
  ),
  description,
  steps = processSteps,
  alt = true,
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  steps?: readonly ProcessStep[];
  /** Tinted background band — home uses it to separate sections. */
  alt?: boolean;
}) {
  return (
    <Section alt={alt} labelledBy="process-heading">
      <Container>
        <SectionHead
          id="process-heading"
          eyebrow={eyebrow}
          title={title}
          {...(description ? { description } : {})}
        />

        <ol className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[14px]">
          {steps.map((step, index) => (
            <li key={step.index} className="h-full">
              <Reveal as="article" className="h-full" delay={(index % 3) * 0.08}>
                <div className="group/step relative h-full border-t border-line p-5 sm:p-7">
                  {/* gradient wipe on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute top-[-1px] left-0 h-px w-0 bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] transition-[width] duration-500 ease-out group-hover/step:w-full"
                  />
                  <span className="text-[12px] font-extrabold tracking-[0.14em] text-cyan uppercase">
                    {step.index} / {step.phase}
                  </span>
                  <h3 className="mt-3 mb-2 text-[1.17em]">{step.title}</h3>
                  <p className="m-0 text-muted">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}