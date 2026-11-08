import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Secure ShikshaSetu administrator sign in.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

type Feature = {
  icon: "dashboard" | "chart" | "shield";
  title: string;
  detail: string;
};

const FEATURES: Feature[] = [
  {
    icon: "dashboard",
    title: "Unified pipeline",
    detail: "Review demo requests, applications, and messages in one place.",
  },
  {
    icon: "chart",
    title: "Clear data hierarchy",
    detail: "Scan KPIs, status distribution, and recent activity quickly.",
  },
  {
    icon: "shield",
    title: "Protected access",
    detail: "Signed sessions, persistent throttling, and append-only audit logs.",
  },
];

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; changed?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="admin-auth" aria-labelledby="admin-auth-title">
      <section className="admin-auth__intro">
        <span className="admin-auth__eyebrow">
          <Icon name="lock" className="h-3.5 w-3.5" aria-hidden="true" />
          Admin console
        </span>
        <h1 id="admin-auth-title" className="admin-auth__title">
          One workspace for every enquiry.
        </h1>
        <p className="admin-auth__lead">
          Monitor and resolve ShikshaSetu demo bookings, tutor applications, and
          contact messages from a focused operations dashboard.
        </p>

        <div className="admin-auth__feature-grid">
          {FEATURES.map((feature) => (
            <div className="admin-auth__feature" key={feature.title}>
              <span className="admin-auth__feature-icon" aria-hidden="true">
                <Icon name={feature.icon} className="h-4 w-4" />
              </span>
              <div>
                <strong>{feature.title}</strong>
                <span>{feature.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="admin-auth__status">
          <span className="admin-auth__status-dot" aria-hidden="true" />
          Restricted access · ShikshaSetu Surat operations
        </p>
      </section>

      <LoginForm
        next={params.next ?? "/admin"}
        passwordChanged={params.changed === "1"}
      />
    </main>
  );
}
