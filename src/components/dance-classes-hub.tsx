import Link from "next/link";
import BodyClass from "@/components/body-class";
import HeroImage from "@/components/hero-image";
import ListingsSection from "@/components/listings-section";
import PromoBanners from "@/components/promo-banners";
import { danceStyleDecisionPaths, danceStyleLinks } from "@/content/dance-styles";
import { getCategoryCardImage, getCategoryCardSummary } from "@/lib/category-card-assets";
import { toCategoryChildUrlSegment, toUrlSlug } from "@/lib/constants";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";
import type { Category, City, Listing } from "@/lib/types";

interface Props {
  category: Category;
  cities: City[];
  listings: Listing[];
  subcategories: Category[];
}

const featuredCitySlugs = [
  "sydney",
  "melbourne",
  "brisbane",
  "gold_coast",
  "adelaide",
  "perth",
  "canberra",
  "newcastle",
];

const styleCopyByHref = new Map(danceStyleLinks.map((style) => [style.href, style.summary]));

function danceStyleHref(style: Category) {
  return `/dance-classes/${toCategoryChildUrlSegment("dance_classes", style.slug)}`;
}

function styleSummary(style: Category) {
  const href = danceStyleHref(style);
  return styleCopyByHref.get(href) || getCategoryCardSummary(style.slug, style.description);
}

function citySummary(city: City) {
  const state = city.state ? `, ${city.state}` : "";
  return `${city.listing_count} dance ${city.listing_count === 1 ? "listing" : "listings"}${state}`;
}

