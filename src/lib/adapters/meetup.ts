import type { Integration } from "@/lib/admin-db";
import type { EventDraft, SyncAdapter } from "@/lib/sync-engine";
import { parseIntegrationConfig } from "@/lib/adapters/shared";
import { normalizeEventLocation } from "@/lib/event-location";
import { cleanEventDescription } from "@/lib/event-text";

type ApolloRef = { __ref?: string };

type MeetupVenue = {
  __typename?: string;
  name?: string | null;
  address?: string | null;
  city?: string | null;
};

type MeetupPhoto = {
  __typename?: string;
  highResUrl?: string | null;
  baseUrl?: string | null;
};

type MeetupGroup = {
  __typename?: "Group";
  id?: string;
  urlname?: string;
  timezone?: string | null;
  city?: string | null;
};

type MeetupEvent = {
  __typename?: "Event";
  id?: string;
  title?: string | null;
  description?: string | null;
  dateTime?: string | null;
  endTime?: string | null;
  eventUrl?: string | null;
  status?: string | null;
  eventType?: string | null;
  venue?: MeetupVenue | ApolloRef | null;
  group?: MeetupGroup | ApolloRef | null;
  featuredEventPhoto?: MeetupPhoto | ApolloRef | null;
  displayPhoto?: MeetupPhoto | ApolloRef | null;
};

type MeetupGraphqlEvent = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  dateTime?: string | null;
  duration?: string | number | null;
  endTime?: string | null;
  eventUrl?: string | null;
  venue?: MeetupVenue | null;
  featuredEventPhoto?: MeetupPhoto | null;
  group?: MeetupGroup | null;
};

type MeetupGraphqlResponse = {
  data?: {
    groupByUrlname?: {
      timezone?: string | null;
      city?: string | null;
      upcomingEvents?: {
        edges?: { node?: MeetupGraphqlEvent | null }[];
      } | null;
    } | null;
  };
  errors?: { message?: string }[];
};

type ApolloValue = MeetupEvent | MeetupGroup | MeetupVenue | MeetupPhoto | ApolloRef | Record<string, unknown> | null;
type ApolloState = Record<string, ApolloValue>;

const EVENT_STATUS_ACTIVE = "ACTIVE";
const MEETUP_GRAPHQL_ENDPOINT = "https://api.meetup.com/gql-ext";
const MEETUP_UPCOMING_EVENTS_QUERY = `
  query UpcomingMeetupEvents($urlname: String!) {
    groupByUrlname(urlname: $urlname) {
      timezone
      city
      upcomingEvents {
        edges {
          node {
            id
            title
            description
            dateTime
            duration
            endTime
            eventUrl
            venue {
              name
              address
              city
            }
            featuredEventPhoto {
              highResUrl
              baseUrl
            }
            group {
              id
              urlname
              timezone
              city
            }
          }
        }
      }
    }
  }
`;

function normalizeMeetupUrlname(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (!/meetup\.com$/i.test(url.hostname.replace(/^www\./i, ""))) return trimmed.replace(/^\/+|\/+$/g, "");

    const [first] = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(first ?? "").trim();
  } catch {
    return trimmed.replace(/^\/+|\/+$/g, "");
  }
}

function stripHtml(value: string | null | undefined): string | null {
  const text = (value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleanEventDescription(text);
}

function addDuration(start: string | null | undefined, duration: string | number | null | undefined): string | null {
  if (!start || duration === null || duration === undefined) return null;

  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return null;

  if (typeof duration === "number" && Number.isFinite(duration)) {
    return new Date(startDate.getTime() + duration).toISOString();
  }

  if (typeof duration !== "string") return null;
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
  if (!match) return null;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return new Date(startDate.getTime() + ((hours * 60 + minutes) * 60 + seconds) * 1000).toISOString();
}

function refId(value: unknown): string | null {
  return value && typeof value === "object" && "__ref" in value && typeof value.__ref === "string" ? value.__ref : null;
}

function hasTypename(value: unknown, typename: string): boolean {
  return Boolean(value && typeof value === "object" && "__typename" in value && value.__typename === typename);
}

function deref<T>(state: ApolloState, value: T | ApolloRef | null | undefined): T | null {
  const id = refId(value);
  if (id) return state[id] as T ?? null;
  return value && typeof value === "object" ? value as T : null;
}

function photoUrl(state: ApolloState, event: MeetupEvent): string | null {
  const photo = deref<MeetupPhoto>(state, event.displayPhoto) ?? deref<MeetupPhoto>(state, event.featuredEventPhoto);
  return photo?.highResUrl ?? photo?.baseUrl ?? null;
}

function groupForEvent(state: ApolloState, event: MeetupEvent, fallback: MeetupGroup | null): MeetupGroup | null {
  return deref<MeetupGroup>(state, event.group) ?? fallback;
}

function findGroup(state: ApolloState, urlname: string): MeetupGroup | null {
  const normalized = urlname.toLowerCase();
  for (const value of Object.values(state)) {
    if (hasTypename(value, "Group")) {
      const group = value as MeetupGroup;
      if (group.urlname?.toLowerCase() === normalized) return group;
    }
  }
  return null;
}

function extractNextData(html: string): Record<string, unknown> {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match?.[1]) throw new Error("Meetup page did not include event data");
  return JSON.parse(match[1]) as Record<string, unknown>;
}

