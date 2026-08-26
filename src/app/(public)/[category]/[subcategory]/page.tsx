import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryMeta,
  getCitiesForCategory,
  getListingsForPage,
  getListingsForCategory,
} from "@/lib/data";
import { categoryChildDbSlugCandidates, toDbSlug, toUrlSlug } from "@/lib/constants";
import ListingsSection from "@/components/listings-section";
import AdvertiseCard from "@/components/advertise-card";
import NavSelect from "@/components/nav-select";
import BodyClass from "@/components/body-class";
import CategoryCitySelect from "@/components/category-city-select";
import CategoryCityHeroImage from "@/components/category-city-hero-image";
import PromoBanners from "@/components/promo-banners";
import CategoryCityPager from "@/components/category-city-pager";
import PageSidebar from "@/components/page-sidebar";
import SeoSupportSection from "@/components/seo-support-section";
import DanceStylesGuide from "@/components/dance-styles-guide";
import {
  categoryCityHeroSubtext,
  categoryCityIntroCopy,
  categoryCitySeoFooterCopy,
  categoryHeroSubtext,
  categoryIntroCopy,
  categorySeoFooterCopy,
} from "@/lib/page-copy";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { getCategoryCardImage } from "@/lib/category-card-assets";
import { getCityHeroFallbacks, getCityHeroImage } from "@/lib/city-hero-assets";

interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

export const dynamic = "force-dynamic";

