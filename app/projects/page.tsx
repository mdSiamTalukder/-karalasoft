import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ProjectShowcase } from '@/components/sections/ProjectShowcase';
import { projectsShowcase } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Case studies that show the problem, the product, the engineering and the measurable result of work delivered by KaralaSoft.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects | KaralaSoft',
    description:
      'Case studies that show the problem, the product, the engineering and the measurable result of work delivered by KaralaSoft.',
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
            Selected case studies
          </h2>

          <ProjectShowcase showcase={projectsShowcase} />

          <p className="mt-3.5 mb-0 text-[13px] text-muted">
            These are presentation templates rather than claims about specific client projects.
            Replace them with approved KaralaSoft work and screenshots.
          </p>
        </Container>
      </Section>
    </>
  );
}