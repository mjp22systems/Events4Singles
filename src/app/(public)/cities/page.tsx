import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { CityDirectoryGrid } from "@/components/directory-sort";
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

type CitiesPageProps = {
  searchParams?: Promise<{ sort?: string | string[] }>;
};

export default async function CitiesPage({ searchParams }: CitiesPageProps) {
  if ((await searchParams)?.sort) permanentRedirect("/cities");

  const cities = await getAllCities();
  const cityTiles = cities.map((city) => {
    const slug = toUrlSlug(city.slug);
    return {
      href: `/${slug}`,
      imageUrl: CITY_IMAGES[slug] ?? null,
      label: city.label,
      listingCount: city.listing_count,
      slug: city.slug,
    };
  });

  return (
    <main className="e4s-index-page" id="site-content">
      <CityDirectoryGrid
        cities={cityTiles}
        title="Browse by City"
        lead="Browse all Australian cities and regions in the Events4Singles directory. Select your city to explore speed dating, dinner parties, social clubs and more."
      />

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
