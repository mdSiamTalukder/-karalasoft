'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, RotateCcw, Send } from 'lucide-react';

import { projectNeeds } from '@/lib/about';
import {
  emptyContactValues,
  hasErrors,
  isContactEndpointConfigured,
  submitContactBrief,
  validateContactValues,
} from '@/lib/contact';
import type { ContactErrors, ContactStatus, ContactValues } from '@/lib/types';
import { Button } from '@/components/ui/Button';

const inputClass =
  'w-full rounded-[14px] border border-line bg-[#081522] px-4 py-[15px] text-white outline-none transition-shadow duration-200 placeholder:text-muted-soft/70 focus:border-cyan/40 focus:shadow-[0_0_0_4px_rgba(88,236,255,0.06)]';
const labelClass = 'mb-1.5 block text-[13px] font-semibold tracking-wide text-paper-3';
const errorClass = 'mt-1.5 flex items-center gap-1.5 text-[13px] text-pink';

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={errorClass}>
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Controlled project-brief form.
 *
 * States: `idle` → `submitting` → `success` | `error`
 * Validation runs on submit and re-validates a field once it has been touched.
 *
 * There is no backend. `submitContactBrief()` POSTs to `NEXT_PUBLIC_CONTACT_ENDPOINT`
 * when configured and otherwise resolves in preview mode.
 */
export function ContactForm() {
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [wasPreview, setWasPreview] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const configured = isContactEndpointConfigured();
  const submitting = status === 'submitting';

  function setField(name: keyof ContactValues, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => {
        const next: ContactErrors = { ...previous };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validateContactValues(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setStatus('error');
      setFeedback('Please fix the highlighted fields and try again.');
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) {
        formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstInvalid))}`)?.focus();
      }
      return;
    }

    setStatus('submitting');
    setFeedback('');

    const result = await submitContactBrief(values);

    if (result.ok) {
      setStatus('success');
      setWasPreview(result.preview);
      setValues(emptyContactValues);
      setErrors({});
    } else {
      setStatus('error');
      setFeedback(result.message ?? 'Something went wrong. Please try again.');
    }
  }

  function resetForm() {
    setStatus('idle');
    setFeedback('');
    setWasPreview(false);
    setErrors({});
    setValues(emptyContactValues);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-3">
      <Field id={fieldId('name')} label="Your name" error={errors.name}>
        <input
          id={fieldId('name')}
          name="name"
          type="text"
          autoComplete="name"
          required
          className={inputClass}
          placeholder="Your name"
          value={values.name}
          onChange={(event) => setField('name', event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${fieldId('name')}-error` : undefined}
        />
      </Field>

      <Field id={fieldId('email')} label="Work email" error={errors.email}>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          className={inputClass}
          placeholder="Work email"
          value={values.email}
          onChange={(event) => setField('email', event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${fieldId('email')}-error` : undefined}
        />
      </Field>

      <Field id={fieldId('company')} label="Company" hint="Optional">
        <input
          id={fieldId('company')}
          name="company"
          type="text"
          autoComplete="organization"
          className={inputClass}
          placeholder="Company"
          value={values.company}
          onChange={(event) => setField('company', event.target.value)}
          aria-describedby={`${fieldId('company')}-hint`}
        />
      </Field>

      <Field id={fieldId('need')} label="What do you need?" error={errors.need}>
        <select
          id={fieldId('need')}
          name="need"
          required
          className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a7bd%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-11`}
          value={values.need}
          onChange={(event) => setField('need', event.target.value)}
          aria-invalid={Boolean(errors.need)}
          aria-describedby={errors.need ? `${fieldId('need')}-error` : undefined}
        >
          {projectNeeds.map((need, index) => (
            <option key={need} value={index === 0 ? '' : need} disabled={index === 0}>
              {need}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={fieldId('message')}
        label="Project brief"
        error={errors.message}
        hint="At least 20 characters — goals, users, timeline."
      >
        <textarea
          id={fieldId('message')}
          name="message"
          rows={6}
          required
          className={`${inputClass} min-h-[150px] resize-y`}
          placeholder="What are you trying to build?"
          value={values.message}
          onChange={(event) => setField('message', event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${fieldId('message')}-error` : `${fieldId('message')}-hint`}
        />
      </Field>

      <div className="mt-1 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={submitting} className="min-w-[210px]">
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send aria-hidden="true" className="size-4" />
              Send Project Brief <span aria-hidden="true">→</span>
            </>
          )}
        </Button>

        {status === 'success' || status === 'error' ? (
          <Button type="button" variant="ghost" onClick={resetForm}>
            <RotateCcw aria-hidden="true" className="size-4" />
            New brief
          </Button>
        ) : null}
      </div>

      {/* Live region so screen readers hear the outcome of the submission. */}
      <div aria-live="polite" role="status" className="min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'success' ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-3 flex items-start gap-2.5 rounded-[14px] border border-lime/30 bg-lime/[0.07] px-4 py-3.5 text-[15px] text-lime"
            >
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                {wasPreview
                  ? 'Preview only — the form validated correctly but no endpoint is configured yet. Set NEXT_PUBLIC_CONTACT_ENDPOINT to deliver briefs.'
                  : 'Thanks — your brief is in. We’ll reply to your work email shortly.'}
              </span>
            </motion.p>
          ) : null}

          {status === 'error' && feedback ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-3 flex items-start gap-2.5 rounded-[14px] border border-pink/35 bg-pink/[0.08] px-4 py-3.5 text-[15px] text-pink"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{feedback}</span>
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {!configured && status !== 'success' ? (
        <p className="mt-1 text-[13px] text-muted-soft">
          Preview mode: no submission endpoint is configured, so nothing is stored or sent.
        </p>
      ) : null}
    </form>
  );
}