import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

export default function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon: IconName;
  actions?: ReactNode;
}) {
  const now = new Date().toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <header className="relative overflow-hidden border-b border-brand-900/8 bg-white px-5 py-6 sm:px-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-brand-50" />
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-900 text-gold">
            <Icon name={icon} className="h-5 w-5" />
          </span>
          <div>
            {eyebrow && (
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.2em] text-accent-600">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1 font-display text-[1.65rem] leading-tight text-brand-900 sm:text-[1.95rem]">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-[0.86rem] text-ink/55">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <span className="hidden items-center gap-2 rounded-full border border-brand-900/10 bg-sand px-4 py-2 text-[0.76rem] font-semibold text-ink/55 md:inline-flex">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {now}
          </span>
        </div>
      </div>
    </header>
  );
}
