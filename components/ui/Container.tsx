import type { ElementType, HTMLAttributes } from 'react';

/** Page-width wrapper — `min(1200px, 100% - 40px)`, same as `.container`. */
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