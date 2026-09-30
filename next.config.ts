import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["@react-pdf/renderer"],
  async redirects() {
    return [
      {
        source: "/category",
        destination: "/",
        permanent: true,
      },
      {
        source: "/category/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:category/rehber/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/kvkk",
        destination: "/aydinlatma-beyani-ve-acik-riza-onayi",
        permanent: true,
      },
      {
        source: "/gizlilik-sozlesmesi",
        destination: "/aydinlatma-beyani-ve-acik-riza-onayi",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/makaleler",
        permanent: true,
      },
      {
        source: "/rehber",
        destination: "/makaleler",
        permanent: true,
      },
      {
        source: "/kidem-ve-ihbar-tazminati",
        destination: "/kidem-tazminati",
        permanent: true,
      },
      {
        source: "/kidem-ve-ihbar-tazminati/blog",
        destination: "/kidem-tazminati/blog",
        permanent: true,
      },
      {
        source: "/kidem-ve-ihbar-tazminati/:path*",
        destination: "/kidem-tazminati",
        permanent: true,
      },
      {
        source: "/kidem-tazminati-hesaplama",
        destination: "/hesaplama-araclari/kidem-tazminati-hesaplama",
        permanent: true,
      },
      {
        source: "/istifa-dilekcesi",
        destination: "/dilekce-yaz/istifa-dilekcesi",
        permanent: true,
      },
      ...[
        "is-hukuku",
        "aile-hukuku",
        "miras-hukuku",
        "icra-hukuku",
        "ceza-hukuku",
        "gayrimenkul-hukuku",
        "diger",
      ].flatMap((slug) => [
        { source: `/${slug}`, destination: "/makaleler", permanent: true },
        { source: `/${slug}/rehber`, destination: "/makaleler", permanent: true },
        { source: `/${slug}/blog`, destination: "/makaleler", permanent: true },
      ]),
      {
        source: "/:category/rehber",
        destination: "/:category/blog",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
