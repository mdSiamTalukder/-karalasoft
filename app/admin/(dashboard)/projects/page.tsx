import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { getAdminSession } from '@/lib/admin-session';
import { listProjects } from '@/lib/admin-api';
import { ProjectsTable } from '@/components/admin/ProjectsTable';
import { AdminCard } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'Projects' };
export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const session = await getAdminSession();
  if (!session) return null;

  let projects: Awaited<ReturnType<typeof listProjects>> = [];
  let loadError: string | null = null;
  try {
    projects = await listProjects(session.token);
  } catch {
    loadError = 'Projects could not be loaded. Check your connection and refresh.';
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1.5 text-[30px] leading-tight tracking-[-0.03em] sm:text-[34px]">
            Projects
          </h1>
          <p className="m-0 text-[15px] text-muted">
            Every change here goes live on the public portfolio straight away.
          </p>
        </div>

        <Link
          href="/admin/projects/create"
          className="inline-flex items-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue)_50%,var(--color-violet))] px-5 py-3 font-[850] text-[#04101a] shadow-[0_18px_55px_rgba(83,119,255,0.30)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Plus aria-hidden="true" className="size-4" />
          New project
        </Link>
      </header>

      {loadError ? (
        <AdminCard className="mb-5 p-6">
          <p role="alert" className="m-0 text-[15px] text-pink">
            {loadError}
          </p>
        </AdminCard>
      ) : (
        <ProjectsTable projects={projects} />
      )}
    </div>
  );
}