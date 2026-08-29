import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { getFeaturedListings, getUpcomingEvents } from "@/lib/data";
import NewsletterForm from "@/components/newsletter-form";
import HomeFeatured from "@/components/home-featured";
import EventCardGrid from "@/components/event-card-grid";
import { PATHWAYS } from "@/lib/pathways";
import { pageMetadata, collectionPageJsonLd } from "@/lib/seo";
import BodyClass from "@/components/body-class";

export const metadata: Metadata = pageMetadata({
  title: "Events4Singles - Australian Singles Events Directory",
  description:
    "Find singles events, speed dating, dinner parties, social clubs, dance classes and dating services across Australia.",
  path: "/",
  keywords: ["singles events Australia", "speed dating Australia", "dating events Australia"],
});

const FEATURED_CITIES = [
  { slug: "sydney", label: "Sydney", img: "/images/site/home/city-cards/home-city-sydney.webp" },
  { slug: "melbourne", label: "Melbourne", img: "/images/site/home/city-cards/home-city-melbourne.webp" },
  { slug: "brisbane", label: "Brisbane", img: "/images/site/home/city-cards/home-city-brisbane.webp" },
  { slug: "perth", label: "Perth", img: "/images/site/home/city-cards/home-city-perth.webp" },
  { slug: "adelaide", label: "Adelaide", img: "/images/site/home/city-cards/home-city-adelaide.webp" },
  { slug: "hobart", label: "Hobart", img: "/images/site/home/city-cards/home-city-hobart.webp" },
];

const FEATURED_CATS = [
  { slug: "speed-dating", label: "Speed Dating", sub: "Quick, fun introductions.", img: "/images/site/home/browse-category-tiles/home-cat-speed-dating.webp" },
  { slug: "dinner-parties", label: "Dinner Parties", sub: "Elegant, curated meals.", img: "/images/site/home/browse-category-tiles/home-cat-dinner-parties.webp" },
  { slug: "social-clubs", label: "Mixers", sub: "Casual, after-work drinks.", img: "/images/site/home/browse-category-tiles/home-cat-mixers.webp" },
  { slug: "dance-classes", label: "Activities", sub: "Hiking, cooking, etc.", img: "/images/site/home/browse-category-tiles/home-cat-activities.webp" },
];


const EXPERIENCES = [
  { label: "Elegant Dinner Parties", desc: "Intimate gatherings for professionals who appreciate fine food and good company.", img: "/images/site/home/experience-cards/home-exp-dinner-parties.jpg", href: "/dinner-parties", badge: "PREMIUM" },
  { label: "Dance & Connect", desc: "Salsa, swing, and ballroom mixers.", img: "/images/site/home/experience-cards/home-exp-dance-classes.jpg", href: "/dance-classes", badge: null },
  { label: "Singles Travel", desc: "Group trips and local getaways.", img: "/images/site/home/experience-cards/home-exp-travel.jpg", href: "/solo-travel", badge: null },
];

const RESOURCES = [
  { badge: "TIPS", img: "/images/site/home/resource-cards/home-blog-tips.jpg", title: "5 Icebreakers for Your Next Speed Dating Event", desc: "Nervous about what to say? These proven icebreakers will help you start meaningful conversations.", href: "/dating-resources" },
  { badge: "SUCCESS STORIES", img: "/images/site/home/resource-cards/home-blog-success.jpg", title: "How Sarah and Mark Met at a Melbourne Mixer", desc: "How a casual Thursday night mixer led to a lasting connection.", href: "/dating-resources" },
  { badge: "CALENDAR", img: "/images/site/home/resource-cards/home-blog-calendar.jpg", title: "Top Events to Attend This Spring", desc: "Our hand-picked selection of the most anticipated singles events this season.", href: "/events" },
];

const HOMEPAGE_FEATURED_LISTING_LIMIT = 5;

