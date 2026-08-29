import Link from "next/link";
import BodyClass from "@/components/body-class";
import HeroImage from "@/components/hero-image";
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

const cityImageBySlug: Record<string, string> = {
  adelaide: "/images/cities/cards/home-city-adelaide.webp",
  brisbane: "/images/cities/cards/home-city-brisbane.webp",
  "byron-bay": "/images/cities/cards/home-city-byron-bay.webp",
  cairns: "/images/cities/cards/home-city-cairns.webp",
  canberra: "/images/cities/cards/home-city-canberra.webp",
  "central-coast": "/images/cities/cards/home-city-central-coast.webp",
  darwin: "/images/cities/cards/home-city-darwin.webp",
  geelong: "/images/cities/cards/home-city-geelong.webp",
  "gold-coast": "/images/cities/cards/home-city-gold-coast.webp",
  hobart: "/images/cities/cards/home-city-hobart.webp",
  melbourne: "/images/cities/cards/home-city-melbourne.webp",
  newcastle: "/images/cities/cards/home-city-newcastle.webp",
  perth: "/images/cities/cards/home-city-perth.webp",
  "sunshine-coast": "/images/cities/cards/home-city-sunshine-coast.webp",
  sydney: "/images/cities/cards/home-city-sydney.webp",
  toowoomba: "/images/cities/cards/home-city-toowoomba.webp",
  wollongong: "/images/cities/cards/home-city-wollongong.webp",
};

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
  return `${city.listing_count} dance ${city.listing_count === 1 ? "option" : "options"}${state}`;
}

function cityImage(city: City) {
  return cityImageBySlug[toUrlSlug(city.slug)] ?? "/images/categories/cards/dance-classes.webp";
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
              src="/images/categories/heroes/dance-classes-hub.webp"
              fallbacks={[
                category.hero_image_url ?? "/images/categories/heroes/dance-classes.webp",
                getCategoryCardImage("dance-classes") ?? "/images/categories/cards/dance-classes.webp",
              ]}
            />
          </div>
          <div className="e4s-shell e4s-dance-hub-hero__inner">
            <p className="e4s-pathway-eyebrow">Dance Classes</p>
            <h1>Find the dance class that fits your rhythm</h1>
            <p>
              Browse dance classes for singles by style, city or social comfort level, then compare
              studios, social dance groups and beginner-friendly providers across Australia.
            </p>
            <div className="e4s-dance-hub-hero__actions">
              <Link href="#dance-styles">Browse Styles</Link>
              <Link href="#dance-cities">Find Your City</Link>
              <Link href="/dance-classes/styles">Style Guide</Link>
            </div>
            <div className="e4s-dance-hub-hero__stats" aria-label="Dance classes directory summary">
              <span><strong>{styleCount}</strong> class styles</span>
              <span><strong>{cityCount}</strong> cities</span>
              <span><strong>{listingCount}</strong> providers indexed</span>
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

        <section className="e4s-dance-hub-promoted" aria-labelledby="dance-promoted-title">
          <div className="e4s-shell e4s-dance-hub-promoted__head">
            <div>
              <p className="e4s-pathway-eyebrow">Featured dance providers</p>
              <h2 id="dance-promoted-title">Promoted classes and studios</h2>
            </div>
            <Link href="/advertise">Reserve a dance class tile</Link>
          </div>
          <PromoBanners mode="category" categoryDbSlug="dance_classes" rows={2} />
        </section>

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
                    <span className="e4s-dance-style-card__media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={style.label}
                        loading="lazy"
                        src={getCategoryCardImage(styleUrlSlug) ?? "/images/categories/cards/dance-classes.webp"}
                      />
                      <span className="e4s-dance-style-card__count">{style.listing_count} options</span>
                    </span>
                    <span className="e4s-dance-style-card__copy">
                      <span className="e4s-dance-style-card__title">{style.label}</span>
                      <span className="e4s-dance-style-card__summary">{styleSummary(style)}</span>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" loading="lazy" src={cityImage(city)} />
                  <span className="e4s-dance-city-card__overlay">
                    <span>{city.label}</span>
                    <em>{citySummary(city)}</em>
                  </span>
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
            <Link href="/dance-classes/styles">Read the beginner style guide</Link>
          </article>
          <article>
            <p className="e4s-pathway-eyebrow">For studios and promoters</p>
            <h2>Reach singles by the way they actually choose a class</h2>
            <p>
              Dance pages create focused advertising surfaces around style, city and beginner intent,
              from Salsa in Sydney to low-pressure dance fitness options nationwide.
            </p>
            <Link href="/advertise">View advertising options</Link>
          </article>
        </section>
      </main>
    </>
  );
}
