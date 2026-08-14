import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Events4Singles - Australian Singles Events Directory",
    template: "%s | Events4Singles",
  },
  applicationName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Events4Singles - Australian Singles Events Directory",
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    url: "/",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="stylesheet" href="/site-card-title-pink-20260813b.css?v=20260814-reverted" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              alternateName: ["Events for Singles", "Events4Singles Australia"],
              url: SITE_URL,
            }),
          }}
        />
      </head>
      <body className="e4s-fixed-header">
        {children}
      </body>
    </html>
  );
}
