import type { Metadata } from 'next';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCollectionView } from '@/components/admin/AdminCollectionView';
import { fetchServicesFromApi } from '@/lib/services';

export const metadata: Metadata = { title: 'Services' };
export const dynamic = 'force-dynamic';

/**
 * Read-only view of the published service catalogue, backed by the same CMS endpoint the
 * public `/services` page uses. No service write endpoint is verified for this build.
 */
export default async function AdminServicesPage() {
  let items: { id: number; title: string; description: string; features: readonly string[] }[] = [];
  let error: string | null = null;

  try {
    items = await fetchServicesFromApi();
  } catch {
    error = 'Services could not be loaded from the CMS right now. Please refresh to try again.';
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Published service records, read live from the content management system."
      />

      <AdminCollectionView
        items={items.map((service) => ({
          id: service.id,
          title: service.title,
          description: service.description,
          meta: service.features.length > 0 ? `${service.features.length} features` : null,
        }))}
        error={error}
        emptyTitle="No services published"
        emptyDescription="Services added in the CMS will appear here."
      />
    </div>
  );
}
