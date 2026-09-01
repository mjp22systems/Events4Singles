import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Compass,
  Heart,
  MapPin,
  Megaphone,
  Music4,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import BodyClass from "@/components/body-class";
import CategoryPager from "@/components/category-pager";
import MobileSidePager from "@/components/mobile-side-pager";
import { danceStyleDecisionPaths, danceStyleLinks } from "@/content/dance-styles";
import { getCategoryCardImage, getCategoryCardSummary } from "@/lib/category-card-assets";
import { toCategoryChildUrlSegment, toListingSlug, toUrlSlug } from "@/lib/constants";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";
import type { Category, City, Listing } from "@/lib/types";

interface Props {
  category: Category;
  cities: City[];
  listings: Listing[];
  subcategories: Category[];
  parentCategories: Category[];
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

const heroImages = [
  {
    src: "/images/categories/heroes/dance-classes-hub-spectrum.webp",
    alt: "Adults of different ages laughing during a singles-friendly social dance class",
  },
  {
    src: "/images/categories/heroes/dance-classes-hub.webp",
    alt: "Singles-friendly dance class with people learning together",
  },
  {
    src: "/images/categories/cards/dance-salsa.webp",
    alt: "Social salsa dance class for singles",
  },
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
const styleMetaByHref = new Map(danceStyleLinks.map((style) => [style.href, style]));

const intentIcons = [Users, Sparkles, Heart, Music4];
const intentPicks = [
  ["/dance-classes/salsa", "/dance-classes/bachata"],
  ["/dance-classes/ballroom-style", "/dance-classes/tango"],
  ["/dance-classes/ceroc", "/dance-classes/line-dancing"],
  ["/dance-classes/fitness-and-health", "/dance-classes/swing"],
];

function danceStyleHref(style: Category) {
  return `/dance-classes/${toCategoryChildUrlSegment("dance_classes", style.slug)}`;
}

function styleTitle(style: Category) {
  return styleMetaByHref.get(danceStyleHref(style))?.title ?? style.label;
}

function styleSummary(style: Category) {
  return styleCopyByHref.get(danceStyleHref(style)) || getCategoryCardSummary(style.slug, style.description);
}

function styleImage(style: Category) {
  const configuredImage = styleMetaByHref.get(danceStyleHref(style))?.image;
  return configuredImage ?? getCategoryCardImage(toUrlSlug(style.slug)) ?? "/images/categories/cards/dance-classes.webp";
}

function cityImage(city: City) {
  return cityImageBySlug[toUrlSlug(city.slug)] ?? "/images/categories/cards/dance-classes.webp";
}

function citySummary(city: City) {
  return city.state ? `${city.state} · ${city.listing_count}` : `${city.listing_count}`;
}

function seoStyleGroups(styles: Category[], cities: City[]) {
  const topCities = cities.slice(0, 6);
  return styles.slice(0, 4).map((style) => ({
    style,
    cities: topCities,
  }));
}

function listingTitle(listing: Listing) {
  return listing.business_name || listing.title;
}

function listingStyle(listing: Listing) {
  return listing.category_label || "Dance class";
}

function listingCity(listing: Listing) {
  if (listing.city_label) return listing.city_label;
  if (listing.city_labels) return listing.city_labels.split(",")[0]?.trim() || "Australia";
  return listing.location_city || "Australia";
}

function listingSummary(listing: Listing) {
  return listing.tagline || "View class details, location, and contact options.";
}

function SectionHeading({
  id,
  eyebrow,
  title,
  sub,
  action,
  actionHref,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  sub?: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="e4s-dance-lovable-heading">
      <div>
        <p>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {sub ? <span>{sub}</span> : null}
      </div>
      {action && actionHref ? (
        <Link href={actionHref}>
          {action}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}

export default async function DanceClassesHub(props: Props) {
  const { category, cities, listings, subcategories, parentCategories } = props;
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
  const featuredListings = listings.slice(0, 6);
  const promotedSlots = Array.from({ length: 12 }, (_, index) => featuredListings[index] ?? null);
  const popularSearchGroups = seoStyleGroups(sortedStyles, sortedCities);
  const sortedParentCategories = [...parentCategories].sort((a, b) => a.label.localeCompare(b.label));
  const currentParentIndex = sortedParentCategories.findIndex((cat) => cat.slug === category.slug);
  const previousCategory = currentParentIndex >= 0 && sortedParentCategories.length > 1
    ? sortedParentCategories[(currentParentIndex - 1 + sortedParentCategories.length) % sortedParentCategories.length]
    : null;
  const nextCategory = currentParentIndex >= 0 && sortedParentCategories.length > 1
    ? sortedParentCategories[(currentParentIndex + 1) % sortedParentCategories.length]
    : null;
  const jsonLd = [
    collectionPageJsonLd({
      name: "Dance Classes for Singles",
      description:
        "Find singles-friendly dance classes across Australia. Browse salsa, bachata, ballroom, swing and tango by city, or start with the beginner style guide.",
      path: "/dance-classes",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Categories", path: "/categories" },
      { name: category.label, path: "/dance-classes" },
    ]),
  ];

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/dance-classes.css" rel="stylesheet" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-category" />
      <BodyClass add="e4s-page-dance-hub" />
      <CategoryPager categories={parentCategories} currentDbSlug={category.slug} />
      <MobileSidePager
        label="Category navigation"
        previous={previousCategory ? { href: `/${toUrlSlug(previousCategory.slug)}`, label: previousCategory.label } : null}
        next={nextCategory ? { href: `/${toUrlSlug(nextCategory.slug)}`, label: nextCategory.label } : null}
      />
      <main className="e4s-dance-hub e4s-dance-lovable" id="site-content">
        <div className="e4s-dance-lovable-shell e4s-dance-lovable-breadcrumb">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/categories">Categories</Link>
            <span>/</span>
            <strong>Dance Classes</strong>
          </nav>
        </div>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-hero" aria-label="Dance Classes for Singles">
          <div className="e4s-dance-lovable-hero__copy">
            <span className="e4s-dance-lovable-chip">
              <MapPin aria-hidden="true" size={14} />
              Australia-Wide Directory
            </span>
            <h1>
              Dance classes for singles, <span>no partner required</span>
            </h1>
            <p>
              A practical, curated list of singles-friendly dance classes, courses and studios across
              Australia. Pick a style, pick a city, and turn up on your own. Most rooms rotate
              partners, and everyone started somewhere.
            </p>

            <div className="e4s-dance-lovable-hero__actions">
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="#styles">
                Browse by Style
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--accent" href="#cities">
                Browse by City
              </Link>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--ghost" href="#guidance">
                I&apos;m Not Sure Yet
              </Link>
            </div>

            <dl className="e4s-dance-lovable-stats" aria-label="Dance classes directory summary">
              <div>
                <dt>{listings.length}</dt>
                <dd>Classes Listed</dd>
              </div>
              <div>
                <dt>{sortedStyles.length}</dt>
                <dd>Dance Styles</dd>
              </div>
              <div>
                <dt>{cities.length}</dt>
                <dd>Cities &amp; Regions</dd>
              </div>
              <div>
                <dt>Guide</dt>
                <dd>Beginner Friendly</dd>
              </div>
            </dl>
          </div>

          <div className="e4s-dance-lovable-hero__media">
            {heroImages.map((image, index) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={image.src}
                alt={image.alt}
                src={image.src}
                style={{ animationDelay: `${index * 6}s` }}
              />
            ))}
            <div>
              <BadgeCheck aria-hidden="true" size={16} />
              Listings Checked for Singles-Friendly Policy
            </div>
          </div>
        </section>

        <section className="e4s-dance-lovable-pathways" aria-label="Choose how to browse dance classes">
          <div className="e4s-dance-lovable-shell">
            {[
              {
                icon: Music4,
                title: "Browse by Style",
                body: "Salsa, bachata, ballroom, swing, tango. See what each one actually feels like.",
                cta: "See All Styles",
                href: "#styles",
              },
              {
                icon: MapPin,
                title: "Browse by City",
                body: "Every capital plus regional hubs, with class counts from the directory.",
                cta: "See All Cities",
                href: "#cities",
              },
              {
                icon: Compass,
                title: "Not Sure Yet?",
                body: "Start from what you want from the night and move into a style guide.",
                cta: "Open the Style Guide",
                href: "#guidance",
              },
            ].map((card) => (
              <Link key={card.title} className="e4s-dance-lovable-path-card" href={card.href}>
                <card.icon aria-hidden="true" size={24} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <span>
                  {card.cta}
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-promoted" aria-labelledby="dance-promoted-title">
          <SectionHeading
            action="Advertising Options"
            actionHref="/advertise"
            eyebrow="Promoted"
            id="dance-promoted-title"
            sub="Paid placements from dance schools and promoters. Twelve slots in a 6x2 surface, ready for the existing promotion system."
            title="Featured Classes & Studios"
          />
          <div className="e4s-dance-lovable-promoted-grid">
            {promotedSlots.map((listing, index) =>
              listing ? (
                <Link
                  key={listing.id}
                  className="e4s-dance-lovable-feature-card"
                  href={`/listing/${toListingSlug(listing.id, listingTitle(listing))}`}
                >
                  <span>Featured</span>
                  <strong>{listingTitle(listing)}</strong>
                  <em>
                    {listingStyle(listing)} / {listingCity(listing)}
                  </em>
                  <p>{listingSummary(listing)}</p>
                  <small>
                    <CalendarDays aria-hidden="true" size={14} />
                    View Class Details
                  </small>
                </Link>
              ) : (
                <Link key={`advertise-${index}`} className="e4s-dance-lovable-ad-card" href="/advertise">
                  <span>
                    <Plus aria-hidden="true" size={18} />
                  </span>
                  <strong>Advertise Here</strong>
                  <em>Dance Class Promotion Slot</em>
                </Link>
              ),
            )}
          </div>
          <div className="e4s-dance-lovable-promo-note">
            <p>
              <Megaphone aria-hidden="true" size={16} />
              Tiles are sold by dance category, city, or exact category and city scope.
            </p>
            <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="/advertise">
              Reserve a Dance Class Tile
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>

        <section className="e4s-dance-lovable-band" id="styles">
          <div className="e4s-dance-lovable-shell">
            <SectionHeading
              action="All Styles"
              actionHref="/dance-classes/styles"
              eyebrow="Choose by Style"
              sub="Each style page lists beginner courses, drop-in classes and socials, city by city."
              title="Pick the Room That Suits You"
            />
            <div className="e4s-dance-lovable-style-grid">
              {sortedStyles.map((style) => (
                <Link key={style.slug} className="e4s-dance-lovable-style-card" href={danceStyleHref(style)}>
                  <span className="e4s-dance-lovable-style-card__image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={`${styleTitle(style)} class`} loading="lazy" src={styleImage(style)} />
                    <span>{style.listing_count} Classes</span>
                  </span>
                  <span className="e4s-dance-lovable-style-card__copy">
                    <strong>{styleTitle(style)}</strong>
                    <em>{styleSummary(style)}</em>
                  </span>
                </Link>
              ))}
            </div>
            <div className="e4s-dance-lovable-chip-row" aria-label="More dance style links">
              {danceStyleLinks.map((style) => (
                <Link key={style.href} href={style.href}>
                  {style.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-guidance" id="guidance">
          <SectionHeading
            eyebrow="Not Sure Yet"
            sub="Four common reasons singles book a first class, and the styles that tend to deliver."
            title="Start from What You Actually Want"
          />
          <div className="e4s-dance-lovable-guidance-grid">
            {danceStyleDecisionPaths.map((path, index) => {
              const Icon = intentIcons[index] ?? Sparkles;
              const picks = intentPicks[index] ?? [];
              return (
                <article key={path.title}>
                  <span>
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <h3>{path.title}</h3>
                  <p>{path.copy}</p>
                  <div>
                    {picks.map((href) => {
                      const meta = styleMetaByHref.get(href);
                      return (
                        <Link key={href} href={href}>
                          {meta?.title ?? href.split("/").pop()?.replace(/-/g, " ")}
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="e4s-dance-lovable-band" id="cities">
          <div className="e4s-dance-lovable-shell">
            <SectionHeading
              action="All Locations"
              actionHref="/dance-classes"
              eyebrow="Choose by City"
              id="dance-classes-near-you"
              sub="Capital cities and regional hubs, with venues, class nights and socials."
              title="Dance Classes Near You"
            />
            <div className="e4s-dance-lovable-city-grid">
              {sortedCities.map((city) => (
                <Link key={city.slug} className="e4s-dance-lovable-city-card" href={`/dance-classes/${toUrlSlug(city.slug)}`}>
                  <span className="e4s-dance-lovable-city-card__image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={`Dance classes in ${city.label}`} loading="lazy" src={cityImage(city)} />
                  </span>
                  <span className="e4s-dance-lovable-city-card__body">
                    <strong>{city.label}</strong>
                    <em>{citySummary(city)}</em>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-searches" aria-labelledby="dance-searches-title">
          <SectionHeading
            eyebrow="Popular Searches"
            id="dance-searches-title"
            sub="Direct internal links to the combinations singles look for most."
            title="Styles by City"
          />
          <div className="e4s-dance-lovable-search-grid">
            {popularSearchGroups.map(({ style, cities: groupCities }) => {
              const styleSegment = toCategoryChildUrlSegment("dance_classes", style.slug);
              return (
                <div key={style.slug}>
                  <h3>{styleTitle(style)}</h3>
                  <ul>
                    {groupCities.map((city) => (
                      <li key={`${style.slug}-${city.slug}`}>
                        <Link href={`/dance-classes/${styleSegment}/${toUrlSlug(city.slug)}`}>
                          {styleTitle(style)} in {city.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-editorial">
          <article>
            <ShieldCheck aria-hidden="true" size={24} />
            <h2>Never danced before? That&apos;s the normal case.</h2>
            <p>
              Most listed classes are beginner-first and rotate partners, so arriving alone is
              expected. The style guide covers what to wear, what a first class costs, and how to
              choose a room that feels comfortable.
            </p>
            <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="/dance-classes/styles">
              Read the Beginner Guide
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </article>
          <article id="advertise">
            <Megaphone aria-hidden="true" size={24} />
            <h2>Run classes? Get in front of singles who are ready to book.</h2>
            <p>
              Free standard listings for studios and promoters, plus promoted tiles on this hub and
              on each style and city page. Reporting on views and click-throughs included.
            </p>
            <div>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--accent" href="/advertise">
                List Your Class Free
              </Link>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--ghost" href="/advertise">
                See Advertising Rates
              </Link>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
