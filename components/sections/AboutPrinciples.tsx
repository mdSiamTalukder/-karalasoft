import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { SplitLines } from '@/components/ui/SplitLines';
import { Card } from '@/components/ui/Card';
import { ABOUT_PRINCIPLES } from '@/lib/about-page';

/**
 * ------------------------------------------------------------------------------------
 * Our principles
 * ------------------------------------------------------------------------------------
 * Reframes the previous six "core values" (Excellence First, Move Fast, True Partnership,
 * Client Obsessed, Security First, Innovation Driven) into engineering and product
 * principles.
 *
 * The structure is preserved — same six-item grid, same `Card` treatment, same section
 * pattern — so the page keeps its rhythm. The wording is what changed: each entry now
 * describes a working practice instead of an aspiration, and none of them asserts a
 * statistic, client count or outcome.
 */
export function AboutPrinciples() {
  return (
    <Section labelledBy="about-principles-heading">
      <Container>
        <SectionHead
          id="about-principles-heading"
          eyebrow={ABOUT_PRINCIPLES.eyebrow}
          title={<SplitLines text={ABOUT_PRINCIPLES.title} />}
          description="These are the practices we hold ourselves to on every engagement, whether the scope is a single feature or a full platform."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {ABOUT_PRINCIPLES.values.map((value, index) => {
            const Icon = value.icon;
            return (
              <li key={value.title}>
                <Card delay={(index % 3) * 0.08}>
                  <span
                    role="img"
                    aria-label={value.title}
                    className="grid size-12 shrink-0 place-items-center rounded-[15px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]"
                  >
                    <Icon aria-hidden="true" className="size-5 text-cyan" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 mb-2 text-[22px]">{value.title}</h3>
                  <p className="m-0 text-muted">{value.description}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}