export default async function DanceClassesHub({ category, cities, listings, subcategories }: Props) {
  const styles = subcategories.filter((cat) => cat.slug !== "dance_styles" && cat.listing_count > 0);
  const sortedStyles = [...styles].sort((a, b) => b.listing_count - a.listing_count || a.label.localeCompare(b.label));
  const sortedCities = [...cities].sort((a, b) => {
    const aFeatured = featuredCitySlugs.indexOf(a.slug);
    const bFeatured = featuredCitySlugs.indexOf(b.slug);
    if (aFeatured !== -1 || bFeatured !== -1) {
      if (aFeatured === -1) return 1;
      if (bFeatured === -1) return -1;
      return aFeatured - bFeatured;
    }
    return b.listing_count - a.listing_count || a.label.localeCompare(b.label);
  });
  const cityCount = cities.length;
  const listingCount = listings.length;
  const styleCount = styles.length;
  const jsonLd = [
    collectionPageJsonLd({
      name: "Dance Classes for Singles",
      description:
        "Choose dance classes for singles by style or city, then compare dance schools, social dance groups and beginner-friendly class providers across Australia.",
      path: "/dance-classes",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: category.label, path: "/dance-classes" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-category" />
      <BodyClass add="e4s-page-dance-hub" />
      <main className="e4s-dance-hub" id="site-content">
        <section className="e4s-dance-hub-hero" aria-label="Dance Classes for Singles">
          <div className="e4s-dance-hub-hero__media">
            <HeroImage
              alt="Dance classes for singles"
              src={category.hero_image_url ?? getCategoryCardImage("dance-classes") ?? "/images/categories/cards/dance-classes.webp"}
              fallbacks={["/images/categories/cards/dance-classes.webp"]}
            />
          </div>
          <div className="e4s-shell e4s-dance-hub-hero__inner">
            <p className="e4s-pathway-eyebrow">Dance Classes</p>
            <h1>Find the dance class that fits your rhythm</h1>
            <p>
              Browse dance classes for singles by style, city or social comfort level, then compare
              studios, social dance groups and beginner-friendly providers across Australia.
            </p>
            <div className="e4s-dance-hub-hero__stats" aria-label="Dance classes directory summary">
              <span><strong>{styleCount}</strong> styles</span>
              <span><strong>{cityCount}</strong> cities</span>
              <span><strong>{listingCount}</strong> listings</span>
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-dance-hub-paths" aria-label="Choose how to browse dance classes">
          <Link className="e4s-dance-hub-path e4s-dance-hub-path--style" href="#dance-styles">
            <span>Browse by Style</span>
            <strong>Salsa, tango, swing, ballroom and more</strong>
          </Link>
          <Link className="e4s-dance-hub-path e4s-dance-hub-path--city" href="#dance-cities">
            <span>Browse by City</span>
            <strong>Find classes close enough to actually attend</strong>
          </Link>
          <Link className="e4s-dance-hub-path" href="/dance-classes/styles">
            <span>Not Sure Yet?</span>
            <strong>Use the dance styles guide to choose a path</strong>
          </Link>
        </section>

        <PromoBanners mode="category" categoryDbSlug="dance_classes" />

        <section className="e4s-dance-hub-band" id="dance-styles">
          <div className="e4s-shell">
            <div className="e4s-dance-hub-section-head">
              <p className="e4s-pathway-eyebrow">Choose by style</p>
              <h2>Start with the kind of class you want</h2>
              <p>
                Dance is easier to browse by feel than by a long national list. Pick a style first,
                then narrow by city when you are ready.
              </p>
            </div>
            <div className="e4s-dance-style-grid">
              {sortedStyles.map((style) => {
                const styleUrlSlug = toUrlSlug(style.slug);
                return (
                  <Link key={style.slug} className="e4s-dance-style-card" href={danceStyleHref(style)}>
                    <span className="e4s-dance-style-card__image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={style.label}
                        loading="lazy"
                        src={getCategoryCardImage(styleUrlSlug) ?? "/images/categories/cards/dance-classes.webp"}
                      />
                    </span>
                    <span className="e4s-dance-style-card__copy">
                      <span className="e4s-dance-style-card__title">{style.label}</span>
                      <span className="e4s-dance-style-card__summary">{styleSummary(style)}</span>
                      <span className="e4s-dance-style-card__count">{style.listing_count} listings</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-dance-hub-guidance">
          {danceStyleDecisionPaths.map((path) => (
            <article key={path.title}>
              <h3>{path.title}</h3>
              <p>{path.copy}</p>
            </article>
          ))}
        </section>

        <section className="e4s-dance-hub-band e4s-dance-hub-band--light" id="dance-cities">
          <div className="e4s-shell">
            <div className="e4s-dance-hub-section-head">
              <p className="e4s-pathway-eyebrow">Choose by city</p>
              <h2>Find dance classes near you</h2>
              <p>
                If location matters first, start with your city. From there you can move across
                dance styles while keeping that city selected.
              </p>
            </div>
            <div className="e4s-dance-city-grid">
              {sortedCities.map((city) => (
                <Link key={city.slug} className="e4s-dance-city-card" href={`/dance-classes/${toUrlSlug(city.slug)}`}>
                  <span>{city.label}</span>
                  <em>{citySummary(city)}</em>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-dance-hub-editorial">
          <article>
            <p className="e4s-pathway-eyebrow">Beginner friendly</p>
            <h2>You usually do not need to arrive with a partner</h2>
            <p>
              Many social dance classes rotate partners, welcome solo beginners and build the night
              around a shared lesson before any social dancing starts.
            </p>
          </article>
          <article>
            <p className="e4s-pathway-eyebrow">Better browsing</p>
            <h2>Use the full list only when you want the whole directory</h2>
            <p>
              The complete directory is still here for comparison and filtering, but the style and
              city paths are the cleaner way to find something useful quickly.
            </p>
          </article>
        </section>

        <section className="e4s-shell e4s-dance-hub-listings" id="all-dance-listings">
          <div className="e4s-dance-hub-section-head">
            <p className="e4s-pathway-eyebrow">Full directory</p>
            <h2>All Dance Class Listings</h2>
          </div>
          <ListingsSection
            listings={listings}
            title="Dance Classes"
            filterCities={cities}
          />
        </section>
      </main>
    </>
  );
}
