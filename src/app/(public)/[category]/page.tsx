import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
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
import CategoryPager from "@/components/category-pager";
import CategoryCitySelect from "@/components/category-city-select";
import PromoBanners from "@/components/promo-banners";
import PageSidebar from "@/components/page-sidebar";
import CityCategorySelect from "@/components/city-category-select";
import ListingsSection from "@/components/listings-section";
import {
  categoryHeroSubtext,
  categoryIntroCopy,
  cityHeroSubtext,
  cityIntroCopy,
} from "@/lib/page-copy";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: param } = await params;
  const dbSlug = toDbSlug(param);

  const cityMeta = await getCityMeta(dbSlug);
  if (cityMeta) {
    return pageMetadata({
      title: `Singles Events in ${cityMeta.label}`,
      description: `Find speed dating, dinner parties, dance classes and social clubs for singles in ${cityMeta.label}, Australia.`,
      path: `/${param}`,
      keywords: [`singles events ${cityMeta.label}`, `events for singles ${cityMeta.label}`],
    });
  }

  const catMeta = await getCategoryMeta(dbSlug);
  if (!catMeta) return {};
  return pageMetadata({
    title: `${catMeta.label} - Australian Singles Events`,
    description:
      catMeta.description ||
      `Find ${catMeta.label.toLowerCase()} events for singles across Australia.`,
    path: `/${param}`,
    keywords: [catMeta.label, `${catMeta.label} for singles`],
  });
}

export default async function CategoryOrCityPage({ params }: Props) {
  const { category: param } = await params;
  const dbSlug = toDbSlug(param);

  // ── City overview page ──────────────────────────────────────────────────────
  const cityMeta = await getCityMeta(dbSlug);
  if (cityMeta) {
    const allCities = await getAllCities();
    const listings = await getListingsForCity(dbSlug);
    const categories = await getCategoriesForCity(dbSlug);
    const intro = cityIntroCopy(cityMeta, listings.length, categories.length);

    return (
      <>
        <BodyClass add="e4s-page-location" />
        <BodyClass add={`e4s-city-${param}`} />
        <LocationPager cities={allCities} currentDbSlug={dbSlug} />

        <section aria-label={`Singles events in ${cityMeta.label}`} className="e4s-page-hero">
          <div className="e4s-page-hero__image">
            <HeroImage
              alt={cityMeta.label}
              src={`/images/location-photo-${param}-photo.jpg`}
              fallbacks={[`/images/location-photo-${param}-v2.png`, `/images/location-hero-${param}.svg`]}
            />
          </div>
          <div className="e4s-page-hero__caption">
            <h1>{cityMeta.label}</h1>
            <p>{cityHeroSubtext(cityMeta)}</p>
          </div>
        </section>

        <PromoBanners mode="city" cityDbSlug={dbSlug} />

        <section className="e4s-page-intro e4s-page-intro--editorial">
          <p className="e4s-page-intro__lead">{intro.lead}</p>
          <p>{intro.detail}</p>
          <p>{intro.support}</p>
        </section>

        <div className="e4s-page-with-sidebar">
          <main className="e4s-category-template" id="site-content">
            <ListingsSection
              listings={listings}
              title={cityMeta.label}
              filterCategories={categories}
            />
            <AdvertiseCard />
          </main>
          <PageSidebar mode="city" categories={categories} cityUrlSlug={param} />
        </div>

        <section className="e4s-location-followup">
          <a className="e4s-calendar-cta" href="/events">
            <span>Events Calendar</span>
            <strong>View {cityMeta.label} Singles Events</strong>
            <em>See upcoming dates, activities and special events</em>
          </a>
          {categories.length > 0 && (
            <CityCategorySelect
              categories={categories}
              cityUrlSlug={param}
              cityLabel={cityMeta.label}
            />
          )}
        </section>
      </>
    );
  }

  // ── Category overview page ──────────────────────────────────────────────────
  const catMeta = await getCategoryMeta(dbSlug);
  if (!catMeta) notFound();

  const [cities, listings, allCats] = await Promise.all([
    getCitiesForCategory(dbSlug),
    getListingsForCategory(dbSlug),
    getAllCategories(),
  ]);
  const parentCats = allCats.filter((c) => !c.parent_slug);
  const intro = categoryIntroCopy(catMeta, cities.length, listings.length);

  return (
    <>
      <BodyClass add="e4s-page-category" />
      <CategoryPager categories={parentCats} currentDbSlug={dbSlug} />

      <section aria-label={catMeta.label} className="e4s-page-hero">
        <div className="e4s-page-hero__image">
          <HeroImage alt={catMeta.label} src={`/images/category-hero-${param}.svg`} />
        </div>
        <div className="e4s-page-hero__caption">
          <h1>{catMeta.label}</h1>
          <p>{categoryHeroSubtext(catMeta)}</p>
        </div>
        {cities.length > 0 && (
          <CategoryCitySelect cities={cities} categoryUrlSlug={param} />
        )}
      </section>

      <PromoBanners mode="category" categoryDbSlug={dbSlug} />

      <section className="e4s-page-intro e4s-page-intro--editorial">
        <p className="e4s-page-intro__lead">{intro.lead}</p>
        <p>{intro.detail}</p>
        <p>{intro.support}</p>
      </section>

      <div className="e4s-page-with-sidebar">
        <main className="e4s-category-template" id="site-content">
          <ListingsSection
            listings={listings}
            title={catMeta.label}
            filterCities={cities}
          />
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
