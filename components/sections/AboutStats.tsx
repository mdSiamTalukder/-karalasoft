import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { siteConfig } from '@/lib/site';
import { fetchProjectsFromApi } from '@/lib/projects';
import { fetchTeamMembersFromApi } from '@/lib/team';

/**
 * ------------------------------------------------------------------------------------
 * Company stats
 * ------------------------------------------------------------------------------------
 * Replaces the previous hand-written `aboutStats`, which claimed "50+ Projects delivered"
 * and "12+ Countries served".
 *
 *   • "50+ Projects delivered" directly contradicted the published CMS catalogue, which
 *     contains 10 projects. It has been removed rather than restated.
 *   • "12+ Countries served" had no source anywhere in the repository — the team endpoint
 *     carries no location data at all. It has been removed rather than guessed at.
 *
 * Everything shown here is either read from `siteConfig` or derived at build time from the
 * live CMS responses, so the figures cannot drift away from the real data:
 *
 *   • Founded / years in business → siteConfig.foundedYear (2020)
 *   • People on the team         → /api/team
 *   • Projects published         → /api/projects
 *
 * If a CMS endpoint is unavailable the corresponding cell shows an em dash rather than a
 * fallback number — an honest "unknown" instead of an invented figure.
 */

export interface AboutStatsSectionProps {
  projectCount: number | null;
  teamCount: number | null;
}

function formatCount(value: number | null): string {
  if (value === null) return '—';
  return value < 10 ? String(value).padStart(2, '0') : String(value);
}

function AboutStatsGrid({ projectCount, teamCount }: AboutStatsSectionProps) {
  const founded = siteConfig.foundedYear;
  const yearsInBusiness = Math.max(0, new Date().getFullYear() - founded);

  const stats = [
    { value: String(founded), label: 'Founded', detail: 'Dhaka, Bangladesh' },
    {
      value: String(yearsInBusiness),
      label: 'Years in business',
      detail: 'Software engineering',
    },
    {
      value: formatCount(teamCount),
      label: teamCount === 1 ? 'Person on the team' : 'People on the team',
      detail: 'Engineering, design and operations',
    },
    {
      value: formatCount(projectCount),
      label: projectCount === 1 ? 'Project published' : 'Projects published',
      detail: 'Full catalogue on this site',
    },
  ];

  return (
    <Container>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal
            as="li"
            key={stat.label}
            delay={(index % 4) * 0.07}
            className="rounded-[22px] glass px-4 py-6 text-center backdrop-blur-[18px] sm:px-6 sm:py-7"
          >
            <strong className="block bg-[linear-gradient(90deg,var(--t-grad-ink),var(--color-cyan)_45%,var(--color-violet))] bg-clip-text text-[34px] leading-none tracking-[-0.04em] text-transparent sm:text-[42px]">
              {stat.value}
            </strong>
            <span className="mt-2 block text-[13px] text-muted">{stat.label}</span>
            <span className="mt-1 block text-[12px] text-muted-soft">{stat.detail}</span>
          </Reveal>
        ))}
      </ul>
    </Container>
  );
}

/**
 * SERVER wrapper — derives the two counts from the same endpoints the rest of the site
 * already reads. Both helpers are cached for an hour, so this costs no extra upstream load.
 */
export async function AboutStats() {
  const [projects, team] = await Promise.all([
    fetchProjectsFromApi().then((all) => all.length).catch(() => null),
    fetchTeamMembersFromApi().then((all) => all.length).catch(() => null),
  ]);

  return <AboutStatsGrid projectCount={projects} teamCount={team} />;
}