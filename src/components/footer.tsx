import Link from "next/link";
import { getAllCategories, getAllCities } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";

export default function Footer() {
  const categories = getAllCategories().filter((c) => !c.parent_slug).slice(0, 12);
  const cities = getAllCities();

  return (
    <footer className="e4s-footer" role="contentinfo">
      <div className="e4s-shell e4s-footer__grid">
        <section>
          <h2>Events4Singles</h2>
          <p>
            Australian singles events, dating resources, social clubs, dinners,
            dancing, speed dating and activities across major cities.
          </p>
        </section>

        <nav aria-label="Footer cities">
          <h2>Cities</h2>
          {cities.map((city) => (
            <Link key={city.slug} href={`/${toUrlSlug(city.slug)}`}>
              {city.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Footer categories">
          <h2>Categories</h2>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/${toUrlSlug(cat.slug)}`}>
              {cat.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Footer information">
          <h2>Advertise</h2>
          <Link href="/portal">Create listing</Link>
          <Link href="/portal">Pricing</Link>
          <Link href="/portal">Advertiser portal</Link>
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms of use</Link>
        </nav>
      </div>

      <div className="e4s-shell e4s-footer__legal">
        <p>&copy; {new Date().getFullYear()} Events4Singles. All rights reserved.</p>
        <p>
          <Link href="/privacy">Privacy Policy</Link>
          {" · "}
          <Link href="/terms">Terms of Use</Link>
        </p>
      </div>
    </footer>
  );
}
