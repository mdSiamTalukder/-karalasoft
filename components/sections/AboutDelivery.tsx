import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ABOUT_DELIVERY } from '@/lib/about-page';
import { siteConfig } from '@/lib/site';

/**
 * ------------------------------------------------------------------------------------
 * Global delivery
 * ------------------------------------------------------------------------------------
 * Location claims are held to exactly what the repository records:
 *   • "Based in Dhaka, Bangladesh" — the existing `aboutLocationTitle`
 *   • "New York · Dhaka · Remote"    — `siteConfig.locations`
 *
 * The previous description asserted "remote team members and clients across 12+ countries".
 * No location data exists anywhere in the CMS — the team endpoint has no location field — so
 * that count has been removed rather than softened or restated. Nothing here claims a
 * country count, an office, a client footprint or an international presence.
 */
export function AboutDelivery() {
  return (
    <Section labelledBy="about-delivery-heading">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
          <div>
            <Eyebrow>{ABOUT_DELIVERY.eyebrow}</Eyebrow>

            <h2
              id="about-delivery-heading"
              className="mt-4 mb-0 text-[clamp(30px,4.5vw,48px)] leading-[1.02] tracking-[-0.05em] text-balance"
            >
              {ABOUT_DELIVERY.title}
            </h2>

            <p className="mt-4 mb-0 max-w-[620px] text-[17px] leading-relaxed text-muted">
              {ABOUT_DELIVERY.description}
            </p>
          </div>

          <Reveal delay={0.08}>
            {/*
              Locations, read from `siteConfig.locations` so the page cannot drift from the
              value used elsewhere in the site.
            */}
            <dl className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-line bg-[var(--color-line)] sm:grid-cols-3">
              {siteConfig.locations.split(' · ').map((location) => (
                <div key={location} className="bg-[var(--t-panel)] px-5 py-6 text-center">
                  <dt className="sr-only">Location</dt>
                  <dd className="m-0 text-[17px] font-bold tracking-[-0.01em]">{location}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}