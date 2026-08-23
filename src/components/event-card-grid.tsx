import Link from "next/link";
import { eventPath } from "@/lib/event-slugs";
import { eventDescriptionExcerpt } from "@/lib/event-text";
import type { PublicEvent } from "@/lib/data";

function formatEventDate(iso: string, timezone: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: timezone });
  } catch {
    return iso;
  }
}

function formatEventPrice(min: number | null) {
  if (min === null) return null;
  if (min === 0) return "Free";
  return `From $${(min / 100).toFixed(0)}`;
}

function eventHref(ev: PublicEvent) {
  return eventPath(ev);
}

export default function EventCardGrid({ events }: { events: PublicEvent[] }) {
  return (
    <div className="e4s-shell e4s-home-events-grid">
      {events.map((ev) => {
        const price = formatEventPrice(ev.price_min);
        const location = [ev.venue_name, ev.suburb, ev.city].filter(Boolean).join(", ");
        const excerpt = eventDescriptionExcerpt(ev.description);
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
              <p className="e4s-home-event-card__date">{formatEventDate(ev.starts_at, ev.timezone)}</p>
              <h3>{ev.title}</h3>
              {location && <p className="e4s-home-event-card__location">{location}</p>}
              {excerpt && <p className="e4s-home-event-card__desc">{excerpt}</p>}
              {price && <p className="e4s-home-event-card__meta">{price}</p>}
              <Link className="e4s-home-event-card__link" href={eventHref(ev)}>View Details</Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
