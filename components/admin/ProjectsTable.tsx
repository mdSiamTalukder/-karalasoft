'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ExternalLink,
  ImageOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { deleteProjectAction } from '@/app/admin/actions';
import { resolveMediaUrl } from '@/lib/admin-api';
import type { AdminProject } from '@/lib/admin-api';
import { AdminCard, AdminStatus, adminInputClass } from '@/components/admin/ui';

type SortKey = 'order' | 'title' | 'updated';

function compare(a: AdminProject, b: AdminProject, key: SortKey): number {
  if (key === 'title') return a.title.localeCompare(b.title);
  if (key === 'updated') return (b.updated_at ?? '').localeCompare(a.updated_at ?? '');
  return (a.order_index ?? 0) - (b.order_index ?? 0) || a.id - b.id;
}

function ProjectThumb({ project }: { project: AdminProject }) {
  const src = resolveMediaUrl(project.image_url);
  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.03] text-muted-soft"
      >
        <ImageOff className="size-4" />
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={44}
      height={44}
      className="size-11 shrink-0 rounded-[12px] border border-white/10 object-cover"
    />
  );
}

export function ProjectsTable({ projects }: { projects: AdminProject[] }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('order');
  const [pendingDelete, setPendingDelete] = useState<AdminProject | null>(null);
  const [error, setError] = useState('');
  const [, startTransition] = useTransition();

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? projects.filter((project) => {
          const haystack = [
            project.title,
            project.category ?? '',
            project.year ?? '',
            project.description ?? '',
          ]
            .join(' ')
            .toLowerCase();
          return haystack.includes(needle);
        })
      : projects;

    return filtered.sort((a, b) => compare(a, b, sortKey));
  }, [projects, query, sortKey]);

  function confirmDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    setError('');
    startTransition(async () => {
      const result = await deleteProjectAction(
        (() => {
          const data = new FormData();
          data.set('id', String(target.id));
          return data;
        })(),
      );
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <div>
      {error ? (
        <div className="mb-4">
          <AdminStatus tone="error">{error}</AdminStatus>
        </div>
      ) : null}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-soft"
          />
          <label htmlFor="project-search" className="sr-only-focusable">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, category or year"
            className={`${adminInputClass} pl-11`}
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="project-sort" className="text-[13px] text-muted-soft">
            Sort
          </label>
          <select
            id="project-sort"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="rounded-[12px] border border-white/10 bg-[#081522] px-3.5 py-2.5 text-[15px] outline-none focus:border-cyan/40"
          >
            <option value="order">Display order</option>
            <option value="title">Title A–Z</option>
            <option value="updated">Last updated</option>
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mb-4 text-[13px] text-muted-soft">
        Showing {visible.length} of {projects.length} project{projects.length === 1 ? '' : 's'}
      </p>

      {visible.length === 0 ? (
        <AdminCard className="p-10 text-center">
          <p className="m-0 text-[16px] font-semibold">
            {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
          </p>
          <p className="mx-auto mt-2 mb-5 max-w-[420px] text-[15px] text-muted">
            {projects.length === 0
              ? 'Create your first project to populate the public portfolio.'
              : 'Try a different title, category or year.'}
          </p>
          {projects.length === 0 ? (
            <Link
              href="/admin/projects/create"
              className="inline-flex items-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue)_50%,var(--color-violet))] px-5 py-3 font-[850] text-[#04101a]"
            >
              <Plus aria-hidden="true" className="size-4" />
              New project
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-[14px] border border-white/10 bg-white/[0.04] px-5 py-3 text-[15px] transition-colors hover:bg-white/[0.08]"
            >
              Clear search
            </button>
          )}
        </AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          {/* Table on wide screens */}
          <table className="hidden w-full border-collapse md:table">
            <thead>
              <tr className="border-b border-white/10 text-left">
                {['Project', 'Category', 'Order', 'Updated', 'Live', ''].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-3.5 text-[12px] font-semibold tracking-[0.12em] text-muted-soft uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr key={project.id} className="border-b border-white/[0.06] last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <ProjectThumb project={project} />
                      <span className="min-w-0">
                        <span className="block max-w-[280px] truncate text-[15px] font-semibold">
                          {project.title}
                        </span>
                        {project.year ? (
                          <span className="block text-[13px] text-muted-soft">{project.year}</span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[15px] text-muted">
                    {project.category ?? '—'}
                  </td>
                  <td className="px-5 py-3.5 text-[15px] text-muted">{project.order_index ?? 0}</td>
                  <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-muted">
                    {new Date(project.updated_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    {project.live_link ? (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Open ${project.title} live site`}
                        className="inline-grid size-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.03] text-muted transition-colors hover:text-cyan"
                      >
                        <ExternalLink aria-hidden="true" className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-[15px] text-muted-soft">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        aria-label={`Edit ${project.title}`}
                        className="inline-grid size-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-cyan/30 hover:text-cyan"
                      >
                        <Pencil aria-hidden="true" className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(project)}
                        aria-label={`Delete ${project.title}`}
                        className="inline-grid size-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-pink/35 hover:text-pink"
                      >
                        <Trash2 aria-hidden="true" className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards on narrow screens */}
          <ul className="m-0 grid list-none gap-3 p-4 md:hidden">
            {visible.map((project) => (
              <li key={project.id}>
                <div className="rounded-[16px] border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-start gap-3">
                    <ProjectThumb project={project} />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[15px] font-semibold">{project.title}</p>
                      <p className="mt-0.5 mb-0 text-[13px] text-muted">
                        {project.category ?? 'Uncategorised'}
                        {project.year ? ` · ${project.year}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-[12px] text-muted-soft">
                      Order {project.order_index ?? 0}
                    </span>
                    <div className="flex gap-2">
                      {project.live_link ? (
                        <a
                          href={project.live_link}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`Open ${project.title} live site`}
                          className="inline-grid size-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.03] text-muted"
                        >
                          <ExternalLink aria-hidden="true" className="size-3.5" />
                        </a>
                      ) : null}
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        aria-label={`Edit ${project.title}`}
                        className="inline-grid size-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.03] text-muted"
                      >
                        <Pencil aria-hidden="true" className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(project)}
                        aria-label={`Delete ${project.title}`}
                        className="inline-grid size-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.03] text-muted"
                      >
                        <Trash2 aria-hidden="true" className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      <AnimatePresence>
        {pendingDelete ? (
          <motion.div
            key="confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(2,5,12,0.78)] p-5 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className="glass w-full max-w-[440px] rounded-[22px] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 id="delete-title" className="m-0 text-[19px] tracking-[-0.02em]">
                  Delete project?
                </h2>
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-[10px] border border-white/10 text-muted hover:text-white"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>

              <p id="delete-body" className="mt-3 mb-0 text-[15px] text-muted">
                <strong className="text-white">{pendingDelete.title}</strong> will be removed from
                the website immediately. This cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="rounded-[14px] border border-white/10 bg-white/[0.04] px-5 py-3 text-[15px] transition-colors hover:bg-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-[14px] bg-pink px-5 py-3 font-[850] text-[#2a0417] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Delete project
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}