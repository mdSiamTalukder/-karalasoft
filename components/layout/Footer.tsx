import Image from 'next/image';
import Link from 'next/link';

import { COMPANY_EMAIL, COMPANY_LOCATIONS, COMPANY_PHONE, siteConfig } from '@/lib/site';

const linkGroups = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Software Development', href: '/services' },
      { label: 'MVP Development', href: '/services' },
      { label: 'Web & Mobile', href: '/services' },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line pt-[60px] pb-[30px]">
      <div className="container-x grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,0.7fr)] lg:gap-[30px]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-[13px] transition-opacity hover:opacity-85"
            aria-label={`${siteConfig.name} — home`}
          >
            {/* Same lockup, identical sizing and identical theme treatment as the Navbar. */}
            <span className="grid shrink-0 place-items-center rounded-[10px] py-[3px] [html[data-theme=dark]_&]:bg-[#fefefe] [html[data-theme=dark]_&]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
              <Image
                src="/images/karalasoftLogo2.png"
                alt={`${siteConfig.name} logo`}
                width={1600}
                height={533}
                sizes="(max-width: 639px) 120px, 150px"
                className="h-[34px] w-[120px] object-contain sm:h-[42px] sm:w-[150px]"
              />
            </span>
          </Link>
          <p className="mt-3 mb-0 block max-w-[38ch] text-muted">
            Full-service product engineering for web, mobile, software and AI-enabled experiences.
          </p>
        </div>

        {linkGroups.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h4 className="m-0 mb-[14px] text-[16px]">{group.heading}</h4>
            <ul className="m-0 list-none p-0">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="my-2 block text-muted transition-colors duration-300 hover:text-on-surface"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h4 className="m-0 mb-[14px] text-[16px]">Contact</h4>
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="my-2 block text-muted transition-colors duration-300 hover:text-on-surface"
          >
            {COMPANY_EMAIL}
          </a>
          <a
            href={`tel:${siteConfig.phoneHref}`}
            className="my-2 block text-muted transition-colors duration-300 hover:text-on-surface"
          >
            {COMPANY_PHONE}
          </a>
          <p className="my-2 block text-muted">{COMPANY_LOCATIONS}</p>
        </div>
      </div>

      <div className="container-x pt-7 text-[13px] text-muted-soft">
        <p className="m-0">{siteConfig.copyright}</p>
      </div>
    </footer>
  );
}