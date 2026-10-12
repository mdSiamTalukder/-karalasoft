import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminCard, AdminStatus } from '@/components/admin/ui';
import { getAdminSession } from '@/lib/admin-session';
import {
  formatMessageDate,
  listAdminMessages,
  previewOf,
  sortMessagesByDate,
} from '@/lib/admin-messages';
import type { AdminMessage } from '@/lib/admin-messages';

export const metadata: Metadata = { title: 'Messages' };
export const dynamic = 'force-dynamic';

/**
 * Messages inbox.
 *
 * Lists the real contact submissions held by the CMS, read with the signed-in admin's own
 * bearer token from `lib/admin-session.ts`. Every row links to the details route for its
 * own id, so clicking a message opens exactly that record.
 *
 * An unread badge appears only when the API actually returns a read/unread flag — the UI
 * does not assume one exists.
 */

function senderLabel(message: AdminMessage): string {
  return message.name ?? message.email ?? 'Unknown sender';
}

function ListRow({ message }: { message: AdminMessage }) {
  const when = formatMessageDate(message.createdAt);
  const preview = previewOf(message);

  return (
    <li>
      <Link
        href={`/admin/messages/${encodeURIComponent(message.id)}`}
        className="block rounded-[14px] border border-white/10 bg-white/[0.03] p-4 transition-colors duration-200 hover:border-cyan/40 hover:bg-white/[0.06]"
      >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {message.isRead === false ? (
            <span className="rounded-full border border-cyan/35 bg-cyan/[0.12] px-2 py-0.5 text-[11px] font-semibold text-cyan">
              Unread
            </span>
          ) : null}
          <p className="m-0 text-[15px] font-semibold break-words">{senderLabel(message)}</p>
          {message.email ? (
            <p className="m-0 min-w-0 text-[13px] break-all text-muted-soft">{message.email}</p>
          ) : null}
        </div>

        {message.subject ? (
          <p className="m-0 mt-1 text-[14px] break-words font-medium text-white">{message.subject}</p>
        ) : null}

        {preview ? <p className="m-0 mt-1 text-[14px] break-words text-muted">{preview}</p> : null}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-soft">
          {message.company ? <span className="break-words">{message.company}</span> : null}
          {message.need ? <span className="break-words">{message.need}</span> : null}
          <span>{when ?? 'Date unavailable'}</span>
        </div>
      </Link>
    </li>
  );
}

export default async function AdminMessagesPage() {
  const session = await getAdminSession();
  if (!session) return null; // the (dashboard) layout already redirects unauthenticated users

  let messages: AdminMessage[] = [];
  let error: string | null = null;

  try {
    messages = sortMessagesByDate(await listAdminMessages(session.token));
  } catch {
    error = 'Messages could not be loaded from the admin service right now. Please refresh to try again.';
  }

  const unread = messages.filter((message) => message.isRead === false).length;

  return (
    <div>
      <PageHeader
        title="Messages"
        description={
          error === null
            ? `${messages.length} submission${messages.length === 1 ? '' : 's'}${
                unread > 0 ? ` · ${unread} unread` : ''
              }`
            : 'Contact submissions sent through the website form.'
        }
      />

      {error !== null ? <AdminStatus tone="error">{error}</AdminStatus> : null}

      {error === null && messages.length === 0 ? (
        <AdminCard className="p-8 text-center">
          <p className="m-0 text-[15px] font-semibold">No messages yet</p>
          <p className="m-0 mt-1.5 text-[14px] text-muted">
            Contact form submissions will appear here once they arrive.
          </p>
        </AdminCard>
      ) : null}

      {messages.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {messages.map((message) => (
            <ListRow key={message.id} message={message} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}