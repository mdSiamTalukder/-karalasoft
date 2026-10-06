import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { techGroups, techStack } from '@/lib/content';

/**
 * ------------------------------------------------------------------------------------
 * Technologies — `/services` only.
 * ------------------------------------------------------------------------------------
 * Presentation only: the technology names are exactly the ones already published in
 * `techStack`, simply arranged into the six groups declared in `techGroups`.
 *
 * Each reference is resolved against `techStack` at render time, so a typo can never put a
 * technology on this page that the rest of the site does not already claim, and a
 * technology listed twice appears once.
 */
function resolveGroups() {
  const known = new Set(techStack.map((tech) => tech.name));
  const seen = new Set<string>();

  return techGroups
    .map((group) => ({
      label: group.label,
      items: group.items.filter((name) => {
        if (!known.has(name) || seen.has(name)) return false;
        seen.add(name);
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

export function ServicesTech() {
  const groups = resolveGroups();

  return (
    <Section labelledBy="services-tech-heading">
      <Container>
        <SectionHead
          id="services-tech-heading"
          eyebrow="TECHNOLOGIES"
          title={
            <>
              The stack we
              <br />
              build on.
            </>
          }
          description="Chosen for maintainability and scale rather than novelty — the same list used across the rest of this site."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {groups.map((group, index) => (
            <Reveal key={group.label} delay={(index % 3) * 0.06} className="h-full">
              <div className="h-full rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-5 transition-colors duration-300 hover:border-cyan/25">
                <h3 className="m-0 mb-4 text-[13px] font-bold tracking-[0.14em] text-paper-3 uppercase">
                  {group.label}
                </h3>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {group.items.map((name) => (
                    <li key={name}>
                      <span className="inline-block cursor-default rounded-xl border border-line bg-veil/[0.035] px-[13px] py-2 text-[14px] text-paper-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan/30 hover:text-on-surface">
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