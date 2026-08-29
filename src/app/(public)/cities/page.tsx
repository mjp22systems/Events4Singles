import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { CityDirectoryGrid } from "@/components/directory-sort";
import { IndexPage, PublicPageFoot } from "@/components/public-page";
import { getAllCities } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";
import { collectionPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Find Singles by City — Australia",
  description:
    "Find Australian singles events, businesses and services in your city. Browse speed dating, dinner parties, social clubs, life coaches and more by location.",
  path: "/cities",
  keywords: ["singles events by city", "Australian singles by city", "speed dating by city"],
});

const CITY_IMAGES: Record<string, string> = {
  sydney: "/images/cities/cards/home-city-sydney.webp",
  melbourne: "/images/cities/cards/home-city-melbourne.webp",
  brisbane: "/images/cities/cards/home-city-brisbane.webp",
  perth: "/images/cities/cards/home-city-perth.webp",
  adelaide: "/images/cities/cards/home-city-adelaide.webp",
  hobart: "/images/cities/cards/home-city-hobart.webp",
  tasmania: "/images/cities/cards/home-city-hobart.webp",
  "gold-coast": "/images/cities/cards/home-city-gold-coast.webp",
  canberra: "/images/cities/cards/home-city-canberra.webp",
  "byron-bay": "/images/cities/cards/home-city-byron-bay.webp",
  newcastle: "/images/cities/cards/home-city-newcastle.webp",
  darwin: "/images/cities/cards/home-city-darwin.webp",
  cairns: "/images/cities/cards/home-city-cairns.webp",
  "sunshine-coast": "/images/cities/cards/home-city-sunshine-coast.webp",
  wollongong: "/images/cities/cards/home-city-wollongong.webp",
  geelong: "/images/cities/cards/home-city-geelong.webp",
  "central-coast": "/images/cities/cards/home-city-central-coast.webp",
  toowoomba: "/images/cities/cards/home-city-toowoomba.webp",
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
    <IndexPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd({
            name: "Browse Singles Events by City",
            description: "Browse Australian cities and regions in the Events4Singles directory.",
            path: "/cities",
          })),
        }}
      />
      <CityDirectoryGrid
        cities={cityTiles}
        title="Browse by City"
        lead="Browse all Australian cities and regions in the Events4Singles directory. Select your city to explore speed dating, dinner parties, social clubs and more."
      />

      <PublicPageFoot>
        <h2>List Your Event</h2>
        <p>
          Running singles events in Australia?{" "}
          <Link href="/advertise">View advertising packages</Link> to get your
          business in front of singles in your city.
        </p>
      </PublicPageFoot>
    </IndexPage>
  );
}
