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
  sydney: "/images/optimized/home-city-sydney.webp",
  melbourne: "/images/optimized/home-city-melbourne.webp",
  brisbane: "/images/optimized/home-city-brisbane.webp",
  perth: "/images/optimized/home-city-perth.webp",
  adelaide: "/images/optimized/home-city-adelaide.webp",
  hobart: "/images/optimized/home-city-hobart.webp",
  "gold-coast": "/images/optimized/home-city-gold-coast.webp",
  canberra: "/images/optimized/home-city-canberra.webp",
  "byron-bay": "/images/optimized/home-city-byron-bay.webp",
  newcastle: "/images/optimized/home-city-newcastle.webp",
  darwin: "/images/optimized/home-city-darwin.webp",
  cairns: "/images/optimized/home-city-cairns.webp",
  "sunshine-coast": "/images/optimized/home-city-sunshine-coast.webp",
  wollongong: "/images/optimized/home-city-wollongong.webp",
  geelong: "/images/optimized/home-city-geelong.webp",
  "central-coast": "/images/optimized/home-city-central-coast.webp",
  toowoomba: "/images/optimized/home-city-toowoomba.webp",
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
