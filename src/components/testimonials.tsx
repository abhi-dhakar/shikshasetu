"use client";

import { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/lib/constants";
import { Icon, Star } from "@/components/icons";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % total), 6500);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const t = TESTIMONIALS[i];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-brand-900/10 bg-white p-8 shadow-[var(--shadow-soft)] sm:p-12">
        <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[10rem] leading-none text-brand-50">
          &rdquo;
        </span>
        <div key={i} className="animate-slide-in relative">
          <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
            {[0, 1, 2, 3, 4].map((idx) => (
              <Star key={idx} className="h-[1.15rem] w-[1.15rem] fill-gold" strokeWidth={0} />
            ))}
          </div>
          <blockquote className="mt-6 text-pretty font-display text-[1.35rem] leading-[1.45] text-brand-900 sm:text-[1.65rem]">
            {t.quote}
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-900 font-display text-lg text-white">
              {t.name.charAt(0)}
            </span>
            <div>
              <p className="font-bold text-brand-900">{t.name}</p>
              <p className="text-sm text-ink/55">
                {t.role} · {t.area}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {TESTIMONIALS.map((item, idx) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Testimonial ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === i ? "w-9 bg-accent-500" : "w-3 bg-brand-900/15 hover:bg-brand-900/35"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setI((v) => (v - 1 + total) % total)}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-900/15 bg-white text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setI((v) => (v + 1) % total)}
            aria-label="Next testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-900/15 bg-white text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
          >
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
