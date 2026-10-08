import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  FolderKanban,
  LayoutGrid,
  MessageSquare,
  Package,
  Plus,
  Users,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { getAdminSession } from '@/lib/admin-session';
import { loadAdminOverview } from '@/lib/admin-overview';
import { listProjects as fetchProjects } from '@/lib/admin-api';
import { AdminCard } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

/**
 * ------------------------------------------------------------------------------------
 * Admin dashboard
 * ------------------------------------------------------------------------------------
 * Information hierarchy follows the KaralaSoft reference admin panel:
 *
 *   greeting → summary cards (one per content collection) → "Manage Content" shortcuts
 *
 * Every figure is a live count from the CMS (see `lib/admin-overview.ts`). A collection
 * that cannot be read renders an explicit "No data available" state rather than a `0`, so
 * a transient backend failure is never mistaken for an empty catalogue.
 */

/** One summary card. */
function SummaryCard({
  label,
  href,
  icon: Icon,
  count,
  error,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  count: number | null;
  error: string | null;
}) {
  const unavailable = count === null;

  return (
    <Link
      href={href}
      className="group/summary block h-full rounded-[22px] border border-white/10 bg-white/[0.03] p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-cyan/35 hover:shadow-[0_22px_60px_rgba(0,0,0,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-[13px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]"
        >
          <Icon className="size-5 text-cyan" strokeWidth={1.7} />
        </span>
        <ArrowRight
          aria-hidden="true"
          className="mt-1 size-4 shrink-0 text-muted-soft/60 transition-[transform,color] duration-300 group-hover/summary:translate-x-0.5 group-hover/summary:text-cyan"
        />
      </div>

      <p className="m-0 text-[30px] leading-none font-black tracking-[-0.03em] tabular-nums">
        {unavailable ? <span className="text-muted-soft">—</span> : count}
      </p>
      <p className="mt-2 mb-0 text-[13px] text-muted">{label}</p>

      {unavailable ? (
        <p className="mt-1.5 mb-0 text-[12px] text-muted-soft">
          {error === 'No data available' ? 'No data available' : 'Unavailable'}
        </p>
      ) : null}
    </Link>
  );
}

/** Compact shortcut under "Manage Content". */
function ManageLink({
  href,
  label,
  icon: Icon,
  available,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  available: boolean;
}) {
  const base =
    'flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-4 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-cyan/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan';
  const tone = available ? '' : 'cursor-not-allowed opacity-55 hover:translate-y-0 hover:border-white/10';

  const inner = (
    <>
      <Icon aria-hidden="true" className="size-5 shrink-0 text-cyan" strokeWidth={1.7} />
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{label}</span>
      {available ? (
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-soft/60"
        />
      ) : (
        <span className="shrink-0 text-[11px] text-muted-soft/80">Unavailable</span>
      )}
    </>
  );

  // Sections the CMS does not expose a read endpoint for are rendered inert rather than
  // linked to a route that does not exist.
  if (!available) {
    return (
      <span className={`${base} ${tone}`} aria-disabled="true">
        {inner}
      </span>
    );
  }

  return (
    <Link href={href} className={`${base} ${tone}`}>
      {inner}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  // The layout already guarantees a session; this narrows the type for TS.
  if (!session) return null;

  const firstName = session.user.name.split(' ')[0] || 'Admin';

  const [overview, latest] = await Promise.all([
    loadAdminOverview(),
    // Recent activity still comes from the authenticated projects endpoint, as before.
    fetchProjects(session.token)
      .then((projects) =>
        projects
          .slice()
          .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
          .slice(0, 5),
      )
      .catch(() => null),
  ]);

  const cards = [
    {
      label: 'Projects',
      href: '/admin/projects',
      icon: FolderKanban,
      count: overview.projects.count,
      error: overview.projects.error,
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
      count: overview.products.count,
      error: overview.products.error,
    },
    {
      label: 'Team Members',
      href: '/admin/team',
      icon: Users,
      count: overview.team.count,
      error: overview.team.error,
    },
    {
      label: 'Services',
      href: '/admin/services',
      icon: Wrench,
      count: overview.services.count,
      error: overview.services.error,
    },
    {
      label: 'Unread Messages',
      href: '#',
      icon: MessageSquare,
      count: overview.messages.count,
      error: overview.messages.error,
    },
  ];

  const manage = [
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban, available: true },
    { label: 'Products', href: '/admin/products', icon: Package, available: true },
    { label: 'Team', href: '/admin/team', icon: Users, available: true },
    { label: 'Services', href: '/admin/services', icon: Wrench, available: true },
    // No read endpoint exists on the CMS for settings, about content or messages, so no
    // count or listing can be shown for them. They stay visible, but inert.
    { label: 'Site Settings', href: '#', icon: LayoutGrid, available: false },
    { label: 'About Content', href: '#', icon: LayoutGrid, available: false },
  ];

  return (
    <div>
      {/* ------------------------------------------------------------- greeting */}
      <header className="mb-8">
        <h1 className="m-0 mb-1.5 text-[30px] leading-tight tracking-[-0.03em] sm:text-[34px]">
          Welcome back, {firstName}
        </h1>
        <p className="m-0 text-[15px] text-muted">
          Here&rsquo;s an overview of your website content.
        </p>
      </header>

      {/* -------------------------------------------------------- summary cards */}
      <ul className="m-0 mb-10 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.label}>
            <SummaryCard
              label={card.label}
              href={card.href}
              icon={card.icon}
              count={card.count}
              error={card.error}
            />
          </li>
        ))}
      </ul>

      {/* ------------------------------------------------------ manage content */}
      <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em]">Manage Content</h2>
      <ul className="m-0 mb-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {manage.map((item) => (
          <li key={item.label}>
            <ManageLink
              href={item.href}
              label={item.label}
              icon={item.icon}
              available={item.available}
            />
          </li>
        ))}
      </ul>

      {/* ------------------------------------------------------ recent activity */}
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

        {latest === null ? (
          <p role="alert" className="m-0 text-[15px] text-muted">
            Recent project activity could not be loaded right now. Please refresh to try
            again.
          </p>
        ) : latest.length === 0 ? (
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
                    <span className="block truncate text-[15px] font-semibold">
                      {project.title}
                    </span>
                    <span className="block truncate text-[13px] text-muted">
                      {project.category ?? 'Uncategorised'}
                      {project.year ? ` · ${project.year}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] text-muted-soft tabular-nums">
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

      {/* Primary action, matching the existing projects workflow. */}
      <div className="mt-8">
        <Link
          href="/admin/projects/create"
          className="inline-flex items-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue)_50%,var(--color-violet))] px-5 py-3 font-[850] text-[#04101a] shadow-[0_18px_55px_rgba(83,119,255,0.30)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Plus aria-hidden="true" className="size-4" />
          New project
        </Link>
      </div>
    </div>
  );
}
