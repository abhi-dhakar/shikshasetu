import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL("https://shikshasetusurat.in"),
  title: {
    default: `${SITE.name} — Home & Online Tuition in Surat | Classes 1–12`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "ShikshaSetu Surat matches students of Classes 1–12 with screened home and online tutors across Vesu, Adajan, City Light, Pal, Athwa and more. GSEB, CBSE, ICSE & NCERT. Book a free demo lecture.",
  keywords: [
    "home tuition Surat",
    "online tuition Surat",
    "GSEB tutor Surat",
    "CBSE home tutor Vesu",
    "ICSE tuition Adajan",
    "Class 10 tuition Surat",
    "Class 12 science tuition Surat",
  ],
  openGraph: {
    title: `${SITE.name} — Home & Online Tuition in Surat`,
    description:
      "One-to-one home and online tuition for Classes 1–12 in Surat. Screened tutors, free demo class, GSEB / CBSE / ICSE / NCERT.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a2540",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230a2540'/%3E%3Cpath d='M14 40l18-22 18 22-18 8z' fill='%23ff7a18'/%3E%3C/svg%3E"
        />
      </head>
      <body className="bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
