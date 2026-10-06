'use client';

import Image from 'next/image';
import { useActionState, useEffect, useState, useTransition } from 'react';
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
  const [uploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState('');
  const [dirty, setDirty] = useState(false);

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

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-picking the same file
    if (!file) return;

    setUploadError('');
    startUpload(async () => {
      const data = new FormData();
      data.set('image', file);
      const result = await uploadImageAction(data);
      if (result.ok && result.redirectTo) {
        setImageUrl(result.redirectTo);
        setDirty(true);
      } else {
        setUploadError(result.message);
      }
    });
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
                setDirty(true);
              }}
              placeholder="/images/projects/example.png"
              className={adminInputClass}
            />
          </AdminField>

          <div className="mt-4">
            <span
              aria-hidden="true"
              className="mb-1.5 block aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-white/10 bg-[#081522]"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-cover"
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
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="sr-only"
              />

              {imageUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
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
              JPG, PNG or WebP up to 8&nbsp;MB.
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