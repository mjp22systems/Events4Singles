import Link from "next/link";
import { getAllCategories, getAllCities } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";

const SKIP_CAT_SLUGS = new Set(["events", "dance_salsa", "dance_tango"]);
const SKIP_CITY_SLUGS = new Set(["melbourne2"]);

export default async function Footer() {
  const allCats = (await getAllCategories()).filter(
    (c) => !c.parent_slug && c.label && !SKIP_CAT_SLUGS.has(c.slug)
  );
  const seenLabels = new Set<string>();
  const categories = allCats
    .filter((c) => {
      if (seenLabels.has(c.label)) return false;
      seenLabels.add(c.label);
      return true;
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const cities = (await getAllCities()).filter((c) => c.slug && c.label && !SKIP_CITY_SLUGS.has(c.slug));
  const catMid = Math.ceil(categories.length / 2);

  return (
    <footer className="e4s-footer" role="contentinfo">
      <div className="e4s-shell e4s-footer__grid">
        <div className="e4s-footer__brand">
          <section>
            <h2>Events4Singles</h2>
            <p>
              Australia&rsquo;s original singles events directory, online since 2001.
              We connect Australian singles with speed dating, dinner parties, dance
              classes, introduction agencies, social clubs and more across Sydney,
              Melbourne, Brisbane, Perth, Adelaide, Gold Coast, Canberra and beyond.
            </p>
            <p style={{ marginTop: "10px" }}>
              Over 20 years of listings. Hundreds of businesses. Thousands of singles
              finding their people every week.
            </p>
          </section>

          <nav aria-label="Footer advertise" className="e4s-footer__advertise-nav">
            <h2>Advertise with Us</h2>
            <Link href="/advertise">List Your Business</Link>
            <Link href="/advertise#pricing">Pricing Plans</Link>
            <Link href="/portal">Advertiser Portal</Link>
            <Link href="/dating-resources">Dating Resources</Link>
            <Link href="/about">About Events4Singles</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </nav>
        </div>

        <nav aria-label="Footer cities" className="e4s-footer__cities">
          <h2>Cities</h2>
          {cities.map((city) => (
            <Link key={city.slug} href={`/${toUrlSlug(city.slug)}`}>
              {city.label}
            </Link>
          ))}
        </nav>

        <div className="e4s-footer__pair">
          <nav aria-label="Footer categories A">
            <h2>Categories</h2>
            {categories.slice(0, catMid).map((cat) => (
              <Link key={cat.slug} href={`/${toUrlSlug(cat.slug)}`}>
                {cat.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Footer categories B">
            <h2 className="e4s-footer__ghost-h">&nbsp;</h2>
            {categories.slice(catMid).map((cat) => (
              <Link key={cat.slug} href={`/${toUrlSlug(cat.slug)}`}>
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="e4s-shell e4s-footer__legal">
        <p>&copy; {new Date().getFullYear()} Events4Singles. All rights reserved.</p>
        <p>
          <Link href="/privacy">Privacy Policy</Link>
          {" - "}
          <Link href="/terms">Terms of Use</Link>
        </p>
      </div>
    </footer>
  );
}
