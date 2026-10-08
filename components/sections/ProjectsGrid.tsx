'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpRight,
  ImageOff,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import { fetchProjects } from '@/lib/projects';
import type { Project } from '@/lib/projects';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FeaturedProject } from '@/components/sections/FeaturedProject';
import { ProjectCapabilities } from '@/components/sections/ProjectCapabilities';
import { ProjectsArchiveHeading } from '@/components/sections/ProjectsArchiveHeading';

type Status = 'loading' | 'ready' | 'error' | 'empty';

/** Sentinel for "no category filter applied" — never collides with a real category. */
const ALL_CATEGORIES = '__all__';

/** Technology pills shown on a card; the rest collapse into "+N". */
const TAG_LIMIT = 4;

/* --------------------------------------------------------------- image fallback */

/**
 * Shown when a project has no image, or its image fails to load upstream.
 * Deliberately text-free — the title is already overlaid at the bottom of the card,
 * so repeating it here would collide with itself.
 */
function ImageFallback() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(88,236,255,0.20),rgba(83,119,255,0.10)_45%,transparent_72%)]"
    >
      <ImageOff className="size-8 text-cyan/45" strokeWidth={1.5} />
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
function ProjectCard({
  project,
  index,
  ordinal,
}: {
  project: Project;
  index: number;
  /** Editorial number in the full CMS order, e.g. "03". */
  ordinal: string;
}) {
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
            /*
              No `priority` here on purpose.

              This archive sits well below the fold, and its first card is the same project
              the featured case study above already renders — but at a different quality
              (`82` here vs `86` there). Preloading from the grid made the browser fetch a
              `q=82` variant that the page never actually painted, because the visible
              image is the featured `q=86` one. Chrome then reported the preload as
              "not used within a few seconds".

              `FeaturedProject` keeps `priority`, since it is the above-the-fold / LCP
              image. Leaving the grid unpreloaded also matches how every other grid on
              the site loads.
            */
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImageFallback />
        )}

        {/* Bottom gradient — always faintly visible, deepens on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,9,19,0.98)_0%,rgba(5,9,19,0.93)_26%,rgba(5,9,19,0.62)_52%,rgba(5,9,19,0.12)_78%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(83,119,255,0.28),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover/proj:opacity-100"
        />
      </div>

      {/* Overlaid information */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 [text-shadow:0_1px_12px_rgba(5,9,19,0.9)] sm:p-6">
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
            {project.tags.slice(0, TAG_LIMIT).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line bg-[#0d1b2b]/70 px-2.5 py-1 text-[11px] text-paper-5 backdrop-blur-sm"
              >
                {tag}
              </li>
            ))}
            {project.tags.length > TAG_LIMIT ? (
              <li className="rounded-full border border-line bg-[#0d1b2b]/70 px-2.5 py-1 text-[11px] text-muted-soft backdrop-blur-sm">
                +{project.tags.length - TAG_LIMIT}
              </li>
            ) : null}
          </ul>
        ) : null}

        {/* Editorial number — derived from the project's own position in the CMS order. */}
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-[11px] border border-white/10 bg-[#0d1b2b]/70 text-[12px] font-semibold tracking-[0.06em] text-paper-5 tabular-nums backdrop-blur-sm"
        >
          {ordinal}
        </span>
      </div>
    </>
  );

  const shell =
    'group/proj relative block h-full overflow-hidden rounded-[26px] glass transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:border-cyan/35 hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)] focus-visible:-translate-y-2 focus-visible:border-cyan/35';

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
      className="overflow-hidden rounded-[26px] glass"
    >
      <div className="aspect-16/10 w-full bg-veil/[0.04] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
      <div className="space-y-2.5 p-5 sm:p-6">
        <div className="h-3 w-1/3 rounded-full bg-veil/[0.07]" />
        <div className="h-5 w-2/3 rounded-full bg-veil/[0.07]" />
        <div className="h-3 w-full rounded-full bg-veil/[0.05]" />
        <div className="h-3 w-4/5 rounded-full bg-veil/[0.05]" />
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

/** Shown when the API itself has no projects yet — distinct from "filters matched none". */
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[26px] border border-line bg-veil/[0.02] px-6 py-14 text-center">
      <p className="m-0 text-[15px] text-muted">
        New case studies are being added. Please check back shortly.
      </p>
    </div>
  );
}

/** Shown when projects exist but the current search/category matches none of them. */
function NoMatchesState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[26px] glass px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-[15px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]"
      >
        <Search className="size-5 text-cyan" strokeWidth={2} />
      </span>
      <div>
        <p className="m-0 text-[19px] font-bold">No projects found</p>
        <p className="mt-1.5 mb-0 text-[15px] text-muted">
          Try a different search term or category.
        </p>
      </div>
      <Button type="button" variant="ghost" onClick={onClear}>
        <X aria-hidden="true" className="size-4" />
        Clear filters
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------- controls */

