import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Events4Singles — Australian Singles Events Directory",
    template: "%s | Events4Singles",
  },
  description:
    "Find speed dating, dinner parties, dance classes, and social clubs for singles across Sydney, Melbourne, Brisbane, Perth, Adelaide and more.",
  metadataBase: new URL("https://www.events4singles.com.au"),
  openGraph: {
    siteName: "Events4Singles",
    locale: "en_AU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="stylesheet" href="/site.css" />
      </head>
      <body className="e4s-fixed-header">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
