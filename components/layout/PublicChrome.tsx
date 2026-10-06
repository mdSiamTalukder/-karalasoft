'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * ------------------------------------------------------------------------------------
 * Public chrome gate.
 * ------------------------------------------------------------------------------------
 * The root layout must keep rendering <html>/<body> for every route, but the marketing
 * Navbar/Footer should never appear inside the Admin Panel. This tiny client component is
 * the only place that knows about the route prefix.
 *
 * IMPORTANT — it renders `header → children → footer`. The page content MUST sit between
 * the navbar and the footer, so `children` is threaded through this component rather than
 * being rendered by the caller alongside it. Grouping header+footer together and rendering
 * that unit above the content would put the footer directly under the navbar on every page.
 *
 * On /admin it renders `children` only, so the panel gets its content with no marketing
 * chrome at all.
 *
 * Server components (Footer) and client components (Navbar, ScrollProgress) can
 * both be passed in as props.
 */
export function PublicChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}