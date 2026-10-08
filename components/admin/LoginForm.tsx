'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

import { loginAction } from '@/app/admin/actions';
import type { ActionState } from '@/app/admin/actions';
import { AdminCard, adminInputClass } from '@/components/admin/ui';

/**
 * ------------------------------------------------------------------------------------
 * Admin sign-in form — presentation only.
 * ------------------------------------------------------------------------------------
 * The authentication path is untouched: this still submits `loginAction` via
 * `useActionState` with `name="email"` and `name="password"`, the server action still
 * validates, calls `loginAdmin`, stores the token and redirects to `/admin`, and every
 * message shown here still comes from the `ActionState` the server returns. Only the
 * markup, spacing and states around that behaviour are new.
 */

const initial: ActionState = { ok: false, message: '' };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [showPassword, setShowPassword] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full max-w-[440px]"
    >
      <AdminCard className="w-full p-6 sm:p-8">
        {/* ------------------------------------------------------------- branding */}
        <div className="mb-7 flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-[conic-gradient(from_180deg,var(--color-cyan),var(--color-blue),var(--color-violet),var(--color-pink),var(--color-cyan))] text-[#041018] text-lg font-black"
          >
            K
          </span>
          <div className="min-w-0">
            <p className="m-0 truncate text-[15px] leading-tight font-extrabold tracking-[-0.02em]">
              KaralaSoft
            </p>
            <p className="m-0 mt-0.5 text-[13px] leading-tight text-muted-soft">
              Admin Portal
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- copy */}
        <div className="mb-7">
          <h1 className="mt-0 mb-2 text-[26px] leading-tight tracking-[-0.03em]">
            Welcome back
          </h1>
          <p className="m-0 text-[15px] leading-relaxed text-muted">
            Sign in to continue to your admin dashboard.
          </p>
        </div>

        <form action={formAction} className="grid gap-4" noValidate aria-busy={pending}>
          {/* ----------------------------------------------------------- email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-paper-3">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                required
                placeholder="you@karalasoft.com"
                aria-invalid={Boolean(state.fieldErrors?.email)}
                aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
                className={`${adminInputClass} peer pl-11`}
              />
              {/* `peer` sits on the input above, so the icon reacts to its focus. */}
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-[17px] -translate-y-1/2 text-muted-soft transition-colors duration-200 peer-focus:text-cyan"
              />
            </div>
            {state.fieldErrors?.email ? (
              <p id="email-error" role="alert" className="mt-1.5 text-[13px] text-pink">
                {state.fieldErrors.email}
              </p>
            ) : null}
          </div>

          {/* -------------------------------------------------------- password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[13px] font-semibold text-paper-3"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className={`${adminInputClass} peer pr-12 pl-11`}
              />
              <Lock
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-[17px] -translate-y-1/2 text-muted-soft transition-colors duration-200 peer-focus:text-cyan"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                aria-controls="password"
                className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-[10px] text-muted-soft transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------ server error */}
          {state.message ? (
            <p
              role="alert"
              className="flex items-start gap-2.5 rounded-[14px] border border-pink/35 bg-pink/[0.08] px-4 py-3 text-[15px] text-pink"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{state.message}</span>
            </p>
          ) : null}

          {/* ------------------------------------------------------------ submit */}
          <button
            type="submit"
            disabled={pending}
            className="group/signin mt-1 flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue)_50%,var(--color-violet))] px-5 py-3.5 font-[850] text-[#04101a] shadow-[0_18px_55px_rgba(83,119,255,0.30)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_65px_rgba(83,119,255,0.38)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover/signin:translate-x-0.5"
                />
              </>
            )}
          </button>
        </form>

        {/* --------------------------------------------------------- back link */}
        <div className="mt-7 border-t border-white/10 pt-6">
          <Link
            href="/"
            className="group/back inline-flex items-center gap-2 rounded-[10px] text-[14px] text-muted transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover/back:-translate-x-0.5"
            />
            Back to KaralaSoft
          </Link>
        </div>
      </AdminCard>
    </motion.div>
  );
}
