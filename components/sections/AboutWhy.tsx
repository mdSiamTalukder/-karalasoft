import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { SplitLines } from '@/components/ui/SplitLines';
import { ABOUT_WHY } from '@/lib/about-page';

/**
 * ------------------------------------------------------------------------------------
 * Why KaralaSoft
 * ------------------------------------------------------------------------------------
 * Four working principles. Each describes *how* the team operates — no delivery counts, no
 * client names, no performance or outcome claims, because none of those are recorded in
 * the project data.
 */
export function AboutWhy() {
  return (
    <Section alt labelledBy="about-why-heading">
      <Container>
        <SectionHead
          id="about-why-heading"
          eyebrow={ABOUT_WHY.eyebrow}
          title={<SplitLines text={ABOUT_WHY.title} />}
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2 lg:gap-[18px]">
          {ABOUT_WHY.principles.map((principle, index) => (
            <Reveal as="li" key={principle.title} delay={(index % 2) * 0.08} className="h-full">
              <div className="group/why flex h-full gap-5 rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-6 backdrop-blur-[18px] transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/30 sm:p-7">
                <span className="grid size-12 shrink-0 place-items-center rounded-[15px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]">
                  <principle.icon
                    aria-hidden="true"
                    className="size-5 text-cyan"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <h3 className="mt-0 mb-2 text-[21px] leading-snug">{principle.title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-muted">
                    {principle.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}