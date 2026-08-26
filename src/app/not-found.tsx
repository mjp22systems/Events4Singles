import type { Metadata } from "next";
import NotFoundHelper from "@/components/not-found-helper";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

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
      <link rel="stylesheet" href="/site.css" />
      <Nav />
      <main id="site-content">
        <NotFoundHelper />
      </main>
      <Footer />
    </>
  );
}
