'use client';

import Image from 'next/image';
import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { ImageOff, Loader2, Save, Upload, X } from 'lucide-react';

import {
  createProjectAction,
  updateProjectAction,
  uploadImageAction,
} from '@/app/admin/actions';
import type { ActionState } from '@/app/admin/actions';
import { resolveMediaUrl } from '@/lib/admin-api';
import { AdminCard, AdminField, AdminStatus, adminInputClass } from '@/components/admin/ui';

export interface ProjectFormValues {
  id?: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  live_link: string;
  year: string;
  order_index: number;
  tags: string;
}

const blank: ProjectFormValues = {
  title: '',
  category: '',
  description: '',
  image_url: '',
  live_link: '',
  year: '',
  order_index: 0,
  tags: '',
};

const initialState: ActionState = { ok: false, message: '' };

/**
 * ------------------------------------------------------------------------------------
 * Cover image upload limits
 * ------------------------------------------------------------------------------------
 * Enforced on the client BEFORE a byte is sent, and mirrored by `uploadImageAction` on the
 * server. Keep all three in step: this constant, `next.config.ts`
 * (`experimental.serverActions.bodySizeLimit`, which must exceed this) and the check in
 * `app/admin/actions.ts`.
 */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Only the three formats the UI advertises. Anything else is rejected up front. */
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;

/** Human-readable size for the error copy. */
function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

