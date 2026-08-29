import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryMeta,
  getCategoriesForCity,
  getCitiesForCategory,
  getListingsForPage,
  getSubcategoriesForCategory,
} from "@/lib/data";
import { categoryChildDbSlugCandidates, categoryChildLabelForDisplay, toCategoryChildUrlSegment, toDbSlug, toUrlSlug } from "@/lib/constants";
import ListingsSection from "@/components/listings-section";
import AdvertiseCard from "@/components/advertise-card";
import NavSelect from "@/components/nav-select";
import SubcategoryNavSelect from "@/components/subcategory-nav-select";
import CategoryCityHeroImage from "@/components/category-city-hero-image";
import PromoBanners from "@/components/promo-banners";
import CategoryCityPager from "@/components/category-city-pager";
import PageSidebar from "@/components/page-sidebar";
import SubcategoryPager from "@/components/subcategory-pager";
import MobileSidePager from "@/components/mobile-side-pager";
import SeoSupportSection from "@/components/seo-support-section";
import {
  EditorialIntro,
  ListingDirectoryPage,
  PageHero,
} from "@/components/listing-directory-page";
import { categoryCityHeroSubtext, categoryCityIntroCopy, categoryCitySeoFooterCopy } from "@/lib/page-copy";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { getCategoryCardImage, getCategoryHeroImage } from "@/lib/category-card-assets";
import { getCitySourceFallbacks, getCitySourceImage } from "@/lib/city-hero-assets";
import { categoryPathWithOptionalCity } from "@/lib/category-routing";

interface Props {
  params: Promise<{ category: string; subcategory: string; city: string }>;
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
  const { category, subcategory, city } = await params;
  const parentDbSlug = toDbSlug(category);
  const parentMeta = await getCategoryMeta(parentDbSlug);
  const childMeta = await getChildCategoryMeta(parentDbSlug, subcategory);
  if (!parentMeta || !childMeta) return {};

  const canonicalSubcategory = toCategoryChildUrlSegment(parentDbSlug, childMeta.slug);
  const cityLabel = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const childLabel = categoryChildLabelForDisplay(parentDbSlug, childMeta.label);
  return pageMetadata({
    title: `${childLabel} in ${cityLabel}`,
    description: `Find ${childLabel.toLowerCase()} classes, events and social dance options for singles in ${cityLabel}, Australia.`,
    path: `/${category}/${canonicalSubcategory}/${city}`,
    keywords: [
      `${childLabel} ${cityLabel}`,
      `${childLabel} for singles ${cityLabel}`,
      `${parentMeta.label} ${cityLabel}`,
    ],
  });
}

