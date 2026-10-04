'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'none';

const OFFSET: Record<Direction, number> = { up: 28, none: 0 };

/**
 * Recreates the IntersectionObserver `.reveal` behaviour from index-2.html:
 * fade in + translateY(28px) once the element reaches 12% visibility.
 *
 * This is the *only* client boundary in the tree — children stay server-rendered.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: OFFSET[direction] }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}