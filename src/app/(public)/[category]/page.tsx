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
import HeroImage from "@/components/hero-image";
import LocationPager from "@/components/location-pager";
import CategoryPager from "@/components/category-pager";
import CategoryCitySelect from "@/components/category-city-select";
import NavSelect from "@/components/nav-select";
import PromoBanners from "@/components/promo-banners";
import PageSidebar from "@/components/page-sidebar";
import CityCategorySelect from "@/components/city-category-select";
import ListingsSection from "@/components/listings-section";
import {
  EditorialIntro,
  ListingDirectoryPage,
  PageHero,
} from "@/components/listing-directory-page";
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

  // City overview page
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
      <ListingDirectoryPage
        jsonLd={jsonLd}
        bodyClasses={["e4s-page-location", `e4s-city-${param}`]}
        beforeHero={<LocationPager cities={allCities} currentDbSlug={dbSlug} />}
        hero={(
          <PageHero
            ariaLabel={`Singles events in ${cityMeta.label}`}
            media={(
              <div className="e4s-page-hero__image">
                <HeroImage
                  alt={cityMeta.label}
                  src={getCityHeroImage(param)}
                  fallbacks={getCityHeroFallbacks(param)}
                />
              </div>
            )}
            title={cityMeta.label}
            subtext={cityHeroSubtext(cityMeta)}
          />
        )}
        promo={<PromoBanners mode="city" cityDbSlug={dbSlug} />}
        intro={(
          <EditorialIntro
            lead={intro.lead}
            detail={intro.detail}
            support={intro.support}
          />
        )}
        sidebar={<PageSidebar mode="city" categories={categories} cityUrlSlug={param} />}
        after={(
          <>
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
        )}
      >
        <ListingsSection
          listings={listings}
          title={cityMeta.label}
          filterCategories={categories}
        />
        <AdvertiseCard />
      </ListingDirectoryPage>
    );
  }

  // Category overview page
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
    <ListingDirectoryPage
      jsonLd={jsonLd}
      bodyClasses={["e4s-page-category"]}
      beforeHero={(
        <>
          <CategoryPager categories={parentCats} currentDbSlug={dbSlug} />
          <nav
            aria-label={`${catMeta.label} mobile navigation`}
            className="e4s-category-child-nav e4s-category-child-nav--category-mobile"
          >
            <Link className="e4s-category-child-nav__back" href="/categories">
              All Categories
            </Link>
            {cities.length > 0 ? (
              <label className="e4s-category-child-nav__control">
                <span>View city</span>
                <NavSelect
                  cities={cities}
                  categoryUrlSlug={param}
                  placeholder="Select city"
                />
              </label>
            ) : null}
          </nav>
        </>
      )}
      hero={(
        <PageHero
          ariaLabel={catMeta.label}
          media={(
            <div className="e4s-page-hero__image">
              <HeroImage
                alt={catMeta.label}
                src={categoryImage ?? `/images/category-hero-${param}.svg`}
                fallbacks={categoryImage ? [`/images/category-hero-${param}.svg`] : []}
              />
            </div>
          )}
          title={catMeta.label}
          subtext={categoryHeroSubtext(catMeta)}
        >
          {cities.length > 0 && (
            <CategoryCitySelect cities={cities} categoryUrlSlug={param} />
          )}
        </PageHero>
      )}
      promo={<PromoBanners mode="category" categoryDbSlug={dbSlug} />}
      intro={(
        <EditorialIntro
          lead={intro.lead}
          detail={intro.detail}
          support={intro.support}
        />
      )}
      sidebar={(
        <PageSidebar
          mode="category"
          cities={cities}
          categoryUrlSlug={param}
          subcategories={subcategories}
        />
      )}
      after={<SeoSupportSection {...footerCopy} />}
    >
      <ListingsSection
        listings={listings}
        title={catMeta.label}
        filterCities={cities}
      />
      <AdvertiseCard />
    </ListingDirectoryPage>
  );
}
