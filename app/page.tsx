import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { TechStack } from '@/components/sections/TechStack';
import { HomeCTA } from '@/components/sections/CTA';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <TechStack />
      <Section>
        <Container>
          <HomeCTA />
        </Container>
      </Section>
    </>
  );
}