'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Users,
  Wrench,
  X,
} from 'lucide-react';

import type { AdminUser } from '@/lib/admin-api';

/**
 * Navigation for the Admin Panel.
 *
 * Labels, order and destinations follow the KaralaSoft reference admin panel:
 * Dashboard → Projects → Products → Team → Services → Site Settings → About Content →
 * Messages.
 *
 * `live: false` marks a section with no readable data source, so the entry stays visible to
 * preserve the information architecture but renders inert instead of linking to a route
 * that does not exist.
 *
 * Site Settings and About Content are now live. Site Settings reads the real `siteConfig`
 * from `lib/site.ts` (the CMS publishes no `GET /api/settings` — that path responds 404).
 * About Content reads the published `GET /api/about` record. Both are read-only views; the
 * CMS exposes no write verb for them, so neither page offers edit or save controls.
 *
 * Messages reads the stored contact submissions through `GET /api/contact` (falling back to
 * `GET /api/contact/messages`) using the signed-in admin's own bearer token. Both routes
 * answer `401 {"detail":"Invalid or expired token"}` without it, which is an auth gate on a
 * route that exists — not the `404` that `/api/messages` and `/api/settings` return. Read
 * access only: the backend publishes no verified write verb for messages, so the inbox and
 * details view offer no mark-as-read, reply or delete control.
 */
const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, live: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban, live: true },
  { href: '/admin/products', label: 'Products', icon: Package, live: true },
  { href: '/admin/team', label: 'Team', icon: Users, live: true },
  { href: '/admin/services', label: 'Services', icon: Wrench, live: true },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings, live: true },
  { href: '/admin/about', label: 'About Content', icon: FileText, live: true },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, live: true },
] as const;

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

export function AdminSidebar({
  user,
  onLogout,
}: {
  user: AdminUser;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock background scroll while the drawer covers the viewport.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const nav = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-6 p-5">
      <Link href="/admin" className="block">
        <span className="grid w-full place-items-center rounded-[12px] p-1 [html[data-theme=dark]_&]:bg-[#fefefe] [html[data-theme=dark]_&]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
          <Image
            src="/images/karalasoftLogo2.png"
            alt="KaralaSoft logo"
            width={1600}
            height={533}
            sizes="223px"
            priority
            className="h-auto w-full object-contain"
          />
        </span>
      </Link>

      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {NAV_ITEMS.map((item) => {
          const active = item.live && isActive(pathname, item.href);
          const Icon = item.icon;
          const base =
            'flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left text-[15px] transition-colors duration-300';
          const tone = !item.live
            ? 'cursor-default text-muted-soft/70'
            : active
              ? 'bg-white/[0.07] text-white'
              : 'text-muted hover:bg-white/[0.05] hover:text-white';

          return (
            <li key={item.href}>
              {item.live ? (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`${base} ${tone}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {item.label}
                </Link>
              ) : (
                <span className={`${base} ${tone}`} aria-disabled="true">
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {item.label}
                  <span className="ml-auto text-[11px] text-muted-soft/70">
                    Unavailable
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto rounded-[16px] border border-white/10 bg-white/[0.03] p-4">
        <p className="m-0 truncate text-[14px] font-semibold">{user.name}</p>
        <p className="mt-0.5 truncate text-[12px] text-muted">{user.email}</p>
        <span className="mt-2 inline-block rounded-full border border-cyan/25 bg-cyan/[0.08] px-2.5 py-1 text-[11px] text-cyan">
          {user.role}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-[14px] transition-colors duration-300 hover:border-pink/30 hover:text-white"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Log out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 border-r border-white/10 bg-[rgba(5,9,19,0.55)] lg:block">
        {nav}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-[rgba(5,9,19,0.85)] px-4 py-3 backdrop-blur-[18px] lg:hidden">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="grid min-w-0 place-items-center rounded-[10px] p-1 [html[data-theme=dark]_&]:bg-[#fefefe] [html[data-theme=dark]_&]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
            <Image
              src="/images/karalasoftLogo2.png"
              alt="KaralaSoft logo"
              width={1600}
              height={533}
              sizes="(max-width: 640px) 136px, 168px"
              priority
              className="h-auto w-[136px] object-contain sm:w-[168px]"
            />
          </span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          aria-label={open ? 'Close admin menu' : 'Open admin menu'}
          className="grid size-10 place-items-center rounded-[12px] border border-white/10 bg-white/[0.035] text-white"
        >
          {open ? <X aria-hidden="true" className="size-4" /> : <Menu aria-hidden="true" className="size-4" />}
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="admin-mobile-nav"
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[rgba(2,5,12,0.75)] backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="h-full w-[280px] max-w-[85vw] border-r border-white/10 bg-[#070d18]"
              onClick={(event) => event.stopPropagation()}
            >
              {nav}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}