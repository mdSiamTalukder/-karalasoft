import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { techStack } from '@/lib/content';

/** Home — “Tech stack” chip wall with lift-on-hover. */
export function TechStack() {
  return (
    <Section labelledBy="tech-heading">
      <Container>
        <SectionHead
          id="tech-heading"
          eyebrow="TECH STACK"
          title={
            <>
              Modern tools.
              <br />
              Serious engineering.
            </>
          }
          description="Technology should serve the product — not become the product. Use the right stack for speed, maintainability and scale."
        />

        <Reveal>
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            {techStack.map((tech) => (
              <li key={tech.name}>
                <span className="inline-block cursor-default rounded-xl border border-line bg-white/[0.035] px-[15px] py-3 text-paper-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/30 hover:text-white">
                  {tech.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}