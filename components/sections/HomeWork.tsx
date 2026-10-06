import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { fetchProjectsFromApi } from '@/lib/projects';
import type { Project } from '@/lib/projects';

/**
 * Home — “Selected work”.
 *
 * Replaces the previous placeholder showcase, which used invented entries
 * ("CASE STUDY TEMPLATE" / "Enterprise Operations Platform"). These are real projects from
 * the same CMS that backs `/projects`, read through the existing
 * `fetchProjectsFromApi()` layer — no duplicated or hard-coded project data.
 *
 * Selection is by CMS id and happens *after* the fetch, so an id that no longer exists is
 * skipped rather than rendering an empty tile.
 */
const FEATURED_PROJECT_IDS: readonly number[] = [1, 2, 3];

/** Real tag chips — the project's own `tags`, never invented. */
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
      {/* Corner glow, matching the language used by the shared `Card`. */}
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
          {/* Fade into the panel below so text stays readable over any image. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,var(--t-panel))]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Eyebrow className="mb-3">{project.category}</Eyebrow>

        <h3 className="mt-0 mb-2 text-[21px] leading-tight sm:text-[23px]">
          {/* The card's single link target — the real showcase. */}
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

        {/* `mt-auto` pushes the footer to the card's baseline; the inner `pt-5` guarantees a
            minimum gap when the card is short. Two elements so the two margins never
            collide. */}
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

function WorkGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
      {projects.map((project, index) => (
        <Reveal as="li" key={project.id} delay={(index % 3) * 0.07} className="h-full">
          <WorkCard project={project} />
        </Reveal>
      ))}
    </ul>
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

/**
 * Presentation only — takes already-fetched projects.
 */
export function HomeWork({ projects }: { projects: readonly Project[] }) {
  return (
    <Section labelledBy="home-work-heading">
      <Container>
        <SectionHead
          id="home-work-heading"
          eyebrow="SELECTED WORK"
          title={
            <>
              Don’t just tell people.
              <br />
              Show them what you can build.
            </>
          }
          description="A few of the platforms we have designed and shipped — the same catalogue behind every case study."
        />

        <WorkGrid projects={projects} />

        <div className="mt-8 flex justify-center">
          <ViewAllLink />
        </div>
      </Container>
    </Section>
  );
}

/**
 * SERVER wrapper — reads the CMS and picks the featured ids. Kept separate from the
 * presentation so the fetch never runs on the client.
 */
export async function HomeWorkSection() {
  let projects: Project[] = [];
  try {
    const all = await fetchProjectsFromApi();
    projects = FEATURED_PROJECT_IDS.map((id) => all.find((p) => p.id === id)).filter(
      (p): p is Project => p !== undefined,
    );
  } catch (error) {
    console.error('[home] selected work fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
  }

  // Never render an empty shell — fall back to a link to the full showcase.
  if (projects.length === 0) {
    return (
      <Section labelledBy="home-work-heading">
        <Container>
          <div className="rounded-[26px] border border-line bg-veil/[0.02] px-6 py-10 text-center">
            <h2 id="home-work-heading" className="mt-0 mb-3 text-[26px] tracking-[-0.04em]">
              Selected work
            </h2>
            <p className="mx-auto mb-6 max-w-[52ch] text-[17px] text-muted">
              The project showcase is briefly unavailable. Every case study is still a click away.
            </p>
            <ViewAllLink />
          </div>
        </Container>
      </Section>
    );
  }

  return <HomeWork projects={projects} />;
}