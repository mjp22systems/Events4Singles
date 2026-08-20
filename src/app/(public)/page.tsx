import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedListings, getUpcomingEvents, type PublicEvent } from "@/lib/data";
import NewsletterForm from "@/components/newsletter-form";
import HomeFeatured from "@/components/home-featured";

export const metadata: Metadata = {
  title: "Events4Singles — Australian Singles Events Directory",
};

const FEATURED_CITIES = [
  { slug: "sydney", label: "Sydney", img: "/images/home-city-sydney.jpg" },
  { slug: "melbourne", label: "Melbourne", img: "/images/home-city-melbourne.jpg" },
  { slug: "brisbane", label: "Brisbane", img: "/images/home-city-brisbane.jpg" },
  { slug: "perth", label: "Perth", img: "/images/home-city-perth.jpg" },
  { slug: "adelaide", label: "Adelaide", img: "/images/home-city-adelaide.jpg" },
  { slug: "hobart", label: "Hobart", img: "/images/home-city-hobart.jpg" },
];

const FEATURED_CATS = [
  { slug: "speed-dating", label: "Speed Dating", sub: "Quick, fun introductions.", img: "/images/home-cat-speed-dating.jpg" },
  { slug: "dinner-parties", label: "Dinner Parties", sub: "Elegant, curated meals.", img: "/images/home-cat-dinner-parties.jpg" },
  { slug: "social-clubs", label: "Mixers", sub: "Casual, after-work drinks.", img: "/images/home-cat-mixers.jpg" },
  { slug: "dance-classes", label: "Activities", sub: "Hiking, cooking, etc.", img: "/images/home-cat-activities.jpg" },
];


const PLACEHOLDER_EVENTS = [
  { id: "p1", title: "Speed Dating Sydney — 30s & 40s", starts_at: "2026-09-06T19:00:00+10:00", venue_name: "The Establishment Bar", suburb: "Sydney CBD", city: "sydney", price_min: 3500, image_url: "/images/home-cat-speed-dating.jpg", source: "admin", ticket_url: null, description: "Fast-paced fun for Sydney singles in their 30s and 40s. Seven-minute dates, great drinks." },
  { id: "p2", title: "Singles Dinner Party Melbourne", starts_at: "2026-09-13T19:30:00+10:00", venue_name: "Cumulus Inc.", suburb: "Flinders Lane", city: "melbourne", price_min: 9500, image_url: "/images/home-cat-dinner-parties.jpg", source: "admin", ticket_url: null, description: "Long-table dinner for 20 Melbourne professionals. Matched seating, three courses, no awkward silences." },
  { id: "p3", title: "Salsa Social — Singles Night Brisbane", starts_at: "2026-09-20T18:00:00+10:00", venue_name: "Cloudland", suburb: "Fortitude Valley", city: "brisbane", price_min: 2500, image_url: "/images/home-cat-activities.jpg", source: "admin", ticket_url: null, description: "Beginner salsa lesson followed by a social dance floor open to all singles." },
  { id: "p4", title: "Speed Dating Perth — 20s & 30s", starts_at: "2026-09-27T19:00:00+08:00", venue_name: "The Rooftop Bar", suburb: "Northbridge", city: "perth", price_min: 3000, image_url: "/images/home-cat-speed-dating.jpg", source: "admin", ticket_url: null, description: "Perth's most popular speed dating night for singles in their 20s and 30s." },
  { id: "p5", title: "Mixer Night Adelaide", starts_at: "2026-10-04T18:30:00+09:30", venue_name: "Press Food & Wine", suburb: "Adelaide CBD", city: "adelaide", price_min: 2000, image_url: "/images/home-cat-mixers.jpg", source: "admin", ticket_url: null, description: "Relaxed after-work mixer in Adelaide's best wine bar. No awkward games, just great people." },
  { id: "p6", title: "Premium Dinner Party Sydney", starts_at: "2026-10-11T19:00:00+10:00", venue_name: "Quay Restaurant", suburb: "The Rocks", city: "sydney", price_min: 14500, image_url: "/images/home-cat-dinner-parties.jpg", source: "admin", ticket_url: null, description: "Sydney's most exclusive singles dinner — waterfront views, matched seating, five courses." },
  { id: "p7", title: "Speed Dating Melbourne CBD", starts_at: "2026-10-18T19:00:00+10:00", venue_name: "Taxi Kitchen", suburb: "Federation Square", city: "melbourne", price_min: 3500, image_url: "/images/home-cat-speed-dating.jpg", source: "admin", ticket_url: null, description: "Melbourne's iconic speed dating night returns with a fresh format and great venue." },
  { id: "p8", title: "Dance & Social Night — Gold Coast", starts_at: "2026-10-25T18:00:00+10:00", venue_name: "HOTA", suburb: "Surfers Paradise", city: "gold_coast", price_min: 2500, image_url: "/images/home-cat-activities.jpg", source: "admin", ticket_url: null, description: "Fun social dancing for Gold Coast singles — no experience needed." },
] as PublicEvent[];