export default async function CategorySubcategoryCityPage({ params }: Props) {
  const { category, subcategory, city } = await params;
  const parentDbSlug = toDbSlug(category);
  const cityDbSlug = toDbSlug(city);

  const parentMeta = await getCategoryMeta(parentDbSlug);
  const childMeta = await getChildCategoryMeta(parentDbSlug, subcategory);
  if (!parentMeta || !childMeta) notFound();
  const canonicalSubcategory = toCategoryChildUrlSegment(parentDbSlug, childMeta.slug);
  if (subcategory !== canonicalSubcategory) {
    permanentRedirect(`/${category}/${canonicalSubcategory}/${city}`);
  }
  const childDisplayMeta = {
    ...childMeta,
    label: categoryChildLabelForDisplay(parentDbSlug, childMeta.label),
  };

  const subcategoryUrlSlug = `${category}/${canonicalSubcategory}`;
  const [childCities, parentCities, siblingSubcategories, cityCategories] = await Promise.all([
    getCitiesForCategory(childMeta.slug),
    getCitiesForCategory(parentMeta.slug),
    getSubcategoriesForCategory(parentDbSlug),
    getCategoriesForCity(cityDbSlug),
  ]);
  const citiesBySlug = new Map([...parentCities, ...childCities].map((entry) => [entry.slug, entry]));
  const cities = Array.from(citiesBySlug.values());
  const cityMeta = cities.find((c) => c.slug === cityDbSlug);
  if (!cityMeta) notFound();
  const styleSubcategories = parentDbSlug === "dance_classes"
    ? siblingSubcategories.filter((cat) => cat.slug !== "dance_styles")
    : siblingSubcategories;
  const navigableSubcategories = styleSubcategories;
  const sortedCityCategories = [...cityCategories].sort((a, b) => a.label.localeCompare(b.label));
  const currentCityCategoryIndex = sortedCityCategories.findIndex((cat) => cat.slug === parentDbSlug);
  const mobilePreviousCategory = currentCityCategoryIndex >= 0 && sortedCityCategories.length > 1
    ? sortedCityCategories[(currentCityCategoryIndex - 1 + sortedCityCategories.length) % sortedCityCategories.length]
    : null;
  const mobileNextCategory = currentCityCategoryIndex >= 0 && sortedCityCategories.length > 1
    ? sortedCityCategories[(currentCityCategoryIndex + 1) % sortedCityCategories.length]
    : null;
  const cityCategoryPathFor = (categorySlug: string) => categoryPathWithOptionalCity(categorySlug, city);

  const listings = await getListingsForPage(childMeta.slug, cityDbSlug);
  const intro = categoryCityIntroCopy(childDisplayMeta, cityMeta, listings.length);
  const footerCopy = categoryCitySeoFooterCopy(childDisplayMeta, cityMeta, listings.length);
  const parentCardImage = getCategoryCardImage(category);
  const parentHeroImage = getCategoryHeroImage(category);
  const parentImage = parentHeroImage ?? parentMeta.hero_image_url ?? parentCardImage ?? `/images/site/category-heroes/category-hero-${category}.svg`;
  const parentImageFallbacks = [
    ...(parentHeroImage && parentMeta.hero_image_url ? [parentMeta.hero_image_url] : []),
    ...(parentHeroImage && parentCardImage ? [parentCardImage] : []),
    ...(!parentHeroImage && parentMeta.hero_image_url && parentCardImage ? [parentCardImage] : []),
    `/images/site/category-heroes/category-hero-${category}.svg`,
  ];
  const childUrlSlug = toUrlSlug(childMeta.slug);
  const categoryCardImage = getCategoryCardImage(childUrlSlug);
  const categoryHeroImage = getCategoryHeroImage(childUrlSlug);
  const categoryImage = categoryHeroImage ?? childMeta.hero_image_url ?? categoryCardImage ?? `/images/site/category-heroes/category-hero-${childUrlSlug}.svg`;
  const categoryImageFallbacks = [
    ...(categoryHeroImage && childMeta.hero_image_url ? [childMeta.hero_image_url] : []),
    ...(categoryHeroImage && categoryCardImage ? [categoryCardImage] : []),
    ...(!categoryHeroImage && childMeta.hero_image_url && categoryCardImage ? [categoryCardImage] : []),
    `/images/site/category-heroes/category-hero-${childUrlSlug}.svg`,
  ];
  const cityImage = getCitySourceImage(city);
  const jsonLd = [
    collectionPageJsonLd({
      name: `${childDisplayMeta.label} in ${cityMeta.label}`,
      description: intro.lead,
      path: `/${subcategoryUrlSlug}/${city}`,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: parentMeta.label, path: `/${category}` },
      { name: childDisplayMeta.label, path: `/${subcategoryUrlSlug}` },
      { name: cityMeta.label, path: `/${subcategoryUrlSlug}/${city}` },
    ]),
  ];

  return (
    <ListingDirectoryPage
      jsonLd={jsonLd}
      bodyClasses={["e4s-page-category", "e4s-page-child", "e4s-page-deep-child"]}
      beforeHero={(
        <>
          <CategoryCityPager
            cities={cities}
            currentCityDbSlug={cityDbSlug}
            categoryUrlSlug={subcategoryUrlSlug}
          />
          <SubcategoryPager
            subcategories={styleSubcategories}
            currentDbSlug={childMeta.slug}
            parentUrlSlug={category}
            cityUrlSlug={city}
            variant="secondary"
          />
          <MobileSidePager
            label={`${cityMeta.label} category navigation`}
            previous={mobilePreviousCategory ? { href: cityCategoryPathFor(mobilePreviousCategory.slug), label: mobilePreviousCategory.label } : null}
            next={mobileNextCategory ? { href: cityCategoryPathFor(mobileNextCategory.slug), label: mobileNextCategory.label } : null}
          />
          <nav
            aria-label={`${childDisplayMeta.label} city navigation`}
            className={`e4s-category-child-nav e4s-category-child-nav--has-sidebar e4s-category-child-nav--multi${navigableSubcategories.length > 1 ? " e4s-category-child-nav--category-has-subcategories" : ""}`}
          >
            <Link className="e4s-category-child-nav__back" href={`/${category}`}>
              Back to {parentMeta.label}
            </Link>
            <label className="e4s-category-child-nav__control e4s-category-child-nav__control--city">
              <NavSelect
                cities={cities}
                categoryUrlSlug={subcategoryUrlSlug}
                currentCitySlug={cityDbSlug}
              />
            </label>
            {navigableSubcategories.length > 1 ? (
              <label className="e4s-category-child-nav__control e4s-category-child-nav__control--subcategory">
                <span>View another style</span>
                <SubcategoryNavSelect
                  subcategories={navigableSubcategories}
                  parentUrlSlug={category}
                  currentSubcategorySlug={childMeta.slug}
                  cityUrlSlug={city}
                />
              </label>
            ) : null}
          </nav>
        </>
      )}
      hero={(
        <PageHero
          ariaLabel={`${childDisplayMeta.label} ${cityMeta.label}`}
          media={(
            <CategoryCityHeroImage
              alt={`${childDisplayMeta.label} ${cityMeta.label}`}
              parentCategoryImage={parentImage}
              parentCategoryFallbacks={parentImageFallbacks}
              categoryImage={categoryImage}
              categoryFallbacks={categoryImageFallbacks}
              cityImage={cityImage}
              cityFallbacks={getCitySourceFallbacks(city)}
            />
          )}
          title={`${childDisplayMeta.label} ${cityMeta.label}`}
          subtext={categoryCityHeroSubtext(childDisplayMeta, cityMeta)}
        />
      )}
      promo={(
        <PromoBanners
          mode="category"
          categoryDbSlug={childMeta.slug}
          cityDbSlug={cityDbSlug}
        />
      )}
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
          currentCityDbSlug={cityDbSlug}
          backLabel={parentMeta.label}
          backHref={`/${category}`}
          subcategories={styleSubcategories}
          currentSubcategoryDbSlug={childMeta.slug}
          subcategoryBaseUrlSlug={category}
          subcategoryCityUrlSlug={city}
          subcategoryHeading={parentDbSlug === "dance_classes" ? "Other Styles" : undefined}
          guideHref={parentDbSlug === "dance_classes" ? `/${category}/styles` : undefined}
          guideLabel={parentDbSlug === "dance_classes" ? "Dance Styles guide" : undefined}
        />
      )}
      after={<SeoSupportSection {...footerCopy} />}
    >
      {listings.length === 0 && (
        <div className="e4s-empty-state">
          <p>No listings found for {childDisplayMeta.label} in {cityMeta.label}.</p>
          <Link href={`/${subcategoryUrlSlug}`}>Browse other cities</Link>
        </div>
      )}
      {listings.length > 0 && (
        <ListingsSection listings={listings} title={`${childDisplayMeta.label} - ${cityMeta.label}`} />
      )}
      <AdvertiseCard />
    </ListingDirectoryPage>
  );
}
