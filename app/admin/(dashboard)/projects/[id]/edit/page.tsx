import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAdminSession } from '@/lib/admin-session';
import { toTagList } from '@/lib/admin-api';
import { ProjectForm } from '@/components/admin/ProjectForm';
import type { ProjectFormValues } from '@/components/admin/ProjectForm';
import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCard } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit project #${id}` };
}

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);
  if (!Number.isFinite(projectId)) notFound();

  const session = await getAdminSession();
  if (!session) return null;

  // Import the data loader here rather than at module scope so this stays a server action.
  const { loadProjectForEdit } = await import('@/app/admin/actions');
  const project = await loadProjectForEdit(projectId);

  if (!project) {
    return (
      <div>
        <PageHeader title="Project not found" backHref="/admin/projects" backLabel="All projects" />
        <AdminCard className="p-8">
          <p className="m-0 text-[15px] text-muted">
            This project could not be loaded. It may have been deleted, or your session may have
            expired.
          </p>
        </AdminCard>
      </div>
    );
  }

  const values: ProjectFormValues = {
    id: project.id,
    title: project.title,
    category: project.category ?? '',
    description: project.description ?? '',
    image_url: project.image_url ?? '',
    live_link: project.live_link ?? '',
    year: project.year ?? '',
    order_index: project.order_index ?? 0,
    tags: toTagList(project.tags).join(', '),
  };

  return (
    <div>
      <PageHeader
        title="Edit project"
        description="Saved changes publish to the website immediately."
        backHref="/admin/projects"
        backLabel="All projects"
      />
      <ProjectForm mode="edit" project={values} />
    </div>
  );
}