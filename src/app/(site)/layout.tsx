import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ScrollProgress from "@/components/scroll-progress";
import FloatingCta from "@/components/floating-cta";
import { SITE } from "@/lib/constants";

// Arena preview hosts sit behind an edge proxy. Keeping HTML dynamic prevents
// stale response/security headers from being cached across preview rebuilds.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: SITE.name,
            description:
              "Home and online tuition service in Surat for Classes 1–12 across GSEB, CBSE, ICSE and NCERT syllabi.",
            telephone: SITE.phone,
            email: SITE.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Silver Trade Centre, VIP Road, Vesu",
              addressLocality: "Surat",
              addressRegion: "Gujarat",
              postalCode: "395007",
              addressCountry: "IN",
            },
            areaServed: [
              "Vesu",
              "Adajan",
              "City Light",
              "Pal",
              "Athwa",
              "Piplod",
              "Althan",
              "Varachha",
              "Katargam",
              "Dumas",
              "Nanpura",
              "Bhatar",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "312",
            },
          }),
        }}
      />
      <ScrollProgress />
      <SiteHeader />
      <main id="top">{children}</main>
      <SiteFooter />
      <FloatingCta />
    </>
  );
}
