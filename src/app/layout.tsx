import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";
import { ClerkProvider } from "@clerk/nextjs";

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
  const scrollRestorationScript = `
    (function () {
      try {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
      } catch (error) {}
    })();
  `;

  const navStateScript = `
    (function () {
      try {
        if (window.localStorage.getItem("e4s-nav-open") === "1") {
          document.body.classList.add("e4s-nav-open");
        }
      } catch (error) {}
    })();
  `;

  return (
    <ClerkProvider>
      <html lang="en-AU" suppressHydrationWarning>
        <head>
          <script id="e4s-scroll-restoration-init" dangerouslySetInnerHTML={{ __html: scrollRestorationScript }} />
          <link rel="preload" href="/fonts/hanken-grotesk-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
          <link rel="preload" href="/fonts/source-serif-4-normal-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
          <link rel="preload" href="/fonts/source-serif-4-italic-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
          <link rel="preload" href="/images/optimized/home-cat-mixers.webp" as="image" fetchPriority="high" />
          <link rel="stylesheet" href="/fonts.css" />
          {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
            <script
              defer
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
            />
          )}
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
        <body className="e4s-fixed-header" suppressHydrationWarning>
          <script id="e4s-nav-state-init" dangerouslySetInnerHTML={{ __html: navStateScript }} />
          {children}
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-N9P8LGTB68" strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N9P8LGTB68');
          `}</Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
