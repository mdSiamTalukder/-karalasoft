'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, RotateCcw, Send } from 'lucide-react';

import { projectNeeds } from '@/lib/about';
import {
  emptyContactValues,
  hasErrors,
  MESSAGE_MIN,
  submitContactBrief,
  validateContactValues,
} from '@/lib/contact';
import { CONTACT_MESSAGE_HINT } from '@/lib/contact-page';
import type { ContactErrors, ContactStatus, ContactValues } from '@/lib/types';
import { Button } from '@/components/ui/Button';

const inputClass =
  'w-full rounded-[14px] border border-line bg-surface px-4 py-[15px] text-on-surface outline-none transition-shadow duration-200 placeholder:text-muted-soft/70 focus:border-cyan/40 focus:shadow-[0_0_0_4px_rgba(88,236,255,0.06)]';
const labelClass = 'mb-1.5 block text-[13px] font-semibold tracking-wide text-paper-3';
const errorClass = 'mt-1.5 flex items-center gap-1.5 text-[13px] text-pink';

function Field({
  id,
  label,
  error,
  hint,
  hideLabel = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  /** Keeps the label as the accessible name but removes it visually (e.g. when the
   *  control shows the same wording as its own placeholder). */
  hideLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={`${labelClass} ${hideLabel ? 'sr-only' : ''}`}>
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
 * Validation runs on submit and clears per-field as the visitor types.
 *
 * Submits to `POST /api/contact`, which validates server-side and emails the brief via
 * Resend. Nothing is stored. A honeypot field is included purely as a spam brake.
 */
export function ContactForm() {
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const submitting = status === 'submitting';

  /**
   * Live count for the brief field. Read from the same `MESSAGE_MIN` constant that
   * `validateContactValues` enforces, so the counter can never disagree with validation.
   */
  const messageLength = values.message.trim().length;
  const messageTooShort = messageLength > 0 && messageLength < MESSAGE_MIN;

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

    // Forward whatever is currently in the hidden honeypot input. Real visitors never
    // see it so it stays empty; automated form-fillers that complete every field trip
    // the server-side check.
    const honeypotField = formRef.current?.elements.namedItem('website');
    const honeypot =
      honeypotField instanceof HTMLInputElement ? honeypotField.value : '';

    const result = await submitContactBrief(values, honeypot);

    // Only clear the visitor's work after the API confirms delivery.
    if (result.ok) {
      setStatus('success');
      setFeedback(result.message ?? "Thanks! Your message has been sent successfully. We'll get back to you soon.");
      setValues(emptyContactValues);
      setErrors({});
    } else {
      setStatus('error');
      setFeedback(result.message ?? 'Something went wrong while sending your message. Please try again.');
    }
  }

  function resetForm() {
    setStatus('idle');
    setFeedback('');
    setErrors({});
    setValues(emptyContactValues);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="relative grid gap-4"
    >
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

      {/* `hideLabel` — the control displays "What do you need?" itself as its
              placeholder, so the label is kept only as the accessible name. */}
      <Field id={fieldId('need')} label="What do you need?" hideLabel error={errors.need}>
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
          {/* Placeholder entry: empty value so it can never validate as a choice. */}
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
        hint={CONTACT_MESSAGE_HINT}
      >
        <textarea
          id={fieldId('message')}
          name="message"
          rows={7}
          required
          className={`${inputClass} min-h-[170px] resize-y`}
          placeholder="What are you building, who is it for, and what should it do?"
          value={values.message}
          onChange={(event) => setField('message', event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${fieldId('message')}-error` : `${fieldId('message')}-hint`
          }
        />

        {/*
          Character counter. `aria-live="polite"` so the count is announced as the visitor
          types, and it stays a plain readout — it never blocks or replaces the validation
          message shown above it.
        */}
        <p
          aria-live="polite"
          className={`mt-1.5 text-right text-[12px] tabular-nums ${
            messageTooShort ? 'text-muted-soft' : 'text-muted'
          }`}
        >
          {messageLength} {messageLength === 1 ? 'character' : 'characters'}
          {messageTooShort ? (
            <span className="text-muted-soft"> · {MESSAGE_MIN} minimum</span>
          ) : null}
        </p>
      </Field>

      {/*
        Honeypot — off-screen, not focusable and hidden from assistive technology, so it is
        invisible to humans. Automated fillers that complete every input get flagged by the
        server, which then discards the submission without sending an email.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={fieldId('website')}>Website</label>
        <input
          id={fieldId('website')}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

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
                {feedback ??
                  "Thanks! Your message has been sent successfully. We'll get back to you soon."}
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
    </form>
  );
}