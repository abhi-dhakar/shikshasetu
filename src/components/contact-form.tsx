"use client";

import { useState } from "react";
import { CONTACT_TOPICS } from "@/lib/constants";
import { isEmail, isPhone } from "@/lib/validation";
import { Icon } from "@/components/icons";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Required";
    if (!isPhone(form.phone)) e.phone = "Enter a valid 10 digit number.";
    if (form.email && !isEmail(form.email)) e.email = "Enter a valid email.";
    if (!form.topic) e.topic = "Please select a topic.";
    if (!form.message) e.message = "Please write a short message.";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? { message: "Could not send. Please try again." });
        return;
      }
      setDone(true);
    } catch {
      setErrors({ message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="animate-slide-in rounded-[1.5rem] border border-brand-900/10 bg-white p-10 text-center shadow-[var(--shadow-soft)]">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="send" className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl text-brand-900">Message sent</h3>
        <p className="mt-3 text-[0.95rem] text-ink/62">
          Thanks {form.name.split(" ")[0]} — a coordinator will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-5 rounded-[1.5rem] border border-brand-900/10 bg-white p-7 shadow-[var(--shadow-soft)] sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <span className="field-label">
            Your name<span className="ml-1 text-accent-600">*</span>
          </span>
          <input
            className="field"
            value={form.name}
            placeholder="First and last name"
            aria-invalid={Boolean(errors.name)}
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && <Err>{errors.name}</Err>}
        </div>
        <div>
          <span className="field-label">
            Contact number<span className="ml-1 text-accent-600">*</span>
          </span>
          <input
            className="field"
            value={form.phone}
            inputMode="numeric"
            maxLength={10}
            placeholder="0000000000"
            aria-invalid={Boolean(errors.phone)}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
          {errors.phone ? <Err>{errors.phone}</Err> : <p className="field-hint">Format: 0000000000.</p>}
        </div>
        <div>
          <span className="field-label">Email address</span>
          <input
            className="field"
            type="email"
            value={form.email}
            placeholder="example@example.com"
            aria-invalid={Boolean(errors.email)}
            onChange={(e) => set("email", e.target.value)}
          />
          {errors.email && <Err>{errors.email}</Err>}
        </div>
        <div>
          <span className="field-label">
            Topic<span className="ml-1 text-accent-600">*</span>
          </span>
          <select
            className="field"
            value={form.topic}
            aria-invalid={Boolean(errors.topic)}
            onChange={(e) => set("topic", e.target.value)}
          >
            <option value="">Please Select</option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {errors.topic && <Err>{errors.topic}</Err>}
        </div>
      </div>
      <div>
        <span className="field-label">
          Message<span className="ml-1 text-accent-600">*</span>
        </span>
        <textarea
          className="field min-h-[8rem] resize-y"
          value={form.message}
          placeholder="Class, board, subjects and what you need help with…"
          aria-invalid={Boolean(errors.message)}
          onChange={(e) => set("message", e.target.value)}
        />
        {errors.message && <Err>{errors.message}</Err>}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-shine inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-3.5 text-[0.92rem] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <Icon name="spinner" className="h-4 w-4 animate-spin" />
        ) : (
          <Icon name="send" className="h-4 w-4" />
        )}
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[0.74rem] font-semibold text-[#c0343a]">{children}</p>;
}