function apolloStateFromNextData(nextData: Record<string, unknown>): ApolloState {
  const props = nextData.props as { pageProps?: { __APOLLO_STATE__?: ApolloState } } | undefined;
  const state = props?.pageProps?.__APOLLO_STATE__;
  if (!state || typeof state !== "object") throw new Error("Meetup page data did not include Apollo state");
  return state;
}

async function fetchMeetupPage(urlname: string): Promise<string> {
  const response = await fetch(`https://www.meetup.com/${encodeURIComponent(urlname)}/events/`, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Events4SinglesBot/1.0 (+https://events4singles.com)",
    },
  });
  if (!response.ok) throw new Error(`Meetup page fetch failed: ${response.status}`);
  return response.text();
}

async function fetchMeetupGraphqlEvents(urlname: string, accessToken: string): Promise<EventDraft[]> {
  const response = await fetch(MEETUP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: MEETUP_UPCOMING_EVENTS_QUERY,
      variables: { urlname },
    }),
  });

  if (!response.ok) throw new Error(`Meetup GraphQL fetch failed: ${response.status}`);

  const body = await response.json() as MeetupGraphqlResponse;
  if (body.errors?.length) {
    throw new Error(body.errors.map((error) => error.message).filter(Boolean).join("; ") || "Meetup GraphQL returned an error");
  }

  const group = body.data?.groupByUrlname;
  const edges = group?.upcomingEvents?.edges ?? [];
  return edges
    .map((edge) => edge.node)
    .filter((event): event is MeetupGraphqlEvent => Boolean(event?.id && event.title && event.dateTime))
    .map((event): EventDraft | null => {
      const start = new Date(event.dateTime ?? "");
      if (Number.isNaN(start.getTime())) return null;
      const location = normalizeEventLocation(
        event.venue?.city,
        event.venue?.address,
        event.group?.city ?? group?.city,
      );
      return {
        title: event.title ?? "Untitled Meetup event",
        description: stripHtml(event.description),
        starts_at: start.toISOString(),
        ends_at: event.endTime ? new Date(event.endTime).toISOString() : addDuration(event.dateTime, event.duration),
        timezone: event.group?.timezone ?? group?.timezone ?? "Australia/Sydney",
        venue_name: event.venue?.name ?? null,
        address: event.venue?.address ?? null,
        suburb: location.suburb,
        city: location.city,
        source_id: event.id ?? "",
        source_url: event.eventUrl ?? `https://www.meetup.com/${event.group?.urlname ?? urlname}/events/${event.id}/`,
        ticket_url: event.eventUrl ?? null,
        image_url: event.featuredEventPhoto?.highResUrl ?? event.featuredEventPhoto?.baseUrl ?? null,
        category: null,
      };
    })
    .filter((draft): draft is EventDraft => Boolean(draft));
}

function eventToDraft(state: ApolloState, event: MeetupEvent, fallbackGroup: MeetupGroup | null): EventDraft | null {
  if (!event.id || !event.title || !event.dateTime) return null;

  const start = new Date(event.dateTime);
  if (Number.isNaN(start.getTime())) return null;
  if (start.getTime() < Date.now() - 60_000) return null;
  if (event.status && event.status !== EVENT_STATUS_ACTIVE) return null;

  const venue = deref<MeetupVenue>(state, event.venue);
  const group = groupForEvent(state, event, fallbackGroup);
  const location = normalizeEventLocation(venue?.city, venue?.address, group?.city);

  return {
    title: event.title,
    description: stripHtml(event.description),
    starts_at: start.toISOString(),
    ends_at: event.endTime ? new Date(event.endTime).toISOString() : null,
    timezone: group?.timezone ?? "Australia/Sydney",
    venue_name: event.eventType === "ONLINE" ? "Online" : venue?.name ?? null,
    address: venue?.address ?? null,
    suburb: location.suburb,
    city: location.city,
    source_id: event.id,
    source_url: event.eventUrl ?? `https://www.meetup.com/${group?.urlname ?? ""}/events/${event.id}/`,
    ticket_url: event.eventUrl ?? null,
    image_url: photoUrl(state, event),
    category: null,
  };
}

export const meetupAdapter: SyncAdapter = {
  platform: "meetup",
  async fetchEvents(integration: Integration): Promise<EventDraft[]> {
    const config = parseIntegrationConfig(integration.config);
    const rawGroupUrl = typeof config.group_url === "string" ? config.group_url : "";
    const urlname = normalizeMeetupUrlname(rawGroupUrl);
    if (!urlname) throw new Error("Meetup integration is missing config.group_url");

    const accessToken = integration.access_token ?? process.env.MEETUP_ACCESS_TOKEN ?? "";
    if (accessToken) {
      try {
        return await fetchMeetupGraphqlEvents(urlname, accessToken);
      } catch (err) {
        console.warn("Meetup GraphQL fetch failed, falling back to public page scraper", err);
      }
    }

    const html = await fetchMeetupPage(urlname);
    const state = apolloStateFromNextData(extractNextData(html));
    const group = findGroup(state, urlname);

    return Object.values(state)
      .filter((value): value is MeetupEvent => hasTypename(value, "Event"))
      .map((event) => eventToDraft(state, event, group))
      .filter((draft): draft is EventDraft => Boolean(draft));
  },
};
