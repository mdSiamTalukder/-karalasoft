'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { primaryNav, siteConfig } from '@/lib/site';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ButtonLink } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
    <header className="sticky top-0 z-50 border-b border-line bg-nav backdrop-blur-[22px]">
      <nav aria-label="Primary" className="container-x flex h-[78px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-[13px] transition-opacity hover:opacity-85"
          aria-label={`${siteConfig.name} — home`}
        >
          {/*
            Official horizontal lockup, occupying the space the old 42px "K" mark plus
            the "KaralaSoft" text used to take (~150 x 42).

            `karalasoftLogo2.png` is a transparent-background derivative of
            `karalasoftLogo2.jpeg`: the plain plate was made alpha=0 while every logo
            pixel was copied through untouched (verified bit-identical), so in the LIGHT
            theme the logo sits directly on the page and the background is invisible.

            The wordmark is dark ink (rgb 0,89,107), so on the dark surface it would fall
            to ~2.5:1 contrast. Rather than recolouring it or dropping a dark plate behind
            dark text, the dark theme keeps a light surface behind the logo using the same
            plain colour the original plate used — rounded and inset, so it reads as a
            deliberate brand plate rather than a stray image tile.
          */}
          <span
            className="grid shrink-0 place-items-center rounded-[10px] py-[3px] [html[data-theme=dark]_&]:bg-[#fefefe] [html[data-theme=dark]_&]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
          >
            <Image
              src="/images/karalasoftLogo2.png"
              alt={`${siteConfig.name} logo`}
              width={1600}
              height={533}
              sizes="(max-width: 639px) 120px, 150px"
              priority
              className="h-[34px] w-[120px] object-contain sm:h-[42px] sm:w-[150px]"
            />
          </span>
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
                    active ? 'bg-veil/[0.06] text-on-surface' : 'text-muted hover:bg-veil/[0.06] hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle />

          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex items-center gap-2 rounded-[14px] border border-line bg-veil/[0.035] px-4 py-3 text-[16px] leading-none text-on-surface transition-colors duration-300 hover:bg-veil/[0.07] lg:hidden"
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