import { ClipboardCheck, Compass, FileText, PlayCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { CONTACT_NEXT_STEPS } from '@/lib/contact-page';

/**
 * ------------------------------------------------------------------------------------
 * What happens next
 * ------------------------------------------------------------------------------------
 * Four plain process steps. There are deliberately no timeframes, guarantees or outcome
 * claims attached to any of them — this describes the shape of the engagement, not a
 * service-level promise.
 *
 * PRESENTATIONAL ONLY — it renders no `<section>` of its own, because it sits beside the
 * project-brief form inside the page's own `Section`. A nested section here would double
 * the vertical padding and produce an invalid section-in-section landmark.
 */

const STEP_ICONS: readonly LucideIcon[] = [ClipboardCheck, Compass, FileText, PlayCircle];

export function ContactNextSteps() {
  return (
    <div className="rounded-[26px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-6 backdrop-blur-[18px] sm:p-7">
      <Eyebrow>{CONTACT_NEXT_STEPS.eyebrow}</Eyebrow>

      <h2
        id="contact-next-heading"
        className="mt-4 mb-3 text-[clamp(24px,2.6vw,32px)] leading-[1.06] tracking-[-0.04em] text-balance"
      >
        {CONTACT_NEXT_STEPS.title}
      </h2>

      <p className="mt-0 mb-6 text-[15px] leading-relaxed text-muted">
        {CONTACT_NEXT_STEPS.description}
      </p>

      <ol className="m-0 list-none grid grid-cols-1 gap-3.5 p-0">
        {CONTACT_NEXT_STEPS.steps.map((step, index) => {
          const Icon = STEP_ICONS[index % STEP_ICONS.length] as LucideIcon;

          return (
            <Reveal
              as="li"
              key={step.index}
              delay={index * 0.06}
              className="group/step relative flex items-start gap-3.5 rounded-[16px] border border-line bg-veil/[0.03] p-4"
            >
              {/*
                Vertical connector between steps. Hidden on the final item so the run does
                not appear to continue past the last step.
              */}
              {index < CONTACT_NEXT_STEPS.steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-full left-[27px] h-3.5 w-px bg-line"
                />
              ) : null}

              <span className="relative grid size-9 shrink-0 place-items-center rounded-[11px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]">
                <Icon aria-hidden="true" className="size-[17px] text-cyan" strokeWidth={1.7} />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="m-0 flex items-baseline gap-2 text-[17px] leading-snug">
                  <span className="text-[11px] font-extrabold tracking-[0.14em] text-cyan uppercase tabular-nums">
                    {step.index}
                  </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 mb-0 text-[14px] leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}