const INTENT_GROUPS = [
  {
    id: "partner",
    icon: "💕",
    heading: "Find a Partner",
    desc: "Explicit matching services for singles actively looking to meet someone.",
    cats: [
      { slug: "speed-dating", label: "Speed Dating" },
      { slug: "dinner-parties", label: "Dinner Parties" },
      { slug: "intro-agencies", label: "Introduction Agencies" },
      { slug: "online-dating", label: "Online Dating" },
      { slug: "mature-dating-events", label: "Mature Dating" },
    ],
    browse: "/speed-dating",
  },
  {
    id: "social",
    icon: "🎉",
    heading: "Get Out There",
    desc: "Activities and venues where singles connect naturally through shared experiences.",
    cats: [
      { slug: "social-clubs", label: "Social Clubs" },
      { slug: "dance-classes", label: "Dance Classes" },
      { slug: "dance-party-clubs", label: "Dance Party Clubs" },
      { slug: "nightclubs", label: "Nightclubs" },
      { slug: "adventure-for-singles", label: "Adventure" },
    ],
    browse: "/social-clubs",
  },
  {
    id: "growth",
    icon: "✨",
    heading: "Invest in Yourself",
    desc: "Services and programs that help you grow, heal, and feel your best.",
    cats: [
      { slug: "life-coaches", label: "Life Coaches" },
      { slug: "psychology", label: "Psychology" },
      { slug: "healing-and-happiness", label: "Healing & Happiness" },
      { slug: "seminars", label: "Seminars" },
      { slug: "fitness4singles", label: "Fitness for Singles" },
    ],
    browse: "/life-coaches",
  },
];

const EXPERIENCES = [
  { label: "Elegant Dinner Parties", desc: "Intimate gatherings for professionals who appreciate fine food and good company.", img: "/images/home-exp-dinner-parties.jpg", href: "/dinner-parties", badge: "PREMIUM" },
  { label: "Dance & Connect", desc: "Salsa, swing, and ballroom mixers.", img: "/images/home-exp-dance-classes.jpg", href: "/dance-classes", badge: null },
  { label: "Singles Travel", desc: "Group trips and local getaways.", img: "/images/home-exp-travel.jpg", href: "/travel-for-singles", badge: null },
];

const RESOURCES = [
  { badge: "TIPS", img: "/images/home-blog-tips.jpg", title: "5 Icebreakers for Your Next Speed Dating Event", desc: "Nervous about what to say? These proven icebreakers will help you start meaningful conversations.", href: "/dating-resources" },
  { badge: "SUCCESS STORIES", img: "/images/home-blog-success.jpg", title: "How Sarah and Mark Met at a Melbourne Mixer", desc: "How a casual Thursday night mixer led to a lasting connection.", href: "/dating-resources" },
  { badge: "CALENDAR", img: "/images/home-blog-calendar.jpg", title: "Top Events to Attend This Spring", desc: "Our hand-picked selection of the most anticipated singles events this season.", href: "/events" },
];

function formatEventDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function formatEventPrice(min: number | null) {
  if (min === null) return null;
  if (min === 0) return "Free";
  return `From $${(min / 100).toFixed(0)}`;
}

function EventsSection({ events }: { events: PublicEvent[] }) {
  const display = events.length > 0 ? events : PLACEHOLDER_EVENTS;

  return (
    <div className="e4s-shell e4s-home-events-grid">
      {display.map((ev) => {
        const price = formatEventPrice(ev.price_min);
        const location = [ev.venue_name, ev.suburb, ev.city].filter(Boolean).join(", ");
        const href = ev.ticket_url || "/events";
        return (
          <article className="e4s-home-event-card" key={ev.id}>
            {ev.image_url && (
              <div className="e4s-home-event-card__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={ev.title} loading="lazy" src={ev.image_url} />
                {ev.source !== "admin" && (
                  <span className="e4s-home-event-card__badge">{ev.source.toUpperCase()}</span>
                )}
              </div>
            )}
            <div className="e4s-home-event-card__body">
              <p className="e4s-home-event-card__date">{formatEventDate(ev.starts_at)}</p>
              <h3>{ev.title}</h3>
              {location && <p className="e4s-home-event-card__location">{location}</p>}
              {ev.description && <p className="e4s-home-event-card__desc">{ev.description.slice(0, 120)}{ev.description.length > 120 ? "…" : ""}</p>}
              {price && <p className="e4s-home-event-card__meta">{price}</p>}
              <Link className="e4s-home-event-card__link" href={href}>View Details</Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default async function HomePage() {
  const [featured, upcomingEvents] = await Promise.all([
    getFeaturedListings(5),
    getUpcomingEvents(8),
  ]);

  return (
    <>
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
            <h2>What are you looking for?</h2>
            <p>Find the right service for where you are in your singles journey.</p>
          </div>
        </div>
        <div className="e4s-shell e4s-home-intent-grid">
          {INTENT_GROUPS.map((group) => (
            <div key={group.id} className={`e4s-home-intent-tile e4s-home-intent-tile--${group.id}`}>
              <span className="e4s-home-intent-tile__icon" aria-hidden="true">{group.icon}</span>
              <h3 className="e4s-home-intent-tile__heading">{group.heading}</h3>
              <p className="e4s-home-intent-tile__desc">{group.desc}</p>
              <div className="e4s-home-intent-tile__cats">
                {group.cats.map((cat) => (
                  <Link key={cat.slug} href={`/${cat.slug}`} className="e4s-home-intent-tile__cat">
                    {cat.label}
                  </Link>
                ))}
              </div>
              <Link href={group.browse} className="e4s-home-intent-tile__browse">
                Browse {group.heading} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPLORE BY CITY */}
      <section className="e4s-home-section e4s-home-section--tinted" id="cities">
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
              <span className="e4s-home-cat-tile__label">{cat.label}</span>
              <span className="e4s-home-cat-tile__sub">{cat.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. WHAT'S ON */}
      <section className="e4s-home-section" id="events-calendar">
        <div className="e4s-shell e4s-home-section__head">
          <div>
            <h2>What&apos;s On</h2>
            <p>Upcoming events across Australia.</p>
          </div>
          <Link className="e4s-home-section__more e4s-home-section__more--calendar" href="/events">View What's On</Link>
        </div>
        <EventsSection events={upcomingEvents} />
      </section>

      {/* 5. FEATURED BUSINESSES */}
      {featured.length > 0 && (
        <section className="e4s-home-section e4s-home-section--tinted" id="featured-organizers">
          <div className="e4s-shell e4s-home-section__head">
            <div>
              <h2>Featured Businesses</h2>
              <p>Hand-picked event organisers, venues and services for singles across Australia. Filter by location or category to find what suits you.</p>
            </div>
            <Link className="e4s-home-section__more" href="/speed-dating/sydney">View All Listings</Link>
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
      <section className="e4s-home-section e4s-home-section--tinted" id="site-content">
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
    </>
  );
}
