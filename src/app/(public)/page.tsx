import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getAllCities, getFeaturedListings } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";
import ListingCard from "@/components/listing-card";

export const metadata: Metadata = {
  title: "Events4Singles — Australian Singles Events Directory",
};

export default async function HomePage() {
  const categories = (await getAllCategories()).filter((c) => !c.parent_slug);
  const cities = await getAllCities();
  const featured = await getFeaturedListings(6);

  return (
    <>
      <section className="e4s-page-intro" style={{ textAlign: "center", display: "block", marginTop: 0, borderRadius: 0, border: "none", background: "var(--e4s-teal-900)", color: "#ffffff", padding: "48px 24px" }}>
        <p style={{ color: "var(--e4s-teal-100)", fontSize: "13px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
          Australia&apos;s Singles Events Directory
        </p>
        <h1 style={{ color: "#ffffff", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", margin: "0 0 16px" }}>
          Find singles events near you
        </h1>
        <p style={{ color: "var(--e4s-teal-100)", maxWidth: "520px", margin: "0 auto 28px", fontSize: "1rem" }}>
          Speed dating, dinner parties, dance classes and social clubs — curated for singles across every major Australian city.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${toUrlSlug(city.slug)}`}
              style={{ background: "#ffffff", color: "var(--e4s-teal-900)", fontWeight: 700, padding: "10px 20px", borderRadius: "6px", fontSize: "14px", textDecoration: "none" }}
            >
              {city.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="e4s-category-city-nav e4s-shell" style={{ marginTop: "28px" }}>
        <h2>Browse by category</h2>
        <div className="e4s-category-city-nav__grid">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${toUrlSlug(cat.slug)}`}
              className="e4s-category-city-nav__text-only"
            >
              <span>
                {cat.label}
                <br />
                <small style={{ fontWeight: 400, opacity: 0.85 }}>
                  {cat.listing_count} listing{cat.listing_count !== 1 ? "s" : ""}
                </small>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {featured.length > 0 && (
        <section className="e4s-shell" style={{ margin: "28px auto" }}>
          <h2 style={{ color: "var(--e4s-teal-900)", fontSize: "18px", marginBottom: "16px" }}>
            Featured businesses
          </h2>
          <main className="e4s-category-template" style={{ marginTop: 0 }}>
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </main>
        </section>
      )}

      <section style={{ background: "var(--e4s-teal-900)", color: "#ffffff", padding: "44px 24px", textAlign: "center", marginTop: "28px" }}>
        <h2 style={{ color: "#ffffff", fontSize: "clamp(1.4rem, 4vw, 2rem)", marginBottom: "12px" }}>
          Run singles events?
        </h2>
        <p style={{ color: "var(--e4s-teal-100)", maxWidth: "480px", margin: "0 auto 24px", fontSize: "1rem" }}>
          List your business on Australia&apos;s longest-running singles events directory. Plans from $39/month.
        </p>
        <Link
          href="/portal"
          style={{ display: "inline-block", background: "#ffffff", color: "var(--e4s-teal-900)", fontWeight: 700, padding: "12px 32px", borderRadius: "6px", textDecoration: "none", fontSize: "15px" }}
        >
          List your business
        </Link>
      </section>
    </>
  );
}
