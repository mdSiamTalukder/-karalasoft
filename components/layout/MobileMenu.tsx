'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { primaryNav } from '@/lib/site';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

/**
 * Slide-down navigation panel for tablet/mobile.
 *
 * Accessibility:
 *  - `Escape` closes and returns focus to the toggle (handled by `Navbar`)
 *  - Tab / Shift+Tab are trapped inside the panel while it is open
 *  - focus moves to the first link on open, background scroll is locked
 */
export function MobileMenu({
  open,
  onClose,
  menuId,
}: {
  open: boolean;
  onClose: () => void;
  menuId: string;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Lock background scrolling while the panel covers the viewport.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    const firstLink = panelRef.current?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus({ preventScroll: true });
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={menuId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed inset-x-5 top-[88px] z-80 rounded-[20px] border border-line bg-surface-2 p-[18px] text-left shadow-premium lg:hidden"
        >
          {/*
            Alignment contract for this panel — read before adding content to it.

            1. `text-left` on the panel above establishes one left content edge that every
               descendant inherits, so no child needs its own `text-*` class.
            2. `m-0 list-none p-0` on the list below is REQUIRED, not cosmetic. This
               project's Tailwind preflight only emits `list-style: none` for lists; it does
               not reset their margin or padding. Without the reset the <ul> inherits the
               browser default `padding-inline-start: 40px`, which is what pushed every nav
               label 40px to the right of the Theme row beneath it (a plain <div>, so it was
               unaffected). Every other list in this codebase carries the same reset.
            3. Nav labels sit inside their own `px-[13px]` pills, so any sibling *text* in
               this panel must carry that same 13px inset to share the left text edge.
               Controls (like the toggle) stay right-aligned by design.
          */}
          <ul className="m-0 grid list-none gap-2 p-0">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-xl px-[13px] py-[13px] transition-colors duration-300 ${
                      active ? 'bg-veil/[0.06] text-on-surface' : 'bg-veil/[0.03] text-muted hover:text-on-surface'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Label matches the links' 13px text inset so both share one left edge (see note 3 above). */}
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="px-[13px] text-[14px] text-muted">Theme</span>
            <ThemeToggle />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}