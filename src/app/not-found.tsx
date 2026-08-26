/* eslint-disable @next/next/no-css-tags, @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
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
      <link rel="stylesheet" href="/site.css" />
      <header className="e4s-header" role="banner">
        <div className="e4s-shell e4s-header__bar">
          <Link aria-label="Events4Singles home" className="e4s-brand" href="/">
            <img alt="Events4Singles - Australia's Singles Events Directory" src="/images/e4s-logo_new.png" />
          </Link>
          <div className="e4s-header__actions">
            <Link href="/portal" className="e4s-header-login">Login</Link>
            <Link href="/advertise" className="e4s-header-cta-btn">Advertise</Link>
          </div>
        </div>
      </header>
      <main id="site-content">
        <NotFoundHelper />
      </main>
      <footer className="e4s-footer" role="contentinfo">
        <div className="e4s-shell e4s-footer__legal e4s-footer__legal--static">
          <div>
            <p>&copy; {new Date().getFullYear()} Events4Singles. All rights reserved.</p>
            <p>
              <Link href="/privacy-policy">Privacy Policy</Link>
              {" - "}
              <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
