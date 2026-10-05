import { NextResponse } from 'next/server';

import { fetchTeamMembersFromApi } from '@/lib/team';

/**
 * ------------------------------------------------------------------------------------
 * GET /api/team
 * ------------------------------------------------------------------------------------
 * Same-origin proxy for the public team roster.
 *
 * Why this exists: the upstream CMS endpoint
 * (https://admin.karalasoft.com/api/team) answers with
 * `Access-Control-Allow-Credentials: true` but NO `Access-Control-Allow-Origin`.
 * Per the Fetch specification that combination is rejected, so a browser can never call
 * it cross-origin — regardless of headers we send. Proxying through our own origin
 * avoids CORS entirely and keeps the client able to show real loading/error states.
 *
 * Read-only. No authentication, no cookies, no user data involved.
 * ------------------------------------------------------------------------------------
 */

export const runtime = 'nodejs';

const REVALIDATE_SECONDS = 3600; // roster changes rarely

export async function GET() {
  try {
    const members = await fetchTeamMembersFromApi();
    return NextResponse.json(
      { success: true, members },
      { headers: { 'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600` } },
    );
  } catch (error) {
    // Log the real cause server-side; return a clean, non-sensitive body to the client.
    console.error('[team] upstream roster fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
    return NextResponse.json(
      { success: false, message: 'Team roster is unavailable right now.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}