export default async function HomePage() {
  const [featured, upcomingEvents] = await Promise.all([
    getFeaturedListings(HOMEPAGE_FEATURED_LISTING_LIMIT),
    getUpcomingEvents(8),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd({
            name: "Events4Singles",
            description: "Australian singles events directory for events, activities and dating services.",
            path: "/",
          })),
        }}
      />
      <BodyClass add="e4s-page-home" />
      <main className="e4s-home-page" id="site-content">
      {/* 1. HERO */}
      <section className="e4s-home-hero">
        <div className="e4s-home-hero__bg" />
        <div className="e4s-shell e4s-home-hero__inner">
          <div className="e4s-home-hero__copy">
            <span className="e4s-home-hero__pill"><span className="e4s-home-hero__pill-emoji">🎉</span> Australia&apos;s Premier Directory</span>
            <h1>Find singles events <em className="e4s-home-hero__pink">near you</em></h1>
            <p className="e4s-home-hero__sub">
              Discover curated speed dating, elegant dinner parties, and exclusive mixers.
              Connect with like-minded professionals in a sophisticated environment.
            </p>
            <div className="e4s-home-hero__ctas">
              <Link className="e4s-home-hero__cta e4s-home-hero__cta--primary" href="/events">Browse Events →</Link>
              <Link className="e4s-home-hero__cta" href="/cities">Browse by City</Link>
              <Link className="e4s-home-hero__cta" href="/categories">Browse Categories</Link>
            </div>
            <p className="e4s-home-hero__advertiser">
              <span className="e4s-home-hero__advertiser-label">EVENT ORGANIZER?</span>{" "}<Link href="/advertise">Advertise with us ↗</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 2. INTENT GROUPS */}
      <section className="e4s-home-section e4s-home-section--tinted" id="browse-by-intent">
        <div className="e4s-shell e4s-home-section__head">
          <div>
            <p className="e4s-home-section__eyebrow">Start Here</p>
            <h2>What are you looking for?</h2>
            <p>Three ways in, depending on where you are right now — from quietly working on yourself, to getting out more, to actively looking to meet someone.</p>
          </div>
        </div>
        <div className="e4s-shell e4s-home-intent-grid">
          {PATHWAYS.map((group) => (
            <div key={group.id} className={`e4s-home-intent-tile e4s-home-intent-tile--${group.id}`}>
              <div className="e4s-home-intent-tile__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={group.title} loading="lazy" src={group.image} />
                <span className="e4s-home-intent-tile__number">{group.number}</span>
                <div className="e4s-home-intent-tile__media-copy">
                  <p>{group.eyebrow}</p>
                  <h3>{group.title}</h3>
                </div>
              </div>
              <div className="e4s-home-intent-tile__body">
                <p className="e4s-home-intent-tile__desc">{group.shortIntro}</p>
                <ul className="e4s-home-intent-tile__cats">
                  {group.categories.slice(0, 5).map((cat) => (
                    <li key={cat.slug}>
                      <Link href={`/${cat.slug}`} className="e4s-home-intent-tile__cat">
                        <span>{cat.label}</span>
                        <span aria-hidden="true">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={`/${group.slug}`} className="e4s-home-intent-tile__browse">
                Browse {group.title} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPLORE BY CITY */}
      <section className="e4s-home-section e4s-home-section--cities" id="cities">
        <div className="e4s-shell e4s-home-section__head">
          <div>
            <h2>Explore by City</h2>
            <p>Find local events happening in major Australian hubs.</p>
          </div>
          <Link className="e4s-home-section__more" href="/cities">View All Cities</Link>
        </div>
        <div className="e4s-shell e4s-home-city-grid">
          {FEATURED_CITIES.map((city) => (
            <Link key={city.slug} className="e4s-home-city-tile" href={`/${city.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={city.label} loading="lazy" src={city.img} />
              <span>{city.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BROWSE BY CATEGORY */}
      <section className="e4s-home-section" id="categories">
        <div className="e4s-shell e4s-home-section__head">
          <div>
            <h2>Browse by Category</h2>
            <p>Discover the perfect event for your personality.</p>
          </div>
          <Link className="e4s-home-section__more" href="/categories">View All Categories</Link>
        </div>
        <div className="e4s-shell e4s-home-cat-grid">
          {FEATURED_CATS.map((cat) => (
            <Link key={cat.slug} className="e4s-home-cat-tile" href={`/${cat.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={cat.label} loading="lazy" src={cat.img} />
              <span className="e4s-home-cat-tile__copy">
                <span className="e4s-home-cat-tile__label">{cat.label}</span>
                <span className="e4s-home-cat-tile__sub">{cat.sub}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. WHAT'S ON */}
      <section className="e4s-home-section e4s-home-section--events" id="events-calendar">
        <div className="e4s-shell e4s-home-section__head">
          <div>
            <h2>What&apos;s On</h2>
            <p>Upcoming events across Australia.</p>
          </div>
          <Link className="e4s-home-section__more e4s-home-section__more--calendar" href="/events">
            <span>View What&apos;s On</span>
            <CalendarDays aria-hidden="true" className="e4s-home-section__more-icon" size={16} />
          </Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <EventCardGrid events={upcomingEvents} />
        ) : (
          <div className="e4s-shell e4s-empty-state">
            <p>No upcoming events are published yet. Check back soon.</p>
          </div>
        )}
      </section>

      {/* 5. FEATURED BUSINESSES */}
      {featured.length > 0 && (
        <section className="e4s-home-section e4s-home-section--featured" id="featured-organizers">
          <div className="e4s-shell e4s-home-section__head">
            <div>
              <h2>Featured Businesses</h2>
              <p>Hand-picked event organisers, venues and services for singles across Australia.</p>
            </div>
            <Link className="e4s-home-section__more" href="/featured-listings">View Featured Listings</Link>
          </div>
          <div className="e4s-shell">
            <HomeFeatured listings={featured} />
          </div>
        </section>
      )}

      {/* 6. CURATED EXPERIENCES */}
      <section className="e4s-home-section" id="experiences">
        <div className="e4s-shell e4s-home-section__head">
          <div>
            <h2>Curated Experiences</h2>
            <p>Standout ways to meet people — from long-table dinners to weekend escapes.</p>
          </div>
          <Link className="e4s-home-section__more" href="/dinner-parties">View More</Link>
        </div>
        <div className="e4s-shell e4s-home-exp-grid">
          {EXPERIENCES.map((exp) => (
            <Link key={exp.href} className="e4s-home-exp-tile" href={exp.href}>
              <div className="e4s-home-exp-tile__img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={exp.label} loading="lazy" src={exp.img} />
                {exp.badge && <span className="e4s-home-exp-tile__badge">{exp.badge}</span>}
              </div>
              <div className="e4s-home-exp-tile__body">
                <h3>{exp.label}</h3>
                <p>{exp.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. ADVERTISER CTA */}
      <section className="e4s-home-advertise-cta">
        <div className="e4s-shell">
          <h2>Reach Thousands of Local Singles</h2>
          <p>Are you an event organizer or venue? List your events in Australia&apos;s premier singles directory and grow your audience.</p>
          <Link className="e4s-home-advertise-cta__btn" href="/advertise">List Your Event</Link>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="e4s-home-newsletter">
        <div className="e4s-shell e4s-home-newsletter__inner">
          <div className="e4s-home-newsletter__icon">
            <svg aria-hidden="true" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2>Never Miss an Event</h2>
          <p>Join our VIP list to get early access to exclusive events in your city.</p>
          <NewsletterForm />
          <p className="e4s-home-newsletter__note">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

      {/* 9. DATING RESOURCES */}
      <section className="e4s-home-section e4s-home-section--tinted" id="dating-resources">
        <div className="e4s-shell e4s-home-section__head">
          <div>
            <h2>Dating Resources</h2>
            <p>Advice, news, and inspiration for singles.</p>
          </div>
          <Link className="e4s-home-section__more" href="/dating-resources">View All Resources</Link>
        </div>
        <div className="e4s-shell e4s-home-resources-grid">
          {RESOURCES.map((res) => (
            <Link key={res.title} className="e4s-home-resource-tile" href={res.href}>
              <div className="e4s-home-resource-tile__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={res.title} loading="lazy" src={res.img} />
                <span className="e4s-home-resource-tile__badge">{res.badge}</span>
              </div>
              <div className="e4s-home-resource-tile__body">
                <h3>{res.title}</h3>
                <p>{res.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </main>
    </>
  );
}
