import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { SplitLines } from '@/components/ui/SplitLines';
import { fetchProjectsFromApi } from '@/lib/projects';
import type { Project } from '@/lib/projects';
import { ABOUT_WORK } from '@/lib/about-page';

/**
 * ------------------------------------------------------------------------------------
 * Selected work
 * ------------------------------------------------------------------------------------
 * Real projects only, read through the same `fetchProjectsFromApi()` layer that backs
 * `/projects` and the home page. Nothing about the projects — titles, descriptions,
 * categories, years, stacks, images or links — is written by hand here.
 *
 * Selection is by CMS id *and* verified against the expected title. If a project is renamed
 * or removed in the CMS the entry is skipped instead of rendering the wrong project under a
 * stale name. If none of the preferred entries survive, the section falls back to simply
 * leading the catalogue by CMS order.
 */

/** Verified against /api/projects: 1 = Garirhat, 2 = WingsBlast, 4 = Finance Management System. */
const PREFERRED: readonly { id: number; title: string }[] = [
  { id: 1, title: 'Garirhat' },
  { id: 2, title: 'WingsBlast' },
  { id: 4, title: 'Finance Management System' },
];

const FALLBACK_COUNT = 3;

function selectProjects(all: readonly Project[]): Project[] {
  const matched = PREFERRED.map((entry) => {
    const found = all.find((project) => project.id === entry.id);
    return found && found.title === entry.title ? found : undefined;
  }).filter((project): project is Project => project !== undefined);

  return matched.length > 0 ? matched : all.slice(0, FALLBACK_COUNT);
}

function ProjectTags({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0">
      {tags.slice(0, 4).map((tag) => (
        <li key={tag}>
          <span className="inline-block rounded-[9px] border border-line bg-veil/[0.035] px-2.5 py-1 text-[12px] text-paper-3">
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WorkCard({ project }: { project: Project }) {
  return (
    <article className="group/work relative flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] backdrop-blur-[18px] transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/30 hover:shadow-[0_28px_70px_var(--t-shadow-card)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[90px] -right-[90px] size-[180px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.14),transparent_70%)] transition-transform duration-300 ease-out group-hover/work:scale-140"
      />

      {project.imageUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-veil/[0.03]">
          <Image
            src={project.imageUrl}
            alt={`${project.title} — ${project.category}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover/work:scale-[1.05]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,var(--t-panel))]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Eyebrow className="mb-3">{project.category}</Eyebrow>

        <h3 className="mt-0 mb-2 text-[21px] leading-tight sm:text-[23px]">
          {/*
            The card links to the full showcase rather than to a project-specific route —
            /projects publishes no per-project URLs, so none are invented here.
          */}
          <Link
            href="/projects"
            className="rounded-[8px] transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            {project.title}
          </Link>
        </h3>

        {project.description ? (
          <p className="mt-0 mb-0 text-[15px] leading-[1.6] text-muted">{project.description}</p>
        ) : null}

        <ProjectTags tags={project.tags} />

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-on-surface transition-colors duration-300 group-hover/work:text-cyan">
              View project
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
            {project.year ? (
              <span className="text-[13px] text-muted-soft">{project.year}</span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function ViewAllLink() {
  return (
    <Link
      href="/projects"
      className="inline-flex items-center gap-2.5 rounded-[14px] border border-cyan/20 bg-veil/[0.035] px-5 py-3.5 text-[16px] text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-veil/[0.07]"
    >
      View all projects
      <ArrowUpRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

/** Presentation only — takes already-fetched projects. */
function AboutWorkGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
        {projects.map((project, index) => (
          <Reveal as="li" key={project.id} delay={(index % 3) * 0.07} className="h-full">
            <WorkCard project={project} />
          </Reveal>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <ViewAllLink />
      </div>
    </>
  );
}

/**
 * SERVER wrapper — reads the CMS and selects the verified projects. The fetch never runs on
 * the client.
 */
export async function AboutWork() {
  let projects: Project[] = [];

  try {
    projects = selectProjects(await fetchProjectsFromApi());
  } catch (error) {
    console.error('[about] selected work fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
  }

  return (
    <Section labelledBy="about-work-heading">
      <Container>
        <SectionHead
          id="about-work-heading"
          eyebrow={ABOUT_WORK.eyebrow}
          title={<SplitLines text={ABOUT_WORK.title} />}
          description={ABOUT_WORK.description}
        />

        {projects.length > 0 ? (
          <AboutWorkGrid projects={projects} />
        ) : (
          // Never render an empty shell — the catalogue is always one click away.
          <div className="rounded-[26px] border border-line bg-veil/[0.02] px-6 py-10 text-center">
            <p className="mx-auto mb-6 max-w-[52ch] text-[17px] text-muted">
              The project catalogue is briefly unavailable. Every published case study is
              still a click away.
            </p>
            <ViewAllLink />
          </div>
        )}
      </Container>
    </Section>
  );
}