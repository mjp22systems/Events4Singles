import type { Metadata } from "next";
import Link from "next/link";
import { getAllCities } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Find Singles by City — Australia",
  description:
    "Find Australian singles events, businesses and services in your city. Browse speed dating, dinner parties, social clubs, life coaches and more by location.",
};

const CITY_IMAGES: Record<string, string> = {
  sydney: "/images/home-city-sydney.jpg",
  melbourne: "/images/home-city-melbourne.jpg",
  brisbane: "/images/home-city-brisbane.jpg",
  perth: "/images/home-city-perth.jpg",
  adelaide: "/images/home-city-adelaide.jpg",
  hobart: "/images/home-city-hobart.jpg",
  "gold-coast": "/images/home-city-gold-coast.jpg",
  canberra: "/images/home-city-canberra.jpg",
  "byron-bay": "/images/home-city-byron-bay.jpg",
  newcastle: "/images/home-city-newcastle.jpg",
  darwin: "/images/home-city-darwin.jpg",
  cairns: "/images/home-city-cairns.jpg",
  "sunshine-coast": "/images/home-city-sunshine-coast.jpg",
  wollongong: "/images/home-city-wollongong.jpg",
  geelong: "/images/home-city-geelong.jpg",
  "central-coast": "/images/home-city-central-coast.jpg",
  toowoomba: "/images/home-city-toowoomba.jpg",
};

export default async function CitiesPage() {
  const cities = await getAllCities();

  return (
    <main id="site-content">
      <div className="e4s-shell e4s-page-head">
        <h1>Browse by City</h1>
        <p className="e4s-lead">
          Browse all Australian cities and regions in the Events4Singles directory.
          Select your city to explore speed dating, dinner parties, social clubs and more.
        </p>
      </div>

      <div className="e4s-shell e4s-home-city-grid">
        {cities.map((city) => {
          const slug = toUrlSlug(city.slug);
          const img = CITY_IMAGES[slug];
          return (
            <Link key={city.slug} className="e4s-home-city-tile" href={`/${slug}`}>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={city.label} loading="lazy" src={img} />
              ) : (
                <div className="e4s-home-city-tile__placeholder" aria-hidden="true" />
              )}
              <span>{city.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="e4s-shell e4s-page-foot">
        <h2>List Your Event</h2>
        <p>
          Running singles events in Australia?{" "}
          <Link href="/advertise">View advertising packages</Link> to get your
          business in front of singles in your city.
        </p>
      </div>
    </main>
  );
}
