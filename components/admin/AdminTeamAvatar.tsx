'use client';

import { useState } from 'react';
import Image from 'next/image';

import { initialsFromName, resolveTeamImageUrl } from '@/lib/team';

/**
 * ------------------------------------------------------------------------------------
 * Admin team avatar
 * ------------------------------------------------------------------------------------
 * Renders a member's REAL profile photo from the team CMS endpoint, or their initials when
 * no photo exists.
 *
 * Image source is exactly the `image_url` value returned by `GET /api/team`, passed through
 * the existing `resolveTeamImageUrl()` helper — the same helper the public `/about` page
 * uses. Nothing is invented or substituted: if the API has no `image_url`, or the URL fails
 * to load, the initials fallback is shown instead. No broken-image icon, no empty box.
 *
 * The hostname is already permitted by `images.remotePatterns` in `next.config.ts`
 * (`karalasoft.com/team/**`), which is where `/team/*` assets are actually served — the
 * admin API host 404s on that path.
 */
export function AdminTeamAvatar({
  name,
  imageUrl,
  size = 40,
}: {
  name: string;
  /** `image_url` exactly as returned by the team API (may be null or empty). */
  imageUrl?: string | null;
  /** Rendered px square; the avatar is always circular. */
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  // Idempotent for the already-absolute URLs the server normaliser produces, and still
  // resolves a relative path if a raw record is ever passed straight through.
  const src = resolveTeamImageUrl(imageUrl);
  const showImage = Boolean(src) && !failed;

  const initials = initialsFromName(name);

  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full border border-white/12 bg-[radial-gradient(circle_at_50%_30%,rgba(88,236,255,0.16),rgba(83,119,255,0.08)_45%,transparent_70%)]"
      style={{ width: size, height: size }}
    >
      {/*
        Initials are always rendered as the base layer, beneath the photo.

        The photo itself never depends on JavaScript: it is painted as soon as it decodes,
        with no `onLoad` gate. So a visitor with scripts blocked or still streaming always
        sees the real photograph.

        The initials underneath cover the case where there is no `image_url` at all (pure
        server render, no JS involved), and `onError` drops the <img> entirely if a URL
        turns out to be broken — leaving the initials as the only thing painted.
      */}
      <span
        aria-hidden={showImage ? 'true' : undefined}
        className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,rgba(88,236,255,0.20),rgba(83,119,255,0.20),rgba(156,100,255,0.22))]"
      >
        <span
          className="bg-[linear-gradient(135deg,var(--t-grad-ink),var(--color-cyan)_60%,var(--color-violet))] bg-clip-text font-bold text-transparent"
          style={{ fontSize: Math.max(11, Math.round(size * 0.36)) }}
        >
          {initials}
        </span>
      </span>

      {showImage ? (
        <Image
          src={src as string}
          alt={name}
          fill
          className="relative object-cover"
          // Avatars render at `size` CSS px; 2x keeps them crisp on retina without
          // pulling a large asset for a 40px element.
          sizes={`${size * 2}px`}
          quality={75}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}
