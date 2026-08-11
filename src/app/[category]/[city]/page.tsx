import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCategoryCityParams,
  getCategoryMeta,
  getCitiesForCategory,
  getListingsForPage,
} from "@/lib/data";
import { toDbSlug, toUrlSlug } from "@/lib/constants";
import ListingCard from "@/components/listing-card";
import AdvertiseCard from "@/components/advertise-card";
import NavSelect from "@/components/nav-select";
import BodyClass from "@/components/body-class";
import HeroImage from "@/components/hero-image";
import PromoBanners from "@/components/promo-banners";
import CategoryCityPager from "@/components/category-city-pager";
import PageSidebar from "@/components/page-sidebar";

interface Props {
  params: Promise<{ category: string; city: string }>;
}

export async function generateStaticParams() {
  return getAllCategoryCityParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, city } = await params;
  const catMeta = getCategoryMeta(toDbSlug(category));
  if (!catMeta) return {};
  const cityLabel = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${catMeta.label} in ${cityLabel}`,
    description: `Find ${catMeta.label.toLowerCase()} events for singles in ${cityLabel}, Australia.`,
  };
}

export default async function CategoryCityPage({ params }: Props) {
  const { category, city } = await params;
  const categoryDbSlug = toDbSlug(category);
  const cityDbSlug = toDbSlug(city);

  const catMeta = getCategoryMeta(categoryDbSlug);
  if (!catMeta) notFound();

  const cities = getCitiesForCategory(categoryDbSlug);
  const cityMeta = cities.find((c) => c.slug === cityDbSlug);
  if (!cityMeta) notFound();

  const listings = getListingsForPage(categoryDbSlug, cityDbSlug);

  return (
    <>
      <BodyClass add="e4s-page-category" />
      <CategoryCityPager cities={cities} currentCityDbSlug={cityDbSlug} categoryUrlSlug={category} />

      <nav aria-label={`${catMeta.label} city navigation`} className="e4s-category-child-nav e4s-category-child-nav--has-sidebar">
        <Link className="e4s-category-child-nav__back" href={`/${category}`}>
          Back to {catMeta.label}
        </Link>
        <label className="e4s-category-child-nav__control">
          <span>View another city</span>
          <NavSelect
            cities={cities}
            categoryUrlSlug={category}
            currentCitySlug={cityDbSlug}
          />
        </label>
      </nav>

      <section aria-label={`${catMeta.label} ${cityMeta.label}`} className="e4s-page-hero">
        <div className="e4s-page-hero__image">
          <HeroImage
            alt={`${catMeta.label} ${cityMeta.label}`}
            src={`/images/category-hero-${category}-${city.replace(/-/g, "")}.svg`}
          />
        </div>
        <div className="e4s-page-hero__caption">
          <h1>{catMeta.label} {cityMeta.label}</h1>
          <p>Australian singles directory</p>
        </div>
      </section>

      <PromoBanners mode="category" categoryDbSlug={categoryDbSlug} cityDbSlug={cityDbSlug} />

      <section className="e4s-page-intro">
        <h1>{catMeta.label} {cityMeta.label}</h1>
        <p>
          {catMeta.seo_intro ||
            catMeta.description ||
            `Browse ${catMeta.label.toLowerCase()} listings for singles in ${cityMeta.label}. ${listings.length} listing${listings.length !== 1 ? "s" : ""} available.`}
        </p>
      </section>

      <div className="e4s-page-with-sidebar">
        <main className="e4s-category-template" id="site-content">
          {listings.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center", width: "100%" }}>
              <p>No listings found for {catMeta.label} in {cityMeta.label}.</p>
              <Link href={`/${category}`} style={{ color: "var(--e4s-pink)" }}>
                Browse other cities
              </Link>
            </div>
          )}
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
          <AdvertiseCard />
        </main>
        <PageSidebar
          mode="category"
          cities={cities}
          categoryUrlSlug={category}
          currentCityDbSlug={cityDbSlug}
          backLabel={catMeta.label}
        />
      </div>
    </>
  );
}
