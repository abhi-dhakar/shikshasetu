"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Icon } from "@/components/icons";
import { loginAction, type LoginState } from "./actions";

export default function LoginForm({
  next,
  passwordChanged = false,
}: {
  next: string;
  passwordChanged?: boolean;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );
  const [reveal, setReveal] = useState(false);

  return (
    <div className="relative w-full max-w-md animate-slide-in">
      <div className="mb-7 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-900 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <path d="M4 20 16 6l12 14-12 5z" fill="#ff7a18" />
            <path
              d="M9 21.5v4.2c0 .5.3.9.7 1.1 4 1.9 8.6 1.9 12.6 0 .4-.2.7-.6.7-1.1v-4.2L16 24.8z"
              fill="#ffc93c"
            />
          </svg>
        </span>
        <h1 className="mt-5 font-display text-[1.85rem] leading-tight text-white">
          Admin sign in
        </h1>
        <p className="mt-2 text-[0.9rem] text-white/55">
          ShikshaSetu Surat · restricted enquiry desk
        </p>
      </div>

      {passwordChanged && (
        <p className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-[0.83rem] font-semibold text-emerald-200">
          <Icon name="success" className="mt-0.5 h-4 w-4 shrink-0" />
          Password updated. All previous sessions were signed out; use your new password.
        </p>
      )}

      <form
        action={formAction}
        className="rounded-[1.6rem] border border-white/12 bg-white/[0.06] p-7 backdrop-blur-xl"
      >
        <input type="hidden" name="next" value={next} />

        <label className="block">
          <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/55">
            Username
          </span>
          <div className="relative">
            <Icon
              name="tutor"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            />
            <input
              name="username"
              autoComplete="username"
              required
              placeholder="Your admin username"
              className="w-full rounded-xl border border-white/15 bg-brand-950/50 py-3 pl-10 pr-3.5 text-[0.95rem] text-white placeholder:text-white/30 transition-all focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-500/20"
            />
          </div>
        </label>

        <label className="mt-5 block">
          <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/55">
            Password
          </span>
          <div className="relative">
            <Icon
              name="key"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            />
            <input
              name="password"
              type={reveal ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••••"
              className="w-full rounded-xl border border-white/15 bg-brand-950/50 py-3 pl-10 pr-11 text-[0.95rem] text-white placeholder:text-white/30 transition-all focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-500/20"
            />
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/10 hover:text-white"
            >
              {reveal ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.8} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </label>

        {state.error && (
          <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-[0.83rem] font-semibold text-red-200">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-shine mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent-500 py-3.5 text-[0.93rem] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? (
            <Icon name="spinner" className="h-4 w-4 animate-spin" />
          ) : (
            <Icon name="lock" className="h-4 w-4" />
          )}
          {pending ? "Verifying…" : "Sign in securely"}
        </button>

        <p className="mt-5 flex items-center justify-center gap-2 text-[0.74rem] text-white/40">
          <Icon name="shield" className="h-3.5 w-3.5" />
          Signed HMAC session · 8 hour expiry · 5 attempt lockout
        </p>
      </form>

      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-2 text-[0.85rem] font-semibold text-white/50 transition-colors hover:text-white"
      >
        <Icon name="arrowLeft" className="h-4 w-4" />
        Back to website
      </Link>
    </div>
  );
}
