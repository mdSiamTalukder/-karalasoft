import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCard, AdminStatus } from '@/components/admin/ui';
import { getAdminSession } from '@/lib/admin-session';
import { formatMessageDate, listAdminMessages } from '@/lib/admin-messages';
import type { AdminMessage } from '@/lib/admin-messages';

export const metadata: Metadata = { title: 'Message Details' };
export const dynamic = 'force-dynamic';

/**
 * Message details.
 *
 * Shows the complete stored record — the body is never truncated — plus whatever sender
 * fields the record actually contains. Fields the API did not return are reported as
 * "Not provided" rather than being filled in, so nothing on this page can be mistaken for
 * real data that does not exist.
 *
 * The message is located by listing the admin's own submissions and matching the id, which
 * keeps this route dependent only on endpoints already verified to exist. Reading is the
 * only action offered: the backend publishes no verified write verb for messages, so there
 * is deliberately no mark-as-read, reply or delete control.
 */

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-t border-white/10 py-3 first:border-t-0 first:pt-0">
      <dt className="m-0 text-[13px] tracking-[0.08em] text-muted-soft uppercase">{label}</dt>
      <dd className="m-0 mt-1 text-[15px] break-words text-white">
        {value ?? <span className="text-muted-soft">Not provided</span>}
      </dd>
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

  if (message === null) notFound();

  const when = formatMessageDate(message.createdAt);

  return (
    <div>
      <PageHeader
        title="Message Details"
        description={when ?? undefined}
        backHref="/admin/messages"
        backLabel="Back to messages"
      />

      <div className="flex flex-col gap-5">
        <AdminCard className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="m-0 text-[17px] font-semibold">Sender</h2>
            {message.isRead === false ? (
              <span className="rounded-full border border-cyan/35 bg-cyan/[0.12] px-2 py-0.5 text-[11px] font-semibold text-cyan">
                Unread
              </span>
            ) : null}
            {message.isRead === true ? (
              <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] text-muted-soft">
                Read
              </span>
            ) : null}
          </div>

          <dl className="m-0">
            <Field label="Name" value={message.name} />
            <Field label="Email" value={message.email} />
            <Field label="Company" value={message.company} />
            <Field label="Needs" value={message.need} />
            <Field label="Subject" value={message.subject} />
            <Field label="Received" value={when} />
          </dl>

          {message.email ? (
            <p className="m-0 mt-4 border-t border-white/10 pt-4 text-[13px] text-muted-soft">
              Replying is done from your mail client —{' '}
              <Link
                href={`mailto:${message.email}`}
                className="break-all text-cyan underline underline-offset-2 hover:text-white"
              >
                {message.email}
              </Link>
              .
            </p>
          ) : null}
        </AdminCard>

        <AdminCard className="p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-[17px] font-semibold">Message</h2>
          {message.message ? (
            /* `whitespace-pre-wrap` keeps the sender's original line breaks, and
               `break-words` stops a single unbroken string from widening the layout. */
            <p className="m-0 text-[15px] leading-relaxed break-words whitespace-pre-wrap text-white">
              {message.message}
            </p>
          ) : (
            <p className="m-0 text-[14px] text-muted-soft">This message has no body text.</p>
          )}
        </AdminCard>
      </div>
    </div>
  );
}