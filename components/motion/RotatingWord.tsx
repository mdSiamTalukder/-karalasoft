'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { rotatingWords } from '@/lib/content';

const EXIT_DURATION = 0.18;
const ENTER_DURATION = 0.22;

/**
 * Recreates the hero `#flipWord` animation from index-2.html: every 1900ms the
 * current word slides up and out (180ms), is swapped, then slides back in (220ms).
 */
export function RotatingWord({
  words = rotatingWords,
  interval = 1900,
}: {
  words?: readonly string[];
  interval?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const length = Math.max(words.length, 1);
  const current = words[index] ?? words[0] ?? '';

  useEffect(() => {
    if (reduceMotion || length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((previous) => (previous + 1) % length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, length, reduceMotion]);

  if (reduceMotion) {
    return <strong className="block text-xl">{current}</strong>;
  }

  return (
    <span className="relative block h-[1.45em] min-w-[11ch] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.strong
          key={current}
          className="absolute left-0 top-0 block text-xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: EXIT_DURATION } }}
          transition={{ duration: ENTER_DURATION, ease: 'easeOut' }}
        >
          {current}
        </motion.strong>
      </AnimatePresence>
    </span>
  );
}