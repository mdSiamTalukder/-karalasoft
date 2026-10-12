import type { Metadata } from 'next';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCard, AdminStatus } from '@/components/admin/ui';
import { getAdminSession } from '@/lib/admin-session';
import { fetchAboutRecord } from '@/lib/admin-api';
import type { AboutRecord } from '@/lib/admin-api';

export const metadata: Metadata = { title: 'About Content' };
export const dynamic = 'force-dynamic';

/**
 * About Content — read-only view of the published About record.
 *
 * Everything on this page is the live `GET /api/about` record fetched through the existing
 * `fetchAboutRecord()` helper, so it mirrors exactly what the public `/about` page serves
 * from the CMS. Nothing here is hardcoded or invented.
 *
 * **This page is intentionally read-only.** The CMS publishes `allow: GET` for
 * `/api/about` — there is no write verb — so no edit, save or publish control is offered.
 * Adding form controls would imply an editing capability that the backend does not
 * support. Editable About content needs a write endpoint upstream first.
 */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 py-3 first:border-t-0 first:pt-0">
      <dt className="m-0 text-[13px] tracking-[0.08em] text-muted-soft uppercase">{label}</dt>
      <dd className="m-0 mt-1 text-[15px] break-words text-white">{value}</dd>
    </div>
  );
}

export default async function AdminAboutPage() {
  const session = await getAdminSession();
  if (!session) return null; // the (dashboard) layout already redirects unauthenticated users

  let record: AboutRecord | null = null;
  let error: string | null = null;

  try {
    record = await fetchAboutRecord(session.token);
  } catch {
    error = 'The About record could not be loaded from the CMS right now. Please refresh to try again.';
  }

  const updatedLabel = record?.updated_at
    ? new Date(record.updated_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
      }) + ' UTC'
    : null;

  return (
    <div>
      <PageHeader
        title="About Content"
        description="Read-only view of the published About page record from the CMS."
      />

      {error !== null ? <AdminStatus tone="error">{error}</AdminStatus> : null}

      {record !== null ? (
        <div className="flex flex-col gap-5">
          <AdminCard className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="m-0 text-[17px] font-semibold">Hero</h2>
              <p className="m-0 text-[12px] text-muted-soft">
                Record #{record.id}
                {updatedLabel !== null ? ` · updated ${updatedLabel}` : ''}
              </p>
            </div>
            <dl className="m-0">
              <Row label="Badge" value={record.badge} />
              <Row label="Hero title" value={record.hero_title} />
              <Row label="Hero highlight" value={record.hero_highlight} />
            </dl>
          </AdminCard>

          <AdminCard className="p-5 sm:p-6">
            <h2 className="m-0 mb-4 text-[17px] font-semibold">
              Paragraphs ({record.paragraphs.length})
            </h2>
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {record.paragraphs.map((paragraph, index) => (
                <li
                  key={index}
                  className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4 text-[15px] leading-relaxed text-white"
                >
                  {paragraph}
                </li>
              ))}
            </ol>
          </AdminCard>

          <AdminCard className="p-5 sm:p-6">
            <h2 className="m-0 mb-4 text-[17px] font-semibold">
              Stats ({record.stats.length})
            </h2>
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
              {record.stats.map((stat, index) => (
                <li
                  key={index}
                  className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="m-0 text-[13px] text-muted-soft">{stat.label}</p>
                  <p className="m-0 mt-1 text-[26px] leading-none font-extrabold tracking-[-0.02em] text-cyan">
                    {stat.value}
                  </p>
                </li>
              ))}
            </ul>
          </AdminCard>

          <AdminCard className="p-5 sm:p-6">
            <h2 className="m-0 mb-4 text-[17px] font-semibold">
              Core values ({record.core_values.length})
            </h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {record.core_values.map((value, index) => (
                <li
                  key={index}
                  className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="m-0 text-[15px] font-semibold">{value.title}</p>
                  <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-muted">
                    {value.description}
                  </p>
                </li>
              ))}
            </ul>
          </AdminCard>

          <AdminCard className="p-5 sm:p-6">
            <h2 className="m-0 mb-4 text-[17px] font-semibold">Location</h2>
            <dl className="m-0">
              <Row label="Location title" value={record.location_title} />
              <Row label="Location text" value={record.location_text} />
            </dl>
          </AdminCard>
        </div>
      ) : null}
    </div>
  );
}