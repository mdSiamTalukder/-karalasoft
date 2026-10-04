import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  name: 'KaralaSoft',
  mark: 'K',
  title: 'KaralaSoft — Build What’s Next',
  description:
    'KaralaSoft designs and engineers custom software, digital products, web, mobile and AI-enabled platforms.',
  tagline: 'Build What’s Next',
  url: 'https://karalasoft.com',
  email: 'contact@karalasoft.com',
  phone: '+1 (718) 737-3202',
  phoneHref: '+17187373202',
  locations: 'New York · Dhaka · Remote',
  foundedYear: 2020,
  copyright: '© KaralaSoft — premium interactive website concept.',
  nav: [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'products', label: 'Products', href: '/products' },
    { key: 'projects', label: 'Projects', href: '/projects' },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ],
};

/** Nav links rendered in the desktop bar and the mobile menu (Home excluded). */
export const primaryNav = siteConfig.nav.filter((item) => item.key !== 'home');

export const COMPANY_EMAIL = siteConfig.email;
export const COMPANY_PHONE = siteConfig.phone;
export const COMPANY_PHONE_HREF = siteConfig.phoneHref;
export const COMPANY_LOCATIONS = siteConfig.locations;