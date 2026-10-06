import type { Metadata } from 'next';

import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageHeader } from '@/components/admin/PageHeader';

export const metadata: Metadata = { title: 'New project' };

export default function AdminProjectCreatePage() {
  return (
    <div>
      <PageHeader
        title="New project"
        description="Add a case study to the public portfolio. It appears as soon as you save."
      />
      <ProjectForm mode="create" />
    </div>
  );
}