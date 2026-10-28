
export type AppItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Demo' | 'Published';
  href: string;
  shortDescription: string;
  features: string[];
  websiteUrl: string | null;
  playStoreUrl: string | null;
  apkDownloadUrl: string | null;
};

export const APPS: AppItem[] = [
  {
    id: 'flowdesk-demo',
    name: 'FlowDesk',
    category: 'Productivity',
    status: 'Demo',
    href: '/apps/flowdesk-demo',
    shortDescription:
      'A smarter workspace concept for organizing tasks, tracking progress, and keeping teams focused.',
    description:
      'FlowDesk is a demo concept for a modern productivity application. It demonstrates how tasks, workflows, and progress insights could come together in one organized workspace.',
    features: [
      'Task and workflow organization',
      'Progress tracking dashboard',
      'Clean and responsive workspace',
      'Designed for focused productivity',
    ],
    websiteUrl: null,
    playStoreUrl: null,
    apkDownloadUrl: null,
  },
  {
    id: 'shoppilot-demo',
    name: 'ShopPilot',
    category: 'E-commerce',
    status: 'Demo',
    href: '/apps/shoppilot-demo',
    shortDescription:
      'An e-commerce management concept for organizing products, orders, and store operations.',
    description:
      'ShopPilot is a demo concept that showcases a streamlined interface for managing an online store. The idea focuses on making everyday store operations easier to understand and manage.',
    features: [
      'Product catalog management concept',
      'Order overview interface',
      'Store performance insights concept',
      'Responsive management experience',
    ],
    websiteUrl: null,
    playStoreUrl: null,
    apkDownloadUrl: null,
  },
  {
    id: 'stayzuno-demo',
    name: 'StayZuno',
    category: 'Hospitality',
    status: 'Demo',
    href: '/apps/stayzuno-demo',
    shortDescription:
      'A hospitality platform concept designed to make discovering and managing stays feel effortless.',
    description:
      'StayZuno is presented here as a demo listing to preview the KaralaSoft Apps experience. Its description and feature list are sample content for layout testing, not a verified specification of a live product.',
    features: [
      'Stay discovery concept',
      'Accommodation information layout',
      'Guest-friendly browsing experience',
      'Responsive interface concept',
    ],
    websiteUrl: null,
    playStoreUrl: null,
    apkDownloadUrl: null,
  },
  {
    id: 'printstudio-demo',
    name: 'PrintStudio',
    category: 'Business Tools',
    status: 'Demo',
    href: '/apps/printstudio-demo',
    shortDescription:
      'A print business tool concept for presenting services, organizing requests, and simplifying workflows.',
    description:
      'PrintStudio is a sample application concept for exploring how a print-focused business tool could be presented on KaralaSoft. All information on this page is illustrative demo content.',
    features: [
      'Print service catalog concept',
      'Customer request organization',
      'Order workflow overview',
      'Business-focused responsive layout',
    ],
    websiteUrl: null,
    playStoreUrl: null,
    apkDownloadUrl: null,
  },
];
