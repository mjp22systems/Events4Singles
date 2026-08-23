type EventbriteTicketClassList = {
  ticket_classes?: unknown[];
  pagination?: { object_count?: number };
  error?: string;
  error_description?: string;
};

type EventbriteApiBody = {
  id?: string;
  page_version_number?: string;
  error?: string;
  error_description?: string;
};

type TicketEvent = {
  title: string;
  starts_at: string;
  price_min: number | null;
};

type LocationEvent = TicketEvent & {
  description: string | null;
  venue_name: string | null;
  address: string | null;
  suburb: string | null;
  city: string;
  state: string | null;
};

export class EventbritePushError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = "EventbritePushError";
    this.statusCode = statusCode;
  }
}

export function eventbriteErrorMessage(body: EventbriteApiBody | null | undefined, status: number): string {
  return body?.error_description ?? body?.error ?? String(status);
}

export function isStaleEventbriteStatus(status: string | null | undefined): boolean {
  return ["deleted", "canceled", "cancelled"].includes((status ?? "").toLowerCase());
}

function eventbriteUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid event date: ${iso}`);
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function plainText(value: string | null): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[#*_`>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function eventbriteSummary(event: { title: string; description: string | null }): string {
  const source = plainText(event.description) || event.title;
  return source.length > 137 ? `${source.slice(0, 137).trimEnd()}...` : source;
}

function cityLabel(slug: string): string {
  return slug
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function defaultRegion(city: string): string | null {
  const regions: Record<string, string> = {
    adelaide: "SA",
    brisbane: "QLD",
    canberra: "ACT",
    gold_coast: "QLD",
    hobart: "TAS",
    melbourne: "VIC",
    newcastle: "NSW",
    perth: "WA",
    sunshine_coast: "QLD",
    sydney: "NSW",
  };
  return regions[city] ?? null;
}

function ticketPayload(event: TicketEvent) {
  const startsAt = new Date(event.starts_at);
  const now = new Date();
  const price = event.price_min ?? 0;
  const ticketClass: Record<string, unknown> = {
    name: price > 0 ? "General Admission" : "RSVP",
    free: price <= 0,
    quantity_total: 100,
  };

  if (price > 0) {
    ticketClass.cost = `AUD,${price}`;
  }

  if (!Number.isNaN(startsAt.getTime()) && startsAt > now) {
    ticketClass.sales_start = eventbriteUtc(now.toISOString());
    ticketClass.sales_end = eventbriteUtc(event.starts_at);
  }

  return { ticket_class: ticketClass };
}

async function readEventbriteJson<T>(res: Response): Promise<T> {
  return res.json().catch(() => ({})) as Promise<T>;
}

function venuePayload(event: LocationEvent) {
  const displayCity = cityLabel(event.city);
  const locality = event.suburb || displayCity;
  const name = event.venue_name || event.address || locality;
  const address1 = event.address || event.venue_name || locality;
  const region = event.state || defaultRegion(event.city);

  if (!name && !address1 && !locality) return null;

  return {
    venue: {
      name,
      address: {
        address_1: address1,
        city: locality,
        ...(region ? { region } : {}),
        country: "AU",
      },
    },
  };
}

export async function ensureEventbriteVenue(
  accessToken: string,
  orgId: string,
  event: LocationEvent,
  existingVenueId?: string | null,
): Promise<string | null> {
  const payload = venuePayload(event);
  if (!payload) return null;

  const url = existingVenueId
    ? `https://www.eventbriteapi.com/v3/venues/${existingVenueId}/`
    : `https://www.eventbriteapi.com/v3/organizations/${orgId}/venues/`;
  const venueRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const venueBody = await readEventbriteJson<EventbriteApiBody>(venueRes);

  if (!venueRes.ok || !venueBody.id) {
    throw new EventbritePushError(`Eventbrite venue setup failed: ${eventbriteErrorMessage(venueBody, venueRes.status)}`);
  }

  return venueBody.id;
}

export async function updateEventbriteStructuredDescription(
  accessToken: string,
  eventbriteId: string,
  descriptionHtml: string,
): Promise<void> {
  if (!descriptionHtml.trim()) return;

  const currentRes = await fetch(`https://www.eventbriteapi.com/v3/events/${eventbriteId}/structured_content/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const currentBody = await readEventbriteJson<EventbriteApiBody>(currentRes);

  if (!currentRes.ok) {
    throw new EventbritePushError(`Eventbrite description lookup failed: ${eventbriteErrorMessage(currentBody, currentRes.status)}`);
  }

  const pageVersion = currentBody.page_version_number || "1";
  const updateRes = await fetch(`https://www.eventbriteapi.com/v3/events/${eventbriteId}/structured_content/${pageVersion}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      modules: [
        {
          type: "text",
          data: {
            body: {
              type: "text",
              text: descriptionHtml,
              alignment: "left",
            },
          },
        },
      ],
      publish: true,
      purpose: "listing",
    }),
  });
  const updateBody = await readEventbriteJson<EventbriteApiBody>(updateRes);

  if (!updateRes.ok) {
    throw new EventbritePushError(`Eventbrite description update failed: ${eventbriteErrorMessage(updateBody, updateRes.status)}`);
  }
}

export async function ensureEventbriteTicketClass(
  accessToken: string,
  eventbriteId: string,
  event: TicketEvent,
): Promise<void> {
  const listRes = await fetch(`https://www.eventbriteapi.com/v3/events/${eventbriteId}/ticket_classes/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const listBody = await readEventbriteJson<EventbriteTicketClassList>(listRes);

  if (!listRes.ok) {
    throw new EventbritePushError(`Eventbrite ticket check failed: ${eventbriteErrorMessage(listBody, listRes.status)}`);
  }

  const existingCount = listBody.pagination?.object_count ?? listBody.ticket_classes?.length ?? 0;
  if (existingCount > 0) return;

  const createRes = await fetch(`https://www.eventbriteapi.com/v3/events/${eventbriteId}/ticket_classes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(ticketPayload(event)),
  });
  const createBody = await readEventbriteJson<EventbriteApiBody>(createRes);

  if (!createRes.ok) {
    throw new EventbritePushError(`Eventbrite ticket setup failed: ${eventbriteErrorMessage(createBody, createRes.status)}`);
  }
}

export async function publishEventbriteEvent(accessToken: string, eventbriteId: string): Promise<string | null> {
  const publishRes = await fetch(`https://www.eventbriteapi.com/v3/events/${eventbriteId}/publish/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const publishBody = await readEventbriteJson<EventbriteApiBody>(publishRes);

  if (!publishRes.ok) {
    return eventbriteErrorMessage(publishBody, publishRes.status);
  }

  return null;
}
