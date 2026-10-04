'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { primaryNav, siteConfig } from '@/lib/site';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ButtonLink } from '@/components/ui/Button';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  // The panel is "open for" a specific pathname, so a route change closes it
  // automatically — no setState-in-effect needed.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpenFor(null), []);
  const toggle = useCallback(() => setOpenFor(pathname), [pathname]);

  // Escape closes the panel and restores focus to the toggle.
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpenFor(null);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(5,9,19,0.70)] backdrop-blur-[22px]">
      <nav aria-label="Primary" className="container-x flex h-[78px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-[13px] transition-opacity hover:opacity-85"
          aria-label={`${siteConfig.name} — home`}
        >
          <span
            aria-hidden="true"
            className="grid size-[42px] place-items-center rounded-[13px] bg-[conic-gradient(from_180deg,var(--color-cyan),var(--color-blue),var(--color-violet),var(--color-pink),var(--color-cyan))] text-[#041018] font-[950] shadow-[0_0_35px_rgba(88,236,255,0.20)]"
          >
            {siteConfig.mark}
          </span>
          <span className="text-[20px] font-[850] tracking-[-0.03em]">{siteConfig.name}</span>
        </Link>

        <ul className="hidden items-center gap-2 lg:flex">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-xl px-[13px] py-2.5 text-[16px] transition-colors duration-300 ${
                    active ? 'bg-white/[0.06] text-white' : 'text-muted hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex items-center gap-2 rounded-[14px] border border-line bg-white/[0.035] px-4 py-3 text-[16px] leading-none text-white transition-colors duration-300 hover:bg-white/[0.07] lg:hidden"
          >
            <span aria-hidden="true" className="flex w-4 flex-col gap-[3px]">
              <span
                className={`h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[4.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[4.5px] -rotate-45' : ''
                }`}
              />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>

          {/* One button with a responsive label — avoids conflicting `display` utilities
              and keeps the header from overflowing on small phones. */}
          <ButtonLink
            href="/contact"
            variant="primary"
            className="max-sm:px-4"
            aria-label="Start a Project"
          >
            <span className="max-sm:hidden">Start a Project </span>
            <span aria-hidden="true">↗</span>
          </ButtonLink>
        </div>
      </nav>

      <MobileMenu open={open} onClose={close} menuId={menuId} />
    </header>
  );
}