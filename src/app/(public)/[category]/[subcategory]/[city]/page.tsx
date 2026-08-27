import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryMeta,
  getCitiesForCategory,
  getListingsForPage,
  getSubcategoriesForCategory,
} from "@/lib/data";
import { categoryChildDbSlugCandidates, toCategoryChildUrlSegment, toDbSlug, toUrlSlug } from "@/lib/constants";
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
import { getCityHeroFallbacks, getCityHeroImage } from "@/lib/city-hero-assets";

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

  const cityLabel = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return pageMetadata({
    title: `${childMeta.label} in ${cityLabel}`,
    description: `Find ${childMeta.label.toLowerCase()} classes, events and social dance options for singles in ${cityLabel}, Australia.`,
    path: `/${category}/${subcategory}/${city}`,
    keywords: [
      `${childMeta.label} ${cityLabel}`,
      `${childMeta.label} for singles ${cityLabel}`,
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

  const subcategoryUrlSlug = `${category}/${subcategory}`;
  const [childCities, parentCities, siblingSubcategories] = await Promise.all([
    getCitiesForCategory(childMeta.slug),
    getCitiesForCategory(parentMeta.slug),
    getSubcategoriesForCategory(parentDbSlug),
  ]);
  const citiesBySlug = new Map([...parentCities, ...childCities].map((entry) => [entry.slug, entry]));
  const cities = Array.from(citiesBySlug.values());
  const cityMeta = cities.find((c) => c.slug === cityDbSlug);
  if (!cityMeta) notFound();
  const styleSubcategories = parentDbSlug === "dance_classes"
    ? siblingSubcategories.filter((cat) => cat.slug !== "dance_styles")
    : siblingSubcategories;
  const navigableSubcategories = styleSubcategories;
  const sortedNavigableSubcategories = [...navigableSubcategories].sort((a, b) => a.label.localeCompare(b.label));
  const currentStyleIndex = sortedNavigableSubcategories.findIndex((cat) => cat.slug === childMeta.slug);
  const mobilePreviousStyle = currentStyleIndex >= 0 && sortedNavigableSubcategories.length > 1
    ? sortedNavigableSubcategories[(currentStyleIndex - 1 + sortedNavigableSubcategories.length) % sortedNavigableSubcategories.length]
    : null;
  const mobileNextStyle = currentStyleIndex >= 0 && sortedNavigableSubcategories.length > 1
    ? sortedNavigableSubcategories[(currentStyleIndex + 1) % sortedNavigableSubcategories.length]
    : null;
  const cityStylePathFor = (childSlug: string) =>
    `/${category}/${toCategoryChildUrlSegment(parentDbSlug, childSlug)}/${city}`;

  const listings = await getListingsForPage(childMeta.slug, cityDbSlug);
  const intro = categoryCityIntroCopy(childMeta, cityMeta, listings.length);
  const footerCopy = categoryCitySeoFooterCopy(childMeta, cityMeta, listings.length);
  const parentCardImage = getCategoryCardImage(category);
  const parentHeroImage = getCategoryHeroImage(category);
  const parentImage = parentHeroImage ?? parentMeta.hero_image_url ?? parentCardImage ?? `/images/category-hero-${category}.svg`;
  const parentImageFallbacks = [
    ...(parentHeroImage && parentMeta.hero_image_url ? [parentMeta.hero_image_url] : []),
    ...(parentHeroImage && parentCardImage ? [parentCardImage] : []),
    ...(!parentHeroImage && parentMeta.hero_image_url && parentCardImage ? [parentCardImage] : []),
    `/images/category-hero-${category}.svg`,
  ];
  const childUrlSlug = toUrlSlug(childMeta.slug);
  const categoryCardImage = getCategoryCardImage(childUrlSlug);
  const categoryHeroImage = getCategoryHeroImage(childUrlSlug);
  const categoryImage = categoryHeroImage ?? childMeta.hero_image_url ?? categoryCardImage ?? `/images/category-hero-${childUrlSlug}.svg`;
  const categoryImageFallbacks = [
    ...(categoryHeroImage && childMeta.hero_image_url ? [childMeta.hero_image_url] : []),
    ...(categoryHeroImage && categoryCardImage ? [categoryCardImage] : []),
    ...(!categoryHeroImage && childMeta.hero_image_url && categoryCardImage ? [categoryCardImage] : []),
    `/images/category-hero-${childUrlSlug}.svg`,
  ];
  const cityImage = getCityHeroImage(city);
  const jsonLd = [
    collectionPageJsonLd({
      name: `${childMeta.label} in ${cityMeta.label}`,
      description: intro.lead,
      path: `/${subcategoryUrlSlug}/${city}`,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: parentMeta.label, path: `/${category}` },
      { name: childMeta.label, path: `/${subcategoryUrlSlug}` },
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
            label={`${parentMeta.label} style navigation`}
            previous={mobilePreviousStyle ? { href: cityStylePathFor(mobilePreviousStyle.slug), label: mobilePreviousStyle.label } : null}
            next={mobileNextStyle ? { href: cityStylePathFor(mobileNextStyle.slug), label: mobileNextStyle.label } : null}
          />
          <nav
            aria-label={`${childMeta.label} city navigation`}
            className={`e4s-category-child-nav e4s-category-child-nav--has-sidebar e4s-category-child-nav--multi${navigableSubcategories.length > 1 ? " e4s-category-child-nav--category-has-subcategories" : ""}`}
          >
            <Link className="e4s-category-child-nav__back" href={`/${category}`}>
              Back to {parentMeta.label}
            </Link>
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
            <label className="e4s-category-child-nav__control e4s-category-child-nav__control--city">
              <span>View another city</span>
              <NavSelect
                cities={cities}
                categoryUrlSlug={subcategoryUrlSlug}
                currentCitySlug={cityDbSlug}
              />
            </label>
          </nav>
        </>
      )}
      hero={(
        <PageHero
          ariaLabel={`${childMeta.label} ${cityMeta.label}`}
          media={(
            <CategoryCityHeroImage
              alt={`${childMeta.label} ${cityMeta.label}`}
              parentCategoryImage={parentImage}
              parentCategoryFallbacks={parentImageFallbacks}
              categoryImage={categoryImage}
              categoryFallbacks={categoryImageFallbacks}
              cityImage={cityImage}
              cityFallbacks={getCityHeroFallbacks(city)}
            />
          )}
          title={`${childMeta.label} ${cityMeta.label}`}
          subtext={categoryCityHeroSubtext(childMeta, cityMeta)}
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
          <p>No listings found for {childMeta.label} in {cityMeta.label}.</p>
          <Link href={`/${subcategoryUrlSlug}`}>Browse other cities</Link>
        </div>
      )}
      {listings.length > 0 && (
        <ListingsSection listings={listings} title={`${childMeta.label} - ${cityMeta.label}`} />
      )}
      <AdvertiseCard />
    </ListingDirectoryPage>
  );
}
