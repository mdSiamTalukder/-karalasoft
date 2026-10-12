'use client';

import { useState } from 'react';
import Image from 'next/image';

import { initialsFromName } from '@/lib/team';

/**
 * ------------------------------------------------------------------------------------
 * Message sender avatar
 * ------------------------------------------------------------------------------------
 * Renders the sender's REAL photo only when the stored record actually contains one and the
 * URL resolves to a host already allowed by `images.remotePatterns`. The Project Brief form
 * collects no photo field, so in practice this is initials — which is rendered on the server
 * with no JavaScript involved.
 *
 * Initials are always painted as the base layer, so a broken or slow photo degrades to them
 * rather than showing an empty box. `photoUrl` is pre-validated by `safeAvatarUrl()` in
 * `lib/admin-messages.ts`, so `next/image` can never be handed an unconfigured host.
 */
export function MessageSenderAvatar({
  name,
  photoUrl,
  size = 84,
}: {
  /** Falls back to a neutral placeholder when the record has no sender name at all. */
  name: string | null;
  /** Absolute, allowlisted URL — or `null` when the record carries no usable photo. */
  photoUrl?: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  const initials = name ? initialsFromName(name) : '?';
  const showImage = Boolean(photoUrl) && !failed;

  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full border border-white/12 bg-[radial-gradient(circle_at_50%_30%,rgba(88,236,255,0.18),rgba(83,119,255,0.09)_45%,transparent_70%)] shadow-[0_10px_30px_-12px_rgba(88,236,255,0.35)]"
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden={showImage ? 'true' : undefined}
        className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,rgba(88,236,255,0.22),rgba(83,119,255,0.22),rgba(156,100,255,0.24))]"
      >
        <span
          className="bg-[linear-gradient(135deg,var(--t-grad-ink),var(--color-cyan)_60%,var(--color-violet))] bg-clip-text font-bold text-transparent"
          style={{ fontSize: Math.max(16, Math.round(size * 0.34)) }}
        >
          {initials}
        </span>
      </span>

      {showImage ? (
        <Image
          src={photoUrl as string}
          alt={name ?? 'Sender'}
          fill
          className="relative object-cover"
          sizes={`${size * 2}px`}
          quality={75}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}