async function getChildCategoryMeta(parentDbSlug: string, childUrlSegment: string) {
  for (const candidate of categoryChildDbSlugCandidates(parentDbSlug, childUrlSegment)) {
    const childMeta = await getCategoryMeta(candidate);
    if (childMeta?.parent_slug === parentDbSlug) return childMeta;
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params;
  const categoryDbSlug = toDbSlug(category);
  const catMeta = await getCategoryMeta(categoryDbSlug);
  if (!catMeta) return {};
  const childMeta = await getChildCategoryMeta(categoryDbSlug, subcategory);
  if (childMeta) {
    if (categoryDbSlug === "dance_classes" && childMeta.slug === "dance_styles") {
      return pageMetadata({
        title: "Dance Styles for Singles | Events4Singles",
        description:
          "Explore dance styles, beginner-friendly class paths and social dance options for singles, from salsa and tango to swing, Ceroc, ballroom and dance fitness.",
        path: "/dance-classes/styles",
        keywords: ["dance styles", "dance classes for singles", "adult beginner dance classes"],
      });
    }
    return pageMetadata({
      title: `${childMeta.label} in ${catMeta.label}`,
      description:
        childMeta.seo_description ||
        `Find ${childMeta.label.toLowerCase()} listings, classes and social dance options for singles across Australia.`,
      path: `/${category}/${subcategory}`,
      keywords: [
        childMeta.label,
        `${childMeta.label} for singles`,
        `${catMeta.label} ${childMeta.label}`,
      ],
    });
  }
  const cityLabel = subcategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return pageMetadata({
    title: `${catMeta.label} in ${cityLabel}`,
    description: `Find ${catMeta.label.toLowerCase()} events, organisers and services for singles in ${cityLabel}, Australia.`,
    path: `/${category}/${subcategory}`,
    keywords: [
      `${catMeta.label} ${cityLabel}`,
      `${catMeta.label} for singles ${cityLabel}`,
      `singles events ${cityLabel}`,
    ],
  });
}

export default async function CategoryCityPage({ params }: Props) {
  const { category, subcategory } = await params;
  const categoryDbSlug = toDbSlug(category);
  const cityDbSlug = toDbSlug(subcategory);

  const catMeta = await getCategoryMeta(categoryDbSlug);
  if (!catMeta) notFound();

  const childMeta = await getChildCategoryMeta(categoryDbSlug, subcategory);
  if (childMeta) {
    if (categoryDbSlug === "dance_classes" && childMeta.slug === "dance_styles") {
      return <DanceStylesGuide />;
    }

    const subcategoryUrlSlug = `${category}/${subcategory}`;
    const [cities, listings] = await Promise.all([
      getCitiesForCategory(childMeta.slug),
      getListingsForCategory(childMeta.slug),
    ]);
    const intro = categoryIntroCopy(childMeta, cities.length, listings.length);
    const footerCopy = categorySeoFooterCopy(childMeta, cities.length);
    const parentCardImage = getCategoryCardImage(category);
    const parentImage = catMeta.hero_image_url ?? parentCardImage ?? `/images/category-hero-${category}.svg`;
    const parentImageFallbacks = [
      ...(catMeta.hero_image_url && parentCardImage ? [parentCardImage] : []),
      `/images/category-hero-${category}.svg`,
    ];
    const childUrlSlug = toUrlSlug(childMeta.slug);
    const childCardImage = getCategoryCardImage(childUrlSlug);
    const childImage = childMeta.hero_image_url ?? childCardImage ?? `/images/category-hero-${childUrlSlug}.svg`;
    const childImageFallbacks = [
      ...(childMeta.hero_image_url && childCardImage ? [childCardImage] : []),
      `/images/category-hero-${childUrlSlug}.svg`,
    ];
    const jsonLd = [
      collectionPageJsonLd({
        name: `${childMeta.label} for Singles`,
        description: intro.lead,
        path: `/${subcategoryUrlSlug}`,
      }),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: catMeta.label, path: `/${category}` },
        { name: childMeta.label, path: `/${subcategoryUrlSlug}` },
      ]),
    ];

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BodyClass add="e4s-page-category" />
        <BodyClass add="e4s-page-child" />

        <nav aria-label={`${childMeta.label} navigation`} className="e4s-category-child-nav e4s-category-child-nav--has-sidebar">
          <Link className="e4s-category-child-nav__back" href={`/${category}`}>
            Back to {catMeta.label}
          </Link>
        </nav>

        <section aria-label={childMeta.label} className="e4s-page-hero">
          <CategoryCityHeroImage
            alt={childMeta.label}
            categoryImage={parentImage}
            categoryFallbacks={parentImageFallbacks}
            cityImage={childImage}
            cityFallbacks={childImageFallbacks}
          />
          <div className="e4s-page-hero__caption">
            <h1>{childMeta.label}</h1>
            <p>{categoryHeroSubtext(childMeta)}</p>
          </div>
          {cities.length > 0 && (
            <CategoryCitySelect cities={cities} categoryUrlSlug={subcategoryUrlSlug} />
          )}
        </section>

        <PromoBanners mode="category" categoryDbSlug={childMeta.slug} />

        <section className="e4s-page-intro e4s-page-intro--editorial">
          <p className="e4s-page-intro__lead">{intro.lead}</p>
          <p>{intro.detail}</p>
          <p>{intro.support}</p>
        </section>

        <div className="e4s-page-with-sidebar">
          <main className="e4s-category-template" id="site-content">
            <ListingsSection
              listings={listings}
              title={childMeta.label}
              filterCities={cities}
            />
            <AdvertiseCard />
          </main>
          <PageSidebar
            mode="category"
            cities={cities}
            categoryUrlSlug={subcategoryUrlSlug}
            backLabel={catMeta.label}
            backHref={`/${category}`}
          />
        </div>
        <SeoSupportSection {...footerCopy} />
      </>
    );
  }

  const cities = await getCitiesForCategory(categoryDbSlug);
  const cityMeta = cities.find((c) => c.slug === cityDbSlug);
  if (!cityMeta) notFound();

  const listings = await getListingsForPage(categoryDbSlug, cityDbSlug);
  const intro = categoryCityIntroCopy(catMeta, cityMeta, listings.length);
  const footerCopy = categoryCitySeoFooterCopy(catMeta, cityMeta, listings.length);
  const categoryCardImage = getCategoryCardImage(category);
  const categoryImage = catMeta.hero_image_url ?? categoryCardImage ?? `/images/category-hero-${category}.svg`;
  const categoryImageFallbacks = [
    ...(catMeta.hero_image_url && categoryCardImage ? [categoryCardImage] : []),
    `/images/category-hero-${category}.svg`,
  ];
  const cityImage = getCityHeroImage(subcategory);
  const jsonLd = [
    collectionPageJsonLd({
      name: `${catMeta.label} in ${cityMeta.label}`,
      description: intro.lead,
      path: `/${category}/${subcategory}`,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: catMeta.label, path: `/${category}` },
      { name: cityMeta.label, path: `/${category}/${subcategory}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-category" />
      <BodyClass add="e4s-page-child" />
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
        <CategoryCityHeroImage
          alt={`${catMeta.label} ${cityMeta.label}`}
          categoryImage={categoryImage}
          categoryFallbacks={categoryImageFallbacks}
          cityImage={cityImage}
          cityFallbacks={getCityHeroFallbacks(subcategory)}
        />
        <div className="e4s-page-hero__caption">
          <h1>{catMeta.label} {cityMeta.label}</h1>
          <p>{categoryCityHeroSubtext(catMeta, cityMeta)}</p>
        </div>
      </section>

      <PromoBanners mode="category" categoryDbSlug={categoryDbSlug} cityDbSlug={cityDbSlug} />

      <section className="e4s-page-intro e4s-page-intro--editorial">
        <p className="e4s-page-intro__lead">{intro.lead}</p>
        <p>{intro.detail}</p>
        <p>{intro.support}</p>
      </section>

      <div className="e4s-page-with-sidebar">
        <main className="e4s-category-template" id="site-content">
          {listings.length === 0 && (
            <div className="e4s-empty-state">
              <p>No listings found for {catMeta.label} in {cityMeta.label}.</p>
              <Link href={`/${category}`}>
                Browse other cities
              </Link>
            </div>
          )}
          {listings.length > 0 && (
            <ListingsSection listings={listings} title={`${catMeta.label} - ${cityMeta.label}`} />
          )}
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
      <SeoSupportSection {...footerCopy} />
    </>
  );
}
