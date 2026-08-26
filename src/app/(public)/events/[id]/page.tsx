import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { canonicalPublicEventSlug, getEventDatePager, getNextUpcomingEvents, getPublicEventBySlugOrId, type PublicEvent } from "@/lib/data";
import { slugToLabel, toProfileSlug } from "@/lib/constants";
import { eventPath } from "@/lib/event-slugs";
import { cleanEventDescription } from "@/lib/event-text";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { PublicMain, PublicPageFoot } from "@/components/public-page";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDateParts(iso: string, timezone: string) {
  const date = new Date(iso);
  return {
    day: date.toLocaleDateString("en-AU", { day: "numeric", timeZone: timezone }),
    month: date.toLocaleDateString("en-AU", { month: "short", timeZone: timezone }),
    weekday: date.toLocaleDateString("en-AU", { weekday: "long", timeZone: timezone }),
    time: date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: timezone }),
  };
}

function formatPagerDate(iso: string, timezone: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: timezone,
  });
}

function eventPagerLabel(direction: "Previous" | "Next", event: PublicEvent) {
  return `${direction}: ${formatPagerDate(event.starts_at, event.timezone)} - ${event.title}`;
}

function formatPrice(min: number | null, max: number | null) {
  if (min === null) return "Free";
  if (min === 0) return "Free";
  const fmt = (value: number) => `$${(value / 100).toFixed(0)}`;
  return max && max !== min ? `${fmt(min)} - ${fmt(max)}` : fmt(min);
}

