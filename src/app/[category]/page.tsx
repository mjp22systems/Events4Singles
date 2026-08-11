import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategoryParams,
  getAllCities,
  getCategoriesForCity,
  getCategoryMeta,
  getCitiesForCategory,
  getCityMeta,
  getListingsForCategory,
  getListingsForCity,
} from "@/lib/data";
import { toDbSlug, toUrlSlug } from "@/lib/constants";
import ListingCard from "@/components/listing-card";
import AdvertiseCard from "@/components/advertise-card";
import BodyClass from "@/components/body-class";
import HeroImage from "@/components/hero-image";
import LocationPager from "@/components/location-pager";
import CategoryCitySelect from "@/components/category-city-select";
import PromoBanners from "@/components/promo-banners";
import PageSidebar from "@/components/page-sidebar";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const catParams = getAllCategoryParams();
  const cityParams = getAllCities().map((c) => ({ category: toUrlSlug(c.slug) }));
  const seen = new Set<string>();
  return [...catParams, ...cityParams].filter((p) => {
    if (seen.has(p.category)) return false;
    seen.add(p.category);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: param } = await params;
  const dbSlug = toDbSlug(param);

  const cityMeta = getCityMeta(dbSlug);
  if (cityMeta) {
    return {
      title: `Singles Events in ${cityMeta.label}`,
      description: `Find speed dating, dinner parties, dance classes and social clubs for singles in ${cityMeta.label}, Australia.`,
    };
  }

  const catMeta = getCategoryMeta(dbSlug);
  if (!catMeta) return {};
  return {
    title: `${catMeta.label} — Australian Singles Events`,
    description:
      catMeta.description ||
      `Find ${catMeta.label.toLowerCase()} events for singles across Australia.`,
  };
}

export default async function CategoryOrCityPage({ params }: Props) {
  const { category: param } = await params;
  const dbSlug = toDbSlug(param);

  // ── City overview page ──────────────────────────────────────────────────────
  const cityMeta = getCityMeta(dbSlug);
  if (cityMeta) {
    const allCities = getAllCities();
    const listings = getListingsForCity(dbSlug);
    const categories = getCategoriesForCity(dbSlug);

    return (
      <>
        <BodyClass add="e4s-page-location" />
        <LocationPager cities={allCities} currentDbSlug={dbSlug} />

        <section aria-label={`Singles events in ${cityMeta.label}`} className="e4s-page-hero">
          <div className="e4s-page-hero__image">
            <HeroImage
              alt={cityMeta.label}
              src={`/images/location-photo-${param}-v2.png`}
              fallbackSrc={`/images/location-hero-${param}.svg`}
            />
          </div>
          <div className="e4s-page-hero__caption">
            <h1>Singles Events in {cityMeta.label}</h1>
            <p>Australian singles directory</p>
          </div>
        </section>

        <PromoBanners mode="city" cityDbSlug={dbSlug} />

        <section className="e4s-page-intro">
          <p>
            Browse singles events across {cityMeta.label} — speed dating, dinner parties,
            dance classes, social clubs and more. {listings.length} listing
            {listings.length !== 1 ? "s" : ""} available.
          </p>
        </section>

        <div className="e4s-page-with-sidebar">
          <main className="e4s-category-template" id="site-content">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
            <AdvertiseCard />
          </main>
          <PageSidebar mode="city" categories={categories} cityUrlSlug={param} />
        </div>
      </>
    );
  }

  // ── Category overview page ──────────────────────────────────────────────────
  const catMeta = getCategoryMeta(dbSlug);
  if (!catMeta) notFound();

  const cities = getCitiesForCategory(dbSlug);
  const listings = getListingsForCategory(dbSlug);

  return (
    <>
      <BodyClass add="e4s-page-category" />

      <section aria-label={catMeta.label} className="e4s-page-hero">
        <div className="e4s-page-hero__image">
          <HeroImage alt={catMeta.label} src={`/images/category-hero-${param}.svg`} />
        </div>
        <div className="e4s-page-hero__caption">
          <h1>{catMeta.label}</h1>
          <p>Australian singles directory</p>
        </div>
        {cities.length > 0 && (
          <CategoryCitySelect cities={cities} categoryUrlSlug={param} />
        )}
      </section>

      <PromoBanners mode="category" categoryDbSlug={dbSlug} />

      <section className="e4s-page-intro">
        <h1>{catMeta.label}</h1>
        <p>
          {catMeta.description ||
            `Browse ${catMeta.label.toLowerCase()} events for singles across Australia. Filter by city using the dropdown above.`}
        </p>
      </section>

      <div className="e4s-page-with-sidebar">
        <main className="e4s-category-template" id="site-content">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
          <AdvertiseCard />
        </main>
        <PageSidebar
          mode="category"
          cities={cities}
          categoryUrlSlug={param}
        />
      </div>
    </>
  );
}
