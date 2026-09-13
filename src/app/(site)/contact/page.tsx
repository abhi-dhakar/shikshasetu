import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import Reveal from "@/components/reveal";
import { PageHero } from "@/components/ui";
import { Icon, WhatsAppIcon } from "@/components/icons";
import { AREAS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to a ShikshaSetu Surat academic coordinator about home tuition, online tuition, exam preparation or tutor registration.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Speak to a coordinator, <span className="text-gradient">not a call centre</span>
          </>
        }
        lead="Tell us the class, board and subjects, and we will tell you exactly which tutors we have available in your part of Surat."
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={120}>
              <div className="rounded-[1.5rem] border border-brand-900/10 bg-brand-950 p-8 text-white">
                <h3 className="font-display text-xl">Office</h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-white/65">
                  {SITE.address}
                </p>
                <div className="mt-6 space-y-3 text-[0.95rem]">
                  <a href={SITE.phoneHref} className="flex items-center gap-3 font-bold">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <Icon name="phone" className="h-4 w-4" />
                    </span>
                    {SITE.phone}
                  </a>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="flex items-center gap-3 text-white/80"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <Icon name="mail" className="h-4 w-4" />
                    </span>
                    {SITE.email}
                  </a>
                  <p className="flex items-center gap-3 text-white/80">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <Icon name="clock" className="h-4 w-4" />
                    </span>
                    9:00 AM – 8:00 PM, all seven days
                  </p>
                </div>
                <a
                  href={SITE.whatsapp}
                  className="btn-shine mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-[1.5rem] border border-brand-900/10 bg-white p-8">
                <h3 className="font-display text-xl text-brand-900">
                  Areas we cover in Surat
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {AREAS.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-sand px-3.5 py-1.5 text-[0.82rem] font-semibold text-brand-900"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[0.85rem] leading-relaxed text-ink/55">
                  Not on the list? Online tuition is available anywhere — same tutors, same
                  learning plan.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
