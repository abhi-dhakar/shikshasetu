import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

/* ---------- status pills ---------- */

const TONES: Record<string, string> = {
  new: "bg-brand-50 text-brand-700 border-brand-200",
  received: "bg-brand-50 text-brand-700 border-brand-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  screening: "bg-amber-50 text-amber-700 border-amber-200",
  scheduled: "bg-violet-50 text-violet-700 border-violet-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  unread: "bg-blue-50 text-blue-700 border-blue-200",
  read: "bg-slate-50 text-slate-600 border-slate-200",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-stone-50 text-stone-600 border-stone-200",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${
        TONES[status] ?? "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ---------- KPI card ---------- */

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "brand",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: IconName;
  accent?: "brand" | "accent" | "emerald" | "violet";
}) {
  const accents = {
    brand: "bg-brand-900 text-gold",
    accent: "bg-accent-500 text-white",
    emerald: "bg-emerald-600 text-white",
    violet: "bg-violet-600 text-white",
  } as const;

  return (
    <div className="card-hover rounded-2xl border border-brand-900/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink/45">
            {label}
          </p>
          <p className="mt-2.5 font-display text-[2rem] leading-none text-brand-900">
            {value}
          </p>
          {hint && <p className="mt-2 text-[0.76rem] text-ink/50">{hint}</p>}
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accents[accent]}`}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

/* ---------- panel ---------- */

export function Panel({
  title,
  subtitle,
  action,
  children,
  padded = false,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-brand-900/10 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/8 px-5 py-4">
        <div>
          <h2 className="font-display text-[1.08rem] text-brand-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[0.78rem] text-ink/50">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function EmptyState({ text, icon = "inbox" }: { text: string; icon?: IconName }) {
  return (
    <div className="grid place-items-center gap-3 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sand text-ink/40">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="text-[0.88rem] text-ink/45">{text}</p>
    </div>
  );
}

export function fmtDateTime(value: Date | string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
