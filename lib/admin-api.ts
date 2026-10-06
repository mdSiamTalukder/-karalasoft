/**
 * ------------------------------------------------------------------------------------
 * Admin API client — SERVER-ONLY.
 * ------------------------------------------------------------------------------------
 * A single typed wrapper around the existing KaralaSoft CRM backend
 * (https://admin.karalasoft.com). It is NOT a second backend: every function here is a
 * thin pass-through to the documented endpoint. Nothing is duplicated or invented.
 *
 * Contract taken from https://admin.karalasoft.com/openapi.json (v3.1.0), NOT guessed:
 *
 *   POST   /api/auth/login            {email, password}          -> {access_token, token_type, user}
 *   GET    /api/auth/me               Bearer                     -> UserOut
 *   GET    /api/projects              (public)                   -> ProjectOut[]
 *   POST   /api/projects              Bearer  ProjectCreate      -> ProjectOut   (201)
 *   GET    /api/projects/{id}         Bearer                     -> ProjectOut
 *   PUT    /api/projects/{id}         Bearer  ProjectUpdate      -> ProjectOut
 *   DELETE /api/projects/{id}         Bearer                     -> 204
 *   POST   /api/upload                Bearer  multipart `file`   -> {url, filename} (201)
 *
 * Auth failures return 401 with `{ "detail": "..." }`; validation failures return 422
 * with `{ "detail": [ { loc, msg } ] }`.
 *
 * The bearer token NEVER leaves the server: it is read from an httpOnly cookie here and
 * is never returned to a client component or written to the console.
 * ------------------------------------------------------------------------------------
 */

export const ADMIN_API_BASE =
  process.env.ADMIN_API_BASE_URL?.trim() || 'https://admin.karalasoft.com';

/* ---------------------------------------------------------------------- types */

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AdminUser;
}

/** Mirrors `ProjectOut`. */
export interface AdminProject {
  id: number;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  live_link: string | null;
  tags: unknown[] | null;
  year: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/** Mirrors `ProjectCreate` — only `title` is required server-side. */
export interface ProjectCreateInput {
  title: string;
  category?: string | null;
  description?: string | null;
  image_url?: string | null;
  live_link?: string | null;
  tags?: string[];
  year?: string | null;
  order_index?: number;
}

/** Mirrors `ProjectUpdate` — every field optional. */
export type ProjectUpdateInput = Partial<ProjectCreateInput>;

export interface UploadResponse {
  url: string;
  filename: string;
}

/* ---------------------------------------------------------------------- errors */

/** Normalised error that is safe to surface in the UI (no stack traces). */
export class AdminApiError extends Error {
  readonly status: number;
  /** Field-level messages parsed from a FastAPI 422 body. */
  readonly fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  /** 401/403 — the session is missing or expired. */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

/** Map a FastAPI 422 `detail` array onto field names. */
function parseValidationDetail(detail: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!Array.isArray(detail)) return out;

  for (const item of detail) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as { loc?: unknown; msg?: unknown };
    const loc = Array.isArray(entry.loc) ? entry.loc : [];
    // FastAPI prefixes locations with "body"; we only care about the field name.
    const field = loc.filter((part) => part !== 'body').join('.');
    if (field && typeof entry.msg === 'string') out[field] ??= entry.msg;
  }
  return out;
}

async function toApiError(response: Response, fallback: string): Promise<AdminApiError> {
  let message = fallback;
  let fieldErrors: Record<string, string> = {};

  try {
    const body: unknown = await response.json();
    if (body && typeof body === 'object' && 'detail' in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail)) {
        fieldErrors = parseValidationDetail(detail);
        message = Object.values(fieldErrors)[0] ?? fallback;
      }
    }
  } catch {
    /* Non-JSON body — keep the fallback. */
  }

  return new AdminApiError(response.status, message, fieldErrors);
}

/* ----------------------------------------------------------------------- core */

interface RequestOptions {
  token?: string;
  /** Send `undefined` instead of omitting the body when there is nothing to send. */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  formData?: FormData;
  signal?: AbortSignal;
}

async function adminFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, method = 'GET', body, formData, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData; // let the runtime set the multipart boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${ADMIN_API_BASE}${path}`, {
      method,
      headers,
      body: payload,
      cache: 'no-store',
      ...(signal ? { signal } : {}),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new AdminApiError(0, 'Could not reach the admin service. Check your connection.');
  }

  if (!response.ok) {
    throw await toApiError(response, `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

/* ------------------------------------------------------------------ functions */

export function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  return adminFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function fetchCurrentUser(token: string, signal?: AbortSignal): Promise<AdminUser> {
  return adminFetch<AdminUser>('/api/auth/me', { token, ...(signal ? { signal } : {}) });
}

export async function listProjects(token: string, signal?: AbortSignal): Promise<AdminProject[]> {
  const data = await adminFetch<AdminProject[] | { projects: AdminProject[] }>('/api/projects', {
    token,
    ...(signal ? { signal } : {}),
  });
  // The endpoint returns a bare array today; tolerate a wrapped shape too.
  const list = Array.isArray(data) ? data : data.projects;
  return Array.isArray(list) ? list : [];
}

export function getProject(token: string, id: number): Promise<AdminProject> {
  return adminFetch<AdminProject>(`/api/projects/${id}`, { token });
}

export function createProject(token: string, input: ProjectCreateInput): Promise<AdminProject> {
  return adminFetch<AdminProject>('/api/projects', { method: 'POST', token, body: input });
}

export function updateProject(
  token: string,
  id: number,
  input: ProjectUpdateInput,
): Promise<AdminProject> {
  return adminFetch<AdminProject>(`/api/projects/${id}`, { method: 'PUT', token, body: input });
}

export async function deleteProject(token: string, id: number): Promise<void> {
  await adminFetch<void>(`/api/projects/${id}`, { method: 'DELETE', token });
}

export function uploadImage(token: string, file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file); // field name comes from the OpenAPI spec
  return adminFetch<UploadResponse>('/api/upload', { method: 'POST', token, formData });
}

/* ------------------------------------------------------------------- helpers */

/** `ProjectOut.tags` is typed loosely by the backend — normalise to plain strings. */
export function toTagList(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => {
      if (typeof tag === 'string') return tag.trim();
      if (typeof tag === 'number' || typeof tag === 'boolean') return String(tag);
      return '';
    })
    .filter(Boolean);
}

/** Newest-first ordering for dashboard "latest project" style views. */
export function sortByOrder(projects: AdminProject[]): AdminProject[] {
  return [...projects].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0) || a.id - b.id,
  );
}

/**
 * The backend stores site-relative paths (`/images/projects/x.png`) that are served by
 * the public site host, so admin previews must resolve them the same way.
 */
export const ADMIN_MEDIA_ORIGIN = process.env.ADMIN_MEDIA_ORIGIN?.trim() || 'https://karalasoft.com';

export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${ADMIN_MEDIA_ORIGIN}${trimmed}`;
  return null;
}