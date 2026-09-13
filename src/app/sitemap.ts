import type { MetadataRoute } from "next";

const BASE = "https://shikshasetusurat.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/programs",
    "/how-it-works",
    "/areas",
    "/tutors",
    "/contact",
    "/book-demo",
    "/about",
  ];
  const now = new Date();
  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route === "/book-demo" ? 0.9 : 0.7,
  }));
}