/**
 * Search + category controls.
 *
 * Categories are derived from the fetched projects only — nothing is hardcoded, so the
 * control set always reflects real CMS data.
 */
function Controls({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
  totalCount,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  categories: readonly string[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}) {
  const searchId = 'projects-search';

  return (
    <div className="mb-6 lg:mb-7">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <label htmlFor={searchId} className="sr-only">
            Search projects by name, category, description or technology
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search projects..."
            autoComplete="off"
            className="w-full rounded-[14px] border border-line bg-surface py-3.5 pr-11 pl-11 text-on-surface outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-soft/70 focus:border-cyan/40 focus:shadow-[0_0_0_4px_rgba(88,236,255,0.06)] [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors duration-200 hover:bg-veil/10 hover:text-on-surface"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        {/* Result count */}
        <p className="m-0 shrink-0 text-[13px] text-muted sm:pl-1">
          <span className="bg-[linear-gradient(90deg,var(--t-grad-ink),var(--color-cyan))] bg-clip-text text-[15px] font-bold text-transparent">
            {resultCount}
          </span>{' '}
          {resultCount === 1 ? 'Project' : 'Projects'}
          {resultCount !== totalCount ? <span className="text-muted-soft"> of {totalCount}</span> : null}
        </p>
      </div>

      {/* Categories — horizontally scrollable so the page never overflows */}
      <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span
          aria-hidden="true"
          className="mr-0.5 hidden shrink-0 items-center gap-1.5 text-[12px] tracking-[0.12em] text-muted-soft uppercase sm:flex"
        >
          <SlidersHorizontal className="size-3.5" />
          Filter
        </span>

        <button
          type="button"
          onClick={() => onCategoryChange(ALL_CATEGORIES)}
          aria-pressed={activeCategory === ALL_CATEGORIES}
          className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] whitespace-nowrap transition-all duration-300 ${
            activeCategory === ALL_CATEGORIES
              ? 'border-cyan/40 bg-[linear-gradient(135deg,rgba(88,236,255,0.20),rgba(83,119,255,0.22),rgba(156,100,255,0.24))] text-on-surface shadow-[0_10px_30px_rgba(83,119,255,0.20)]'
              : 'border-line bg-veil/[0.035] text-muted hover:border-cyan/25 hover:text-on-surface'
          }`}
        >
          All Projects
        </button>

        {categories.map((category) => {
          const active = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-pressed={active}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] whitespace-nowrap transition-all duration-300 ${
                active
                  ? 'border-cyan/40 bg-[linear-gradient(135deg,rgba(88,236,255,0.20),rgba(83,119,255,0.22),rgba(156,100,255,0.24))] text-on-surface shadow-[0_10px_30px_rgba(83,119,255,0.20)]'
                  : 'border-line bg-veil/[0.035] text-muted hover:border-cyan/25 hover:text-on-surface'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ section */

/**
 * Project showcase grid — renders the real projects from the public CMS endpoint,
 * with explicit loading, error, empty and image-failure handling, plus client-side
 * search and category filtering over the already-fetched data.
 */
export function ProjectsGrid({ initialProjects }: { initialProjects?: Project[] }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ status: Status; projects: Project[] }>(() =>
    initialProjects
      ? { status: initialProjects.length === 0 ? 'empty' : 'ready', projects: initialProjects }
      : { status: 'loading', projects: [] },
  );
  const { status, projects } = state;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);

  /**
   * Only fetch from the browser when the server did not already supply the data.
   *
   * `initialProjects` is a fresh server fetch on every page load, so it is never stale by
   * the time this effect first runs — and re-fetching would only replace identical content.
   * If the server fetch failed, `initialProjects` is `undefined` and this effect takes over
   * exactly as it did before, preserving the loading, error and retry states.
   */
  useEffect(() => {
    if (initialProjects) return;

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
  }, [attempt, initialProjects]);

  const retry = useCallback(() => {
    setState({ status: 'loading', projects: [] });
    setAttempt((n) => n + 1);
  }, []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setActiveCategory(ALL_CATEGORIES);
  }, []);

  /**
   * Distinct technologies across the whole portfolio.
   *
   * Compared case-insensitively because the CMS stores some entries as "Node.js" and
   * others as "NODE.JS" — without this the headline would double-count the same stack.
   */
  const technologyCount = useMemo(() => {
    const seen = new Set<string>();
    for (const project of projects) {
      for (const tag of project.tags) seen.add(tag.trim().toLowerCase());
    }
    return seen.size;
  }, [projects]);

  /**
   * Editorial number for a card, taken from the project's position in the *full* CMS
   * order rather than its position in the filtered result, so the numbering stays stable
   * while the visitor searches or filters.
   */
  const ordinalOf = useCallback(
    (project: Project) => {
      const index = projects.findIndex(
        (candidate) => candidate.id === project.id && candidate.title === project.title,
      );
      return String(index >= 0 ? index + 1 : 1).padStart(2, '0');
    },
    [projects],
  );

  /** Unique categories taken from the fetched data only, in first-seen order. */
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const project of projects) {
      if (project.category) seen.add(project.category);
    }
    return [...seen];
  }, [projects]);

  /** Case-insensitive match across title, category, description and tags. */
  const visibleProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (activeCategory !== ALL_CATEGORIES && project.category !== activeCategory) return false;
      if (!needle) return true;
      const haystack = [project.title, project.category, project.description, ...project.tags]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [projects, query, activeCategory]);

  // Keep the category selection valid if the data ever changes underneath us.
  const effectiveCategory =
    activeCategory === ALL_CATEGORIES || categories.includes(activeCategory)
      ? activeCategory
      : ALL_CATEGORIES;

  return (
    <div aria-busy={status === 'loading'}>
      <p aria-live="polite" className="sr-only">
        {status === 'loading'
          ? 'Loading projects'
          : status === 'error'
            ? 'Projects could not be loaded'
            : status === 'empty'
              ? 'No projects listed'
              : `${visibleProjects.length} of ${projects.length} projects shown`}
      </p>

      {/*
        Loading, error and empty all keep the page's vertical rhythm and width. They share
        one wrapper because they are mutually exclusive with the `ready` branch below.
      */}
      {status !== 'ready' ? (
        <div className="pt-[72px] pb-[72px] sm:pt-20 sm:pb-20 lg:pt-[95px] lg:pb-[95px]">
          <Container>
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
          </Container>
        </div>
      ) : null}

      {status === 'ready' ? (
        <>
          {/* ------------------------------------------- featured case study */}
          <div className="pt-[72px] pb-[72px] sm:pt-20 sm:pb-20 lg:pt-[95px] lg:pb-[95px]">
            <Container>
              <Reveal>
                <ul
                  aria-label="Portfolio at a glance"
                  className="m-0 flex list-none flex-wrap items-center gap-x-7 gap-y-3 border-b border-line pb-6 p-0"
                >
                  <li className="text-[14px] text-muted">
                    <span className="bg-[linear-gradient(90deg,var(--t-grad-ink),var(--color-cyan))] bg-clip-text text-[22px] leading-none font-bold text-transparent">
                      {String(projects.length).padStart(2, '0')}
                    </span>{' '}
                    {projects.length === 1 ? 'project' : 'projects'} published
                  </li>
                  <li className="text-[14px] text-muted">
                    <span className="bg-[linear-gradient(90deg,var(--t-grad-ink),var(--color-cyan))] bg-clip-text text-[22px] leading-none font-bold text-transparent">
                      {String(categories.length).padStart(2, '0')}
                    </span>{' '}
                    {categories.length === 1 ? 'category' : 'categories'} covered
                  </li>
                  <li className="text-[14px] text-muted">
                    <span className="bg-[linear-gradient(90deg,var(--t-grad-ink),var(--color-cyan))] bg-clip-text text-[22px] leading-none font-bold text-transparent">
                      {String(technologyCount).padStart(2, '0')}
                    </span>{' '}
                    {technologyCount === 1 ? 'technology' : 'technologies'} in use
                  </li>
                </ul>
              </Reveal>

              <div className="mt-8 sm:mt-10">
                <Reveal delay={0.06} direction="none">
                  <FeaturedProject project={projects[0]!} />
                </Reveal>
              </div>
            </Container>
          </div>

          {/* --------------------------------------------------- filterable archive */}
          <ProjectsArchiveHeading total={projects.length} />

          <Container>
            <div className="mt-7 sm:mt-9">
              <Controls
                query={query}
                onQueryChange={setQuery}
                categories={categories}
                activeCategory={effectiveCategory}
                onCategoryChange={setActiveCategory}
                resultCount={visibleProjects.length}
                totalCount={projects.length}
              />

              {visibleProjects.length === 0 ? (
                <NoMatchesState onClear={clearFilters} />
              ) : (
                <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visibleProjects.map((project, index) => (
                      <motion.li
                        key={project.id || project.title}
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                        className="h-full"
                      >
                        <ProjectCard
                          project={project}
                          index={index}
                          ordinal={ordinalOf(project)}
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </Container>

          {/* -------------------------------------------------- capability themes */}
          <div className="mt-[72px] sm:mt-20 lg:mt-[95px]">
            <Container>
              <ProjectCapabilities projects={projects} />
            </Container>
          </div>
        </>
      ) : null}
    </div>
  );
}