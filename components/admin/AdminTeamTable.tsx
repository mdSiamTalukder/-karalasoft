import { AdminTeamAvatar } from '@/components/admin/AdminTeamAvatar';
import { AdminCard } from '@/components/admin/ui';
import type { TeamMember } from '@/lib/team';

/**
 * ------------------------------------------------------------------------------------
 * Admin team roster
 * ------------------------------------------------------------------------------------
 * Follows the KaralaSoft reference admin team page: a glass card containing a roster of
 * `Member · Position · Order`, where each member shows their real profile photo beside
 * their name. The reference hides the Order column below `md`; the same applies here.
 *
 * Responsive strategy follows the existing admin convention used by `ProjectsTable` rather
 * than introducing a new pattern: a real `<table>` from `md` up, and stacked rows below it,
 * so narrow screens never scroll horizontally or truncate a name or role.
 *
 * Members are rendered from the CMS response only — no name, role or image is written here.
 */
export function AdminTeamTable({
  members,
  loading = false,
  error = null,
}: {
  members: readonly TeamMember[];
  loading?: boolean;
  error?: string | null;
}) {
  if (error) {
    return (
      <AdminCard className="p-6">
        <p role="alert" className="m-0 text-[15px] text-muted">
          {error}
        </p>
      </AdminCard>
    );
  }

  if (loading) {
    return (
      <ul aria-hidden="true" className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <AdminCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 shrink-0 rounded-full bg-white/[0.06] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3.5 w-1/2 rounded-full bg-white/[0.07] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
                  <div className="h-3 w-3/4 rounded-full bg-white/[0.05] [animation:pulseDot_1.8s_ease-in-out_infinite]" />
                </div>
              </div>
            </AdminCard>
          </li>
        ))}
      </ul>
    );
  }

  if (members.length === 0) {
    return (
      <AdminCard className="p-10 text-center">
        <p className="m-0 text-[16px] font-semibold">No team members yet</p>
        <p className="mx-auto mt-2 mb-0 max-w-[420px] text-[15px] text-muted">
          Team profiles added in the CMS will appear here.
        </p>
      </AdminCard>
    );
  }

  return (
    <AdminCard className="overflow-hidden">
      {/* Table — wide screens */}
      <table className="hidden w-full border-collapse md:table">
        <caption className="sr-only">
          Team members shown on the public website, with their position and display order.
        </caption>
        <thead>
          <tr className="border-b border-white/10 text-left">
            {['Member', 'Position', 'Order'].map((heading, index) => (
              <th
                key={heading}
                scope="col"
                className={`px-5 py-3.5 text-[13px] font-semibold tracking-[0.08em] text-muted-soft uppercase ${
                  index === 2 ? 'w-24 text-right' : ''
                }`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr
              key={member.id}
              className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
            >
              <th scope="row" className="px-5 py-3.5 text-left font-normal">
                <span className="flex items-center gap-3">
                  <AdminTeamAvatar name={member.name} imageUrl={member.imageUrl} />
                  <span className="min-w-0 truncate text-[15px] font-semibold text-white">
                    {member.name}
                  </span>
                </span>
              </th>
              <td className="px-5 py-3.5 text-[15px] text-muted">
                {member.position ? (
                  <span className="block truncate">{member.position}</span>
                ) : (
                  <span className="text-muted-soft">No position set</span>
                )}
              </td>
              <td className="px-5 py-3.5 text-right text-[15px] text-muted-soft tabular-nums">
                {member.orderIndex}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stacked rows — narrow screens */}
      <ul className="m-0 grid list-none gap-3 p-4 md:hidden">
        {members.map((member) => (
          <li key={member.id}>
            <div className="rounded-[16px] border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <AdminTeamAvatar name={member.name} imageUrl={member.imageUrl} />
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-[15px] font-semibold text-white">
                    {member.name}
                  </p>
                  <p className="mt-0.5 mb-0 truncate text-[13px] text-muted">
                    {member.position ? member.position : 'No position set'}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-muted-soft tabular-nums">
                  #{member.orderIndex}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}
