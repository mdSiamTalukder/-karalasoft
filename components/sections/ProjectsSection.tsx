import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { ProjectShowcase } from '@/components/sections/ProjectShowcase';
import { homeShowcase } from '@/lib/content';

/** Home — “Selected work” showcase. */
export function ProjectsSection() {
  return (
    <Section labelledBy="work-heading">
      <Container>
        <SectionHead
          id="work-heading"
          eyebrow="SELECTED WORK"
          title={
            <>
              Don’t just tell people.
              <br />
              Show them what you can build.
            </>
          }
          description="Large product visuals create curiosity immediately. Each case study should explain the problem, the build, the technology and the business outcome."
        />

        <ProjectShowcase showcase={homeShowcase} />
      </Container>
    </Section>
  );
}