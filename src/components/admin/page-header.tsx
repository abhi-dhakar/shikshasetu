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
  const now = new Date();
  const label = now.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <header className="admin-page-header">
      <div className="admin-page-header__inner">
        <div className="admin-page-header__heading">
          <span className="admin-page-icon" aria-hidden="true">
            <Icon name={icon} className="h-5 w-5" />
          </span>
          <div>
            <nav className="admin-breadcrumb" aria-label="Breadcrumb">
              <span>ShikshaSetu</span>
              <span aria-hidden="true">/</span>
              <span>Admin</span>
              {eyebrow && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className="admin-breadcrumb__current">{eyebrow}</span>
                </>
              )}
            </nav>
            <h1 className="admin-page-title">{title}</h1>
            {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="admin-page-meta">
          {actions}
          <span className="admin-session-chip">
            <span className="admin-session-chip__dot" aria-hidden="true" />
            Session active
          </span>
          <time className="admin-time-chip" dateTime={now.toISOString()}>
            <Icon name="clock" className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </time>
        </div>
      </div>
    </header>
  );
}
