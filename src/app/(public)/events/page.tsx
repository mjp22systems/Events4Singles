import type { Metadata } from "next";
import Link from "next/link";
import { getAllCities } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Singles Events Calendar — Australia",
  description: "Browse upcoming singles events across Australia — speed dating, dinner parties, social nights and more.",
};

const CITY_LABELS: Record<string, string> = {
  sydney: "Sydney",
  melbourne: "Melbourne",
  brisbane: "Brisbane",
  perth: "Perth",
  adelaide: "Adelaide",
  gold_coast: "Gold Coast",
  canberra: "Canberra",
};

export default async function EventsPage() {
  const cities = await getAllCities();

  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Singles Events Calendar</h1>
      <p className="e4s-lead">
        Browse upcoming singles events across Australia. Select a city to see what's on.
      </p>

      <section className="e4s-events-coming-soon">
        <div className="e4s-events-coming-soon__inner">
          <h2>Full Calendar Coming Soon</h2>
          <p>
            We're building a full events calendar with list and calendar views, so you can
            see exactly what's on and when. In the meantime, browse listings by city below —
            each organiser lists their upcoming events on their own page.
          </p>
        </div>
      </section>

      <section>
        <h2>Browse Events by City</h2>
        <nav className="e4s-city-grid" aria-label="Browse events by city">
          {cities.map((city) => (
            <Link key={city.slug} href={`/${toUrlSlug(city.slug)}`} className="e4s-city-grid__item">
              <span className="e4s-city-grid__name">{city.label}</span>
              <span className="e4s-city-grid__count">{city.listing_count} listings</span>
            </Link>
          ))}
        </nav>
      </section>

      <section>
        <h2>List Your Event</h2>
        <p>
          Running singles events? Get your events in front of thousands of singles across Australia.
          Calendar placement is available as an add-on to all paid listing packages.
        </p>
        <p><a href="/advertise">View advertising packages →</a></p>
      </section>
    </main>
  );
}
