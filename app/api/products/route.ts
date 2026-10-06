import { NextResponse } from 'next/server';

import { fetchProductsFromApi } from '@/lib/products';

/**
 * ------------------------------------------------------------------------------------
 * GET /api/products
 * ------------------------------------------------------------------------------------
 * Same-origin proxy for the public product suite, following the exact pattern already
 * established by `/api/projects` and `/api/team`.
 *
 * Required because the upstream CMS endpoint (https://admin.karalasoft.com/api/products)
 * answers with `Access-Control-Allow-Credentials: true` and no `Access-Control-Allow-Origin`
 * — a combination the Fetch specification rejects, so a browser can never call it directly.
 *
 * Read-only, public catalogue data. No authentication and no user data involved.
 * ------------------------------------------------------------------------------------
 */

export const runtime = 'nodejs';

const REVALIDATE_SECONDS = 3600;

export async function GET() {
  try {
    const products = await fetchProductsFromApi();
    return NextResponse.json(
      { success: true, products },
      { headers: { 'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600` } },
    );
  } catch (error) {
    console.error('[products] upstream suite fetch failed', {
      message: error instanceof Error ? error.message : 'unknown error',
    });
    return NextResponse.json(
      { success: false, message: 'Product suite is unavailable right now.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}