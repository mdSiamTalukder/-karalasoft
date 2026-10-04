'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Top-of-page gradient scroll indicator (`.progress`).
 * Uses Framer Motion's `useScroll` + a spring for a smoother, cheaper
 * implementation than the original scroll listener.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 34, restDelta: 0.001 });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 z-100 h-[3px] w-full origin-left bg-[linear-gradient(90deg,var(--color-cyan),var(--color-blue),var(--color-violet),var(--color-pink))]"
      style={{ scaleX }}
    />
  );
}