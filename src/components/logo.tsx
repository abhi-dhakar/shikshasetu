import Link from "next/link";

export default function Logo({
  variant = "dark",
  compact = false,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
}) {
  const title = variant === "light" ? "text-white" : "text-brand-900";
  const sub = variant === "light" ? "text-white/60" : "text-ink/55";

  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="ShikshaSetu Surat home">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-900 shadow-[0_10px_24px_-12px_rgba(10,37,64,0.9)] transition-transform duration-500 group-hover:-rotate-6">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,201,60,0.45),transparent_60%)]" />
        <svg viewBox="0 0 32 32" className="relative h-6 w-6" aria-hidden="true">
          <path d="M4 20 16 6l12 14-12 5z" fill="#ff7a18" />
          <path d="M9 21.5v4.2c0 .5.3.9.7 1.1 4 1.9 8.6 1.9 12.6 0 .4-.2.7-.6.7-1.1v-4.2L16 24.8z" fill="#ffc93c" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[1.12rem] font-bold tracking-tight ${title}`}>
          Shiksha<span className="text-accent-500">Setu</span>
        </span>
        {!compact && (
          <span className={`mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.24em] ${sub}`}>
            Surat
          </span>
        )}
      </span>
    </Link>
  );
}
