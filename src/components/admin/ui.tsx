import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

/* ---------- status pills ---------- */

const TONES: Record<string, string> = {
  new: "info",
  received: "info",
  contacted: "warning",
  screening: "warning",
  scheduled: "info",
  completed: "success",
  approved: "success",
  cancelled: "danger",
  rejected: "danger",
  unread: "info",
  read: "neutral",
  replied: "success",
  archived: "neutral",
};

export function StatusPill({ status }: { status: string }) {
  const tone = TONES[status] ?? "neutral";

  return (
    <span className={`admin-status admin-status--${tone}`}>
      <span className="admin-status__dot" aria-hidden="true" />
      {status}
    </span>
  );
}

/* ---------- KPI card ---------- */

const ACCENTS = {
  brand: "",
  accent: "admin-stat--warning",
  emerald: "admin-stat--success",
  violet: "admin-stat--secondary",
} as const;

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
  accent?: keyof typeof ACCENTS;
}) {
  return (
    <article className={`admin-stat ${ACCENTS[accent]}`}>
      <div className="admin-stat__top">
        <p className="admin-eyebrow">{label}</p>
        <span className="admin-stat__icon" aria-hidden="true">
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
      <p className="admin-stat__value">{value}</p>
      {hint && <p className="admin-stat__hint">{hint}</p>}
    </article>
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
    <section className="admin-panel">
      <header className="admin-panel__header">
        <div>
          <h2 className="admin-panel__title">{title}</h2>
          {subtitle && <p className="admin-panel__subtitle">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className={padded ? "admin-panel__body" : "admin-panel__content"}>
        {children}
      </div>
    </section>
  );
}

export function EmptyState({
  text,
  icon = "inbox",
}: {
  text: string;
  icon?: IconName;
}) {
  return (
    <div className="admin-empty" role="status">
      <span className="admin-empty__icon" aria-hidden="true">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p>{text}</p>
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
