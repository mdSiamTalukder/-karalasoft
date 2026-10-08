import type { Metadata, Viewport } from 'next';

import './globals.css';

import { siteConfig } from '@/lib/site';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicChrome } from '@/components/layout/PublicChrome';
import { ThemeScript } from '@/components/layout/ThemeScript';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'software development',
    'MVP development',
    'web development',
    'mobile apps',
    'API development',
    'AI product engineering',
    'IT staff augmentation',
    'custom software',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@karalasoft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#050913' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * `data-theme` is what the whole design system keys off. It is hard-coded to "dark"
     * here so the server markup is deterministic; `ThemeScript` upgrades it from
     * localStorage before first paint. `suppressHydrationWarning` is required because the
     * script mutates this attribute before React hydrates.
     *
     * `data-scroll-behavior="smooth"` is the attribute Next.js checks before suppressing
     * smooth scrolling during a route transition. This site deliberately sets
     * `html { scroll-behavior: smooth }` in globals.css and honours
     * `prefers-reduced-motion` by switching it back to `auto`, so the attribute records
     * that the behaviour is intentional — without it Next logs a console warning on every
     * client-side navigation. The smooth-scroll behaviour itself is unchanged.
     */
    <html
      lang="en"
      className="scroll-smooth"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Runs before paint — prevents a flash of the wrong theme on refresh. */}
        <ThemeScript />

        {/* Returns the viewport to the top on route changes. Renders nothing. */}
        <ScrollToTop />

        <a href="#main" className="sr-only-focusable">
          Skip to content
        </a>

        {/*
          Public marketing chrome is suppressed under /admin so the panel stands alone.
          `children` is threaded *through* PublicChrome (not rendered beside it) so the
          page content always sits between the navbar and the footer.
        */}
        <PublicChrome
          header={
            <>
              <ScrollProgress />
              <Navbar />
            </>
          }
          footer={<Footer />}
        >
          {/* `pageIn` recreates the route-change fade used by the original SPA shell. */}
          <main id="main" className="[animation:pageIn_0.4s_ease]">
            {children}
          </main>
        </PublicChrome>
      </body>
    </html>
  );
}