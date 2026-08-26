import type { Metadata } from "next";
import Link from "next/link";
import AdvertiseCard from "@/components/advertise-card";
import HeroImage from "@/components/hero-image";
import ListingsSection from "@/components/listings-section";
import PageSidebar from "@/components/page-sidebar";
import PromoBanners from "@/components/promo-banners";
import {
  EditorialIntro,
  ListingDirectoryPage,
  PageHero,
} from "@/components/listing-directory-page";
import { getAllFeaturedListings } from "@/lib/data";
import { slugToLabel, toDbSlug } from "@/lib/constants";
import type { Category, City, Listing } from "@/lib/types";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Featured Singles Listings - Australia",
  description:
    "Browse featured singles event organisers, venues, services and dating businesses across Australia.",
  path: "/featured-listings",
  keywords: ["featured singles listings", "singles businesses Australia", "featured dating services"],
});

type SearchParams = Promise<{
  category?: string | string[];
  city?: string | string[];
}>;

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function listingSlugs(value?: string | null) {
  return (value || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}

function listingCityLabels(value?: string | null) {
  return (value || "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

function filterFeaturedListings(
  listings: Listing[],
  activeCategoryDbSlug: string | null,
  activeCityDbSlug: string | null,
) {
  return listings.filter((listing) => {
    const categoryMatch =
      !activeCategoryDbSlug ||
      listingSlugs(listing.category_slugs || listing.category_slug).includes(activeCategoryDbSlug);
    const cityMatch =
      !activeCityDbSlug ||
      listingSlugs(listing.city_slugs || listing.city_slug).includes(activeCityDbSlug);

    return categoryMatch && cityMatch;
  });
}

function categoryFacets(listings: Listing[]): Category[] {
  const counts = new Map<string, number>();
  for (const listing of listings) {
    for (const slug of new Set(listingSlugs(listing.category_slugs || listing.category_slug))) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, listing_count]) => ({
      slug,
      label: slugToLabel(slug),
      parent_slug: null,
      description: null,
      seo_title: null,
      seo_description: null,
      seo_intro: null,
      hero_image_url: null,
      listing_count,
    }))
    .sort((a, b) => b.listing_count - a.listing_count || a.label.localeCompare(b.label));
}

function cityFacets(listings: Listing[]): City[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const listing of listings) {
    const slugs = listingSlugs(listing.city_slugs || listing.city_slug);
    const labels = listingCityLabels(listing.city_labels);
    for (const slug of new Set(slugs)) {
      const current = counts.get(slug);
      counts.set(slug, {
        label: current?.label || labels[slugs.indexOf(slug)] || slugToLabel(slug),
        count: (current?.count ?? 0) + 1,
      });
    }
  }
  return [...counts.entries()]
    .map(([slug, value]) => ({
      slug,
      label: value.label,
      state: null,
      seo_title: null,
      seo_description: null,
      listing_count: value.count,
    }))
    .sort((a, b) => b.listing_count - a.listing_count || a.label.localeCompare(b.label));
}

export default async function FeaturedListingsPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const activeCategoryDbSlug = firstParam(params.category)
    ? toDbSlug(firstParam(params.category) as string)
    : null;
  const activeCityDbSlug = firstParam(params.city)
    ? toDbSlug(firstParam(params.city) as string)
    : null;

  const listings = await getAllFeaturedListings();
  const filteredListings = filterFeaturedListings(
    listings,
    activeCategoryDbSlug,
    activeCityDbSlug,
  );
  const categoryOptions = categoryFacets(filterFeaturedListings(listings, null, activeCityDbSlug));
  const cityOptions = cityFacets(filterFeaturedListings(listings, activeCategoryDbSlug, null));

  const jsonLd = [
    collectionPageJsonLd({
      name: "Featured Singles Listings",
      description:
        "Featured singles event organisers, venues, services and dating businesses across Australia.",
      path: "/featured-listings",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Featured Listings", path: "/featured-listings" },
    ]),
  ];

  return (
    <ListingDirectoryPage
      jsonLd={jsonLd}
      bodyClasses={["e4s-page-category"]}
      hero={(
        <PageHero
          ariaLabel="Featured Listings"
          media={(
            <div className="e4s-page-hero__image">
              <HeroImage
                alt="Featured Listings"
                src="/images/optimized/home-cat-mixers.webp"
                fallbacks={[
                  "/images/home-cat-mixers.jpg",
                  "/images/optimized/home-cat-speed-dating.webp",
                ]}
              />
            </div>
          )}
          title="Featured Listings"
          subtext="Featured event organisers, venues and services for singles across Australia."
        />
      )}
      promo={<PromoBanners mode="featured" />}
      intro={(
        <EditorialIntro
          lead="These are paid featured placements from across the Events4Singles directory."
        >
          <p>
            Refine the showcase by category or city, or browse the full featured pool when you want a high-level view.
          </p>
        </EditorialIntro>
      )}
      sidebar={(
        <PageSidebar
          mode="featured"
          categories={categoryOptions}
          cities={cityOptions}
          activeCategoryDbSlug={activeCategoryDbSlug}
          activeCityDbSlug={activeCityDbSlug}
        />
      )}
    >
      <ListingsSection
        listings={filteredListings}
        title="Featured Listings"
      />
      {filteredListings.length === 0 && (activeCategoryDbSlug || activeCityDbSlug) && (
        <div className="e4s-empty-state">
          <p>No featured listings match those refinements.</p>
          <Link href="/featured-listings">Show all featured listings</Link>
        </div>
      )}
      <AdvertiseCard />
    </ListingDirectoryPage>
  );
}
