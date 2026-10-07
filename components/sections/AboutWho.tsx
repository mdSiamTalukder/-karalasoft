import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { SplitLines } from '@/components/ui/SplitLines';
import { ABOUT_WHO } from '@/lib/about-page';

/**
 * ------------------------------------------------------------------------------------
 * Who we are
 * ------------------------------------------------------------------------------------
 * A positioning statement plus the four areas the company already documents. Each entry
 * restates a capability the site already makes elsewhere (services, projects, the previous
 * solution areas) rather than introducing a new claim.
 */
export function AboutWho() {
  return (
    <Section labelledBy="about-who-heading">
      <Container>
        <SectionHead
          id="about-who-heading"
          eyebrow={ABOUT_WHO.eyebrow}
          title={<SplitLines text={ABOUT_WHO.title} />}
          description={ABOUT_WHO.description}
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
          {ABOUT_WHO.points.map((point, index) => (
            <Reveal as="li" key={point.title} delay={(index % 4) * 0.07} className="h-full">
              <div className="group/point relative flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-6 backdrop-blur-[18px] transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan/30">
                {/* Same corner-light language as the shared `Card`, kept restrained. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[70px] -right-[70px] size-[150px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.13),transparent_70%)] transition-transform duration-300 ease-out group-hover/point:scale-140"
                />

                <span className="relative text-[12px] font-extrabold tracking-[0.14em] text-cyan uppercase">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="relative mt-3.5 mb-2 text-[19px] leading-snug">{point.title}</h3>
                <p className="relative m-0 text-[15px] leading-relaxed text-muted">
                  {point.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}