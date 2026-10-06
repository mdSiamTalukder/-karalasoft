import type { ReactNode } from 'react';

/**
 * Section header (`.section-head`): eyebrow + two-line heading on the left,
 * supporting paragraph on the right. Stacks on tablet and below.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col items-end justify-between gap-6 lg:mb-9 lg:flex-row lg:gap-8">
      <div>
        {eyebrow ? (
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-veil/[0.04] px-3 py-2 text-[13px] text-paper-3">
            {eyebrow}
          </span>
        ) : null}
        <h2
          id={id}
          className="mt-2.5 mb-0 text-[clamp(34px,5vw,62px)] leading-none tracking-[-0.05em]"
        >
          {title}
        </h2>
      </div>

      {description || children ? (
        <div className="max-w-[570px]">
          {description ? <p className="m-0 text-muted">{description}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}