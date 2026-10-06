import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { techGroups, techStack } from '@/lib/content';

/**
 * Home — “Tech stack”, grouped for scanning.
 *
 * Presentation only: the technology list is unchanged. Each group *references* names that
 * already exist in `techStack`, and every reference is resolved against that list here, so
 * a typo can never surface a technology the site does not already claim. A technology
 * named in two groups keeps its first appearance.
 */
export function TechStack() {
  const known = new Set(techStack.map((tech) => tech.name));
  const seen = new Set<string>();

  const groups = techGroups
    .map((group) => ({
      label: group.label,
      items: group.items.filter((name) => {
        if (!known.has(name) || seen.has(name)) return false;
        seen.add(name);
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {groups.map((group, groupIndex) => (
            <Reveal key={group.label} delay={(groupIndex % 3) * 0.06}>
              <div className="h-full rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-5 transition-colors duration-300 hover:border-cyan/25 sm:p-6">
                <h3 className="mt-0 mb-4 text-[13px] font-bold tracking-[0.14em] text-paper-3 uppercase">
                  {group.label}
                </h3>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {group.items.map((name) => (
                    <li key={name}>
                      <span className="inline-block cursor-default rounded-xl border border-line bg-veil/[0.035] px-[13px] py-2.5 text-[14px] text-paper-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan/30 hover:text-on-surface">
                        {name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}