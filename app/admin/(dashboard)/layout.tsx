import { redirect } from 'next/navigation';

import { getAdminSession } from '@/lib/admin-session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { logoutAction } from '@/app/admin/actions';

/**
 * Authenticated shell for every admin route except the login screen.
 *
 * The gate runs on the server: a missing, invalid or expired bearer token always
 * redirects to `/admin/login`, and the token itself is never passed to the client.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    // `flex-col` on mobile so AdminSidebar's mobile <header> (a sibling of <aside>, hidden
    // below `lg`) stacks ABOVE the content instead of competing with it for horizontal
    // space. As a row flex item it took ~228px and squeezed the content column to ~147px
    // on a 375px screen. `lg:flex-row` restores the sidebar layout on desktop.
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AdminSidebar user={session.user} onLogout={logoutAction} />
      {/* The root layout already renders <main id="main">, so this stays a div to avoid
          nested landmark elements. */}
      <div className="min-w-0 flex-1">
        <div className="container-x py-8 sm:py-10">{children}</div>
      </div>
    </div>
  );
}