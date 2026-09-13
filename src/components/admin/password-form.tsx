"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changePasswordAction, type PasswordState } from "@/app/admin/actions";
import { Icon } from "@/components/icons";

export default function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(
    changePasswordAction,
    {},
  );
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border border-brand-900/10 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-sand/40"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Icon name="key" className="h-4 w-4" />
          </span>
          <span>
            <span className="block font-display text-[1.05rem] text-brand-900">
              Change administrator password
            </span>
            <span className="mt-0.5 block text-[0.75rem] text-ink/45">
              Changing it signs out every active session.
            </span>
          </span>
        </span>
        <span
          className={`grid h-8 w-8 place-items-center rounded-full border border-brand-900/15 text-brand-900 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <Icon name="arrowLeft" className="h-3.5 w-3.5 -rotate-90" />
        </span>
      </button>

      <div
        className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <form action={action} className="border-t border-brand-900/8 px-5 py-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <label>
                <span className="field-label">Current password</span>
                <input
                  name="currentPassword"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="field"
                />
              </label>
              <label>
                <span className="field-label">New password</span>
                <input
                  name="newPassword"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={14}
                  className="field"
                />
              </label>
              <label>
                <span className="field-label">Confirm new password</span>
                <input
                  name="confirmation"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={14}
                  className="field"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] text-ink/45">
                  Minimum 14 characters with uppercase, lowercase, number and symbol.
                </p>
                {state.error && (
                  <p className="mt-1 flex items-center gap-2 text-[0.76rem] font-semibold text-rose-700">
                    <Icon name="alert" className="h-3.5 w-3.5" />
                    {state.error}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShow((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-brand-900/15 text-ink/55 transition-colors hover:bg-sand hover:text-brand-900"
                  aria-label={show ? "Hide passwords" : "Show passwords"}
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.8} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.8} />
                  )}
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-5 py-3 text-[0.8rem] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                >
                  <Icon
                    name={pending ? "spinner" : "key"}
                    className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`}
                  />
                  {pending ? "Updating…" : "Update password"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
