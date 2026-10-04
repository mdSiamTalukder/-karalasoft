'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  children: ReactNode;
  /** Wrap in the intersection-observer reveal animation. */
  reveal?: boolean;
  /** Wrap in the pointer-driven 3D tilt (`.tilt`). */
  tilt?: boolean;
  /** Reveal stagger, in seconds. */
  delay?: number;
  as?: 'div' | 'article' | 'li';
}

/**
 * The premium glass card from index-2.html:
 * rounded-[26px] · 1px hairline border · vertical white gradient · cyan corner glow
 * that scales up on hover, plus an 8px lift.
 *
 * `Card` is a client component because it *may* mount `Reveal` / `TiltCard`.
 * Everything rendered inside it is still server-rendered and streamed as children.
 */
export function Card({
  children,
  className = '',
  reveal = true,
  tilt = false,
  delay = 0,
  as = 'div',
  ...rest
}: CardProps) {
  const surface = (
    <div
      className={`group/card relative h-full overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] p-5 transition-[border-color,box-shadow] duration-300 ease-out hover:border-cyan/30 hover:shadow-[0_28px_70px_rgba(0,0,0,0.25)] sm:p-7 ${className}`}
      {...rest}
    >
      {/* `.card::after` — corner glow that scales 1.4× on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[90px] -right-[90px] size-[180px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.12),transparent_70%)] transition-transform duration-300 ease-out group-hover/card:scale-140"
      />
      {children}
    </div>
  );

  const revealed = reveal ? (
    <Reveal as={as} className="h-full" delay={delay}>
      {surface}
    </Reveal>
  ) : (
    surface
  );

  return tilt ? <TiltCard>{revealed}</TiltCard> : revealed;
}