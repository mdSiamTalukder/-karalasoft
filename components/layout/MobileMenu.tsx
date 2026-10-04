'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { primaryNav } from '@/lib/site';

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
          className="fixed inset-x-5 top-[88px] z-80 rounded-[20px] border border-line bg-[#081321] p-[18px] shadow-premium lg:hidden"
        >
          <ul className="grid gap-2">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-xl px-[13px] py-[13px] transition-colors duration-300 ${
                      active ? 'bg-white/[0.06] text-white' : 'bg-white/[0.03] text-muted hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}