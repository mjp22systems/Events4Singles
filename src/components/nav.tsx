import Link from "next/link";
import { getAllCategories, getAllCities } from "@/lib/data";
import NavDropdowns from "./nav-dropdowns";

export default async function Nav() {
  const cities = await getAllCities();
  const categories = (await getAllCategories()).filter((c) => !c.parent_slug);

  return (
    <header className="e4s-header" role="banner">
      <div className="e4s-shell e4s-header__bar">
        <Link aria-label="Events4Singles home" className="e4s-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Events4Singles Australian singles events directory" src="/images/E4S_Logo3_375x50.gif" title="Events4Singles" />
          <em>Australian Singles Events Directory</em>
        </Link>
        <div aria-label="Advertising and listing options" className="e4s-header-cta">
          <strong>Advertise Here</strong>
          <span>Reach Australian Singles Looking for Local Events</span>
          <Link href="/advertise">Create Listing</Link>
        </div>
      </div>
      <NavDropdowns cities={cities} categories={categories} />
    </header>
  );
}
