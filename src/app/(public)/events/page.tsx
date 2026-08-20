import type { Metadata } from "next";
import Link from "next/link";
import { getAllCities, getAllCategories, getUpcomingEvents, type PublicEvent } from "@/lib/data";
import EventsFilter from "@/components/events-filter";
import EventsCalendarLoader from "@/components/events-calendar-loader";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What's On — Upcoming Singles Events Australia",
  description: "Browse upcoming singles events across Australia — speed dating, dinner parties, social nights, dance classes and more. List view and calendar.",
};

const PLACEHOLDER_EVENTS: PublicEvent[] = [
  { id: "p1", title: "Speed Dating Sydney — 30s & 40s", starts_at: "2026-09-06T19:00:00+10:00", ends_at: null, venue_name: "The Establishment Bar", suburb: "Sydney CBD", city: "sydney", price_min: 3500, price_max: null, image_url: "/images/home-cat-speed-dating.jpg", source: "admin", ticket_url: null, description: "Fast-paced fun for Sydney singles in their 30s and 40s. Seven-minute dates, great drinks.", category: "speed_dating" },
  { id: "p2", title: "Singles Dinner Party Melbourne", starts_at: "2026-09-13T19:30:00+10:00", ends_at: null, venue_name: "Cumulus Inc.", suburb: "Flinders Lane", city: "melbourne", price_min: 9500, price_max: null, image_url: "/images/home-cat-dinner-parties.jpg", source: "admin", ticket_url: null, description: "Long-table dinner for 20 Melbourne professionals. Matched seating, three courses.", category: "dinner_parties" },
  { id: "p3", title: "Salsa Social — Singles Night Brisbane", starts_at: "2026-09-20T18:00:00+10:00", ends_at: null, venue_name: "Cloudland", suburb: "Fortitude Valley", city: "brisbane", price_min: 2500, price_max: null, image_url: "/images/home-cat-activities.jpg", source: "admin", ticket_url: null, description: "Beginner salsa lesson followed by a social dance floor open to all singles.", category: "dance_classes" },
  { id: "p4", title: "Speed Dating Perth — 20s & 30s", starts_at: "2026-09-27T19:00:00+08:00", ends_at: null, venue_name: "The Rooftop Bar", suburb: "Northbridge", city: "perth", price_min: 3000, price_max: null, image_url: "/images/home-cat-speed-dating.jpg", source: "admin", ticket_url: null, description: "Perth's most popular speed dating night for singles in their 20s and 30s.", category: "speed_dating" },
  { id: "p5", title: "Mixer Night Adelaide", starts_at: "2026-10-04T18:30:00+09:30", ends_at: null, venue_name: "Press Food & Wine", suburb: "Adelaide CBD", city: "adelaide", price_min: 2000, price_max: null, image_url: "/images/home-cat-mixers.jpg", source: "admin", ticket_url: null, description: "Relaxed after-work mixer in Adelaide's best wine bar. No awkward games, just great people.", category: "social_clubs" },
  { id: "p6", title: "Premium Dinner Party Sydney", starts_at: "2026-10-11T19:00:00+10:00", ends_at: null, venue_name: "Quay Restaurant", suburb: "The Rocks", city: "sydney", price_min: 14500, price_max: null, image_url: "/images/home-cat-dinner-parties.jpg", source: "admin", ticket_url: null, description: "Sydney's most exclusive singles dinner — waterfront views, matched seating, five courses.", category: "dinner_parties" },
  { id: "p7", title: "Speed Dating Melbourne CBD", starts_at: "2026-10-18T19:00:00+10:00", ends_at: null, venue_name: "Taxi Kitchen", suburb: "Federation Square", city: "melbourne", price_min: 3500, price_max: null, image_url: "/images/home-cat-speed-dating.jpg", source: "admin", ticket_url: null, description: "Melbourne's iconic speed dating night returns with a fresh format and great venue.", category: "speed_dating" },
  { id: "p8", title: "Dance & Social Night — Gold Coast", starts_at: "2026-10-25T18:00:00+10:00", ends_at: null, venue_name: "HOTA", suburb: "Surfers Paradise", city: "gold_coast", price_min: 2500, price_max: null, image_url: "/images/home-cat-activities.jpg", source: "admin", ticket_url: null, description: "Fun social dancing for Gold Coast singles — no experience needed.", category: "dance_classes" },
];

function formatEventDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

function formatEventPrice(min: number | null) {
  if (min === null) return null;
  if (min === 0) return "Free";
  return `From $${(min / 100).toFixed(0)}`;
}

function defaultMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string; paid?: string; view?: string; month?: string }>;
}) {
  const { city, category, paid, view: viewParam, month: monthParam } = await searchParams;

  const view = viewParam === "calendar" ? "calendar" : "list";
  const month = monthParam || defaultMonth();
  const paidFilter = paid === "free" ? "free" : paid === "paid" ? "paid" : undefined;

  const limit = view === "calendar" ? 50 : 16;

  const [events, cities, categories] = await Promise.all([
    getUpcomingEvents(limit, city, category, paidFilter),
    getAllCities(),
    getAllCategories(),
  ]);

  const display = events.length > 0 ? events : PLACEHOLDER_EVENTS;

  return (
    <main id="site-content">
      <div className="e4s-shell e4s-events-page-header">
        <div>
          <h1>What's On</h1>
          <p className="e4s-lead">Upcoming singles events across Australia — browse by list or calendar.</p>
        </div>
        <EventsFilter
          cities={cities}
          categories={categories}
          selectedCity={city}
          selectedCategory={category}
          selectedPaid={paid}
          view={view}
          month={month}
        />
      </div>

      {view === "calendar" ? (
        <div className="e4s-shell e4s-events-view">
          <EventsCalendarLoader events={display} month={month} />
        </div>
      ) : (
        <div className="e4s-shell e4s-home-events-grid">
          {display.map((ev) => {
            const price = formatEventPrice(ev.price_min);
            const location = [ev.venue_name, ev.suburb, ev.city].filter(Boolean).join(", ");
            const href = ev.ticket_url || "/advertise";
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
                  {ev.description && (
                    <p className="e4s-home-event-card__desc">
                      {ev.description.slice(0, 120)}{ev.description.length > 120 ? "…" : ""}
                    </p>
                  )}
                  {price && <p className="e4s-home-event-card__meta">{price}</p>}
                  <Link className="e4s-home-event-card__link" href={href}>View Details</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="e4s-shell e4s-page-foot">
        <h2>List Your Event</h2>
        <p>
          Running singles events? <Link href="/advertise">View advertising packages</Link> to get
          your events in front of thousands of singles across Australia.
        </p>
      </div>
    </main>
  );
}
