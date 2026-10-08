import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getAdminSession } from '@/lib/admin-session';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

/**
 * Admin sign-in screen.
 *
 * Full-viewport, centred card. The ambient wash and grain below are decorative and
 * `aria-hidden`; the dark palette itself comes from `app/admin/layout.tsx`, which pins this
 * subtree to dark — so nothing here affects the authenticated dashboard or the public site.
 *
 * The "already signed in" short-circuit is unchanged: a valid session still redirects to
 * `/admin` before the form is ever rendered.
 */
export default async function AdminLoginPage() {
  // Already signed in — skip the form.
  const session = await getAdminSession();
  if (session) redirect('/admin');

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/*
        Ambient light. Positioned behind the card and clipped by the page's `overflow-hidden`,
        which also guarantees the page can never scroll horizontally on small screens.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -top-[22vh] -left-[18vw] size-[min(78vw,620px)] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.13),transparent_66%)]" />
        <span className="absolute -top-[10vh] right-[-22vw] size-[min(72vw,560px)] rounded-full bg-[radial-gradient(circle,rgba(156,100,255,0.12),transparent_66%)]" />
        <span className="absolute bottom-[-26vh] left-1/2 size-[min(96vw,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(83,119,255,0.13),transparent_68%)]" />
        {/* Hairline horizon — adds depth without a second gradient competing with the card. */}
        <span className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)]" />
      </div>

      <div className="container-x relative flex flex-1 items-center justify-center py-12 sm:py-16 lg:py-20">
        <LoginForm />
      </div>
    </div>
  );
}