/** Browser MIME check, with an extension fallback for the odd browser reporting `''`. */
function isAcceptedImage(file: File): boolean {
  if ((ACCEPTED_TYPES as readonly string[]).includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
}

export function ProjectForm({
  mode,
  project,
}: {
  mode: 'create' | 'edit';
  project?: ProjectFormValues;
}) {
  const values = project ?? blank;
  const isEdit = mode === 'edit' && typeof values.id === 'number';

  const [state, formAction, pending] = useActionState(
    isEdit ? updateProjectAction : createProjectAction,
    initialState,
  );

  const [imageUrl, setImageUrl] = useState(values.image_url);
  const [uploadError, setUploadError] = useState('');
  const [dirty, setDirty] = useState(false);

  /**
   * Uploading is an explicit boolean rather than a `useTransition` flag.
   *
   * The previous transition-based version had no error handling: when the Server Action
   * rejected (oversized body, dropped connection), the `await` inside the transition threw,
   * the transition never settled and `uploading` stayed `true` for good — leaving the form
   * permanently disabled with a spinner and no way out. Explicit state, cleared in a
   * `finally`, always restores the UI.
   */
  const [uploading, setUploading] = useState(false);

  /**
   * Ref-based in-flight lock. `disabled` on the input alone is not enough: a second
   * `change` event can still arrive before React re-renders, which used to stack parallel
   * uploads of the same file.
   */
  const uploadInFlight = useRef(false);

  /** Transient preview of the file the visitor just picked, before the upload returns. */
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  /** Drop the current blob URL, if any. */
  const releaseLocalPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setLocalPreview(null);
  }, []);

  // Never leak a blob URL: release the last one when the form unmounts.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // Warn before losing unsaved edits (create only — the edit form is short).
  useEffect(() => {
    if (mode !== 'create') return undefined;
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty, mode]);

  const preview = resolveMediaUrl(imageUrl);

  /**
   * Show the picked file immediately.
   *
   * `URL.createObjectURL` is a cheap handle — it does not read or decode the file — so the
   * preview appears without touching the main thread, even for an 8 MB image. Nothing is
   * base64-encoded, which is what would otherwise stall the UI. The old URL is revoked
   * first so repeated picks cannot accumulate blobs.
   */
  function showLocalPreview(file: File) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setLocalPreview(url);
  }

  async function uploadFile(file: File) {
    uploadInFlight.current = true;
    setUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      data.set('image', file);
      const result = await uploadImageAction(data);

      if (result.ok && result.redirectTo) {
        setImageUrl(result.redirectTo);
        setDirty(true);
        // The saved path is now the source of truth — the blob is redundant.
        releaseLocalPreview();
      } else {
        setUploadError(result.message || 'The image could not be uploaded. Please try again.');
      }
    } catch {
      // The action itself failed (network drop, rejected body, server error). Without this
      // the rejection escaped the transition and left the form stuck on "Uploading…".
      setUploadError(
        'The image could not be uploaded. Check your connection and try again — images must be JPG, PNG or WebP under 8 MB.',
      );
    } finally {
      // Always restore the UI, on every path.
      uploadInFlight.current = false;
      setUploading(false);
    }
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-picking the same file
    if (!file) return;

    // Refuse a second upload while one is still running.
    if (uploadInFlight.current) return;

    // Validate locally first, so an oversized or wrong-type file is never uploaded and the
    // Server Action is never asked to stream a body the framework will reject.
    if (!isAcceptedImage(file)) {
      releaseLocalPreview();
      setUploadError('Choose a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      releaseLocalPreview();
      setUploadError(
        `That image is ${formatSize(file.size)}. Images must be 8 MB or smaller.`,
      );
      return;
    }

    showLocalPreview(file);
    void uploadFile(file);
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_340px]" noValidate>
      {isEdit ? <input type="hidden" name="id" value={values.id} /> : null}

      <AdminCard className="grid gap-5 p-6">
        <AdminField label="Title" htmlFor="title" required error={state.fieldErrors?.title}>
          <input
            id="title"
            name="title"
            defaultValue={values.title}
            onChange={() => setDirty(true)}
            required
            maxLength={200}
            placeholder="e.g. Siam & Khmer POS"
            className={adminInputClass}
          />
        </AdminField>

        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Category" htmlFor="category" error={state.fieldErrors?.category}>
            <input
              id="category"
              name="category"
              defaultValue={values.category}
              onChange={() => setDirty(true)}
              placeholder="e.g. Web application"
              className={adminInputClass}
            />
          </AdminField>

          <AdminField
            label="Year"
            htmlFor="year"
            error={state.fieldErrors?.year}
            hint="Four digits"
          >
            <input
              id="year"
              name="year"
              inputMode="numeric"
              defaultValue={values.year}
              onChange={() => setDirty(true)}
              placeholder="2024"
              className={adminInputClass}
            />
          </AdminField>
        </div>

        <AdminField
          label="Description"
          htmlFor="description"
          hint="Shown on hover and on the project card."
        >
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={values.description}
            onChange={() => setDirty(true)}
            placeholder="What was built, and for whom?"
            className={`${adminInputClass} resize-y`}
          />
        </AdminField>

        <AdminField
          label="Tags"
          htmlFor="tags"
          hint="Comma separated, e.g. Laravel, React, Stripe"
        >
          <input
            id="tags"
            name="tags"
            defaultValue={values.tags}
            onChange={() => setDirty(true)}
            placeholder="Laravel, React, Stripe"
            className={adminInputClass}
          />
        </AdminField>

        <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
          <AdminField
            label="Live URL"
            htmlFor="live_link"
            error={state.fieldErrors?.live_link}
            hint="Where the “Visit site” button points."
          >
            <input
              id="live_link"
              name="live_link"
              type="url"
              inputMode="url"
              defaultValue={values.live_link}
              onChange={() => setDirty(true)}
              placeholder="https://example.com"
              className={adminInputClass}
            />
          </AdminField>

          <AdminField
            label="Display order"
            htmlFor="order_index"
            hint="Lower first"
            error={state.fieldErrors?.order_index}
          >
            <input
              id="order_index"
              name="order_index"
              type="number"
              defaultValue={values.order_index}
              onChange={() => setDirty(true)}
              className={adminInputClass}
            />
          </AdminField>
        </div>
      </AdminCard>

      <div className="grid content-start gap-5">
        <AdminCard className="p-6">
          <AdminField
            label="Cover image"
            htmlFor="image-url"
            error={uploadError || state.fieldErrors?.image_url}
            hint="Upload a file or paste an image path."
          >
            <input
              id="image-url"
              name="image_url"
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                releaseLocalPreview();
                setDirty(true);
              }}
              placeholder="/images/projects/example.png"
              className={adminInputClass}
            />
          </AdminField>

          <div className="mt-4">
            {/*
              `relative` is REQUIRED, not cosmetic: `next/image` with `fill` renders the
              <img> as `position:absolute; inset:0`. Without a positioned ancestor this box
              resolves against the initial containing block, so the absolutely-positioned
              image escapes the Cover image field and stretches across the viewport.

              `block` + `aspect-[4/3]` gives the box a stable height before any image
              loads, and `max-h-[220px]` bounds it so a tall image can never grow the
              field. No `fixed` positioning and no viewport units are used.
            */}
            <span
              aria-hidden="true"
              className="relative mb-1.5 block aspect-[4/3] max-h-[220px] w-full overflow-hidden rounded-[16px] border border-white/10 bg-[#081522]"
            >
              {/*
                While the upload is in flight the picked file is shown via a transient
                blob: URL for instant feedback, then the stored path takes over once the
                action returns. `next/image` cannot take a `blob:` source and encoding the
                file as a data URL would stall the main thread, so that one branch is a
                plain <img> with explicit containment styles.
              */}
              {localPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={localPreview}
                  alt=""
                  className="block h-auto max-h-[220px] w-full max-w-full object-contain"
                  decoding="async"
                />
              ) : preview ? (
                <Image
                  src={preview}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  // Bounded by the `relative` wrapper above; `contain` keeps the whole
                  // cover visible instead of cropping it to a fill.
                  className="object-contain"
                />
              ) : (
                <span className="grid h-full place-items-center text-muted-soft">
                  <ImageOff className="size-6" />
                </span>
              )}
            </span>

            <div className="mt-3 flex gap-2">
              <label
                htmlFor="image-file"
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[14px] transition-colors hover:bg-white/[0.08] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan"
              >
                {uploading ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <Upload aria-hidden="true" className="size-4" />
                )}
                {uploading ? 'Uploading…' : 'Upload image'}
              </label>
              <input
                id="image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
                disabled={uploading}
                className="sr-only"
              />

              {imageUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setUploadError('');
                    releaseLocalPreview();
                    setDirty(true);
                  }}
                  aria-label="Clear image"
                  className="grid size-10 place-items-center rounded-[12px] border border-white/10 text-muted transition-colors hover:border-pink/35 hover:text-pink"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </div>

            <p className="mt-2 mb-0 text-[12px] text-muted-soft">
              JPG, PNG or WebP up to 8&nbsp;MB. Checked before upload.
            </p>
          </div>
        </AdminCard>

        {state.message ? (
          <AdminStatus tone={state.ok ? 'ok' : 'error'}>{state.message}</AdminStatus>
        ) : null}

        <button
          type="submit"
          disabled={pending || uploading}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue)_50%,var(--color-violet))] px-5 py-3.5 font-[850] text-[#04101a] shadow-[0_18px_55px_rgba(83,119,255,0.30)] transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save aria-hidden="true" className="size-4" />
              {isEdit ? 'Save changes' : 'Create project'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}