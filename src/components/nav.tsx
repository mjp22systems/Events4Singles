import Link from "next/link";
import { getAllCategories, getAllCities } from "@/lib/data";
import NavDropdowns from "./nav-dropdowns";
import MobileMenuToggle from "./mobile-menu-toggle";

export default async function Nav() {
  const cities = await getAllCities();
  const categories = (await getAllCategories()).filter((c) => !c.parent_slug);

  return (
    <header className="e4s-header" role="banner">
      <div className="e4s-shell e4s-header__bar">
        <Link aria-label="Events4Singles home" className="e4s-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Events4Singles — Australia's Singles Events Directory" src="/images/e4s-logo_new.png" title="Events4Singles" />
        </Link>
        <div className="e4s-header__actions">
          <Link href="/portal" className="e4s-header-login">Login</Link>
          <Link href="/advertise" className="e4s-header-cta-btn">Advertise</Link>
          <MobileMenuToggle />
        </div>
      </div>
      <NavDropdowns cities={cities} categories={categories} />
    </header>
  );
}
