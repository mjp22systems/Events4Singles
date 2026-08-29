import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryMeta,
  getCategoriesForCity,
  getCitiesForCategory,
  getListingsForPage,
  getListingsForCategory,
  getSubcategoriesForCategory,
} from "@/lib/data";
import { categoryChildDbSlugCandidates, toCategoryChildUrlSegment, toDbSlug, toUrlSlug } from "@/lib/constants";
import ListingsSection from "@/components/listings-section";
import AdvertiseCard from "@/components/advertise-card";
import NavSelect from "@/components/nav-select";
import SubcategoryNavSelect from "@/components/subcategory-nav-select";
import CategoryCitySelect from "@/components/category-city-select";
import CategoryCityHeroImage from "@/components/category-city-hero-image";
import PromoBanners from "@/components/promo-banners";
import CategoryCityPager from "@/components/category-city-pager";
import PageSidebar from "@/components/page-sidebar";
import SubcategoryPager from "@/components/subcategory-pager";
import MobileSidePager from "@/components/mobile-side-pager";
import SeoSupportSection from "@/components/seo-support-section";
import DanceStylesGuide from "@/components/dance-styles-guide";
import {
  EditorialIntro,
  ListingDirectoryPage,
  PageHero,
} from "@/components/listing-directory-page";
import {
  categoryCityHeroSubtext,
  categoryCityIntroCopy,
  categoryCitySeoFooterCopy,
  categoryHeroSubtext,
  categoryIntroCopy,
  categorySeoFooterCopy,
} from "@/lib/page-copy";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { getCategoryCardImage, getCategoryHeroImage } from "@/lib/category-card-assets";
import { getCitySourceFallbacks, getCitySourceImage } from "@/lib/city-hero-assets";

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
    const [childCities, listings, siblingSubcategories] = await Promise.all([
      getCitiesForCategory(childMeta.slug),
      getListingsForCategory(childMeta.slug),
      getSubcategoriesForCategory(categoryDbSlug),
    ]);
    const cities = childCities.length > 0 ? childCities : await getCitiesForCategory(catMeta.slug);
    const styleSubcategories = categoryDbSlug === "dance_classes"
      ? siblingSubcategories.filter((cat) => cat.slug !== "dance_styles")
      : siblingSubcategories;
    const sortedStyleSubcategories = [...styleSubcategories].sort((a, b) => a.label.localeCompare(b.label));
    const currentStyleIndex = sortedStyleSubcategories.findIndex((cat) => cat.slug === childMeta.slug);
    const mobilePreviousStyle = currentStyleIndex >= 0 && sortedStyleSubcategories.length > 1
      ? sortedStyleSubcategories[(currentStyleIndex - 1 + sortedStyleSubcategories.length) % sortedStyleSubcategories.length]
      : null;
    const mobileNextStyle = currentStyleIndex >= 0 && sortedStyleSubcategories.length > 1
      ? sortedStyleSubcategories[(currentStyleIndex + 1) % sortedStyleSubcategories.length]
      : null;
    const stylePathFor = (childSlug: string) => `/${category}/${toCategoryChildUrlSegment(categoryDbSlug, childSlug)}`;
    const intro = categoryIntroCopy(childMeta, cities.length, listings.length);
    const footerCopy = categorySeoFooterCopy(childMeta, cities.length);
    const parentCardImage = getCategoryCardImage(category);
    const parentHeroImage = getCategoryHeroImage(category);
    const parentImage = parentHeroImage ?? catMeta.hero_image_url ?? parentCardImage ?? `/images/category-hero-${category}.svg`;
    const parentImageFallbacks = [
      ...(parentHeroImage && catMeta.hero_image_url ? [catMeta.hero_image_url] : []),
      ...(parentHeroImage && parentCardImage ? [parentCardImage] : []),
      ...(!parentHeroImage && catMeta.hero_image_url && parentCardImage ? [parentCardImage] : []),
      `/images/category-hero-${category}.svg`,
    ];
    const childUrlSlug = toUrlSlug(childMeta.slug);
    const childCardImage = getCategoryCardImage(childUrlSlug);
    const childHeroImage = getCategoryHeroImage(childUrlSlug);
    const childImage = childHeroImage ?? childMeta.hero_image_url ?? childCardImage ?? `/images/category-hero-${childUrlSlug}.svg`;
    const childImageFallbacks = [
      ...(childHeroImage && childMeta.hero_image_url ? [childMeta.hero_image_url] : []),
      ...(childHeroImage && childCardImage ? [childCardImage] : []),
      ...(!childHeroImage && childMeta.hero_image_url && childCardImage ? [childCardImage] : []),
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
      <ListingDirectoryPage
        jsonLd={jsonLd}
        bodyClasses={["e4s-page-category", "e4s-page-child"]}
        beforeHero={(
          <>
            <SubcategoryPager
              subcategories={styleSubcategories}
              currentDbSlug={childMeta.slug}
              parentUrlSlug={category}
            />
            <MobileSidePager
              label={`${catMeta.label} style navigation`}
              previous={mobilePreviousStyle ? { href: stylePathFor(mobilePreviousStyle.slug), label: mobilePreviousStyle.label } : null}
              next={mobileNextStyle ? { href: stylePathFor(mobileNextStyle.slug), label: mobileNextStyle.label } : null}
            />
            <nav
              aria-label={`${childMeta.label} navigation`}
              className={`e4s-category-child-nav e4s-category-child-nav--has-sidebar${styleSubcategories.length > 1 && cities.length > 0 ? " e4s-category-child-nav--category-has-subcategories" : ""}`}
            >
              <Link className="e4s-category-child-nav__back" href={`/${category}`}>
                Back to {catMeta.label}
              </Link>
              {cities.length > 0 ? (
                <label className="e4s-category-child-nav__control e4s-category-child-nav__control--city">
                  <NavSelect
                    cities={cities}
                    categoryUrlSlug={subcategoryUrlSlug}
                    placeholder="Select city"
                  />
                </label>
              ) : null}
              {styleSubcategories.length > 1 ? (
                <label className="e4s-category-child-nav__control e4s-category-child-nav__control--subcategory">
                  <span>View another style</span>
                  <SubcategoryNavSelect
                    subcategories={styleSubcategories}
                    parentUrlSlug={category}
                    currentSubcategorySlug={childMeta.slug}
                  />
                </label>
              ) : null}
            </nav>
          </>
        )}
        hero={(
          <PageHero
            ariaLabel={childMeta.label}
            media={(
              <CategoryCityHeroImage
                alt={childMeta.label}
                categoryImage={parentImage}
                categoryFallbacks={parentImageFallbacks}
                cityImage={childImage}
                cityFallbacks={childImageFallbacks}
              />
            )}
            title={childMeta.label}
            subtext={categoryHeroSubtext(childMeta)}
          >
            {cities.length > 0 && (
              <CategoryCitySelect cities={cities} categoryUrlSlug={subcategoryUrlSlug} />
            )}
          </PageHero>
        )}
        promo={<PromoBanners mode="category" categoryDbSlug={childMeta.slug} />}
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
            categoryUrlSlug={subcategoryUrlSlug}
            backLabel={catMeta.label}
            backHref={`/${category}`}
            subcategories={styleSubcategories}
            currentSubcategoryDbSlug={childMeta.slug}
            subcategoryBaseUrlSlug={category}
            subcategoryHeading={categoryDbSlug === "dance_classes" ? "Other Styles" : undefined}
            guideHref={categoryDbSlug === "dance_classes" ? `/${category}/styles` : undefined}
            guideLabel={categoryDbSlug === "dance_classes" ? "Dance Styles guide" : undefined}
          />
        )}
        after={<SeoSupportSection {...footerCopy} />}
      >
        <ListingsSection
          listings={listings}
          title={childMeta.label}
          filterCities={cities}
        />
        <AdvertiseCard />
      </ListingDirectoryPage>
    );
  }

  const [cities, subcategories, cityCategories] = await Promise.all([
    getCitiesForCategory(categoryDbSlug),
    getSubcategoriesForCategory(categoryDbSlug),
    getCategoriesForCity(cityDbSlug),
  ]);
  const cityMeta = cities.find((c) => c.slug === cityDbSlug);
  if (!cityMeta) notFound();
  const styleSubcategories = categoryDbSlug === "dance_classes"
    ? subcategories.filter((cat) => cat.slug !== "dance_styles")
    : subcategories;
  const navigableSubcategories = styleSubcategories;
  const sortedNavigableSubcategories = [...navigableSubcategories].sort((a, b) => a.label.localeCompare(b.label));
  const mobilePreviousStyle = sortedNavigableSubcategories.length > 1
    ? sortedNavigableSubcategories[sortedNavigableSubcategories.length - 1]
    : null;
  const mobileNextStyle = sortedNavigableSubcategories.length > 1
    ? sortedNavigableSubcategories[0]
    : null;
  const cityStylePathFor = (childSlug: string) =>
    `/${category}/${toCategoryChildUrlSegment(categoryDbSlug, childSlug)}/${subcategory}`;
  const sortedCityCategories = [...cityCategories].sort((a, b) => a.label.localeCompare(b.label));
  const currentCityCategoryIndex = sortedCityCategories.findIndex((cat) => cat.slug === categoryDbSlug);
  const mobilePreviousCategory = currentCityCategoryIndex >= 0 && sortedCityCategories.length > 1
    ? sortedCityCategories[(currentCityCategoryIndex - 1 + sortedCityCategories.length) % sortedCityCategories.length]
    : null;
  const mobileNextCategory = currentCityCategoryIndex >= 0 && sortedCityCategories.length > 1
    ? sortedCityCategories[(currentCityCategoryIndex + 1) % sortedCityCategories.length]
    : null;
  const cityCategoryPathFor = (categorySlug: string) => `/${toUrlSlug(categorySlug)}/${subcategory}`;
  const mobilePagerPrevious = mobilePreviousStyle
    ? { href: cityStylePathFor(mobilePreviousStyle.slug), label: mobilePreviousStyle.label }
    : mobilePreviousCategory
      ? { href: cityCategoryPathFor(mobilePreviousCategory.slug), label: mobilePreviousCategory.label }
      : null;
  const mobilePagerNext = mobileNextStyle
    ? { href: cityStylePathFor(mobileNextStyle.slug), label: mobileNextStyle.label }
    : mobileNextCategory
      ? { href: cityCategoryPathFor(mobileNextCategory.slug), label: mobileNextCategory.label }
      : null;
  const mobilePagerLabel = mobilePreviousStyle || mobileNextStyle
    ? `${catMeta.label} style navigation`
    : `${cityMeta.label} category navigation`;

  const listings = await getListingsForPage(categoryDbSlug, cityDbSlug);
  const intro = categoryCityIntroCopy(catMeta, cityMeta, listings.length);
  const footerCopy = categoryCitySeoFooterCopy(catMeta, cityMeta, listings.length);
  const categoryCardImage = getCategoryCardImage(category);
  const categoryHeroImage = getCategoryHeroImage(category);
  const categoryImage = categoryHeroImage ?? catMeta.hero_image_url ?? categoryCardImage ?? `/images/category-hero-${category}.svg`;
  const categoryImageFallbacks = [
    ...(categoryHeroImage && catMeta.hero_image_url ? [catMeta.hero_image_url] : []),
    ...(categoryHeroImage && categoryCardImage ? [categoryCardImage] : []),
    ...(!categoryHeroImage && catMeta.hero_image_url && categoryCardImage ? [categoryCardImage] : []),
    `/images/category-hero-${category}.svg`,
  ];
  const cityImage = getCitySourceImage(subcategory);
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
    <ListingDirectoryPage
      jsonLd={jsonLd}
      bodyClasses={["e4s-page-category", "e4s-page-child"]}
      beforeHero={(
        <>
          <CategoryCityPager cities={cities} currentCityDbSlug={cityDbSlug} categoryUrlSlug={category} />
          <MobileSidePager
            label={mobilePagerLabel}
            previous={mobilePagerPrevious}
            next={mobilePagerNext}
          />
          <nav
            aria-label={`${catMeta.label} city navigation`}
            className={`e4s-category-child-nav e4s-category-child-nav--has-sidebar${navigableSubcategories.length > 0 ? " e4s-category-child-nav--category-has-subcategories" : ""}`}
          >
            <Link className="e4s-category-child-nav__back" href={`/${category}`}>
              Back to {catMeta.label}
            </Link>
            <label className="e4s-category-child-nav__control e4s-category-child-nav__control--city">
              <NavSelect
                cities={cities}
                categoryUrlSlug={category}
                currentCitySlug={cityDbSlug}
              />
            </label>
            {navigableSubcategories.length > 0 ? (
              <label className="e4s-category-child-nav__control e4s-category-child-nav__control--subcategory">
                <span>View style</span>
                <SubcategoryNavSelect
                  subcategories={navigableSubcategories}
                  parentUrlSlug={category}
                  cityUrlSlug={subcategory}
                  placeholder="Select style"
                />
              </label>
            ) : null}
          </nav>
        </>
      )}
      hero={(
        <PageHero
          ariaLabel={`${catMeta.label} ${cityMeta.label}`}
          media={(
            <CategoryCityHeroImage
              alt={`${catMeta.label} ${cityMeta.label}`}
              categoryImage={categoryImage}
              categoryFallbacks={categoryImageFallbacks}
              cityImage={cityImage}
              cityFallbacks={getCitySourceFallbacks(subcategory)}
            />
          )}
          title={`${catMeta.label} ${cityMeta.label}`}
          subtext={categoryCityHeroSubtext(catMeta, cityMeta)}
        />
      )}
      promo={<PromoBanners mode="category" categoryDbSlug={categoryDbSlug} cityDbSlug={cityDbSlug} />}
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
          categoryUrlSlug={category}
          currentCityDbSlug={cityDbSlug}
          backLabel={catMeta.label}
          subcategories={styleSubcategories}
          subcategoryBaseUrlSlug={category}
          subcategoryCityUrlSlug={subcategory}
          subcategoryHeading={categoryDbSlug === "dance_classes" ? "Other Styles" : undefined}
          guideHref={categoryDbSlug === "dance_classes" ? `/${category}/styles` : undefined}
          guideLabel={categoryDbSlug === "dance_classes" ? "Dance Styles guide" : undefined}
        />
      )}
      after={<SeoSupportSection {...footerCopy} />}
    >
      {listings.length === 0 && (
        <div className="e4s-empty-state">
          <p>No listings found for {catMeta.label} in {cityMeta.label}.</p>
          <Link href={`/${category}`}>Browse other cities</Link>
        </div>
      )}
      {listings.length > 0 && (
        <ListingsSection listings={listings} title={`${catMeta.label} - ${cityMeta.label}`} />
      )}
      <AdvertiseCard />
    </ListingDirectoryPage>
  );
}
