'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ------------------------------------------------------------------------------------
 * Scroll restoration.
 * ------------------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * Next.js 16's App Router does not force the viewport back to the top on navigation. The
 * scroll position lives on <html>, and because a client-side route change swaps the DOM
 * without reloading the document, the browser keeps whatever offset it had — so clicking
 * "Services" half-way down the Home page can land mid-page on Services.
 *
 * (The older Pages Router did this for you via `window.scrollTo`; that code path is not
 * part of the App Router client, which is why the behaviour differs.)
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *   - Nothing on first render, so a reload / bfcache restore keeps the browser's own
 *     position instead of being yanked to the top.
 *   - Nothing when the URL carries a hash, so intentional anchor navigation
 *     (`/#about`, `/#contact`, the `#main` skip link, …) still scrolls to its section.
 *   - Nothing on browser back/forward. Those are POP navigations and users expect to
 *     return to where they were, so the browser's own restoration is left in place.
 *
 * `behavior: 'instant'` is used because the site sets `html { scroll-behavior: smooth }`;
 * without it the reset would animate instead of jumping, which reads as a laggy page.
 *
 * Renders `null`, so it has no effect on layout, spacing or page order.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  const isFirstRender = useRef(true);
  // Set by the popstate listener below; read and reset by the scroll effect.
  const cameFromHistory = useRef(false);

  // Track POP navigations. `popstate` fires before React re-renders for the new URL, so
  // the flag is already set by the time the effect below runs.
  useEffect(() => {
    const onPopState = () => {
      cameFromHistory.current = true;
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    // Never interfere with the initial load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Back / forward — leave the browser's restoration alone.
    if (cameFromHistory.current) {
      cameFromHistory.current = false;
      return;
    }

    // Anchor navigation — let the browser handle the hash.
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}