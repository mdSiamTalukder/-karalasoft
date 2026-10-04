'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * Pointer-following ambient glow (`.cursor-glow`).
 * Deliberately hidden on coarse pointers (touch devices) where it adds nothing.
 */
export function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 120, damping: 26, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (reduceMotion) return undefined;

    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedData = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => setEnabled(finePointer.matches && !reducedData.matches);
    sync();

    finePointer.addEventListener('change', sync);
    return () => finePointer.removeEventListener('change', sync);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return undefined;

    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-[-1] size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.10),rgba(83,119,255,0.05)_40%,transparent_70%)] max-lg:size-[260px]"
      style={{ left: springX, top: springY }}
    />
  );
}