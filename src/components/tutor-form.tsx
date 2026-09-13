"use client";

import { useState } from "react";
import {
  AREAS,
  BOARDS,
  CLASS_RANGES,
  EXPERIENCE_LEVELS,
  MODES,
  SUBJECT_POOL,
} from "@/lib/constants";
import { isEmail, isPhone } from "@/lib/validation";
import { Icon } from "@/components/icons";

export default function TutorForm() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    qualification: "",
    experience: "",
    classes: "",
    area: "",
    mode: "",
    about: "",
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const e: Record<string, string> = {};
    if (!form.fullName) e.fullName = "Required";
    if (!isPhone(form.phone)) e.phone = "Enter a valid 10 digit number.";
    if (form.email && !isEmail(form.email)) e.email = "Enter a valid email.";
    if (!form.qualification) e.qualification = "Required";
    if (!form.experience) e.experience = "Select your experience.";
    if (!form.classes) e.classes = "Select a class range.";
    if (!form.area) e.area = "Select your area.";
    if (!form.mode) e.mode = "Select a teaching mode.";
    if (subjects.length === 0) e.subjects = "Select at least one subject.";
    if (boards.length === 0) e.boards = "Select at least one board.";

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tutor-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subjects, boards }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        errors?: Record<string, string>;
        data?: { reference: string };
      };
      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? { fullName: "Please review your details." });
        return;
      }
      setReference(json.data?.reference ?? "SST");
      window.scrollTo({ top: 200, behavior: "smooth" });
    } catch {
      setErrors({ fullName: "Network error, please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="animate-slide-in rounded-[1.75rem] border border-brand-900/10 bg-white p-10 text-center shadow-[var(--shadow-soft)]">
        <span className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="success" className="h-9 w-9" />
        </span>
        <h2 className="mt-6 font-display text-[1.9rem] text-brand-900">
          Application received
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[0.96rem] leading-relaxed text-ink/65">
          Thanks {form.fullName.split(" ")[0]}! Your reference is{" "}
          <strong className="text-brand-900">{reference}</strong>. Our academic team will
          call you to schedule the subject knowledge test and mock teaching round.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-7 rounded-[1.75rem] border border-brand-900/10 bg-white p-7 shadow-[var(--shadow-soft)] sm:p-10"
    >
      <div>
        <h2 className="font-display text-[1.7rem] text-brand-900">
          Tutor registration form
        </h2>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-ink/60">
          Register once. Once you clear our four-stage screening, you receive one-to-one
          assignments in your locality, subjects and class range.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName}>
          <input
            className="field"
            value={form.fullName}
            placeholder="Your name as on ID"
            aria-invalid={Boolean(errors.fullName)}
            onChange={(e) => set("fullName", e.target.value)}
          />
        </Field>
        <Field label="Contact number" required error={errors.phone} hint="Format: 0000000000.">
          <input
            className="field"
            value={form.phone}
            inputMode="numeric"
            maxLength={10}
            placeholder="0000000000"
            aria-invalid={Boolean(errors.phone)}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
        </Field>
        <Field label="Email address" error={errors.email}>
          <input
            className="field"
            type="email"
            value={form.email}
            placeholder="example@example.com"
            aria-invalid={Boolean(errors.email)}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Highest qualification" required error={errors.qualification}>
          <input
            className="field"
            value={form.qualification}
            placeholder="e.g. M.Sc Physics, B.Ed"
            aria-invalid={Boolean(errors.qualification)}
            onChange={(e) => set("qualification", e.target.value)}
          />
        </Field>
        <Field label="Teaching experience" required error={errors.experience}>
          <select
            className="field"
            value={form.experience}
            onChange={(e) => set("experience", e.target.value)}
          >
            <option value="">Please Select</option>
            {EXPERIENCE_LEVELS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Class range you teach" required error={errors.classes}>
          <select
            className="field"
            value={form.classes}
            onChange={(e) => set("classes", e.target.value)}
          >
            <option value="">Please Select</option>
            {CLASS_RANGES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Your area in Surat" required error={errors.area}>
          <select
            className="field"
            value={form.area}
            onChange={(e) => set("area", e.target.value)}
          >
            <option value="">Please Select</option>
            {AREAS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred mode" required error={errors.mode}>
          <select
            className="field"
            value={form.mode}
            onChange={(e) => set("mode", e.target.value)}
          >
            <option value="">Please Select</option>
            {MODES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Subjects you can teach" required error={errors.subjects}>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_POOL.map((s) => {
            const active = subjects.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggle(subjects, setSubjects, s)}
                className={`rounded-full border px-4 py-2 text-[0.83rem] font-semibold transition-all duration-250 ${
                  active
                    ? "border-brand-900 bg-brand-900 text-white"
                    : "border-[#dfd7c9] text-brand-900 hover:-translate-y-0.5 hover:border-brand-400"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Boards you are comfortable with" required error={errors.boards}>
        <div className="flex flex-wrap gap-2">
          {BOARDS.map((b) => {
            const active = boards.includes(b);
            return (
              <button
                type="button"
                key={b}
                onClick={() => toggle(boards, setBoards, b)}
                className={`rounded-full border px-4 py-2 text-[0.83rem] font-semibold transition-all duration-250 ${
                  active
                    ? "border-accent-500 bg-accent-500 text-white"
                    : "border-[#dfd7c9] text-brand-900 hover:-translate-y-0.5 hover:border-accent-400"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Tell us about your teaching approach">
        <textarea
          className="field min-h-[7rem] resize-y"
          value={form.about}
          placeholder="Schools/institutes you have taught at, results you are proud of, availability…"
          onChange={(e) => set("about", e.target.value)}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="btn-shine inline-flex items-center gap-3 rounded-full bg-brand-900 px-9 py-4 text-[0.93rem] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <Icon name="spinner" className="h-4 w-4 animate-spin" />
        ) : (
          <Icon name="send" className="h-4 w-4" />
        )}
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="field-label">
        {label}
        {required && <span className="ml-1 text-accent-600">*</span>}
      </span>
      {children}
      {error ? (
        <p className="mt-1.5 text-[0.74rem] font-semibold text-[#c0343a]">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}
