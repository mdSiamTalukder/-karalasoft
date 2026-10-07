import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { SplitLines } from '@/components/ui/SplitLines';
import { ABOUT_STORY } from '@/lib/about-page';
import { siteConfig } from '@/lib/site';

/**
 * ------------------------------------------------------------------------------------
 * Our story
 * ------------------------------------------------------------------------------------
 * Intentionally NOT a timeline.
 *
 * The only verified historical fact in this repository is the founding year (2020, from
 * `siteConfig.foundedYear`). There is no recorded milestone history, so inventing dated
 * events would have meant fabricating the company's past. This stays a short, honest
 * statement instead, and the founding year is read from config rather than retyped.
 */
export function AboutStory() {
  return (
    <Section labelledBy="about-story-heading">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <SectionHead
              id="about-story-heading"
              eyebrow={ABOUT_STORY.eyebrow}
              title={<SplitLines text={ABOUT_STORY.title} />}
            />
          </div>

          <div className="flex flex-col gap-5">
            {ABOUT_STORY.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 0.07}>
                <p className="m-0 text-[17px] leading-relaxed text-muted">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={0.16}>
              {/*
                Founding detail, sourced from config. The year is not duplicated here — it
                is the same `siteConfig.foundedYear` the stats row uses.
              */}
              <dl className="m-0 mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-line bg-[var(--color-line)] sm:grid-cols-2">
                <div className="bg-[var(--t-panel)] px-5 py-5">
                  <dt className="m-0 text-[12px] tracking-[0.14em] text-muted-soft uppercase">
                    Founded
                  </dt>
                  <dd className="mt-1.5 mb-0 text-[24px] leading-none font-bold tracking-[-0.03em] tabular-nums">
                    {siteConfig.foundedYear}
                  </dd>
                </div>
                <div className="bg-[var(--t-panel)] px-5 py-5">
                  <dt className="m-0 text-[12px] tracking-[0.14em] text-muted-soft uppercase">
                    Based in
                  </dt>
                  <dd className="mt-1.5 mb-0 text-[24px] leading-none font-bold tracking-[-0.03em]">
                    Dhaka
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}