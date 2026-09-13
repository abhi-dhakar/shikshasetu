"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppointmentScheduler from "./appointment-scheduler";
import { BOARDS, MODES, SITE, STANDARDS } from "@/lib/constants";
import { isEmail, isPhone } from "@/lib/validation";
import { Icon, WhatsAppIcon, type IconName } from "@/components/icons";

type Form = {
  parentFirstName: string;
  parentLastName: string;
  childFirstName: string;
  childLastName: string;
  standard: string;
  board: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  schoolName: string;
  mode: string;
  preferredDate: string;
  preferredSlot: string;
  altDate: string;
  altHour: string;
  altMinute: string;
  altMeridiem: string;
  comments: string;
};

const EMPTY: Form = {
  parentFirstName: "",
  parentLastName: "",
  childFirstName: "",
  childLastName: "",
  standard: "",
  board: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "Surat",
  state: "Gujarat",
  postalCode: "",
  schoolName: "",
  mode: "",
  preferredDate: "",
  preferredSlot: "",
  altDate: "",
  altHour: "",
  altMinute: "",
  altMeridiem: "PM",
  comments: "",
};

const STEPS = [
  { id: 1, label: "Student details" },
  { id: 2, label: "Contact & address" },
  { id: 3, label: "Pick your slot" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, "0"));
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

