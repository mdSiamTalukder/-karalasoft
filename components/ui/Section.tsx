import type { HTMLAttributes } from 'react';

/** `<section>` with the original 95px vertical rhythm. */
export function Section({
  alt = false,
  className = '',
  children,
  id,
  labelledBy,
  ...rest
}: HTMLAttributes<HTMLElement> & { alt?: boolean; id?: string; labelledBy?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative py-[72px] sm:py-20 lg:py-[95px] ${
        alt ? 'border-y border-line bg-white/[0.025]' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}