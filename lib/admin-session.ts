import { cookies } from 'next/headers';

import { fetchCurrentUser } from './admin-api';
import type { AdminUser } from './admin-api';

/**
 * ------------------------------------------------------------------------------------
 * Admin session — SERVER-ONLY.
 * ------------------------------------------------------------------------------------
 * The backend issues a bearer `access_token` from POST /api/auth/login. We keep it in an
 * httpOnly cookie so it is never readable by client JavaScript, and resolve it to a user
 * via GET /api/auth/me. No bespoke signing or fake session layer is introduced.
 * ------------------------------------------------------------------------------------
 */

export const ADMIN_COOKIE = 'karala_admin_token';

/** Matches a working day; the backend's own token lifetime governs validity. */
const MAX_AGE_SECONDS = 60 * 60 * 8;

export async function setAdminToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminToken(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? null;
}

/**
 * Resolve the current admin from the stored token.
 * Returns `null` for a missing, invalid or expired token — never throws — so callers can
 * redirect instead of handling exceptions.
 */
export async function getAdminSession(): Promise<{ token: string; user: AdminUser } | null> {
  const token = await getAdminToken();
  if (!token) return null;

  try {
    const user = await fetchCurrentUser(token);
    if (!user?.email) return null;
    return { token, user };
  } catch {
    return null;
  }
}