import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-brand-950 px-6 py-32 text-center text-white">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 invert" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 animate-blob bg-accent-600/25 blur-3xl" />
      <div className="relative mx-auto max-w-xl">
        <p className="font-display text-[5rem] leading-none text-gold">404</p>
        <h1 className="mt-4 font-display text-[2rem] leading-tight sm:text-[2.6rem]">
          This page went for a tuition break
        </h1>
        <p className="mt-4 text-white/65">
          The page you were looking for does not exist. Let&apos;s get you back to
          something useful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-shine rounded-full bg-accent-500 px-7 py-3.5 font-bold text-white"
          >
            Back to home
          </Link>
          <Link
            href="/book-demo"
            className="rounded-full border border-white/30 px-7 py-3.5 font-bold text-white transition-colors hover:bg-white hover:text-brand-900"
          >
            Book a free demo
          </Link>
        </div>
      </div>
    </section>
  );
}
