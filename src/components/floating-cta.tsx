"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { Icon, WhatsAppIcon } from "@/components/icons";

export default function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <div className="glass flex items-center gap-2 rounded-full border border-brand-900/12 p-2 shadow-[0_24px_50px_-24px_rgba(8,26,45,0.7)]">
        <a
          href={SITE.phoneHref}
          aria-label="Call ShikshaSetu Surat"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-900 text-white transition-transform hover:scale-105"
        >
          <Icon name="phone" className="h-[1.15rem] w-[1.15rem]" />
        </a>
        <a
          href={SITE.whatsapp}
          aria-label="WhatsApp ShikshaSetu Surat"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="h-[1.15rem] w-[1.15rem]" />
        </a>
        <Link
          href="/book-demo"
          className="btn-shine flex-1 rounded-full bg-accent-500 px-5 py-3 text-center text-[0.86rem] font-bold text-white"
        >
          Book a free demo lecture
        </Link>
      </div>
    </div>
  );
}
