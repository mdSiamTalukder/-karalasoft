import { NextResponse } from 'next/server';

import { fetchProjectsFromApi } from '@/lib/projects';

/**
 * ------------------------------------------------------------------------------------
 * GET /api/projects
 * ------------------------------------------------------------------------------------
 * Same-origin proxy for the public project showcase.
 *
 * Required for the same reason as `/api/team`: the upstream CMS endpoint
 * (https://admin.karalasoft.com/api/projects) answers with
 * `Access-Control-Allow-Credentials: true` but no `Access-Control-Allow-Origin`,
 * a combination the Fetch specification rejects — so a browser can never call it
 * cross-origin no matter what we send.
 *
 * Read-only, public catalogue data. No authentication and no user data involved.
 * ------------------------------------------------------------------------------------
 */

export const runtime = 'nodejs';

const REVALIDATE_SECONDS = 3600;

export async function GET() {
  try {
    const projects = await fetchProjectsFromApi();
    return NextResponse.json(
      { success: true, projects },
      { headers: { 'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600` } },
    );
  } catch (error) {
    console.error('[projects] upstream showcase fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
    return NextResponse.json(
      { success: false, message: 'Project showcase is unavailable right now.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}