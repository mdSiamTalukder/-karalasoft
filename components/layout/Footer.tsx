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
            <span
              aria-hidden="true"
              className="grid size-[42px] place-items-center rounded-[13px] bg-[conic-gradient(from_180deg,var(--color-cyan),var(--color-blue),var(--color-violet),var(--color-pink),var(--color-cyan))] text-on-accent font-[950] shadow-[0_0_35px_rgba(88,236,255,0.20)]"
            >
              {siteConfig.mark}
            </span>
            <span className="text-[20px] font-[850] tracking-[-0.03em]">{siteConfig.name}</span>
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