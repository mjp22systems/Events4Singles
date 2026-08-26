import { notFound } from "next/navigation";
import Link from "next/link";
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
  getSubcategoriesForCategory,
} from "@/lib/data";
import { toDbSlug } from "@/lib/constants";
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
  categorySeoFooterCopy,
  cityHeroSubtext,
  cityIntroCopy,
  citySeoFooterCopy,
} from "@/lib/page-copy";
import SeoSupportSection from "@/components/seo-support-section";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { getCategoryCardImage } from "@/lib/category-card-assets";
import { getCityHeroFallbacks, getCityHeroImage } from "@/lib/city-hero-assets";

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
      title: cityMeta.seo_title || `Singles Events in ${cityMeta.label}`,
      description:
        cityMeta.seo_description ||
        `Find singles events, speed dating, dinner parties, dance classes, social clubs and dating services in ${cityMeta.label}, Australia.`,
      path: `/${param}`,
      keywords: [
        `singles events ${cityMeta.label}`,
        `events for singles ${cityMeta.label}`,
        `speed dating ${cityMeta.label}`,
      ],
    });
  }

  const catMeta = await getCategoryMeta(dbSlug);
  if (!catMeta) return {};
  return pageMetadata({
    title: catMeta.seo_title || `${catMeta.label} for Singles Australia`,
    description:
      catMeta.seo_description ||
      catMeta.description ||
      `Find ${catMeta.label.toLowerCase()} events, organisers and services for singles across Australia.`,
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
    const footerCopy = citySeoFooterCopy(cityMeta, categories.length);
    const jsonLd = [
      collectionPageJsonLd({
        name: `Singles Events in ${cityMeta.label}`,
        description: intro.lead,
        path: `/${param}`,
      }),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: cityMeta.label, path: `/${param}` },
      ]),
    ];

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BodyClass add="e4s-page-location" />
        <BodyClass add={`e4s-city-${param}`} />
        <LocationPager cities={allCities} currentDbSlug={dbSlug} />

        <section aria-label={`Singles events in ${cityMeta.label}`} className="e4s-page-hero">
          <div className="e4s-page-hero__image">
            <HeroImage
              alt={cityMeta.label}
              src={getCityHeroImage(param)}
              fallbacks={getCityHeroFallbacks(param)}
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
          <Link className="e4s-calendar-cta" href="/events">
            <span>Events Calendar</span>
            <strong>View {cityMeta.label} Singles Events</strong>
            <em>See upcoming dates, activities and special events</em>
          </Link>
          {categories.length > 0 && (
            <CityCategorySelect
              categories={categories}
              cityUrlSlug={param}
              cityLabel={cityMeta.label}
            />
          )}
        </section>
        <SeoSupportSection {...footerCopy} />
      </>
    );
  }

  // ── Category overview page ──────────────────────────────────────────────────
  const catMeta = await getCategoryMeta(dbSlug);
  if (!catMeta) notFound();
  const categoryImage = catMeta.hero_image_url ?? getCategoryCardImage(param);

  const [cities, listings, allCats] = await Promise.all([
    getCitiesForCategory(dbSlug),
    getListingsForCategory(dbSlug),
    getAllCategories(),
  ]);
  const parentCats = allCats.filter((c) => !c.parent_slug);
  const subcategories = await getSubcategoriesForCategory(dbSlug);
  const intro = categoryIntroCopy(catMeta, cities.length, listings.length);
  const footerCopy = categorySeoFooterCopy(catMeta, cities.length);
  const jsonLd = [
    collectionPageJsonLd({
      name: `${catMeta.label} for Singles`,
      description: intro.lead,
      path: `/${param}`,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: catMeta.label, path: `/${param}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-category" />
      <CategoryPager categories={parentCats} currentDbSlug={dbSlug} />

      <section aria-label={catMeta.label} className="e4s-page-hero">
        <div className="e4s-page-hero__image">
          <HeroImage
            alt={catMeta.label}
            src={categoryImage ?? `/images/category-hero-${param}.svg`}
            fallbacks={categoryImage ? [`/images/category-hero-${param}.svg`] : []}
          />
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
          subcategories={subcategories}
        />
      </div>
      <SeoSupportSection {...footerCopy} />
    </>
  );
}