function sourceLabel(source: string) {
  if (source === "admin") return "Events4Singles";
  if (source === "meetup") return "Meetup";
  if (source === "eventbrite") return "Eventbrite";
  return source
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function uniqueLocationParts(parts: Array<string | null | undefined>) {
  const seen = new Set<string>();
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .filter((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

type EventCta = {
  href: string;
  label: string;
  external: boolean;
  primary: boolean;
};

function eventCtas(event: PublicEvent): EventCta[] {
  const isPaid = (event.price_min ?? 0) > 0 || (event.price_max ?? 0) > 0;
  const registrationMode = event.registration_mode ?? "auto";

  function cta(href: string | null | undefined, label: string): EventCta[] {
    if (!href) return [];
    return [{ href, label, external: /^https?:\/\//i.test(href), primary: true }];
  }

  if (registrationMode === "eventbrite") return cta(event.push_url, "Register on Eventbrite");
  if (registrationMode === "ticket") return cta(event.ticket_url, "Book or RSVP");
  if (registrationMode === "source") return cta(event.source_url, "View organiser page");
  if (registrationMode === "contact") return cta("/contact", "Contact organiser");
  if (isPaid && event.push_url) return cta(event.push_url, "Register on Eventbrite");

  return cta(event.push_url, "Register on Eventbrite")
    .concat(cta(event.ticket_url, "Book or RSVP"))
    .concat(cta(event.source_url, "View organiser page"))
    .slice(0, 1)
    .concat(cta("/contact", "Contact organiser"))
    .slice(0, 1);
}

function renderInlineMarkdown(text: string) {
  const nodes: ReactNode[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach((part, index) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={index}>{part.slice(2, -2)}</strong>);
    } else {
      nodes.push(part);
    }
  });
  return nodes;
}

function EventDescription({ description }: { description: string }) {
  return (
    <div className="e4s-event-detail__description">
      {description.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>
          {paragraph.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && <br />}
              {renderInlineMarkdown(line)}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getPublicEventBySlugOrId(id);
  if (!event) return { title: "Event not found" };
  const eventDescription = cleanEventDescription(event.description);
  const canonicalSlug = canonicalPublicEventSlug(event);
  return pageMetadata({
    title: `${event.title} - ${slugToLabel(event.city)}`,
    description: eventDescription?.replace(/\*\*/g, "").slice(0, 155) ?? `Details for ${event.title} in ${slugToLabel(event.city)}.`,
    path: `/events/${canonicalSlug}`,
    keywords: [
      event.title,
      `${slugToLabel(event.city)} singles events`,
      event.category ? slugToLabel(event.category) : "",
    ].filter(Boolean),
    image: event.image_url || "/icon.png",
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getPublicEventBySlugOrId(id);
  if (!event) notFound();
  const canonicalSlug = canonicalPublicEventSlug(event);
  if (id !== canonicalSlug) redirect(`/events/${canonicalSlug}`);

  const locationParts = uniqueLocationParts([event.venue_name, event.address, event.suburb, slugToLabel(event.city), event.state]);
  const addressParts = uniqueLocationParts([event.address, event.suburb, slugToLabel(event.city), event.state]);
  const location = locationParts.join(", ");
  const locationAddress = addressParts.join(", ");
  const mapQuery = locationParts.join(", ");
  const mapHref = mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : null;
  const price = formatPrice(event.price_min, event.price_max);
  const priceLabel = price;
  const dateParts = formatDateParts(event.starts_at, event.timezone);
  const eventSourceLabel = sourceLabel(event.source);
  const hostName = event.host_business_name ?? event.host_account_name ?? eventSourceLabel;
  const hostHref = event.host_business_id
    ? `/profile/${event.host_business_profile_slug ?? toProfileSlug(event.host_business_id, event.host_business_name ?? hostName)}`
    : event.source_url;
  const ctas = eventCtas(event);
  const primaryCta = ctas.find((cta) => cta.primary) ?? ctas[0];
  const [upcomingEvents, datePager] = await Promise.all([
    getNextUpcomingEvents(event.id, 4),
    getEventDatePager(event),
  ]);
  const previousPagerLabel = datePager.previous ? eventPagerLabel("Previous", datePager.previous) : null;
  const nextPagerLabel = datePager.next ? eventPagerLabel("Next", datePager.next) : null;
  const eventDescription = cleanEventDescription(event.description);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url: absoluteUrl(`/events/${canonicalSlug}`),
    description: eventDescription,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: event.image_url ? [event.image_url] : undefined,
    location: location ? {
      "@type": "Place",
      name: event.venue_name ?? location,
      address: location,
    } : undefined,
    offers: price ? {
      "@type": "Offer",
      price: event.price_min ? event.price_min / 100 : 0,
      priceCurrency: "AUD",
      url: primaryCta?.href,
      availability: "https://schema.org/InStock",
    } : undefined,
    organizer: hostName ? {
      "@type": "Organization",
      name: hostName,
      url: hostHref ? absoluteUrl(hostHref) : undefined,
    } : undefined,
  };

  return (
    <PublicMain>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <article className="e4s-event-detail">
        {datePager.previous && (
          <Link
            aria-label={previousPagerLabel ?? `Previous: ${datePager.previous.title}`}
            className="e4s-location-pager e4s-location-pager--prev e4s-event-side-pager"
            href={eventPath(datePager.previous)}
          >
            <span className="e4s-location-pager__icon" />
            <span className="e4s-location-pager__label">{previousPagerLabel}</span>
          </Link>
        )}
        {datePager.next && (
          <Link
            aria-label={nextPagerLabel ?? `Next: ${datePager.next.title}`}
            className="e4s-location-pager e4s-location-pager--next e4s-event-side-pager"
            href={eventPath(datePager.next)}
          >
            <span className="e4s-location-pager__icon" />
            <span className="e4s-location-pager__label">{nextPagerLabel}</span>
          </Link>
        )}
        <Link className="e4s-event-back-pager" href="/events">What&apos;s On</Link>

        <div className="e4s-event-detail__layout">
          <div className="e4s-event-detail__main">
            {event.image_url && (
              <div className="e4s-event-detail__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image_url} alt={event.title} />
              </div>
            )}

            <header className="e4s-event-detail__intro">
              <div className="e4s-event-detail__kicker">
                {event.category && <span>{slugToLabel(event.category)}</span>}
              </div>
              <h1>{event.title}</h1>
            </header>

            <section className="e4s-event-section">
              <h2>About this event</h2>
              {eventDescription ? (
                <EventDescription description={eventDescription} />
              ) : (
                <p className="e4s-event-detail__description">More event details are coming soon.</p>
              )}
            </section>

            {(event.source_url || event.source !== "admin") && (
              <section className="e4s-event-section">
                <div className="e4s-event-source__head">
                  <h2>Organiser source</h2>
                  <span>{eventSourceLabel}</span>
                </div>
                <p>
                  This event listing came from {eventSourceLabel}. Event details should be checked with the organiser before attending.
                </p>
                {event.source_url && (
                  <a href={event.source_url} target="_blank" rel="noopener noreferrer">View original event</a>
                )}
              </section>
            )}
          </div>

          <aside className="e4s-event-detail__sidebar" aria-label="Booking and related events">
            <div className="e4s-event-booking">
              <div className="e4s-event-booking__summary" aria-label="Event date, time and price">
                <div className="e4s-event-booking__tile e4s-event-booking__tile--date">
                  <span>{dateParts.month}</span>
                  <strong>{dateParts.day}</strong>
                </div>
                <div className="e4s-event-booking__tile e4s-event-booking__tile--time">
                  <span>{dateParts.weekday}</span>
                  <strong>{dateParts.time}</strong>
                </div>
                <div className="e4s-event-booking__tile e4s-event-booking__tile--price">
                  <span>Price</span>
                  <strong>{priceLabel}</strong>
                </div>
              </div>
              <div className="e4s-event-booking__ctas">
                {ctas.map((cta) => (
                  <a
                    key={cta.href}
                    className={`e4s-event-booking__cta${cta.primary ? "" : " e4s-event-booking__cta--secondary"}`}
                    href={cta.href}
                    target={cta.external ? "_blank" : undefined}
                    rel={cta.external ? "noopener noreferrer" : undefined}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            </div>

            {location && (
              <section className="e4s-event-location-card" aria-labelledby="event-location-heading">
                {mapHref ? (
                  <a className="e4s-event-location-card__map" href={mapHref} target="_blank" rel="noopener noreferrer" aria-label="Open this event location in Google Maps">
                    <span />
                    <em>Open map</em>
                  </a>
                ) : (
                  <div className="e4s-event-location-card__map" aria-hidden="true">
                    <span />
                  </div>
                )}
                <div className="e4s-event-location-card__body">
                  <h2 id="event-location-heading">Location and meeting point</h2>
                  {event.venue_name && (
                    <p>
                      <strong>{event.venue_name}</strong>
                    </p>
                  )}
                  {locationAddress && <p>{locationAddress}</p>}
                </div>
              </section>
            )}

            <section className="e4s-event-host-card" aria-labelledby="event-host-heading">
              <span className="e4s-event-host-card__label">Hosted by</span>
              <div className="e4s-event-host-card__row">
                {event.host_business_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.host_business_logo_url} alt="" />
                ) : (
                  <span className="e4s-event-host-card__avatar" aria-hidden="true">{hostName.charAt(0).toUpperCase()}</span>
                )}
                <div>
                  <h2 id="event-host-heading">{hostName}</h2>
                  <p>{event.host_business_name ? "Event organiser" : `Listed from ${eventSourceLabel}`}</p>
                </div>
              </div>
              {hostHref && (
                event.host_business_id ? (
                  <Link href={hostHref}>View organiser profile</Link>
                ) : (
                  <a href={hostHref} target="_blank" rel="noopener noreferrer">View organiser source</a>
                )
              )}
            </section>
          </aside>
        </div>

        {/* Future promoted events should render here, above the chronological fallback. */}
        {upcomingEvents.length > 0 && (
          <section className="e4s-event-upcoming" aria-labelledby="more-upcoming-events">
            <div className="e4s-event-upcoming__head">
              <h2 id="more-upcoming-events">More upcoming events</h2>
              <Link href="/events">View What&apos;s On</Link>
            </div>
            <div className="e4s-event-upcoming__grid">
              {upcomingEvents.map((upcoming) => {
                const upcomingDate = formatDateParts(upcoming.starts_at, upcoming.timezone);
                const upcomingLocation = [upcoming.venue_name, upcoming.suburb, slugToLabel(upcoming.city)].filter(Boolean).join(", ");
                return (
                  <Link className="e4s-event-upcoming-card" href={eventPath(upcoming)} key={upcoming.id}>
                    {upcoming.image_url && (
                      <span className="e4s-event-upcoming-card__image">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={upcoming.image_url} alt="" loading="lazy" />
                      </span>
                    )}
                    <span className="e4s-event-upcoming-card__body">
                      <span className="e4s-event-upcoming-card__date">{upcomingDate.month} {upcomingDate.day} · {upcomingDate.time}</span>
                      <strong>{upcoming.title}</strong>
                      {upcomingLocation && <span className="e4s-event-upcoming-card__location">{upcomingLocation}</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <PublicPageFoot className="e4s-event-detail__list-cta" shell={false}>
          <h2>List Your Event</h2>
          <p>
            Running singles events? <Link href="/advertise">View advertising packages</Link> to get
            your events in front of thousands of singles across Australia.
          </p>
        </PublicPageFoot>
      </article>
    </PublicMain>
  );
}
