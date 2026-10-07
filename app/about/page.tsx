import type { Metadata } from 'next';

import { AboutHero } from '@/components/sections/AboutHero';
import { AboutStats } from '@/components/sections/AboutStats';
import { AboutWho } from '@/components/sections/AboutWho';
import { AboutWhy } from '@/components/sections/AboutWhy';
import { AboutStory } from '@/components/sections/AboutStory';
import { AboutCapabilities } from '@/components/sections/AboutCapabilities';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { AboutPrinciples } from '@/components/sections/AboutPrinciples';
import { AboutWork } from '@/components/sections/AboutWork';
import { TeamMembers } from '@/components/sections/TeamMembers';
import { AboutDelivery } from '@/components/sections/AboutDelivery';
import { CTA } from '@/components/sections/CTA';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { ABOUT_CTA, ABOUT_PROCESS } from '@/lib/about-page';
import { teamIntro } from '@/lib/about';

const DESCRIPTION =
  'KaralaSoft is a software and product engineering company based in Dhaka, Bangladesh. Founded in 2020, we design, build and maintain web applications, mobile apps, desktop software and enterprise platforms.';

export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | KaralaSoft',
    description: DESCRIPTION,
    url: '/about',
  },
};

/**
 * Page order follows the agreed structure:
 *
 *   Hero → Stats → Who We Are → Why KaralaSoft → Our Story → What We Build →
 *   How We Work → Our Principles → Selected Work → Team → Global Delivery → CTA
 *
 * Notes on sourcing:
 *   • `AboutStats` derives its figures from /api/projects and /api/team instead of the
 *     previous hard-coded "50+ projects / 12+ countries" claims, which had no basis in the
 *     project data.
 *   • `AboutStory` is a statement, not a timeline — the founding year is the only verified
 *     historical fact in the repository.
 *   • `AboutWork` reads the same CMS catalogue as `/projects`; no project detail is retyped.
 *   • `AboutDelivery` states only the locations in `siteConfig`.
 *   • `TeamMembers` is unchanged and still renders the live roster with its loading, error
 *     and missing-photo states.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <AboutStats />

      <AboutWho />

      <AboutWhy />

      <AboutStory />

      <AboutCapabilities />

      <ProcessSection
        eyebrow={ABOUT_PROCESS.eyebrow}
        title={ABOUT_PROCESS.title}
        description={ABOUT_PROCESS.description}
        steps={ABOUT_PROCESS.steps}
        alt={false}
        variant="flow"
      />

      <AboutPrinciples />

      <AboutWork />

      <Section alt labelledBy="about-team-heading">
        <Container>
          <SectionHead
            id="about-team-heading"
            eyebrow="The team"
            title={
              <>
                The people
                <br />
                behind the work.
              </>
            }
            description={teamIntro}
          />

          <TeamMembers />
        </Container>
      </Section>

      <AboutDelivery />

      <Section alt>
        <Container>
          <CTA
            eyebrow={ABOUT_CTA.eyebrow}
            title={ABOUT_CTA.title}
            description={ABOUT_CTA.description}
            action={ABOUT_CTA.action}
          />
        </Container>
      </Section>
    </>
  );
}