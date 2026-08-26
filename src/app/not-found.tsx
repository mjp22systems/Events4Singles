/* eslint-disable @next/next/no-css-tags */
import type { Metadata } from "next";
import NotFoundHelper from "@/components/not-found-helper";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" href="/site-20260827.css" />
      <main id="site-content">
        <NotFoundHelper />
      </main>
    </>
  );
}
