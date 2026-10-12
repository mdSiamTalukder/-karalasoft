import type { Metadata } from 'next';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCard } from '@/components/admin/ui';
import { siteConfig, primaryNav } from '@/lib/site';

export const metadata: Metadata = { title: 'Site Settings' };
export const dynamic = 'force-dynamic';

/**
 * Site Settings — read-only view of the site's configuration.
 *
 * **Where this data comes from.** There is no settings API on the CMS: `GET /api/settings`
 * responds `404`. The public site's settings live in `siteConfig` (`lib/site.ts`), which is
 * the single source `Navbar`, `Footer`, the contact page and the metadata all read from.
 * This page imports that exact object, so it shows the real, live configuration rather than
 * a copy — and it cannot drift from what the site actually renders.
 *
 * **Why it is read-only.** Changing these values means editing `lib/site.ts` and deploying.
 * There is no backend write endpoint, so no edit/save control is offered here; adding one
 * would imply a capability the project does not have.
 */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 py-3 first:border-t-0 first:pt-0">
      <dt className="m-0 text-[13px] tracking-[0.08em] text-muted-soft uppercase">{label}</dt>
      <dd className="m-0 mt-1 text-[15px] break-words text-white">{value}</dd>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Read-only view of the site configuration defined in lib/site.ts."
      />

      <div className="flex flex-col gap-5">
        <AdminCard className="p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-[17px] font-semibold">Identity</h2>
          <dl className="m-0">
            <Row label="Name" value={siteConfig.name} />
            <Row label="Title" value={siteConfig.title} />
            <Row label="Tagline" value={siteConfig.tagline} />
            <Row label="Description" value={siteConfig.description} />
            <Row label="Founded" value={String(siteConfig.foundedYear)} />
          </dl>
        </AdminCard>

        <AdminCard className="p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-[17px] font-semibold">Contact</h2>
          <dl className="m-0">
            <Row label="Email" value={siteConfig.email} />
            <Row label="Phone" value={siteConfig.phone} />
            <Row label="Locations" value={siteConfig.locations} />
            <Row label="Site URL" value={siteConfig.url} />
          </dl>
        </AdminCard>

        <AdminCard className="p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-[17px] font-semibold">
            Navigation ({primaryNav.length})
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {primaryNav.map((item) => (
              <li
                key={item.key}
                className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="m-0 text-[15px] font-semibold">{item.label}</p>
                <p className="m-0 mt-1 text-[13px] break-words text-muted-soft">{item.href}</p>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard className="p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-[17px] font-semibold">Footer</h2>
          <dl className="m-0">
            <Row label="Copyright" value={siteConfig.copyright} />
          </dl>
        </AdminCard>
      </div>
    </div>
  );
}