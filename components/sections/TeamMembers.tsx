'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertCircle, RefreshCw, Users } from 'lucide-react';

import { fetchTeamMembers, initialsFromName } from '@/lib/team';
import type { TeamMember } from '@/lib/team';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';

type Status = 'loading' | 'ready' | 'error' | 'empty';

/* ------------------------------------------------------------------ fallback */

/** Initials avatar used when a member has no photo (7 of 12 currently) or it 404s.
 *  Kept deliberately dark and glassy so it sits quietly beside real photography. */
function InitialsAvatar({
  name,
  className = '',
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center bg-[radial-gradient(circle_at_50%_28%,rgba(88,236,255,0.20),rgba(83,119,255,0.10)_45%,transparent_72%)] ${className}`}
    >
      <span className="bg-[linear-gradient(135deg,var(--t-grad-ink),var(--color-cyan)_60%,var(--color-violet))] bg-clip-text text-[clamp(40px,7vw,60px)] leading-none font-extrabold tracking-tight text-transparent">
        {initialsFromName(name)}
      </span>
    </span>
  );
}

/* --------------------------------------------------------------------- card */

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(member.imageUrl) && !imageFailed;

  return (
    <Reveal as="article" className="h-full" delay={(index % 4) * 0.07}>
      <div className="group/member relative flex h-full flex-col overflow-hidden rounded-[26px] glass transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan/30 hover:shadow-[0_28px_70px_rgba(0,0,0,0.25)]">
        {/* Photo area — fixed ratio so mixed source crops stay consistent */}
        <div className="relative aspect-4/5 w-full overflow-hidden bg-[radial-gradient(circle_at_50%_30%,rgba(88,236,255,0.14),rgba(83,119,255,0.08)_45%,transparent_70%)]">
          {showPhoto ? (
            <Image
              src={member.imageUrl as string}
              alt={`${member.name}, ${member.position || 'team member'}`}
              fill
              // Faces sit in the upper third of these portraits.
              className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/member:scale-[1.06]"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
              quality={82}
              priority={index < 4}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <InitialsAvatar
              name={member.name}
              className="absolute inset-0 text-[clamp(48px,9vw,72px)]"
            />
          )}

          {/* Bottom fade into the card body */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(5,9,19,0.85),transparent)]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5 pt-4">
          <h3 className="m-0 text-[17px] leading-snug font-bold tracking-[-0.01em]">
            {member.name}
          </h3>
          {member.position ? (
            <p className="mt-1 mb-0 text-[13px] text-muted">{member.position}</p>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------- states */

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-[26px] glass"
    >
      <div className="aspect-4/5 w-full bg-veil/[0.04] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
      <div className="space-y-2.5 p-5 pt-4">
        <div className="h-4 w-2/3 rounded-full bg-veil/[0.07]" />
        <div className="h-3 w-1/2 rounded-full bg-veil/[0.05]" />
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <ul
      aria-hidden="true"
      className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px] xl:grid-cols-4"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[26px] border border-pink/30 bg-pink/[0.06] px-6 py-8 sm:px-8">
      <span className="flex items-center gap-2.5 text-[15px] font-semibold text-pink">
        <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
        The team roster couldn’t be loaded right now.
      </span>
      <p className="m-0 max-w-[60ch] text-[15px] text-muted">
        Please try again, or reach us directly and we’ll point you to the right person.
      </p>
      <Button type="button" variant="ghost" onClick={onRetry}>
        <RefreshCw aria-hidden="true" className="size-4" />
        Try again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[26px] border border-line bg-veil/[0.02] px-6 py-14 text-center">
      <Users aria-hidden="true" className="size-6 text-muted" />
      <p className="m-0 text-[15px] text-muted">
        Our team profiles are being updated. Please check back shortly.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ section */

/**
 * Team Members section.
 *
 * Renders real roster data from the public CMS endpoint, with explicit loading,
 * error, empty and missing-photo handling. Four columns on wide screens, stepping
 * down to three, two and one.
 */
export function TeamMembers() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ status: Status; members: TeamMember[] }>({
    status: 'loading',
    members: [],
  });
  const { status, members } = state;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetchTeamMembers(controller.signal)
      .then((data) => {
        if (!active) return;
        setState({ status: data.length === 0 ? 'empty' : 'ready', members: data });
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof DOMException && error.name === 'AbortError')) return;
        setState({ status: 'error', members: [] });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  // Resetting to the loading state belongs here (a user action) rather than inside the
  // effect, which only performs the request.
  const retry = useCallback(() => {
    setState({ status: 'loading', members: [] });
    setAttempt((n) => n + 1);
  }, []);

  return (
    <div aria-busy={status === 'loading'}>
      {/* Announce outcome changes to assistive tech without stealing focus. */}
      <p aria-live="polite" className="sr-only">
        {status === 'loading'
          ? 'Loading team members'
          : status === 'error'
            ? 'Team members could not be loaded'
            : status === 'empty'
              ? 'No team members listed'
              : `${members.length} team members loaded`}
      </p>

      {status === 'loading' ? <LoadingGrid /> : null}
      {status === 'error' ? <ErrorState onRetry={retry} /> : null}
      {status === 'empty' ? <EmptyState /> : null}

      {status === 'ready' ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px] xl:grid-cols-4">
          {members.map((member, index) => (
            <li key={member.id || member.name} className="h-full">
              <TeamCard member={member} index={index} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}