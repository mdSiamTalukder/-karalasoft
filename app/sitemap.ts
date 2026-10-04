import type { MetadataRoute } from 'next';

import { primaryNav, siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteConfig.url, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...primaryNav
      .filter((item) => item.key !== 'home')
      .map((item) => ({
        url: `${siteConfig.url}${item.href}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
  ];
}