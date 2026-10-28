import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-session';

export const runtime = 'nodejs';

type AppRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  features: string[];
  logo_url: string | null;
  website_url: string | null;
  play_store_url: string | null;
  apple_store_url: string | null;
  apk_download_url: string | null;
  status: 'Demo' | 'Published';
  is_published: boolean;
  order_index: number;
  created_at: Date;
  updated_at: Date;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isOptionalString(
  value: unknown,
): value is string | null | undefined {
  return (
    value === undefined ||
    value === null ||
    typeof value === 'string'
  );
}

function validPayload(body: Record<string, unknown>) {
  return (
    typeof body.name === 'string' &&
    body.name.trim().length > 0 &&
    body.name.trim().length <= 200 &&
    (body.category === undefined ||
      (typeof body.category === 'string' &&
        body.category.length <= 100)) &&
    (body.shortDescription === undefined ||
      typeof body.shortDescription === 'string') &&
    (body.description === undefined ||
      typeof body.description === 'string') &&
    (body.features === undefined ||
      (Array.isArray(body.features) &&
        body.features.every((item) => typeof item === 'string'))) &&
    isOptionalString(body.logoUrl) &&
    isOptionalString(body.websiteUrl) &&
    isOptionalString(body.playStoreUrl) &&
    isOptionalString(body.appleStoreUrl) &&
    isOptionalString(body.apkDownloadUrl) &&
    (body.status === undefined ||
      body.status === 'Demo' ||
      body.status === 'Published') &&
    (body.isPublished === undefined ||
      typeof body.isPublished === 'boolean') &&
    (body.orderIndex === undefined ||
      (Number.isInteger(body.orderIndex) &&
        Number(body.orderIndex) >= 0))
  );
}

// Public API: list published apps.
export async function GET() {
  try {
    const result = await db.query<AppRow>(
      `SELECT id, slug, name, category, short_description,
              description, features, logo_url, website_url,
              play_store_url, apple_store_url, apk_download_url,
              status, is_published, order_index, created_at, updated_at
       FROM apps
       WHERE is_published = TRUE
       ORDER BY order_index ASC, created_at DESC`,
    );

    return NextResponse.json({ apps: result.rows });
  } catch (error) {
    console.error('GET /api/apps failed:', error);

    return NextResponse.json(
      { error: 'Unable to load apps.' },
      { status: 500 },
    );
  }
}

// Admin API: create an app.
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body) ||
      !validPayload(body as Record<string, unknown>)
    ) {
      return NextResponse.json(
        { error: 'Invalid app data.' },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const name = (data.name as string).trim();
    const slug = toSlug(name);

    if (!slug) {
      return NextResponse.json(
        {
          error:
            'App name must contain English letters or numbers.',
        },
        { status: 400 },
      );
    }

    const features = (data.features as string[] | undefined) ?? [];
    const status =
      (data.status as 'Demo' | 'Published' | undefined) ?? 'Demo';
    const isPublished =
      (data.isPublished as boolean | undefined) ?? false;
    const orderIndex =
      (data.orderIndex as number | undefined) ?? 0;

    const result = await db.query<AppRow>(
      `INSERT INTO apps (
         slug, name, category, short_description, description,
         features, logo_url, website_url, play_store_url,
         apple_store_url, apk_download_url, status,
         is_published, order_index
       )
       VALUES (
         $1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10,
         $11, $12, $13, $14
       )
       RETURNING *`,
      [
        slug,
        name,
        (data.category as string | undefined)?.trim() || 'Other',
        (data.shortDescription as string | undefined) ?? '',
        (data.description as string | undefined) ?? '',
        JSON.stringify(features),
        data.logoUrl ?? null,
        data.websiteUrl ?? null,
        data.playStoreUrl ?? null,
        data.appleStoreUrl ?? null,
        data.apkDownloadUrl ?? null,
        status,
        isPublished,
        orderIndex,
      ],
    );

    return NextResponse.json(
      { app: result.rows[0] },
      { status: 201 },
    );
  } catch (error) {
    const databaseError = error as { code?: string };

    if (databaseError.code === '23505') {
      return NextResponse.json(
        { error: 'An app with this name already exists.' },
        { status: 409 },
      );
    }

    console.error('POST /api/apps failed:', error);

    return NextResponse.json(
      { error: 'Unable to create app.' },
      { status: 500 },
    );
  }
}