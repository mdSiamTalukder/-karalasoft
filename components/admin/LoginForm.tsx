'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';

import { loginAction } from '@/app/admin/actions';
import type { ActionState } from '@/app/admin/actions';
import { AdminCard, adminInputClass } from '@/components/admin/ui';

const initial: ActionState = { ok: false, message: '' };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AdminCard className="w-full max-w-[440px] p-6 sm:p-8">
      <div className="mb-7">
        <span
          aria-hidden="true"
          className="grid size-[46px] place-items-center rounded-[14px] bg-[conic-gradient(from_180deg,var(--color-cyan),var(--color-blue),var(--color-violet),var(--color-pink),var(--color-cyan))] text-[#041018] text-lg font-black"
        >
          K
        </span>
        <h1 className="mt-5 mb-2 text-[26px] leading-tight tracking-[-0.03em]">
          Admin sign in
        </h1>
        <p className="m-0 text-[15px] text-muted">
          Use your KaralaSoft admin credentials to manage projects.
        </p>
      </div>

      <form action={formAction} className="grid gap-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-paper-3">
            Email
          </label>
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
            className={adminInputClass}
          />
          {state.fieldErrors?.email ? (
            <p id="email-error" role="alert" className="mt-1.5 text-[13px] text-pink">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-paper-3">
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
              className={`${adminInputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-[10px] text-muted transition-colors hover:bg-white/10 hover:text-white"
            >
              {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </div>

        {state.message ? (
          <p role="alert" className="rounded-[14px] border border-pink/35 bg-pink/[0.08] px-4 py-3 text-[15px] text-pink">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue)_50%,var(--color-violet))] px-5 py-3.5 font-[850] text-[#04101a] shadow-[0_18px_55px_rgba(83,119,255,0.30)] transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Logging in…
            </>
          ) : (
            <>
              <LogIn aria-hidden="true" className="size-4" />
              Sign in
            </>
          )}
        </button>
      </form>
    </AdminCard>
  );
}