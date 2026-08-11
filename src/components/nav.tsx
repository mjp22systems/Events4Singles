import Link from "next/link";
import { getAllCategories, getAllCities } from "@/lib/data";
import NavDropdowns from "./nav-dropdowns";

export default function Nav() {
  const cities = getAllCities();
  const categories = getAllCategories().filter((c) => !c.parent_slug);

  return (
    <header className="e4s-header" role="banner">
      <div className="e4s-shell e4s-header__bar">
        <Link aria-label="Events4Singles home" className="e4s-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Events4Singles" src="/images/E4S_Logo3_375x50.gif" />
          <em>Australian singles events directory</em>
        </Link>
        <div aria-label="Advertising and listing options" className="e4s-header-cta">
          <strong>Advertise here</strong>
          <span>Reach Australian singles looking for local events</span>
          <Link href="/portal">Create listing</Link>
        </div>
      </div>
      <NavDropdowns cities={cities} categories={categories} />
    </header>
  );
}
