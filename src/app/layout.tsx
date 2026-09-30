import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalSiteFooter } from "@/components/conditional-site-footer";
import { ConditionalMain } from "@/components/conditional-main";
import { EnforceExternalLinks } from "@/components/enforce-external-links";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

function getSupabaseOrigin(): string | null {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u) return null;
  try {
    return new URL(u).origin;
  } catch {
    return null;
  }
}

const supabaseOrigin = getSupabaseOrigin();

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | İşçi Hakları Rehberi`,
    template: `${siteConfig.name} | %s`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: ["/favicon-16x16.png", "/favicon-32x32.png"],
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "tr_TR",
    title: `${siteConfig.name} | İşçi Hakları Rehberi`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: "/images/default-og.jpg", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | İşçi Hakları Rehberi`,
    description: siteConfig.description,
    images: ["/images/default-og.jpg"],
  },
  other: { "theme-color": "#1e3a5f" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={manrope.variable}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} RSS`}
          href={`${siteConfig.url.replace(/\/$/, "")}/feed.xml`}
        />
        {supabaseOrigin && <link rel="preconnect" href={supabaseOrigin} />}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SiteShell>
            <ConditionalMain>{children}</ConditionalMain>
          </SiteShell>
          <ConditionalSiteFooter />
          <EnforceExternalLinks />
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
