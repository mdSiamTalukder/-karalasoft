import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Card } from '@/components/ui/Card';
import { solutionAreas } from '@/lib/about';

/**
 * ------------------------------------------------------------------------------------
 * What we build
 * ------------------------------------------------------------------------------------
 * Reuses the existing `solutionAreas` from `lib/about.ts` verbatim — Web Applications,
 * Mobile Solutions, Desktop Software and Enterprise Platforms. Those four areas were
 * already documented on this page, so the section keeps the same information while giving
 * it a clearer heading and placement in the page flow.
 */
export function AboutCapabilities() {
  return (
    <Section alt labelledBy="about-capabilities-heading">
      <Container>
        <SectionHead
          id="about-capabilities-heading"
          eyebrow="What we build"
          title={
            <>
              Four areas,
              <br />
              one engineering team.
            </>
          }
          description="The kinds of products we are set up to design, engineer and maintain — each one delivered by the same team end to end."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
          {solutionAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <li key={area.title}>
                <Card delay={(index % 4) * 0.07}>
                  <span
                    role="img"
                    aria-label={area.title}
                    className="grid size-12 shrink-0 place-items-center rounded-[15px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]"
                  >
                    <Icon aria-hidden="true" className="size-5 text-cyan" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 mb-2 text-[19px]">{area.title}</h3>
                  <p className="m-0 text-[15px] text-muted">{area.description}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}