import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A showcase of solutions delivered by KaralaSoft across marketplaces, gaming, AI, finance, commerce, hospitality and enterprise systems.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects | KaralaSoft',
    description:
      'A showcase of solutions delivered by KaralaSoft across marketplaces, gaming, AI, finance, commerce, hospitality and enterprise systems.',
    url: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        headingId="projects-page-heading"
        title="Case studies should make clients think,"
        highlight="“I want that team.”"
        lead="Large product imagery, before/after context, stack, timeline and measurable impact make the work much more convincing than a simple logo grid."
      />

      <Section labelledBy="projects-page-grid">
        <Container>
          <h2 id="projects-page-grid" className="sr-only">
            Selected projects
          </h2>

          <ProjectsGrid />

          <p className="mt-3.5 mb-0 text-[13px] text-muted">
            Projects marked with an arrow include a public link to the live build.
          </p>
        </Container>
      </Section>
    </>
  );
}