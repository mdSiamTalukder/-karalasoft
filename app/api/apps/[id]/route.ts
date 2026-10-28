
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-session';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidId(id: string) {
  return /^\d+$/.test(id) && Number(id) > 0;
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

function isValidPayload(body: Record<string, unknown>) {
  const allowedKeys = [
    'name',
    'category',
    'shortDescription',
    'description',
    'features',
    'websiteUrl',
    'playStoreUrl',
    'apkDownloadUrl',
    'status',
    'isPublished',
    'orderIndex',
  ];

  if (Object.keys(body).some((key) => !allowedKeys.includes(key))) {
    return false;
  }

  return (
    (body.name === undefined ||
      (typeof body.name === 'string' &&
        body.name.trim().length > 0 &&
        body.name.trim().length <= 200)) &&
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
    isOptionalString(body.websiteUrl) &&
    isOptionalString(body.playStoreUrl) &&
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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function isAdminAuthenticated() {
  const session = await getAdminSession();
  return Boolean(session);
}

// GET: Retrieve an app (admin only).
export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { error: 'Invalid app ID.' },
        { status: 400 },
      );
    }

    const result = await db.query(
      'SELECT * FROM apps WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'App not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ app: result.rows[0] });
  } catch (error) {
    console.error('GET /api/apps/[id] failed:', error);

    return NextResponse.json(
      { error: 'Unable to load app.' },
      { status: 500 },
    );
  }
}

// PATCH: Update an app (admin only).
export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { error: 'Invalid app ID.' },
        { status: 400 },
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body) ||
      !isValidPayload(body as Record<string, unknown>)
    ) {
      return NextResponse.json(
        { error: 'Invalid app data.' },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const fields: string[] = [];
    const values: unknown[] = [];

    function addField(column: string, value: unknown) {
      values.push(value);
      fields.push(`${column} = $${values.length}`);
    }

    if (typeof data.name === 'string') {
      const name = data.name.trim();
      const slug = createSlug(name);

      if (!slug) {
        return NextResponse.json(
          {
            error:
              'App name must contain English letters or numbers.',
          },
          { status: 400 },
        );
      }

      addField('name', name);
      addField('slug', slug);
    }

    if (typeof data.category === 'string') {
      addField('category', data.category.trim() || 'Other');
    }

    if (typeof data.shortDescription === 'string') {
      addField('short_description', data.shortDescription);
    }

    if (typeof data.description === 'string') {
      addField('description', data.description);
    }

    if (Array.isArray(data.features)) {
      values.push(JSON.stringify(data.features));
      fields.push(`features = $${values.length}::jsonb`);
    }

    if (data.websiteUrl !== undefined) {
      addField('website_url', data.websiteUrl);
    }

    if (data.playStoreUrl !== undefined) {
      addField('play_store_url', data.playStoreUrl);
    }

    if (data.apkDownloadUrl !== undefined) {
      addField('apk_download_url', data.apkDownloadUrl);
    }

    if (data.status !== undefined) {
      addField('status', data.status);
    }

    if (data.isPublished !== undefined) {
      addField('is_published', data.isPublished);
    }

    if (data.orderIndex !== undefined) {
      addField('order_index', data.orderIndex);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'No fields provided to update.' },
        { status: 400 },
      );
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await db.query(
      `UPDATE apps
       SET ${fields.join(', ')}
       WHERE id = $${values.length}
       RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'App not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ app: result.rows[0] });
  } catch (error) {
    const databaseError = error as { code?: string };

    if (databaseError.code === '23505') {
      return NextResponse.json(
        { error: 'An app with this name already exists.' },
        { status: 409 },
      );
    }

    console.error('PATCH /api/apps/[id] failed:', error);

    return NextResponse.json(
      { error: 'Unable to update app.' },
      { status: 500 },
    );
  }
}

// DELETE: Delete an app (admin only).
export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { error: 'Invalid app ID.' },
        { status: 400 },
      );
    }

    const result = await db.query(
      'DELETE FROM apps WHERE id = $1 RETURNING id',
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'App not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'App deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE /api/apps/[id] failed:', error);

    return NextResponse.json(
      { error: 'Unable to delete app.' },
      { status: 500 },
    );
  }
}
