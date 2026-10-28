
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  X,
  Save,
  LoaderCircle,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

type AppItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  features: string[];
  website_url: string | null;
  play_store_url: string | null;
  apk_download_url: string | null;
  status: 'Demo' | 'Published';
  is_published: boolean;
  order_index: number;
};

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#0a1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400';

const initialForm = {
  name: '',
  slug: '',
  category: '',
  short_description: '',
  description: '',
  features: '',
  website_url: '',
  play_store_url: '',
  apk_download_url: '',
  is_published: true,
  order_index: 0,
};

type AppForm = typeof initialForm;

export default function AdminAppsManager({ apps }: { apps: AppItem[] }) {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [form, setForm] = useState<AppForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyAppId, setBusyAppId] = useState<string | null>(null);

  const updateField = (
    field: keyof AppForm,
    value: string | number | boolean,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  function openAddForm() {
    setError('');
    setSuccess('');
    setEditingApp(null);
    setForm(initialForm);
    setShowForm(true);
  }

  function openEditForm(app: AppItem) {
    setError('');
    setSuccess('');
    setEditingApp(app);

    setForm({
      name: app.name,
      slug: app.slug,
      category: app.category ?? '',
      short_description: app.short_description ?? '',
      description: app.description ?? '',
      features: Array.isArray(app.features) ? app.features.join('\n') : '',
      website_url: app.website_url ?? '',
      play_store_url: app.play_store_url ?? '',
      apk_download_url: app.apk_download_url ?? '',
      is_published: app.is_published,
      order_index: app.order_index ?? 0,
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingApp(null);
    setForm(initialForm);
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category.trim() || 'Other',
        shortDescription: form.short_description.trim(),
        description: form.description.trim(),
        features: form.features
          .split('\n')
          .map((feature) => feature.trim())
          .filter(Boolean),
        websiteUrl: form.website_url.trim() || null,
        playStoreUrl: form.play_store_url.trim() || null,
        apkDownloadUrl: form.apk_download_url.trim() || null,
        isPublished: form.is_published,
        orderIndex: Number(form.order_index),
      };

      const response = await fetch(
        editingApp ? `/api/apps/${editingApp.id}` : '/api/apps',
        {
          method: editingApp ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            editingApp
              ? payload
              : {
                  ...payload,
                  status: 'Published',
                },
          ),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            `Failed to ${editingApp ? 'update' : 'create'} app.`,
        );
      }

      setSuccess(
        editingApp
          ? `${form.name.trim()} updated successfully.`
          : 'App added successfully.',
      );

      setShowForm(false);
      setEditingApp(null);
      setForm(initialForm);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(app: AppItem) {
    setError('');
    setSuccess('');
    setBusyAppId(app.id);

    try {
      const response = await fetch(`/api/apps/${app.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !app.is_published,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || result?.message || 'Failed to update app.',
        );
      }

      setSuccess(
        `${app.name} ${app.is_published ? 'unpublished' : 'published'} successfully.`,
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setBusyAppId(null);
    }
  }

  async function deleteApp(app: AppItem) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${app.name}"?`,
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setBusyAppId(app.id);

    try {
      const response = await fetch(`/api/apps/${app.id}`, {
        method: 'DELETE',
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || result?.message || 'Failed to delete app.',
        );
      }

      setSuccess(`${app.name} deleted successfully.`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setBusyAppId(null);
    }
  }

  const actionButtonClass =
    'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Total Apps</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {apps.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Published</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-300">
            {apps.filter((app) => app.is_published).length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Unpublished</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {apps.filter((app) => !app.is_published).length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">App Catalogue</h2>
          <p className="mt-1 text-sm text-slate-400">
            Add and manage your applications.
          </p>
        </div>

        <button
          type="button"
          onClick={showForm ? closeForm : openAddForm}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close Form' : 'Add New App'}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300"
        >
          {success}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
        >
          <h3 className="text-lg font-semibold text-white">
            {editingApp ? 'Edit Application' : 'Add New Application'}
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              App Name *
              <input
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. FlowDesk"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Slug
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="e.g. flowdesk-demo"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Category *
              <input
                required
                className={inputClass}
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="Productivity, Business, etc."
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Display Order
              <input
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={form.order_index}
                onChange={(e) =>
                  updateField('order_index', Number(e.target.value) || 0)
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Short Description *
              <input
                required
                maxLength={300}
                className={inputClass}
                value={form.short_description}
                onChange={(e) =>
                  updateField('short_description', e.target.value)
                }
                placeholder="A short introduction to your app"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Full Description *
              <textarea
                required
                rows={4}
                className={inputClass}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe what the app does..."
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Features (one per line)
              <textarea
                rows={4}
                className={inputClass}
                value={form.features}
                onChange={(e) => updateField('features', e.target.value)}
                placeholder={'Task management\nTeam collaboration\nReports'}
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Website URL
              <input
                type="url"
                className={inputClass}
                value={form.website_url}
                onChange={(e) => updateField('website_url', e.target.value)}
                placeholder="https://example.com"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Google Play Store URL
              <input
                type="url"
                className={inputClass}
                value={form.play_store_url}
                onChange={(e) =>
                  updateField('play_store_url', e.target.value)
                }
                placeholder="https://play.google.com/..."
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              APK Download URL
              <input
                type="url"
                className={inputClass}
                value={form.apk_download_url}
                onChange={(e) =>
                  updateField('apk_download_url', e.target.value)
                }
                placeholder="https://example.com/app.apk"
              />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                updateField('is_published', e.target.checked)
              }
              className="size-4 accent-cyan-400"
            />
            Publish this app immediately
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving
                ? 'Saving...'
                : editingApp
                  ? 'Update App'
                  : 'Save App'}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        {apps.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-white">No apps yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Click “Add New App” to create your first application.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {apps.map((app) => {
              const isBusy = busyAppId === app.id;

              return (
                <div
                  key={app.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{app.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          app.is_published
                            ? 'bg-emerald-400/10 text-emerald-300'
                            : 'bg-amber-400/10 text-amber-300'
                        }`}
                      >
                        {app.is_published ? 'Published' : 'Unpublished'}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                      {app.category} · /apps/{app.slug}
                    </p>

                    <p className="mt-2 text-sm text-slate-300">
                      {app.short_description}
                    </p>

                    {app.website_url && (
                      <a
                        href={app.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200"
                      >
                        View live app ↗
                      </a>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      title="Edit app"
                      aria-label={`Edit ${app.name}`}
                      disabled={isBusy || saving}
                      onClick={() => openEditForm(app)}
                      className={`${actionButtonClass} border-cyan-400/20 text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      title={app.is_published ? 'Unpublish app' : 'Publish app'}
                      aria-label={`${app.is_published ? 'Unpublish' : 'Publish'} ${app.name}`}
                      disabled={isBusy || saving}
                      onClick={() => togglePublished(app)}
                      className={`${actionButtonClass} border-white/10 text-slate-300 hover:bg-white/5 hover:text-white`}
                    >
                      {isBusy ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : app.is_published ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Delete app"
                      aria-label={`Delete ${app.name}`}
                      disabled={isBusy || saving}
                      onClick={() => deleteApp(app)}
                      className={`${actionButtonClass} border-red-400/20 text-red-300 hover:bg-red-400/10 hover:text-red-200`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
