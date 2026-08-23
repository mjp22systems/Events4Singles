export interface EventSlugInput {
  id: string;
  title: string;
  starts_at: string | null;
  city?: string | null;
  slug?: string | null;
}

function slugSegment(value: string | null | undefined, fallback = "event") {
  const slug = (value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || fallback;
}

function dateSegment(startsAt: string | null | undefined) {
  const date = startsAt?.slice(0, 10);
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "date-tba";
}

function shortEventCode(id: string) {
  const cleaned = id
    .toLowerCase()
    .replace(/^seed[_-]home[_-]/, "")
    .replace(/^homepage[_-]placeholder[_-]/, "")
    .replace(/[^a-z0-9]+/g, "");
  if (!cleaned) return "event";
  return cleaned.length <= 10 ? cleaned : cleaned.slice(0, 8);
}

export function canonicalEventSlug(event: EventSlugInput) {
  const title = slugSegment(event.title);
  const city = slugSegment(event.city, "");
  const citySuffix = city && !title.includes(city) ? `-${city}` : "";
  return `${dateSegment(event.starts_at)}-${title}${citySuffix}-${shortEventCode(event.id)}`;
}

export function eventPath(event: EventSlugInput) {
  if (event.slug) return `/events/${event.slug}`;
  return `/events/${canonicalEventSlug(event)}`;
}
