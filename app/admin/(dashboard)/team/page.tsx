import type { Metadata } from 'next';

import { PageHeader } from '@/components/admin/PageHeader';
import { AdminTeamTable } from '@/components/admin/AdminTeamTable';
import { fetchTeamMembersFromApi } from '@/lib/team';
import type { TeamMember } from '@/lib/team';

export const metadata: Metadata = { title: 'Team' };
export const dynamic = 'force-dynamic';

/**
 * Admin team roster.
 *
 * Mirrors the reference admin team page: a roster of member, position and display order,
 * with each member's real profile photo from the CMS beside their name.
 *
 * Data comes straight from `GET /api/team` via the existing `fetchTeamMembersFromApi()`,
 * so names, roles, ordering and `image_url` values are exactly what is published — nothing
 * is hardcoded here. Members without an `image_url` fall back to their initials inside
 * `AdminTeamAvatar`.
 */
export default async function AdminTeamPage() {
  let members: TeamMember[] = [];
  let error: string | null = null;

  try {
    members = await fetchTeamMembersFromApi();
  } catch {
    error = 'Team members could not be loaded from the CMS right now. Please refresh to try again.';
  }

  const withPhoto = members.filter((member) => Boolean(member.imageUrl)).length;

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage team members shown on the About page."
      />

      {error === null && members.length > 0 ? (
        <p aria-live="polite" className="mb-4 text-[13px] text-muted-soft">
          Showing {members.length} team member{members.length === 1 ? '' : 's'} ·{' '}
          {withPhoto} with a profile photo, {members.length - withPhoto} using initials.
        </p>
      ) : null}

      <AdminTeamTable members={members} error={error} />
    </div>
  );
}
