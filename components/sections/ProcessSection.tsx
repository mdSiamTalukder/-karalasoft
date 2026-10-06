import type { ReactNode } from 'react';

import {
  Code2,
  Globe,
  Rocket,
  ScanFace,
  Settings,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { processSteps } from '@/lib/content';
import type { ProcessStep } from '@/lib/types';

/**
 * Node icon per phase, keyed by upper-cased phase name so it matches both the home page's
 * phases (DISCOVER / DESIGN / …) and the services page's (Discover / Plan / …).
 * Unknown phases fall back to `Sparkles`.
 */
const STEP_ICON: Record<string, LucideIcon> = {
  DISCOVER: ScanFace,
  PLAN: Settings,
  DESIGN: Sparkles,
  ENGINEER: Code2,
  DEVELOP: Code2,
  TEST: Shield,
  LAUNCH: Rocket,
  GROW: Globe,
};

type Variant = 'grid' | 'flow';

/**
 * Six-step “how we build” process.
 *
 * Shared by the home page and /services.
 *
 * `variant`:
 *   - `"grid"` (default) — the original hairline-wipe card grid. /services uses this and
 *     is therefore unchanged.
 *   - `"flow"` — home only: a connected timeline with a numbered node per step and a
 *     gradient connector between steps.
 *
 * Every other prop defaults to the original home-page content, so `<ProcessSection />`
 * with no props renders exactly as before.
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
  variant = 'grid',
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  steps?: readonly ProcessStep[];
  /** Tinted background band — home uses it to separate sections. */
  alt?: boolean;
  variant?: Variant;
}) {
  const isFlow = variant === 'flow';

  return (
    <Section alt={alt} labelledBy="process-heading">
      <Container>
        <SectionHead
          id="process-heading"
          eyebrow={eyebrow}
          title={title}
          {...(description ? { description } : {})}
        />

        {isFlow ? (
          <FlowTimeline steps={steps} />
        ) : (
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
        )}
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Flow variant (home)                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Connected timeline. The connector is a plain gradient rule between steps — no
 * scroll-jacking, no scroll listeners, no animation driven by scroll position. Steps just
 * reveal as they enter the viewport, reusing `Reveal`.
 *
 * On mobile the rule is vertical and runs down the left of each step; from `lg` the layout
 * becomes a row and the rule turns horizontal, sitting on the node's centre line. Index
 * maths skips the trailing connector on the last item of each row.
 */
function FlowTimeline({ steps }: { steps: readonly ProcessStep[] }) {
  const columns = 3;

  return (
    <ol className="m-0 grid list-none grid-cols-1 gap-x-4 p-0 lg:grid-cols-3 lg:gap-y-8">
      {steps.map((step, index) => {
        const Icon = STEP_ICON[step.phase.toUpperCase()] ?? Sparkles;
        const isLast = index === steps.length - 1;
        // No connector after the final item, nor at the end of a row on desktop.
        const showConnector = !isLast && (index + 1) % columns !== 0;

        return (
          <Reveal as="li" key={step.index} delay={(index % columns) * 0.08} className="relative">
            <div className="group/step relative flex gap-4 lg:block">
              {/* Node */}
              <span
                aria-hidden="true"
                className="relative z-1 grid size-12 shrink-0 place-items-center rounded-full border border-line bg-veil/[0.05] text-cyan transition-[border-color,box-shadow] duration-300 group-hover/step:border-cyan/40 group-hover/step:shadow-[0_0_28px_rgba(88,236,255,0.22)]"
              >
                <Icon className="size-5" strokeWidth={1.6} />
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue))] text-[10px] font-black text-on-accent">
                  {step.index}
                </span>
              </span>

              {/* Body */}
              <div className="min-w-0 pb-2 lg:mt-5 lg:pr-4">
                <span className="text-[12px] font-extrabold tracking-[0.14em] text-muted-soft uppercase">
                  {step.index} / {step.phase}
                </span>
                <h3 className="mt-2 mb-2 text-[19px] leading-tight transition-colors duration-300 group-hover/step:text-cyan">
                  {step.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.6] text-muted">{step.description}</p>
              </div>

              {/* Connector: vertical on mobile, horizontal from lg */}
              {showConnector ? (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute top-12 bottom-0 left-6 w-px bg-[linear-gradient(180deg,var(--t-flow-from),var(--t-flow-to))] opacity-60 lg:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-6 left-12 hidden h-px w-[calc(100%-3rem)] bg-[linear-gradient(90deg,var(--t-flow-from),var(--t-flow-to))] opacity-60 lg:block"
                  />
                </>
              ) : null}
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
