import type { Metadata, Viewport } from 'next';

import './globals.css';

import { siteConfig } from '@/lib/site';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { CursorGlow } from '@/components/motion/CursorGlow';

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
  themeColor: '#050913',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <a href="#main" className="sr-only-focusable">
          Skip to content
        </a>

        <ScrollProgress />
        <CursorGlow />
        <Navbar />

        {/* `pageIn` recreates the route-change fade used by the original SPA shell. */}
        <main id="main" className="[animation:pageIn_0.4s_ease]">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}