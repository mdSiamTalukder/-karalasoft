import type { Metadata } from 'next';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCollectionView } from '@/components/admin/AdminCollectionView';
import { fetchProductsFromApi } from '@/lib/products';

export const metadata: Metadata = { title: 'Products' };
export const dynamic = 'force-dynamic';

/**
 * Read-only view of the published product catalogue, backed by the same CMS endpoint the
 * public `/products` page uses. This admin build has no verified product write endpoint,
 * so no edit/delete actions are offered — see `AdminCollectionView`.
 */
export default async function AdminProductsPage() {
  let items: { id: number; name: string; tagline: string; liveUrl: string | null }[] = [];
  let error: string | null = null;

  try {
    items = await fetchProductsFromApi();
  } catch {
    error = 'Products could not be loaded from the CMS right now. Please refresh to try again.';
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Published product records, read live from the content management system."
      />

      <AdminCollectionView
        items={items.map((product) => ({
          id: product.id,
          title: product.name,
          description: product.tagline,
          href: product.liveUrl,
        }))}
        error={error}
        emptyTitle="No products published"
        emptyDescription="Products added in the CMS will appear here."
      />
    </div>
  );
}
