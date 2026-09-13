"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { Icon, Star } from "@/components/icons";

const SLIDES = [
  {
    kicker: "Surat · Classes 1 to 12",
    title: ["Personalised home tuition", "for your child's success"],
    highlight: "home tuition",
    text: "Screened tutors at your doorstep in Vesu, Adajan, City Light, Pal and across Surat. Focused one-to-one attention, a customised learning plan, and visible results.",
    image: "/images/hero-tutor.png",
    alt: "Home tutor teaching a school student at a study table",
    badge: "Free demo lecture",
    stat: { value: "1800+", label: "Surat students taught" },
  },
  {
    kicker: "GSEB · CBSE · ICSE · NCERT",
    title: ["Ace your boards with", "ShikshaSetu guidance"],
    highlight: "boards",
    text: "Board-year coaching for Classes 9 and 10 with weekly chapter tests, previous-year paper drills and a written score-improvement plan for every student.",
    image: "/images/students-success.png",
    alt: "Students celebrating their board exam results",
    badge: "Board specialists",
    stat: { value: "+23%", label: "Average score lift" },
  },
  {
    kicker: "Home · Online · Either",
    title: ["Where every child learns", "better and faster"],
    highlight: "better and faster",
    text: "Prefer online? Our tutors teach live one-to-one with a digital whiteboard, recorded doubt sessions and shared notes — same tutor, same plan, from anywhere.",
    image: "/images/online-class.png",
    alt: "Student attending a live online tuition class",
    badge: "Live online classes",
    stat: { value: "420+", label: "Verified tutors" },
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), 7000);
    return () => window.clearInterval(id);
  }, [total]);

  const slide = SLIDES[index];

  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 invert" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] animate-blob bg-brand-700/35 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] animate-blob bg-accent-600/25 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.07fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
        {/* copy */}
        <div key={index} className="animate-slide-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
            <span className="relative inline-grid h-2 w-2 place-items-center text-gold">
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
            {slide.kicker}
          </span>

          <h1 className="mt-6 text-balance font-display text-[2.5rem] leading-[1.03] sm:text-[3.3rem] lg:text-[4rem]">
            {slide.title[0]}
            <br />
            <span className="text-gradient">{slide.title[1]}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-[1.03rem] leading-relaxed text-white/70">
            {slide.text}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/book-demo"
              className="btn-shine group inline-flex items-center gap-2.5 rounded-full bg-accent-500 px-7 py-4 text-[0.95rem] font-bold text-white shadow-[0_24px_48px_-22px_rgba(255,122,24,0.9)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Try a free demo class
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-4 text-[0.95rem] font-bold text-white transition-colors duration-300 hover:bg-white hover:text-brand-900"
            >
              <span className="relative grid h-2.5 w-2.5 place-items-center text-gold">
                <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-gold/70" />
                <span className="h-2 w-2 rounded-full bg-gold" />
              </span>
              {SITE.phone}
            </a>
          </div>

          <dl className="mt-11 grid max-w-lg grid-cols-3 gap-5 border-t border-white/12 pt-7">
            {[
              ["Classes", "1 – 12"],
              ["Boards", "GSEB · CBSE · ICSE"],
              ["Areas", "12 in Surat"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-white/45">
                  {k}
                </dt>
                <dd className="mt-1.5 font-display text-lg text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* visual */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 animate-blob rounded-[3rem] bg-gradient-to-br from-accent-500/25 via-brand-500/20 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.85)]">
            <div className="relative aspect-[4/3.15] w-full">
              {SLIDES.map((s, i) => (
                <Image
                  key={s.image}
                  src={s.image}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className={`object-cover transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <span className="rounded-full bg-white px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-brand-900 shadow-lg">
                  {slide.badge}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous slide"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-brand-950/50 text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-900"
                  >
                    <Icon name="arrowLeft" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next slide"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-brand-950/50 text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-900"
                  >
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* floating stat card */}
          <div className="animate-float absolute -left-3 top-8 hidden rounded-2xl border border-white/15 bg-white p-4 text-brand-900 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] sm:block">
            <p className="font-display text-2xl leading-none">{slide.stat.value}</p>
            <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink/50">
              {slide.stat.label}
            </p>
          </div>

          <div className="animate-float-slow absolute -bottom-5 -right-2 hidden rounded-2xl border border-white/15 bg-brand-900 p-4 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-brand-900">
                <Star className="h-5 w-5 fill-brand-900" strokeWidth={0} />
              </span>
              <div>
                <p className="text-sm font-bold text-white">4.9 / 5 parent rating</p>
                <p className="text-[0.7rem] text-white/55">From 300+ Surat families</p>
              </div>
            </div>
          </div>

          {/* dots */}
          <div className="mt-6 flex items-center justify-center gap-2.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.image}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-9 bg-accent-500" : "w-3 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
