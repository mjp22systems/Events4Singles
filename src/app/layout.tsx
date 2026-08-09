import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Events4Singles — Australian Singles Events Directory",
    template: "%s | Events4Singles",
  },
  description:
    "Find speed dating, dinner parties, dance classes, and social clubs for singles across Sydney, Melbourne, Brisbane, Perth, Adelaide and more.",
  metadataBase: new URL("https://www.events4singles.com"),
  openGraph: {
    siteName: "Events4Singles",
    locale: "en_AU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
