'use client';

import { Moon, Sun } from 'lucide-react';

import { toggleTheme } from '@/lib/theme';

/**
 * ------------------------------------------------------------------------------------
 * Theme toggle.
 * ------------------------------------------------------------------------------------
 * Shows a Moon in dark mode and a Sun in light mode. Which icon is visible is decided by
 * CSS from the `data-theme` attribute (see `.theme-icon` in globals.css), NOT by React
 * state — so the server-rendered markup always matches the hydrated tree and there is no
 * hydration mismatch or icon flash.
 *
 * The button is therefore stateless: it simply flips the attribute and persists it.
 * `aria-label` is static for the same reason, and `aria-pressed` is omitted because the
 * control is a two-state action rather than a toggle button with an on/off label.
 *
 * Identical markup in the desktop bar and the mobile panel — same size, shape, radius
 * and transitions as the surrounding controls.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch between dark and light theme"
      title="Switch theme"
      className={`relative inline-grid size-10 shrink-0 place-items-center overflow-hidden rounded-[14px] border border-line bg-veil/[0.035] text-on-surface transition-colors duration-300 hover:bg-veil/[0.07] ${className}`}
    >
      <span className="theme-icon theme-icon-moon" aria-hidden="true">
        <Moon className="size-[18px]" />
      </span>
      <span className="theme-icon theme-icon-sun" aria-hidden="true">
        <Sun className="size-[18px]" />
      </span>
    </button>
  );
}