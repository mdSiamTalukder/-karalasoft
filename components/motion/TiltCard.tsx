'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

const PERSPECTIVE = 900;
const MAX_ROTATE_X = 5;
const MAX_ROTATE_Y = 6;
const HOVER_LIFT = -8;

/**
 * Recreates `.tilt` from index-2.html:
 *   pointermove → perspective(900px) rotateX(-y*5deg) rotateY(x*6deg) translateY(-6px)
 *   pointerleave → reset
 *
 * Rendered as a plain element (not a motion component) so it can stay nested inside a
 * server-rendered `<Reveal>` without creating a second client boundary in the tree.
 * CSS `:hover` keeps working because the element itself never stops being hoverable.
 */
export function TiltCard({
  children,
  className = '',
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const config = { stiffness: 220, damping: 22, mass: 0.4 };
  const smoothX = useSpring(pointerX, config);
  const smoothY = useSpring(pointerY, config);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [MAX_ROTATE_X, -MAX_ROTATE_X]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-MAX_ROTATE_Y, MAX_ROTATE_Y]);

  const inactive = disabled || reduceMotion;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (inactive || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      className={`h-full ${className}`}
      style={{ perspective: PERSPECTIVE }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="h-full"
        style={
          inactive
            ? undefined
            : { rotateX, rotateY, transformStyle: 'preserve-3d' }
        }
        whileHover={{ y: HOVER_LIFT }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}