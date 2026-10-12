import type { Metadata } from 'next';
import Link from 'next/link';
import { AtSign, Building2, Clock, Globe, Mail, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCard, AdminStatus } from '@/components/admin/ui';
import { CopyEmailButton } from '@/components/admin/CopyEmailButton';
import { MessageSenderAvatar } from '@/components/admin/MessageSenderAvatar';
import { getAdminSession } from '@/lib/admin-session';
import {
  formatMessageDate,
  listAdminMessages,
  replyMailto,
  safeAvatarUrl,
} from '@/lib/admin-messages';
import type { AdminMessage } from '@/lib/admin-messages';

export const metadata: Metadata = { title: 'Message Details' };
export const dynamic = 'force-dynamic';

/**
 * Message details — sender profile + full message.
 *
 * Shows the complete stored record and every sender field the API actually returned. Rows
 * are rendered only for fields that hold a value, so nothing on this page can be mistaken
 * for real data that does not exist: there is no phone number, website or social profile in
 * the Project Brief payload, so none is displayed or invented. The body is never truncated.
 *
 * The message is located by listing the admin's own submissions and matching the id, which
 * keeps this route dependent only on endpoints already verified to exist. Reading is the
 * only action offered — the backend publishes no verified write verb for messages, so there
 * is deliberately no mark-as-read, delete or server-side reply control. The reply action is
 * a `mailto:` link that opens the admin's own mail client; it sends nothing from here.
 */

/** A labelled value that is only rendered when there is real data to show. */
function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="border-t border-white/10 py-3 first:border-t-0 first:pt-0">
      <dt className="m-0 text-[12px] tracking-[0.1em] text-muted-soft uppercase">{label}</dt>
      <dd className="m-0 mt-1 text-[15px] break-words text-white">{value}</dd>
    </div>
  );
}