export default function DemoForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const progress = useMemo(() => (step / STEPS.length) * 100, [step]);

  const validateStep = (target: number) => {
    const e: Record<string, string> = {};
    if (target >= 1) {
      if (!form.parentFirstName) e.parentFirstName = "Required";
      if (!form.parentLastName) e.parentLastName = "Required";
      if (!form.childFirstName) e.childFirstName = "Required";
      if (!form.childLastName) e.childLastName = "Required";
      if (!form.standard) e.standard = "Please select a standard.";
      if (!form.board) e.board = "Please select a board.";
    }
    if (target >= 2) {
      if (!isPhone(form.phone))
        e.phone = "Please enter a valid phone number. Format: 0000000000.";
      if (form.email && !isEmail(form.email))
        e.email = "Please enter a valid email address.";
      if (!form.addressLine1) e.addressLine1 = "Street address is required.";
      if (!form.city) e.city = "City is required.";
      if (!form.state) e.state = "State is required.";
      if (!/^[0-9]{6}$/.test(form.postalCode))
        e.postalCode = "Enter a valid 6 digit PIN code.";
      if (!form.mode) e.mode = "Please select a mode.";
    }
    if (target >= 3) {
      if (!form.preferredDate || !form.preferredSlot)
        e.preferredSlot = "Please select a date and an appointment time.";
    }
    return e;
  };

  const goNext = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length));
    window.scrollTo({ top: 160, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 160, behavior: "smooth" });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const e = validateStep(3);
    if (Object.keys(e).length) {
      setErrors(e);
      if (e.parentFirstName || e.standard || e.board) setStep(1);
      else if (e.phone || e.addressLine1 || e.mode || e.postalCode) setStep(2);
      return;
    }

    setSubmitting(true);
    setServerError("");
    const altTime =
      form.altHour && form.altMinute
        ? `${form.altHour}:${form.altMinute} ${form.altMeridiem}`
        : "";

    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, altTime }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        errors?: Record<string, string>;
        error?: string;
        data?: { reference: string };
      };
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        setServerError(json.error ?? "Please review the highlighted fields.");
        return;
      }
      setReference(json.data?.reference ?? "SSD");
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch {
      setServerError("Network error. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="animate-slide-in rounded-[1.75rem] border border-brand-900/10 bg-white p-9 text-center shadow-[var(--shadow-soft)] sm:p-14">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="celebrate" className="h-9 w-9" />
        </span>
        <h2 className="mt-7 font-display text-[2rem] leading-tight text-brand-900">
          Your demo lecture is requested!
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[0.98rem] leading-relaxed text-ink/65">
          Thank you, {form.parentFirstName}. Our academic coordinator will call{" "}
          <strong className="text-brand-900">{form.phone}</strong> within a few working
          hours to confirm the tutor match for {form.childFirstName}.
        </p>
        <div className="mx-auto mt-7 grid max-w-md gap-3 rounded-2xl border border-brand-900/10 bg-sand p-5 text-left text-[0.88rem]">
          {[
            ["Reference", reference],
            ["Student", `${form.childFirstName} ${form.childLastName} · ${form.standard}`],
            ["Board", form.board],
            ["Mode", form.mode],
            [
              "Demo slot",
              `${new Date(`${form.preferredDate}T00:00:00`).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })} · ${form.preferredSlot}`,
            ],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <span className="text-ink/50">{k}</span>
              <span className="text-right font-semibold text-brand-900">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={SITE.whatsapp}
            className="btn-shine inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp us the details
          </a>
          <Link
            href="/"
            className="rounded-full border border-brand-900/20 px-6 py-3 text-sm font-bold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-white shadow-[var(--shadow-soft)]"
    >
      {/* header */}
      <div className="relative overflow-hidden bg-brand-950 px-7 py-8 text-white sm:px-10">
        <div className="dotted pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative">
          <h2 className="font-display text-[1.8rem] leading-tight sm:text-[2.15rem]">
            Book a Free Demo lecture with us
          </h2>
          <p className="mt-3 max-w-2xl text-[0.94rem] leading-relaxed text-white/70">
            Thank you for your interest in {SITE.short}! Please fill out this form to help
            us understand your child&apos;s needs and schedule a demo lecture.
          </p>

          <div className="mt-7">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-500 to-gold transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {STEPS.map((s) => (
                <li
                  key={s.id}
                  className={`flex items-center gap-2 text-[0.78rem] font-semibold transition-colors ${
                    s.id === step
                      ? "text-white"
                      : s.id < step
                        ? "text-gold"
                        : "text-white/40"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border text-[0.68rem] ${
                      s.id === step
                        ? "border-white bg-white text-brand-900"
                        : s.id < step
                          ? "border-gold bg-gold text-brand-900"
                          : "border-white/30"
                    }`}
                  >
                    {s.id < step ? <Icon name="check" className="h-3.5 w-3.5" /> : s.id}
                  </span>
                  {s.label}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="px-7 py-9 sm:px-10">
        {/* STEP 1 */}
        {step === 1 && (
          <div key="s1" className="animate-slide-in space-y-7">
            <FieldGroup label="Parent's full name" required>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="First Name"
                  value={form.parentFirstName}
                  onChange={(v) => set("parentFirstName", v)}
                  error={errors.parentFirstName}
                  sub="First Name"
                />
                <Input
                  placeholder="Last Name"
                  value={form.parentLastName}
                  onChange={(v) => set("parentLastName", v)}
                  error={errors.parentLastName}
                  sub="Last Name"
                />
              </div>
            </FieldGroup>

            <FieldGroup label="Child's full name" required>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="First Name"
                  value={form.childFirstName}
                  onChange={(v) => set("childFirstName", v)}
                  error={errors.childFirstName}
                  sub="First Name"
                />
                <Input
                  placeholder="Last Name"
                  value={form.childLastName}
                  onChange={(v) => set("childLastName", v)}
                  error={errors.childLastName}
                  sub="Last Name"
                />
              </div>
            </FieldGroup>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldGroup label="Standard" required>
                <Select
                  value={form.standard}
                  onChange={(v) => set("standard", v)}
                  options={STANDARDS}
                  error={errors.standard}
                />
              </FieldGroup>
              <FieldGroup label="Board" required>
                <Select
                  value={form.board}
                  onChange={(v) => set("board", v)}
                  options={BOARDS}
                  error={errors.board}
                />
              </FieldGroup>
            </div>

            <FieldGroup label="Name of school">
              <Input
                placeholder="e.g. Delhi Public School, Surat"
                value={form.schoolName}
                onChange={(v) => set("schoolName", v)}
              />
            </FieldGroup>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div key="s2" className="animate-slide-in space-y-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldGroup label="Contact number" required>
                <Input
                  placeholder="0000000000"
                  value={form.phone}
                  inputMode="numeric"
                  maxLength={10}
                  onChange={(v) => set("phone", v.replace(/\D/g, "").slice(0, 10))}
                  error={errors.phone}
                  sub="Format: 0000000000."
                />
              </FieldGroup>
              <FieldGroup label="Email address">
                <Input
                  placeholder="example@example.com"
                  type="email"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                />
              </FieldGroup>
            </div>

            <FieldGroup label="Address" required>
              <div className="space-y-3">
                <Input
                  placeholder="Street Address"
                  value={form.addressLine1}
                  onChange={(v) => set("addressLine1", v)}
                  error={errors.addressLine1}
                  sub="Street Address"
                />
                <Input
                  placeholder="Street Address Line 2"
                  value={form.addressLine2}
                  onChange={(v) => set("addressLine2", v)}
                  sub="Street Address Line 2"
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="City"
                    value={form.city}
                    onChange={(v) => set("city", v)}
                    error={errors.city}
                    sub="City"
                  />
                  <Input
                    placeholder="State / Province"
                    value={form.state}
                    onChange={(v) => set("state", v)}
                    error={errors.state}
                    sub="State / Province"
                  />
                  <Input
                    placeholder="395007"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.postalCode}
                    onChange={(v) => set("postalCode", v.replace(/\D/g, "").slice(0, 6))}
                    error={errors.postalCode}
                    sub="Postal / Zip Code"
                  />
                </div>
              </div>
            </FieldGroup>

            <FieldGroup label="Mode" required>
              <div className="grid gap-3 sm:grid-cols-3">
                {MODES.map((m) => {
                  const active = form.mode === m;
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => set("mode", m)}
                      className={`rounded-xl border px-4 py-4 text-left transition-all duration-300 ${
                        active
                          ? "border-brand-900 bg-brand-900 text-white shadow-[0_16px_30px_-20px_rgba(10,37,64,1)]"
                          : "border-[#dfd7c9] bg-white text-brand-900 hover:-translate-y-0.5 hover:border-brand-400"
                      }`}
                    >
                      <span className="block">
                        <Icon
                          name={
                            (m === "Home Tuition"
                              ? "home"
                              : m === "Online Tuition"
                                ? "laptop"
                                : "either") as IconName
                          }
                          className={`h-6 w-6 ${active ? "text-gold" : "text-brand-700"}`}
                        />
                      </span>
                      <span className="mt-2 block text-[0.9rem] font-bold">{m}</span>
                      <span
                        className={`mt-0.5 block text-[0.72rem] ${
                          active ? "text-white/60" : "text-ink/45"
                        }`}
                      >
                        {m === "Home Tuition"
                          ? "Tutor visits your home"
                          : m === "Online Tuition"
                            ? "Live one-to-one video"
                            : "Whatever suits us best"}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.mode && <ErrorText>{errors.mode}</ErrorText>}
            </FieldGroup>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div key="s3" className="animate-slide-in space-y-7">
            <FieldGroup label="What date and time work best for you?" required>
              <AppointmentScheduler
                date={form.preferredDate}
                slot={form.preferredSlot}
                onDateChange={(v) => set("preferredDate", v)}
                onSlotChange={(v) => set("preferredSlot", v)}
                error={errors.preferredSlot ?? errors.preferredDate}
              />
            </FieldGroup>

            <FieldGroup label="Any other specific date and time, if the above selection is not suitable">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    type="date"
                    className="field"
                    value={form.altDate}
                    onChange={(e) => set("altDate", e.target.value)}
                    aria-invalid={Boolean(errors.altDate)}
                  />
                  <p className="field-hint">Date (day / month / year)</p>
                </div>
                <div>
                  <div className="flex gap-2">
                    <select
                      className="field"
                      value={form.altHour}
                      onChange={(e) => set("altHour", e.target.value)}
                      aria-label="Hour"
                    >
                      <option value="">HH</option>
                      {HOURS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <select
                      className="field"
                      value={form.altMinute}
                      onChange={(e) => set("altMinute", e.target.value)}
                      aria-label="Minutes"
                    >
                      <option value="">MM</option>
                      {MINUTES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      className="field max-w-[6rem]"
                      value={form.altMeridiem}
                      onChange={(e) => set("altMeridiem", e.target.value)}
                      aria-label="AM/PM option"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <p className="field-hint">Hour · Minutes · AM/PM option</p>
                </div>
              </div>
            </FieldGroup>

            <FieldGroup label="Additional comments (optional)">
              <textarea
                className="field min-h-[7rem] resize-y"
                placeholder="Tell us about weak subjects, upcoming exams, preferred tutor gender, timings…"
                value={form.comments}
                onChange={(e) => set("comments", e.target.value)}
              />
            </FieldGroup>

            <div className="rounded-2xl border border-brand-900/10 bg-sand p-5 text-[0.85rem] leading-relaxed text-ink/60">
              By submitting, you agree that a {SITE.short} coordinator may contact you on
              the number provided to confirm your free demo lecture. We never share your
              details with third parties.
            </div>
          </div>
        )}

        {serverError && (
          <p className="mt-6 rounded-xl border border-[#f3c9cb] bg-[#fdf1f1] px-4 py-3 text-[0.85rem] font-semibold text-[#c0343a]">
            {serverError}
          </p>
        )}

        {/* actions */}
        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-brand-900/10 pt-7">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className={`rounded-full border px-6 py-3 text-[0.88rem] font-bold transition-all ${
              step === 1
                ? "cursor-not-allowed border-brand-900/10 text-ink/25"
                : "border-brand-900/20 text-brand-900 hover:bg-brand-900 hover:text-white"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="arrowLeft" className="h-4 w-4" /> Back
            </span>
          </button>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-brand-900 px-8 py-3.5 text-[0.9rem] font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Continue
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="btn-shine inline-flex items-center gap-3 rounded-full bg-accent-500 px-9 py-3.5 text-[0.92rem] font-bold text-white shadow-[0_20px_40px_-20px_rgba(237,93,0,0.95)] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? (
                <Icon name="spinner" className="h-4 w-4 animate-spin" />
              ) : (
                <Icon name="send" className="h-4 w-4" />
              )}
              {submitting ? "Submitting…" : "Submit"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

/* ---------- small field primitives ---------- */

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="field-label">
        {label}
        {required && <span className="ml-1 text-accent-600">*</span>}
      </p>
      {children}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[0.74rem] font-semibold text-[#c0343a]">{children}</p>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  error,
  sub,
  type = "text",
  inputMode,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  sub?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "email" | "tel";
  maxLength?: number;
}) {
  return (
    <div>
      <input
        className="field"
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <ErrorText>{error}</ErrorText> : sub ? <p className="field-hint">{sub}</p> : null}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <select
        className="field"
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Please Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
