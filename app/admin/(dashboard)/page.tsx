import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Image as ImageIcon, Plus, Tags } from 'lucide-react';

import { listProjects as fetchProjects } from '@/lib/admin-api';
import { getAdminSession } from '@/lib/admin-session';
import { AdminCard } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

/** Serialisable subset handed to the client chart-free summary cards. */
function summarise(projects: Awaited<ReturnType<typeof fetchProjects>>) {
  const total = projects.length;
  const categories = new Set(projects.map((p) => p.category?.trim()).filter(Boolean));
  const withImage = projects.filter((p) => Boolean(p.image_url)).length;
  const withLiveLink = projects.filter((p) => Boolean(p.live_link)).length;
  const tagged = projects.filter((p) => (p.tags?.length ?? 0) > 0).length;
  return { total, categories: categories.size, withImage, withLiveLink, tagged };
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  // The layout already guarantees a session; this narrows the type for TS.
  if (!session) return null;

  let stats = { total: 0, categories: 0, withImage: 0, withLiveLink: 0, tagged: 0 };
  let latest: Awaited<ReturnType<typeof fetchProjects>> = [];
  let loadError: string | null = null;

  try {
    const projects = await fetchProjects(session.token);
    stats = summarise(projects);
    latest = projects
      .slice()
      .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
      .slice(0, 5);
  } catch {
    loadError = 'Projects could not be loaded right now. Please refresh to try again.';
  }

  const tiles = [
    { label: 'Projects', value: stats.total, icon: FolderKanban },
    { label: 'Categories', value: stats.categories, icon: Tags },
    { label: 'With cover image', value: stats.withImage, icon: ImageIcon },
    { label: 'With live link', value: stats.withLiveLink, icon: ArrowRight },
  ];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1.5 text-[30px] leading-tight tracking-[-0.03em] sm:text-[34px]">
            Welcome back, {session.user.name.split(' ')[0]}
          </h1>
          <p className="m-0 text-[15px] text-muted">
            Manage the portfolio shown on the public website.
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
        <p role="alert" className="mb-6 rounded-[14px] border border-pink/35 bg-pink/[0.08] px-4 py-3 text-[15px] text-pink">
          {loadError}
        </p>
      ) : null}

      <ul className="m-0 mb-8 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <li key={tile.label}>
              <AdminCard className="p-5">
                <span
                  aria-hidden="true"
                  className="mb-4 grid size-10 place-items-center rounded-[12px] border border-white/10 bg-white/[0.04] text-cyan"
                >
                  <Icon className="size-4" />
                </span>
                <p className="m-0 text-[30px] leading-none font-black tracking-[-0.03em]">
                  {tile.value}
                </p>
                <p className="mt-2 mb-0 text-[13px] text-muted">{tile.label}</p>
              </AdminCard>
            </li>
          );
        })}
      </ul>

      <AdminCard className="p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="m-0 text-[19px] tracking-[-0.02em]">Recently updated</h2>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-cyan hover:underline"
          >
            Manage all
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="m-0 text-[15px] text-muted">
            No projects yet. Create your first project to populate the public portfolio.
          </p>
        ) : (
          <ul className="m-0 grid list-none gap-2 p-0">
            {latest.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold">{project.title}</span>
                    <span className="block truncate text-[13px] text-muted">
                      {project.category ?? 'Uncategorised'}
                      {project.year ? ` · ${project.year}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] text-muted-soft">
                    {new Date(project.updated_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}