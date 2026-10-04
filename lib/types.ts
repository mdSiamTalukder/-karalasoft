import type { LucideIcon } from 'lucide-react';

/** Primary navigation route. */
export type RouteKey = 'home' | 'services' | 'products' | 'projects' | 'about' | 'contact';

export interface NavItem {
  readonly key: RouteKey;
  readonly label: string;
  readonly href: `/${string}`;
}

export interface TagItem {
  readonly label: string;
}

/**
 * A service / capability card.
 * `glyph` keeps the original decorative character used in index-2.html so the
 * visual design is preserved verbatim; `icon` is the accessible equivalent.
 */
export interface ServiceCard {
  readonly glyph: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly TagItem[];
  readonly tilt?: boolean;
}

export interface ProductCard {
  readonly glyph: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export interface ProcessStep {
  readonly index: string;
  readonly phase: string;
  readonly title: string;
  readonly description: string;
}

export interface TechItem {
  readonly name: string;
}

export interface ProjectCard {
  readonly eyebrow?: string;
  readonly title: string;
  readonly meta: string;
  readonly size: 'large' | 'small';
}

export interface ShowcaseGrid {
  readonly feature: ProjectCard;
  readonly stack: readonly ProjectCard[];
}

export interface Metric {
  readonly value: string;
  readonly label: string;
}

export interface MarqueeItem {
  readonly label: string;
}

export interface ValueCard {
  readonly glyph: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export interface ContactChannel {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly href?: string;
}

export interface FooterLinkGroup {
  readonly heading: string;
  readonly links: readonly NavItem[];
}

export interface SiteConfig {
  readonly name: string;
  readonly mark: string;
  readonly title: string;
  readonly description: string;
  readonly tagline: string;
  readonly url: string;
  readonly email: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly locations: string;
  readonly foundedYear: number;
  readonly copyright: string;
  readonly nav: readonly NavItem[];
}

export type ContactStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactValues {
  name: string;
  email: string;
  company: string;
  need: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export interface SubmitResult {
  readonly ok: boolean;
  /** True when no endpoint is wired up yet, so the UI can label it as a preview. */
  readonly preview: boolean;
  readonly message?: string;
}