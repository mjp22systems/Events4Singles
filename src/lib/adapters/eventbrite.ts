import type { Integration } from "@/lib/admin-db";
import type { EventDraft, SyncAdapter } from "@/lib/sync-engine";
import { cityNameToDbSlug, parseIntegrationConfig } from "@/lib/adapters/shared";

type EventbriteEvent = {
  id: string;
  name?: { text?: string | null } | null;
  description?: { text?: string | null } | null;
  start?: { utc?: string | null; timezone?: string | null } | null;
  end?: { utc?: string | null } | null;
  venue?: {
    name?: string | null;
    address?: {
      localized_address_display?: string | null;
      city?: string | null;
    } | null;
  } | null;
  url?: string | null;
  logo?: { url?: string | null } | null;
  category_id?: string | null;
};

type EventbriteResponse = {
  events?: EventbriteEvent[];
};

export const eventbriteAdapter: SyncAdapter = {
  platform: "eventbrite",
  async fetchEvents(integration: Integration): Promise<EventDraft[]> {
    const config = parseIntegrationConfig(integration.config);
    const orgId = typeof config.org_id === "string" ? config.org_id : "";
    if (!orgId) throw new Error("Eventbrite integration is missing config.org_id");
    if (!integration.access_token) throw new Error("Eventbrite integration is missing an access token");

    const url = new URL(`https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`);
    url.searchParams.set("status", "live");
    url.searchParams.set("expand", "venue");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${integration.access_token}`,
      },
    });
    if (!response.ok) throw new Error(`Eventbrite fetch failed: ${response.status}`);

    const body = await response.json() as EventbriteResponse;
    return (body.events ?? [])
      .filter((event) => event.id && event.name?.text && event.start?.utc)
      .map((event) => ({
        title: event.name?.text ?? "Untitled Eventbrite event",
        description: event.description?.text ?? null,
        starts_at: event.start?.utc ?? new Date().toISOString(),
        ends_at: event.end?.utc ?? null,
        timezone: event.start?.timezone ?? "Australia/Sydney",
        venue_name: event.venue?.name ?? null,
        address: event.venue?.address?.localized_address_display ?? null,
        suburb: null,
        city: cityNameToDbSlug(event.venue?.address?.city),
        source_id: event.id,
        source_url: event.url ?? null,
        ticket_url: event.url ?? null,
        image_url: event.logo?.url ?? null,
        category: null,
      }));
  },
};