/** Small capsule for the service type / read state. */
function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'accent' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] ${
        tone === 'accent'
          ? 'border-cyan/30 bg-cyan/[0.10] text-cyan'
          : 'border-white/12 bg-white/[0.05] text-muted'
      }`}
    >
      {children}
    </span>
  );
}

function StatusBadge({ isRead }: { isRead: boolean | null }) {
  // `null` means the API exposes no read flag — say nothing rather than guessing.
  if (isRead === null) return null;
  return isRead ? <Pill>Read</Pill> : <Pill tone="accent">Unread</Pill>;
}

/**
 * One labelled line in the profile card.
 *
 * Renders nothing at all when there is no real value, so a field the stored record does not
 * carry simply does not appear — there is no "Not provided" clutter and nothing invented.
 */
function ProfileRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-white/10 py-3 first:border-t-0 first:pt-0">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[10px] border border-white/10 bg-white/[0.04] text-muted-soft">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[12px] tracking-[0.1em] text-muted-soft uppercase">{label}</p>
        <div className="mt-0.5 flex min-w-0 items-center gap-2 text-[15px] break-words text-white">
          {children}
        </div>
      </div>
    </div>
  );
}

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getAdminSession();
  if (!session) return null; // the (dashboard) layout already redirects unauthenticated users

  let message: AdminMessage | null = null;
  let error: string | null = null;

  try {
    const messages = await listAdminMessages(session.token);
    message = messages.find((entry) => entry.id === id) ?? null;
  } catch {
    error = 'This message could not be loaded from the admin service right now. Please refresh to try again.';
  }

  if (error !== null) {
    return (
      <div>
        <PageHeader title="Message Details" backHref="/admin/messages" backLabel="Back to messages" />
        <AdminStatus tone="error">{error}</AdminStatus>
      </div>
    );
  }

  if (message === null) {
    /*
     * Rendered inline rather than via `notFound()` + a `not-found.tsx` boundary.
     *
     * `notFound()` produces a completely empty document for this route in the current
     * Next.js setup — verified with a trivial boundary that rendered nothing at all — so a
     * real not-found screen has to be drawn here. The route is behind admin auth and is
     * never indexed, so the HTTP status carries no SEO consequence.
     */
    return (
      <div>
        <PageHeader title="Message Details" backHref="/admin/messages" backLabel="Back to messages" />
        <AdminCard className="p-8 text-center">
          <p className="m-0 text-[13px] tracking-[0.14em] text-muted-soft uppercase">Message</p>
          <h2 className="m-0 mt-2 text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
            That message isn&apos;t here
          </h2>
          <p className="m-0 mx-auto mt-2 max-w-[46ch] text-[15px] text-muted">
            It may have been removed, or the link may be out of date. Nothing was deleted by
            looking for it.
          </p>
          <Link
            href="/admin/messages"
            className="mt-6 inline-flex items-center gap-2 rounded-[14px] border border-white/12 bg-white/[0.05] px-4 py-3 text-[15px] text-white transition-colors duration-200 hover:border-cyan/40"
          >
            Back to messages
          </Link>
        </AdminCard>
      </div>
    );
  }

  const when = formatMessageDate(message.createdAt);
  const avatar = await safeAvatarUrl(message.avatarUrl);
  const reply = replyMailto(message);
  const senderName = message.name ?? message.email ?? 'Unknown sender';

  return (
    <div>
      <PageHeader
        title="Message Details"
        description={when ?? undefined}
        backHref="/admin/messages"
        backLabel="Back to messages"
      />

      {/* Stacks on mobile/tablet; becomes a fixed profile column beside the message on desktop. */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        {/* ------------------------------------------------------- sender profile */}
        <AdminCard className="p-5 sm:p-6 lg:sticky lg:top-6">
          <div className="flex flex-col items-center text-center">
            <MessageSenderAvatar name={message.name} photoUrl={avatar} />

            <h2 className="m-0 mt-4 text-[20px] leading-tight font-extrabold tracking-[-0.02em] break-words">
              {senderName}
            </h2>

            {message.company ? (
              <p className="m-0 mt-1 text-[14px] break-words text-muted">{message.company}</p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <StatusBadge isRead={message.isRead} />
              {message.need ? <Pill tone="accent">{message.need}</Pill> : null}
            </div>
          </div>

          <div className="mt-5 space-y-0 border-t border-white/10 pt-1">
            {message.email ? (
              <ProfileRow icon={AtSign} label="Email">
                <a
                  href={`mailto:${message.email}`}
                  className="min-w-0 break-all transition-colors duration-200 hover:text-cyan"
                >
                  {message.email}
                </a>
                <CopyEmailButton value={message.email} />
              </ProfileRow>
            ) : null}

            {message.company ? (
              <ProfileRow icon={Building2} label="Company">
                <span className="break-words">{message.company}</span>
              </ProfileRow>
            ) : null}

            {/* Only rendered when the stored record actually carries one. */}
            {message.phone ? (
              <ProfileRow icon={Phone} label="Phone">
                <a
                  href={`tel:${message.phone.replace(/[^+\d]/g, '')}`}
                  className="break-all transition-colors duration-200 hover:text-cyan"
                >
                  {message.phone}
                </a>
              </ProfileRow>
            ) : null}

            {message.website ? (
              <ProfileRow icon={Globe} label="Website">
                <a
                  href={message.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="break-all underline decoration-white/25 underline-offset-2 transition-colors duration-200 hover:text-cyan hover:decoration-cyan/50"
                >
                  {message.website}
                </a>
              </ProfileRow>
            ) : null}

            {when ? (
              <ProfileRow icon={Clock} label="Received">
                <span className="break-words">{when}</span>
              </ProfileRow>
            ) : null}
          </div>

          {reply ? (
            <a
              href={reply}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-cyan/30 bg-cyan/[0.10] px-4 py-3 text-[15px] font-semibold text-cyan transition-colors duration-200 hover:border-cyan/50 hover:bg-cyan/[0.16]"
            >
              <Mail aria-hidden="true" className="size-4 shrink-0" />
              Reply by email
            </a>
          ) : null}

          <p className="m-0 mt-3 text-[12px] leading-relaxed text-muted-soft">
            Replying opens your own mail client. Nothing is sent from this page.
          </p>
        </AdminCard>

        {/* ------------------------------------------------------ message content */}
        <div className="flex min-w-0 flex-col gap-5">
          <AdminCard className="p-5 sm:p-6">
            <h2 className="m-0 mb-4 text-[17px] font-semibold">Message</h2>
            {message.message ? (
              /* `whitespace-pre-wrap` keeps the sender's original line breaks and
                 `break-words` stops a single unbroken string widening the layout. */
              <p className="m-0 text-[15px] leading-relaxed break-words whitespace-pre-wrap text-white">
                {message.message}
              </p>
            ) : (
              <p className="m-0 text-[14px] text-muted-soft">This message has no body text.</p>
            )}
          </AdminCard>

          <AdminCard className="p-5 sm:p-6">
            <h2 className="m-0 mb-4 text-[17px] font-semibold">Submission</h2>
            <dl className="m-0">
              <Detail label="Received" value={when} />
              <Detail label="Sender" value={message.name} />
              <Detail label="Email" value={message.email} />
              <Detail label="Company" value={message.company} />
              <Detail label="Needs" value={message.need} />
              <Detail label="Subject" value={message.subject} />
              <Detail label="Phone" value={message.phone} />
              <Detail label="Website" value={message.website} />
            </dl>

            {/* Only renders when at least one submission field is actually present. */}
            {when === null &&
            message.name === null &&
            message.email === null &&
            message.company === null &&
            message.need === null &&
            message.subject === null &&
            message.phone === null &&
            message.website === null ? (
              <p className="m-0 text-[14px] text-muted-soft">
                This record carries no sender or submission details.
              </p>
            ) : null}

            <p className="m-0 mt-4 border-t border-white/10 pt-4 text-[12px] text-muted-soft">
              Record <span className="break-all text-muted">{message.id}</span>
              {' · '}
              <Link href="/admin/messages" className="text-cyan underline underline-offset-2 hover:text-white">
                Back to inbox
              </Link>
            </p>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}