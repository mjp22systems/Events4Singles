import type { Metadata } from "next";
import Link from "next/link";
import { getAllCities } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Singles Events by Location — Australia",
  description:
    "Find Australian singles events in your city. Browse speed dating, dinner parties, social clubs and more by location.",
  path: "/locations",
  keywords: ["singles events by location", "Australian singles locations", "dating events by city"],
});

export default async function LocationsPage() {
  const cities = await getAllCities();

  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Find Singles Events by Location</h1>
      <p className="e4s-lead">
        Browse all Australian cities and regions in the Events4Singles directory.
        Select your city to explore speed dating, dinner parties, social clubs and more.
      </p>

      <nav className="e4s-city-grid" aria-label="Browse by city">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${toUrlSlug(city.slug)}`}
            className="e4s-city-grid__item"
          >
            <span className="e4s-city-grid__name">{city.label}</span>
            <span className="e4s-city-grid__count">{city.listing_count} listings</span>
          </Link>
        ))}
      </nav>

      <section className="e4s-locations-cta">
        <h2>List Your Event</h2>
        <p>
          Running singles events in Australia?{" "}
          <Link href="/advertise">View advertising packages</Link> to get your
          business in front of singles in your city.
        </p>
      </section>
    </main>
  );
}
