
export type AppItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Demo' | 'Published';
  href: string;
  shortDescription: string;
  features: string[];
  logo_url: string | null;
  websiteUrl: string | null;
  playStoreUrl: string | null;
  apkDownloadUrl: string | null;
};

export const APPS: AppItem[] = [];
