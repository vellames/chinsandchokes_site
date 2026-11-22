import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { paths, site, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { types: { "application/rss+xml": [{ url: paths.feed(), title: site.name }] } },
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/brand/og-default.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#121312", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="kicker sr-only bg-lime px-4 py-2 text-charcoal focus:not-sr-only focus:absolute focus:z-50">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
