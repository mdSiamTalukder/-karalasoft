import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { HomeWorkSection } from '@/components/sections/HomeWork';
import { ServicesStrengths } from '@/components/sections/ServicesStrengths';
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
      <HomeWorkSection />
      <ServicesStrengths />
      <ProcessSection variant="flow" />
      <TechStack />
      <Section>
        <Container>
          <HomeCTA />
        </Container>
      </Section>
    </>
  );
}