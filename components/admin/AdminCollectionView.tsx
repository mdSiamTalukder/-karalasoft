import type { ReactNode } from 'react';
import { ExternalLink, Inbox } from 'lucide-react';

import { AdminCard } from '@/components/admin/ui';

/**
 * ------------------------------------------------------------------------------------
 * Read-only catalogue view
 * ------------------------------------------------------------------------------------
 * Shared renderer for the admin sections that mirror published CMS collections
 * (products, team, services). Those collections are readable through the public endpoints
 * the site already uses, but this admin build has no verified write endpoint for them, so
 * they are presented as read-only rather than wired to CRUD actions that would not work.
 *
 * Handles the three states the admin panel needs: loading, error and empty.
 */

export interface AdminCollectionItem {
  readonly id: number;
  readonly title: string;
  readonly description?: string | null;
  readonly meta?: string | null;
  readonly href?: string | null;
  readonly badge?: ReactNode;
}

export function AdminCollectionView({
  items,
  emptyTitle,
  emptyDescription,
  loading = false,
  error = null,
}: {
  items: readonly AdminCollectionItem[];
  emptyTitle: string;
  emptyDescription: string;
  loading?: boolean;
  error?: string | null;
}) {
  if (error) {
    return (
      <AdminCard className="p-6">
        <p role="alert" className="m-0 flex items-start gap-2.5 text-[15px] text-muted">
          <Inbox aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-soft" />
          <span>{error}</span>
        </p>
      </AdminCard>
    );
  }

  if (loading) {
    return (
      <ul aria-hidden="true" className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i}>
            <AdminCard className="p-5">
              <div className="h-4 w-1/2 rounded-full bg-white/[0.07] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
              <div className="mt-3 h-3 w-full rounded-full bg-white/[0.05] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
              <div className="mt-2 h-3 w-4/5 rounded-full bg-white/[0.05] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
            </AdminCard>
          </li>
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <AdminCard className="p-6">
        <p role="status" className="m-0 flex items-start gap-2.5 text-[15px] text-muted">
          <Inbox aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-soft" />
          <span>
            {emptyTitle}
            <span className="mt-1 block text-[13px] text-muted-soft">{emptyDescription}</span>
          </span>
        </p>
      </AdminCard>
    );
  }

  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <AdminCard className="flex h-full flex-col p-5">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 className="m-0 min-w-0 flex-1 text-[17px] leading-snug font-semibold tracking-[-0.01em]">
                {item.title}
              </h2>
              {item.badge}
            </div>

            {item.description ? (
              <p className="m-0 line-clamp-3 text-[14px] leading-relaxed text-muted">
                {item.description}
              </p>
            ) : null}

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
              {item.meta ? (
                <span className="text-[12px] text-muted-soft">{item.meta}</span>
              ) : null}
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan hover:underline"
                >
                  View live
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                </a>
              ) : null}
            </div>
          </AdminCard>
        </li>
      ))}
    </ul>
  );
}
