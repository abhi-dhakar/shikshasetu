import Link from "next/link";
import Logo from "./logo";
import { AREAS, PROGRAMS, SITE } from "@/lib/constants";
import {
  FacebookIcon,
  Icon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "./icons";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white/70">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-700/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-600/20 blur-3xl" />
      <div className="dotted pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Logo variant="light" />
            <p className="max-w-sm text-sm leading-relaxed">
              ShikshaSetu Surat is a home and online tuition service connecting parents
              with screened, verified tutors for Classes 1–12 across GSEB, CBSE, ICSE and
              NCERT syllabi.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {["GSEB", "CBSE", "ICSE", "NCERT"].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-white/15 px-3 py-1 text-[0.7rem] font-semibold tracking-wide text-white/80"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              {[
                { label: "WhatsApp", href: SITE.whatsapp, Cmp: WhatsAppIcon, hover: "hover:bg-[#25D366]" },
                { label: "Instagram", href: "https://instagram.com", Cmp: InstagramIcon, hover: "hover:bg-[#E4405F]" },
                { label: "Facebook", href: "https://facebook.com", Cmp: FacebookIcon, hover: "hover:bg-[#1877F2]" },
                { label: "YouTube", href: "https://youtube.com", Cmp: YouTubeIcon, hover: "hover:bg-[#FF0000]" },
              ].map(({ label, href, Cmp, hover }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-white ${hover}`}
                >
                  <Cmp className="h-[1.05rem] w-[1.05rem]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Programs
            </h4>
            <ul className="space-y-2.5 text-sm">
              {PROGRAMS.map((p) => (
                <li key={p.slug}>
                  <Link href="/programs" className="underline-swipe hover:text-white">
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/how-it-works" className="underline-swipe hover:text-white">
                  Exam preparation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "About us", href: "/about" },
                { label: "How it works", href: "/how-it-works" },
                { label: "Service areas", href: "/areas" },
                { label: "Become a tutor", href: "/tutors" },
                { label: "Book a free demo", href: "/book-demo" },
                { label: "Contact", href: "/contact" },
                { label: "Admin desk", href: "/admin" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline-swipe hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Reach us
            </h4>
            <p className="flex gap-2.5 text-sm leading-relaxed">
              <Icon name="location" className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              {SITE.address}
            </p>
            <div className="space-y-1.5 text-sm">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2.5 font-semibold text-white"
              >
                <Icon name="phone" className="h-4 w-4 text-accent-400" />
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 underline-swipe hover:text-white"
              >
                <Icon name="mail" className="h-4 w-4 text-accent-400" />
                {SITE.email}
              </a>
            </div>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>WhatsApp us</span>
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Home tuition across Surat
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-[0.8rem]">
            {AREAS.map((a) => (
              <Link
                key={a}
                href="/areas"
                className="rounded-full bg-white/5 px-3 py-1 transition-colors hover:bg-white/15 hover:text-white"
              >
                Tuition in {a}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Made in Surat, Gujarat · {SITE.timezone}</p>
        </div>
      </div>
    </footer>
  );
}
