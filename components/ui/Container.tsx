import type { ElementType, HTMLAttributes } from 'react';

/**
 * Page-width wrapper.
 *
 * The width itself lives in the single `.container-x` rule in `app/globals.css`
 * (`min(1440px, …)` with responsive gutters). Change it there — not here — so every
 * container on the site moves together.
 */
export function Container({
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { as?: ElementType }) {
  return (
    <Tag className={`container-x ${className}`} {...rest}>
      {children}
    </Tag>
  );
}