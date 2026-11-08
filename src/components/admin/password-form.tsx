"use client";

import { useActionState, useId, useState } from "react";
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
  const formId = useId();
  const hintId = `${formId}-hint`;

  return (
    <section className="admin-panel">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={formId}
        className="admin-panel__header w-full text-left"
      >
        <span className="admin-record-card__identity">
          <span className="admin-security-feature__icon" aria-hidden="true">
            <Icon name="key" className="h-4 w-4" />
          </span>
          <span>
            <span className="admin-panel__title">Change administrator password</span>
            <span className="admin-panel__subtitle">
              Changing it signs out every active session.
            </span>
          </span>
        </span>
        <span className="admin-icon-button" aria-hidden="true">
          <Icon
            name="arrowLeft"
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : "-rotate-90"}`}
          />
        </span>
      </button>

      <div id={formId} hidden={!open}>
        <form action={action} className="admin-panel__body admin-panel__body--divided">
          <div className="admin-form-grid admin-form-grid--three">
            <div>
              <label className="admin-field-label" htmlFor={`${formId}-current`}>
                Current password
              </label>
              <input
                id={`${formId}-current`}
                name="currentPassword"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-field-label" htmlFor={`${formId}-new`}>
                New password
              </label>
              <input
                id={`${formId}-new`}
                name="newPassword"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={14}
                aria-describedby={hintId}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-field-label" htmlFor={`${formId}-confirm`}>
                Confirm new password
              </label>
              <input
                id={`${formId}-confirm`}
                name="confirmation"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={14}
                aria-describedby={hintId}
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <div>
              <p id={hintId} className="admin-form-hint">
                Minimum 14 characters with uppercase, lowercase, number and symbol.
              </p>
              {state.error && (
                <p className="admin-alert admin-alert--danger mt-4" role="alert">
                  <Icon name="alert" className="h-3.5 w-3.5" aria-hidden="true" />
                  {state.error}
                </p>
              )}
            </div>
            <div className="admin-contact-actions">
              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                className="admin-icon-button"
                aria-label={show ? "Hide passwords" : "Show passwords"}
              >
                {show ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                )}
              </button>
              <button
                type="submit"
                disabled={pending}
                aria-busy={pending}
                className="admin-button admin-button--primary"
              >
                <Icon
                  name={pending ? "spinner" : "key"}
                  className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {pending ? "Updating…" : "Update password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
