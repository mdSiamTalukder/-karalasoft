import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · KaralaSoft Admin' },
  // The panel must never be indexed.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Root of the Admin Panel.
 *
 * No auth check here — `/admin/login` must stay reachable while signed out, so the
 * protected gate lives in the `(dashboard)` layout that wraps every other admin route.
 *
 * `data-theme="dark"` pins this subtree to the dark palette. The Admin Panel is a
 * self-contained dark UI and is intentionally not part of the public light/dark theme
 * system; scoping the attribute here means a visitor who prefers light mode on the public
 * site still sees the panel exactly as before, with no changes to any admin styling.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="dark"
      className="min-h-dvh bg-[radial-gradient(circle_at_15%_0%,rgba(83,119,255,0.14),transparent_38%),radial-gradient(circle_at_85%_8%,rgba(156,100,255,0.10),transparent_32%),#050913]"
    >
      {children}
    </div>
  );
}