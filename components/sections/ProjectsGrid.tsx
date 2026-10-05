'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertCircle, ArrowUpRight, RefreshCw } from 'lucide-react';

import { fetchProjects } from '@/lib/projects';
import type { Project } from '@/lib/projects';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';

type Status = 'loading' | 'ready' | 'error' | 'empty';

/* --------------------------------------------------------------- image fallback */

/** Shown when a project has no image, or its image fails to load upstream. */
function ImageFallback({ title }: { title: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(88,236,255,0.18),rgba(83,119,255,0.09)_45%,transparent_72%)]"
    >
      <span className="bg-[linear-gradient(135deg,#ffffff,var(--color-cyan)_60%,var(--color-violet))] bg-clip-text px-6 text-center text-[28px] leading-tight font-extrabold tracking-tight text-transparent">
        {title}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- card */

/**
 * Project card.
 *
 * Composition follows the reference showcase: a 16:10 cover image with the project
 * information overlaid on a bottom-up gradient. Styling is entirely this project's own
 * dark glassmorphism system.
 *
 * The whole card is one link, but ONLY when the API supplied a real `live_link`.
 * Projects without one render as a plain card — we never invent a destination.
 */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(project.imageUrl) && !imageFailed;

  const inner = (
    <>
      {/* Cover */}
      <div className="relative aspect-16/10 w-full overflow-hidden">
        {showImage ? (
          <Image
            src={project.imageUrl as string}
            alt={`${project.title} — ${project.category || 'project'}`}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/proj:scale-[1.07]"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            quality={82}
            priority={index < 3}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImageFallback title={project.title} />
        )}

        {/* Bottom gradient — always faintly visible, deepens on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,9,19,0.96)_8%,rgba(5,9,19,0.82)_38%,rgba(5,9,19,0.25)_68%,transparent)] transition-opacity duration-500 group-hover/proj:from-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(83,119,255,0.28),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover/proj:opacity-100"
        />
      </div>

      {/* Overlaid information */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 sm:p-6">
        {project.category || project.year ? (
          <p className="m-0 mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
            {project.category ? <span className="truncate">{project.category}</span> : null}
            {project.category && project.year ? (
              <span aria-hidden="true" className="text-muted-soft">
                •
              </span>
            ) : null}
            {project.year ? <span className="shrink-0 text-paper-3">{project.year}</span> : null}
          </p>
        ) : null}

        <h3 className="m-0 flex items-center gap-2 text-[19px] leading-tight font-bold tracking-[-0.02em] text-balance sm:text-[21px]">
          <span>{project.title}</span>
          {project.liveUrl ? (
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 text-cyan opacity-0 transition-all duration-300 group-hover/proj:translate-x-0.5 group-hover/proj:-translate-y-0.5 group-hover/proj:opacity-100"
            />
          ) : null}
        </h3>

        {project.description ? (
          <p className="mt-2 mb-0 line-clamp-2 max-w-[46ch] text-[14px] leading-relaxed text-paper-2">
            {project.description}
          </p>
        ) : null}

        {project.tags.length > 0 ? (
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/10 bg-[#0d1b2b]/70 px-2.5 py-1 text-[11px] text-paper-5 backdrop-blur-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );

  const shell =
    'group/proj relative block h-full overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] backdrop-blur-[18px] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:border-cyan/35 hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)] focus-visible:-translate-y-2 focus-visible:border-cyan/35';

  return (
    <Reveal as="article" className="h-full" delay={(index % 3) * 0.08}>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — opens the live project in a new tab`}
          className={shell}
        >
          {inner}
        </a>
      ) : (
        <div className={shell}>{inner}</div>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------------ states */

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))]"
    >
      <div className="aspect-16/10 w-full bg-white/[0.04] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
      <div className="space-y-2.5 p-5 sm:p-6">
        <div className="h-3 w-1/3 rounded-full bg-white/[0.07]" />
        <div className="h-5 w-2/3 rounded-full bg-white/[0.07]" />
        <div className="h-3 w-full rounded-full bg-white/[0.05]" />
        <div className="h-3 w-4/5 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[26px] border border-pink/30 bg-pink/[0.06] px-6 py-8 sm:px-8">
      <span className="flex items-center gap-2.5 text-[15px] font-semibold text-pink">
        <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
        The project showcase couldn’t be loaded right now.
      </span>
      <p className="m-0 max-w-[60ch] text-[15px] text-muted">
        Please try again, or get in touch and we’ll walk you through the work.
      </p>
      <Button type="button" variant="ghost" onClick={onRetry}>
        <RefreshCw aria-hidden="true" className="size-4" />
        Try again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[26px] border border-line bg-white/[0.02] px-6 py-14 text-center">
      <p className="m-0 text-[15px] text-muted">
        New case studies are being added. Please check back shortly.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------ section */

/**
 * Project showcase grid — renders the real projects from the public CMS endpoint,
 * with explicit loading, error, empty and image-failure handling.
 */
export function ProjectsGrid() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ status: Status; projects: Project[] }>({
    status: 'loading',
    projects: [],
  });
  const { status, projects } = state;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetchProjects(controller.signal)
      .then((data) => {
        if (!active) return;
        setState({ status: data.length === 0 ? 'empty' : 'ready', projects: data });
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof DOMException && error.name === 'AbortError')) return;
        setState({ status: 'error', projects: [] });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading', projects: [] });
    setAttempt((n) => n + 1);
  }, []);

  return (
    <div aria-busy={status === 'loading'}>
      <p aria-live="polite" className="sr-only">
        {status === 'loading'
          ? 'Loading projects'
          : status === 'error'
            ? 'Projects could not be loaded'
            : status === 'empty'
              ? 'No projects listed'
              : `${projects.length} projects loaded`}
      </p>

      {status === 'loading' ? (
        <ul
          aria-hidden="true"
          className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      ) : null}

      {status === 'error' ? <ErrorState onRetry={retry} /> : null}
      {status === 'empty' ? <EmptyState /> : null}

      {status === 'ready' ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {projects.map((project, index) => (
            <li key={project.id || project.title} className="h-full">
              <ProjectCard project={project} index={index} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}