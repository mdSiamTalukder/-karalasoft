import type { Metadata } from 'next';

import { ProjectsHero } from '@/components/sections/ProjectsHero';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';
import { ProjectCta } from '@/components/sections/ProjectCta';
import { fetchProjectsFromApi } from '@/lib/projects';

const DESCRIPTION =
  'Real products designed, built and shipped by KaralaSoft — marketplaces, operational platforms, commerce, backend systems and applied AI.';

export const metadata: Metadata = {
  title: 'Projects',
  description: DESCRIPTION,
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects | KaralaSoft',
    description: DESCRIPTION,
    url: '/projects',
  },
};

/**
 * The portfolio is read on the server so the case studies are present in the initial HTML
 * and in the static output. `fetchProjectsFromApi()` already caches for an hour, which is
 * what turns this route into ISR.
 */
export const revalidate = 3600;

/**
 * `/projects` is assembled entirely from projects-specific components.
 *
 * `ProjectsGrid` stays the single owner of the data and of the loading, error, empty and
 * image-fallback states. It receives the server result as `initialProjects`; when that is
 * unavailable it falls back to the original browser fetch through the same-origin
 * `/api/projects` proxy, so no existing behaviour is lost.
 */
export default async function ProjectsPage() {
  const projects = await fetchProjectsFromApi().catch(() => undefined);

  return (
    <>
      <ProjectsHero />

      <ProjectsGrid initialProjects={projects} />

      <ProjectCta />
    </>
  );
}