import type { ElementType, ReactNode } from 'react';

/** Pill-shaped label used above headings. */
export function Eyebrow({
  children,
  className = '',
  dot = false,
  as: Tag = 'span',
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
  as?: ElementType;
}) {
  return (
    <Tag
      className={`inline-flex items-center gap-2.5 rounded-full border border-line bg-veil/[0.04] px-3 py-2 text-[13px] text-paper-3 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] ${className}`}
    >
      {dot ? <StatusDot /> : null}
      {children}
    </Tag>
  );
}

/** Pulsing availability dot (the `.dot` inside the hero eyebrow). */
export function StatusDot({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`size-2 shrink-0 rounded-full bg-lime shadow-[0_0_16px_var(--color-lime)] [animation:pulseDot_2.4s_ease-in-out_infinite] ${className}`}
    />
  );
}