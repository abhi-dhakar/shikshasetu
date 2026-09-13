import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Secure ShikshaSetu administrator sign in.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; changed?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-brand-950 px-5 py-16">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-25 invert" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[26rem] w-[26rem] animate-blob bg-brand-700/35 blur-[110px]" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-[24rem] w-[24rem] animate-blob bg-accent-600/25 blur-[110px]" />

      <LoginForm next={params.next ?? "/admin"} passwordChanged={params.changed === "1"} />
    </main>
  );
}
