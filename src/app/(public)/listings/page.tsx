import type { Metadata } from "next";
import Link from "next/link";
import AdvertiseCard from "@/components/advertise-card";
import BodyClass from "@/components/body-class";
import HeroImage from "@/components/hero-image";
import ListingsSection from "@/components/listings-section";
import PageSidebar from "@/components/page-sidebar";
import PromoBanners from "@/components/promo-banners";
import {
  getAllFeaturedListings,
  getFeaturedListingCategories,
  getFeaturedListingCities,
} from "@/lib/data";
import { toDbSlug } from "@/lib/constants";
import type { Listing } from "@/lib/types";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Featured Singles Listings - Australia",
  description:
    "Browse featured singles event organisers, venues, services and dating businesses across Australia.",
  path: "/listings",
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

export default async function ListingsPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const activeCategoryDbSlug = firstParam(params.category)
    ? toDbSlug(firstParam(params.category) as string)
    : null;
  const activeCityDbSlug = firstParam(params.city)
    ? toDbSlug(firstParam(params.city) as string)
    : null;

  const [listings, categories, cities] = await Promise.all([
    getAllFeaturedListings(),
    getFeaturedListingCategories(),
    getFeaturedListingCities(),
  ]);
  const filteredListings = filterFeaturedListings(
    listings,
    activeCategoryDbSlug,
    activeCityDbSlug,
  );

  const jsonLd = [
    collectionPageJsonLd({
      name: "Featured Singles Listings",
      description:
        "Featured singles event organisers, venues, services and dating businesses across Australia.",
      path: "/listings",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Listings", path: "/listings" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-category" />

      <section aria-label="Featured Listings" className="e4s-page-hero">
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
        <div className="e4s-page-hero__caption">
          <h1>Featured Listings</h1>
          <p className="e4s-lead">
            Featured event organisers, venues and services for singles across Australia.
          </p>
        </div>
      </section>

      <PromoBanners mode="featured" />

      <section className="e4s-page-intro e4s-page-intro--editorial">
        <p className="e4s-page-intro__lead">
          These are paid featured placements from across the Events4Singles directory.
        </p>
        <p>
          Refine the showcase by category or city, or browse the full featured pool when you want a high-level view.
        </p>
      </section>

      <div className="e4s-page-with-sidebar">
        <main className="e4s-category-template" id="site-content">
          <ListingsSection
            listings={filteredListings}
            title="Featured Listings"
          />
          {filteredListings.length === 0 && (activeCategoryDbSlug || activeCityDbSlug) && (
            <div className="e4s-empty-state">
              <p>No featured listings match those refinements.</p>
              <Link href="/listings">Show all featured listings</Link>
            </div>
          )}
          <AdvertiseCard />
        </main>
        <PageSidebar
          mode="featured"
          categories={categories}
          cities={cities}
          activeCategoryDbSlug={activeCategoryDbSlug}
          activeCityDbSlug={activeCityDbSlug}
        />
      </div>
    </>
  );
}
