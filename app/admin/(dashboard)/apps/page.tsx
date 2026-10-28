
import type { Metadata } from 'next';

import { PageHeader } from '@/components/admin/PageHeader';
import AdminAppsManager from '@/components/admin/apps/AdminAppsManager';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Apps' };
export const dynamic = 'force-dynamic';

type AppRow = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  features: string[] | null;
  website_url: string | null;
  play_store_url: string | null;
  apk_download_url: string | null;
  status: 'Demo' | 'Published';
  is_published: boolean;
  order_index: number;
};

export default async function AdminAppsPage() {
  let apps: AppRow[] = [];
  let error: string | null = null;

  try {
    const result = await db.query<AppRow>(
      `SELECT
        id,
        slug,
        name,
        category,
        short_description,
        description,
        features,
        website_url,
        play_store_url,
        apk_download_url,
        status,
        is_published,
        order_index
      FROM apps
      ORDER BY order_index ASC, created_at DESC`,
    );

    apps = result.rows;
  } catch (err) {
    console.error('Admin Apps page failed to load:', err);
    error = 'Apps could not be loaded. Please refresh to try again.';
  }

  const formattedApps = apps.map((app) => ({
    ...app,
    id: String(app.id),
    features: app.features ?? [],
  }));

  return (
    <div>
      <PageHeader
        title="Apps"
        description="Manage the app catalogue stored in the KaralaSoft database."
      />

      {error ? (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : (
        <AdminAppsManager apps={formattedApps} />
      )}
    </div>
  );
}
