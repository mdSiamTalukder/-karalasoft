'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  AdminApiError,
  createProject,
  deleteProject,
  getProject,
  toTagList,
  updateProject,
  uploadImage,
} from '@/lib/admin-api';
import type { ProjectCreateInput } from '@/lib/admin-api';
import { clearAdminToken, getAdminSession, setAdminToken } from '@/lib/admin-session';

/**
 * ------------------------------------------------------------------------------------
 * Admin Server Actions.
 * ------------------------------------------------------------------------------------
 * All backend mutation happens here so the bearer token stays on the server. Client
 * components submit forms and receive plain, serialisable results.
 * ------------------------------------------------------------------------------------
 */

export interface ActionState {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  /** Set on successful create/update so the form can navigate. */
  redirectTo?: string;
}

const fail = (message: string, fieldErrors?: Record<string, string>): ActionState => ({
  ok: false,
  message,
  ...(fieldErrors ? { fieldErrors } : {}),
});

/** Resolve the session or return null (callers must handle unauthenticated). */
async function requireSession() {
  return getAdminSession();
}

/* ------------------------------------------------------------------------ login */

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return fail('Enter both your email and password.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return fail('Enter a valid email address.', { email: 'Enter a valid email address.' });
  }

  try {
    // Imported lazily so the module graph stays flat; the API key is never involved.
    const { loginAdmin } = await import('@/lib/admin-api');
    const result = await loginAdmin(email, password);

    await setAdminToken(result.access_token);
  } catch (error) {
    if (error instanceof AdminApiError) {
      if (error.isAuthError) return fail('Incorrect email or password.');
      if (error.status === 422) {
        return fail('Please check the details you entered.', error.fieldErrors);
      }
      return fail('Sign-in is temporarily unavailable. Please try again.');
    }
    return fail('Something went wrong while signing in. Please try again.');
  }

  redirect('/admin');
}

/* ----------------------------------------------------------------------- logout */

export async function logoutAction(): Promise<void> {
  await clearAdminToken();
  redirect('/admin/login');
}

/* ----------------------------------------------------------------------- upload */

export async function uploadImageAction(formData: FormData): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return fail('Your session has expired. Please sign in again.');

  const file = formData.get('image');
  if (!(file instanceof File) || file.size === 0) {
    return fail('Choose an image to upload.', { image: 'Choose an image to upload.' });
  }
  if (!file.type.startsWith('image/')) {
    return fail('Only image files can be uploaded.', { image: 'Only image files can be uploaded.' });
  }
  // 8 MB ceiling — matches typical CMS limits and protects the backend.
  if (file.size > 8 * 1024 * 1024) {
    return fail('Images must be 8 MB or smaller.', { image: 'Images must be 8 MB or smaller.' });
  }

  try {
    const result = await uploadImage(session.token, file);
    return { ok: true, message: 'Image uploaded.', redirectTo: result.url };
  } catch (error) {
    if (error instanceof AdminApiError && error.isAuthError) {
      return fail('Your session has expired. Please sign in again.');
    }
    return fail('The image could not be uploaded. Please try another file.');
  }
}

/* ----------------------------------------------------------------- form parsing */

function readProjectForm(formData: FormData): ProjectCreateInput {
  const title = String(formData.get('title') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const imageUrl = String(formData.get('image_url') ?? '').trim();
  const liveLink = String(formData.get('live_link') ?? '').trim();
  const year = String(formData.get('year') ?? '').trim();
  const orderRaw = String(formData.get('order_index') ?? '').trim();
  const tags = toTagList(
    String(formData.get('tags') ?? '')
      .split(',')
      .map((tag) => tag.trim()),
  );

  return {
    title,
    category: category || null,
    description: description || null,
    image_url: imageUrl || null,
    live_link: liveLink || null,
    year: year || null,
    tags,
    order_index: orderRaw === '' ? 0 : Number.parseInt(orderRaw, 10) || 0,
  };
}

function validateProject(input: ProjectCreateInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.title) errors.title = 'Project title is required.';
  else if (input.title.length > 200) errors.title = 'Title must be 200 characters or fewer.';

  if (input.live_link && !/^https?:\/\//i.test(input.live_link)) {
    errors.live_link = 'Live URL must start with http:// or https://';
  }
  if (input.year && !/^\d{4}$/.test(input.year)) {
    errors.year = 'Year must be 4 digits, e.g. 2024.';
  }
  return errors;
}

/** Refresh the public pages that consume the projects API. */
function revalidatePublicProjects() {
  revalidatePath('/projects');
  revalidatePath('/');
}

/* ---------------------------------------------------------------------- create */

export async function createProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return fail('Your session has expired. Please sign in again.');

  const input = readProjectForm(formData);
  const errors = validateProject(input);
  if (Object.keys(errors).length > 0) {
    return fail('Please fix the highlighted fields.', errors);
  }

  try {
    await createProject(session.token, input);
  } catch (error) {
    if (error instanceof AdminApiError && error.isAuthError) {
      return fail('Your session has expired. Please sign in again.');
    }
    if (error instanceof AdminApiError && error.status === 422) {
      return fail('The project could not be created.', error.fieldErrors);
    }
    return fail('The project could not be created. Please try again.');
  }

  revalidatePublicProjects();
  redirect('/admin/projects');
}

/* ----------------------------------------------------------------------- update */

export async function updateProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return fail('Your session has expired. Please sign in again.');

  const id = Number.parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isFinite(id)) return fail('This project could not be identified.');

  const input = readProjectForm(formData);
  const errors = validateProject(input);
  if (Object.keys(errors).length > 0) {
    return fail('Please fix the highlighted fields.', errors);
  }

  try {
    await updateProject(session.token, id, input);
  } catch (error) {
    if (error instanceof AdminApiError && error.isAuthError) {
      return fail('Your session has expired. Please sign in again.');
    }
    if (error instanceof AdminApiError && error.status === 422) {
      return fail('The project could not be updated.', error.fieldErrors);
    }
    return fail('The project could not be updated. Please try again.');
  }

  revalidatePublicProjects();
  redirect('/admin/projects');
}

/* ----------------------------------------------------------------------- delete */

export async function deleteProjectAction(formData: FormData): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return fail('Your session has expired. Please sign in again.');

  const id = Number.parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isFinite(id)) return fail('This project could not be identified.');

  try {
    await deleteProject(session.token, id);
  } catch (error) {
    if (error instanceof AdminApiError && error.isAuthError) {
      return fail('Your session has expired. Please sign in again.');
    }
    return fail('The project could not be deleted. Please try again.');
  }

  revalidatePublicProjects();
  return { ok: true, message: 'Project deleted.' };
}

/** Used by the edit page to pre-fill the form with real data. */
export async function loadProjectForEdit(id: number) {
  const session = await requireSession();
  if (!session) return null;
  try {
    const project = await getProject(session.token, id);
    return { ...project, tags: toTagList(project.tags) };
  } catch {
    return null;
  }
}