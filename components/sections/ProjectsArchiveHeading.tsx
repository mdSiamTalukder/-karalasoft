import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';

/**
 * ------------------------------------------------------------------------------------
 * Archive heading
 * ------------------------------------------------------------------------------------
 * Intro for the filterable archive that follows. The count beside the heading is passed in
 * by `ProjectsGrid`, which owns the data — this component never fetches anything, so there
 * is exactly one client fetch for the page.
 */
export function ProjectsArchiveHeading({ total }: { total: number }) {
  return (
    <div id="projects-archive" className="scroll-mt-[96px]">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="m-0 mb-2.5 text-[11px] tracking-[0.16em] text-cyan uppercase">
                The archive
              </p>
              <h2
                id="projects-archive-heading"
                className="m-0 text-[clamp(26px,3.4vw,38px)] leading-[1.06] tracking-[-0.045em] text-balance"
              >
                Every build we’ve published
              </h2>
            </div>

            {total > 0 ? (
              <p className="m-0 shrink-0 text-[14px] text-muted">
                <span className="bg-[linear-gradient(90deg,var(--t-grad-ink),var(--color-cyan))] bg-clip-text text-[22px] font-bold text-transparent">
                  {String(total).padStart(2, '0')}
                </span>{' '}
                {total === 1 ? 'project' : 'projects'}
              </p>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </div>
  );
}