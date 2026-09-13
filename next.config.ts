import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Framing is restricted through CSP below. Arena preview domains are
  // explicitly allowed so the application can render in the preview iframe.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      // Arena previews can be nested through multiple platform origins. Public
      // pages intentionally permit embedding; admin access remains protected by
      // signed sessions and authoritative server-side authorization.
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "media-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const publicPages = [
      "/",
      "/about",
      "/areas",
      "/book-demo",
      "/contact",
      "/how-it-works",
      "/programs",
      "/tutors",
    ];
    const noStoreHeaders = [
      { key: "Cache-Control", value: "private, no-store, no-cache, max-age=0, must-revalidate" },
      { key: "CDN-Cache-Control", value: "no-store" },
      { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
      { key: "Surrogate-Control", value: "no-store" },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...publicPages.map((source) => ({ source, headers: noStoreHeaders })),
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
