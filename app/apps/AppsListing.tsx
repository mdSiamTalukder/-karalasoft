
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Download,
  Layers3,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';

import type { AppItem } from './apps-data';

type ApiApp = {
  id: string | number;
  slug: string;
  name: string;
  category: string | null;
  short_description: string | null;
  description: string | null;
  features: string[] | null;
  website_url: string | null;
  play_store_url: string | null;
  apk_download_url: string | null;
  status: 'Demo' | 'Published';
  is_published?: boolean;
  order_index?: number;
};

const CATEGORIES = ['All apps'];

function AppCard({ app }: { app: AppItem }) {
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-line glass p-5 transition-colors duration-200 hover:border-[#5377FF]/50 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#5377FF]/20 bg-[#5377FF]/10 text-[#829AFF]">
          <Layers3 size={21} strokeWidth={1.7} aria-hidden="true" />
        </div>

        <span className="text-xs font-medium text-muted">{app.status}</span>
      </div>

      <div className="mt-5 flex-1">
        <p className="mb-2 text-xs font-medium tracking-wide text-[#829AFF]">
          {app.category}
        </p>

        <h2 className="m-0 text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-[#829AFF]">
          {app.name}
        </h2>

        <p className="mt-3 mb-0 text-sm leading-6 text-muted">
          {app.shortDescription || app.description}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-line pt-4">
        {app.playStoreUrl ? (
          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#5377FF] px-2 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-[#4265E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5377FF]/50 sm:gap-2 sm:text-sm"
          >
            <Play size={15} aria-hidden="true" />
            <span>Google Play</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Google Play link is not available yet"
            className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-line px-2 py-2 text-center text-xs text-muted opacity-60 sm:gap-2 sm:text-sm"
          >
            <Play size={15} aria-hidden="true" />
            <span>Google Play</span>
          </button>
        )}

        {app.apkDownloadUrl ? (
          <a
            href={app.apkDownloadUrl}
            download
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#5377FF]/40 px-2 py-2 text-center text-xs font-medium text-[#829AFF] transition-colors hover:bg-[#5377FF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5377FF]/50 sm:gap-2 sm:text-sm"
          >
            <Download size={15} aria-hidden="true" />
            <span>Download APK</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="APK download is not available yet"
            className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-line px-2 py-2 text-center text-xs text-muted opacity-60 sm:gap-2 sm:text-sm"
          >
            <Download size={15} aria-hidden="true" />
            <span>Download APK</span>
          </button>
        )}
      </div>
    </article>
  );
}

export function AppsListing() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All apps');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApps() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch('/api/apps', {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Unable to load applications.');
        }

        const data: { apps?: ApiApp[] } = await response.json();

        if (!Array.isArray(data.apps)) {
          throw new Error('Invalid applications response.');
        }

        const mappedApps: AppItem[] = data.apps.map((app) => ({
          id: String(app.id),
          name: app.name,
          category: app.category || 'Other',
          status: app.status,
          href: `/apps/${app.slug}`,
          shortDescription: app.short_description || '',
          description: app.description || '',
          features: Array.isArray(app.features) ? app.features : [],
          websiteUrl: app.website_url,
          playStoreUrl: app.play_store_url,
          apkDownloadUrl: app.apk_download_url,
        }));

        if (!controller.signal.aborted) {
          setApps(mappedApps);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        if (!controller.signal.aborted) {
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadApps();

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [
      ...CATEGORIES,
      ...Array.from(new Set(apps.map((app) => app.category))),
    ],
    [apps],
  );

  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesCategory =
        selectedCategory === 'All apps' ||
        app.category === selectedCategory;

      const matchesSearch =
        query.length === 0 ||
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.shortDescription.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [apps, search, selectedCategory]);

  const hasFilters =
    search.trim().length > 0 || selectedCategory !== 'All apps';

  function resetFilters() {
    setSearch('');
    setSelectedCategory('All apps');
  }

  return (
    <Section alt>
      <Container>
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 max-w-[680px]">
            <Eyebrow className="mb-4">Our Applications</Eyebrow>

            <h2 className="m-0 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              Explore our apps.
            </h2>

            <p className="mt-4 mb-0 text-sm leading-7 text-muted sm:text-base">
              Discover applications built to simplify workflows, solve
              real-world problems, and help businesses move forward.
            </p>
          </div>

          <div className="mb-8 rounded-[22px] border border-line glass p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_240px]">
              <label className="relative block">
                <span className="sr-only">Search applications</span>

                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search applications..."
                  className="w-full rounded-xl border border-line bg-veil/[0.04] py-3.5 pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-[#5377FF]/70 focus:ring-2 focus:ring-[#5377FF]/15"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-veil/[0.08] hover:text-current"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </label>

              <label className="relative block">
                <span className="sr-only">Filter by category</span>

                <SlidersHorizontal
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-line bg-veil/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-[#5377FF]/70 focus:ring-2 focus:ring-[#5377FF]/15"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="m-0 text-sm text-muted" aria-live="polite">
                Showing{' '}
                <span className="font-semibold text-current">
                  {filteredApps.length}
                </span>{' '}
                {filteredApps.length === 1
                  ? 'application'
                  : 'applications'}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#829AFF] transition-colors hover:bg-[#5377FF]/10"
                >
                  <X size={15} aria-hidden="true" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[28px] border border-line glass px-6 py-14 text-center text-sm text-muted sm:py-20">
              Loading applications...
            </div>
          ) : hasError ? (
            <div
              className="rounded-[28px] border border-line glass px-6 py-14 text-center sm:px-10 sm:py-20"
              role="alert"
            >
              <Eyebrow className="mb-4">Unable to load apps</Eyebrow>
              <h3 className="m-0 text-2xl font-semibold sm:text-3xl">
                Something went wrong.
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Please refresh the page and try again.
              </p>
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-line glass px-6 py-14 text-center sm:px-10 sm:py-20">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-600 dark:text-cyan-300">
                {hasFilters ? (
                  <Search size={27} strokeWidth={1.6} aria-hidden="true" />
                ) : (
                  <Layers3 size={27} strokeWidth={1.6} aria-hidden="true" />
                )}
              </div>

              <Eyebrow className="mt-6 mb-4">
                {hasFilters ? 'No matching results' : 'Coming soon'}
              </Eyebrow>

              <h3 className="m-0 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
                {hasFilters
                  ? 'No apps found.'
                  : 'Our apps are on their way.'}
              </h3>

              <p className="mx-auto mt-4 mb-0 max-w-[460px] text-sm leading-7 text-muted sm:text-base">
                {hasFilters
                  ? 'Try another search term or category to find what you are looking for.'
                  : 'We are preparing our application collection. Check back soon to explore what we have built.'}
              </p>

              {hasFilters ? (
                <div className="mt-7 flex justify-center">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-medium transition-colors hover:bg-veil/[0.06]"
                  >
                    <X size={16} aria-hidden="true" />
                    Reset search and filters
                  </button>
                </div>
              ) : (
                <div className="mt-7 flex justify-center">
                  <ButtonLink href="/contact">
                    <Sparkles size={16} aria-hidden="true" />
                    Talk to our team
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </ButtonLink>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
