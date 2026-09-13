"use client";

import { useState } from "react";
import { FAQS } from "@/lib/constants";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-900/10 overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-white shadow-[var(--shadow-soft)]">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-brand-50/60 sm:px-8"
            >
              <span className="font-display text-[1.08rem] text-brand-900 sm:text-[1.2rem]">
                {item.q}
              </span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-lg transition-all duration-400 ${
                  isOpen
                    ? "rotate-45 border-accent-500 bg-accent-500 text-white"
                    : "border-brand-900/20 text-brand-900"
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-[0.95rem] leading-relaxed text-ink/65 sm:px-8 sm:pr-16">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
