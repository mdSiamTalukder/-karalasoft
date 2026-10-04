import type { ElementType, ReactNode } from 'react';

/** Animated gradient headline fragment — recreates `.grad` from index-2.html. */
export function GradientText({
  children,
  as: Tag = 'span',
}: {
  children: ReactNode;
  as?: ElementType;
}) {
  return <Tag className="grad-text">{children}</Tag>;
}