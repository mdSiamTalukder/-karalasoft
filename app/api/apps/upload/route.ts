
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/admin-session';

export const runtime = 'nodejs';

const MAX_APK_SIZE = 500 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in as an admin.' },
        { status: 401 },
      );
    }

    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.toLowerCase().endsWith('.apk')) {
          throw new Error('Only APK files are allowed.');
        }

        return {
          allowedContentTypes: [
            'application/vnd.android.package-archive',
            'application/octet-stream',
          ],
          maximumSizeInBytes: MAX_APK_SIZE,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // The client saves the returned Blob URL through the existing Apps API.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'APK upload failed.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
