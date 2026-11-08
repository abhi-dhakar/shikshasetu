"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
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
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  return (
    <div className="admin-auth__panel">
      {passwordChanged && (
        <p className="admin-alert admin-alert--success" role="status">
          <Icon name="success" className="h-4 w-4 shrink-0" aria-hidden="true" />
          Password updated. All previous sessions were signed out. Use your new password.
        </p>
      )}

      <div className="admin-auth__card">
        <div className="admin-auth__heading">
          <h2>Sign in</h2>
          <p>Use your administrator credentials to open the console.</p>
        </div>

        <form action={formAction} className="admin-auth__form">
          <input type="hidden" name="next" value={next} />

          <div>
            <label className="admin-field-label" htmlFor={`${fieldId}-username`}>
              Username
            </label>
            <div className="admin-auth__input-wrap">
              <Icon
                name="tutor"
                className="admin-auth__input-icon"
                aria-hidden="true"
              />
              <input
                id={`${fieldId}-username`}
                name="username"
                autoComplete="username"
                required
                placeholder="Your admin username"
                aria-describedby={state.error ? errorId : undefined}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="admin-field-label" htmlFor={`${fieldId}-password`}>
              Password
            </label>
            <div className="admin-auth__input-wrap admin-auth__password">
              <Icon
                name="key"
                className="admin-auth__input-icon"
                aria-hidden="true"
              />
              <input
                id={`${fieldId}-password`}
                name="password"
                type={reveal ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••••"
                aria-describedby={state.error ? errorId : undefined}
                className="admin-input"
              />
              <button
                type="button"
                onClick={() => setReveal((value) => !value)}
                aria-label={reveal ? "Hide password" : "Show password"}
                className="admin-auth__reveal"
              >
                {reveal ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {state.error && (
            <p id={errorId} className="admin-alert admin-alert--danger" role="alert">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="admin-button admin-button--primary admin-auth__submit"
          >
            {pending ? (
              <Icon name="spinner" className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Icon name="lock" className="h-4 w-4" aria-hidden="true" />
            )}
            {pending ? "Verifying…" : "Sign in securely"}
          </button>
        </form>

        <p className="admin-auth__policy">
          <Icon name="shield" className="h-3.5 w-3.5" aria-hidden="true" />
          8-hour signed sessions · 5-attempt lockout
        </p>
      </div>

      <Link href="/" className="admin-auth__footer">
        <Icon name="arrowLeft" className="h-4 w-4" aria-hidden="true" />
        Back to website
      </Link>
    </div>
  );
}
