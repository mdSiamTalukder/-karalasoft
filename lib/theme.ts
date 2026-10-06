/**
 * ------------------------------------------------------------------------------------
 * Theme — two themes, one design system.
 * ------------------------------------------------------------------------------------
 * The whole site is driven by the `data-theme` attribute on <html> plus the CSS
 * variables declared in `app/globals.css`. This module is only the thin JavaScript
 * bridge: read the stored preference, apply it, and persist changes.
 *
 * IMPORTANT: this file is imported by client components only. `localStorage` and
 * `window` are never touched during server rendering.
 * ------------------------------------------------------------------------------------
 */

export const THEME_STORAGE_KEY = 'karala-theme';

export type Theme = 'dark' | 'light';

export const DEFAULT_THEME: Theme = 'dark';

/** Attribute on <html>; kept as a constant so the script and CSS cannot drift. */
export const THEME_ATTRIBUTE = 'data-theme';

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

/** The theme currently applied to the document. Safe to call only in the browser. */
export function getAppliedTheme(): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(value) ? value : DEFAULT_THEME;
}

/**
 * Apply a theme to <html> and persist it.
 * Returns the theme that was applied.
 */
export function applyTheme(theme: Theme): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME;

  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);

  // Keep the browser chrome (address bar) in step with the page.
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'light' ? '#f6f8fc' : '#050913');
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / storage disabled — the theme still applies for this page view.
  }

  return theme;
}

/** Toggle between the two themes and persist the result. */
export function toggleTheme(): Theme {
  return applyTheme(getAppliedTheme() === 'dark' ? 'light' : 'dark');
}