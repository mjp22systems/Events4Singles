import { eventbriteDescriptionHtml } from "@/lib/eventbrite-format";
import { uploadEventbriteLogo } from "@/lib/eventbrite-media";
import { markEventExternalRefStale, upsertEventExternalRef } from "@/lib/event-external-refs";
import {
  ensureEventbriteTicketClass,
  ensureEventbriteVenue,
  eventbriteErrorMessage,
  eventbriteSummary,
  EventbritePushError,
  isStaleEventbriteStatus,
  publishEventbriteEvent,
  updateEventbriteStructuredDescription,
} from "@/lib/eventbrite-push";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  status: string;
  account_id: string;
  image_url: string | null;
  price_min: number | null;
  venue_name: string | null;
  address: string | null;
  suburb: string | null;
  city: string;
  state: string | null;
  push_id: string | null;
  push_url: string | null;
};

type IntegrationRow = {
  id: string;
  access_token: string | null;
  token_expiry: string | null;
  push_enabled: number;
  config: string | null;
};

type EventbriteCreateResponse = {
  id?: string;
  url?: string;
  status?: string;
  venue_id?: string | null;
  error?: string;
  error_description?: string;
};

type PushOptions = {
  db: D1Database;
  eventId: string;
  platform?: string;
  accountId?: string;
  requireApproved?: boolean;
  requirePushEnabled?: boolean;
};

export type EventbritePushResult =
  | { ok: true; action?: "created" | "updated"; push_url: string; warning?: string }
  | { ok: false; error: string; status: number; push_url?: string };

function twoHoursAfter(iso: string): string {
  return new Date(new Date(iso).getTime() + 2 * 60 * 60 * 1000).toISOString();
}

function eventbriteUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid event date: ${iso}`);
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function errorResult(error: unknown, fallback = "Eventbrite push failed"): Extract<EventbritePushResult, { ok: false }> {
  if (error instanceof EventbritePushError) {
    return { ok: false, error: error.message, status: error.statusCode };
  }
  return { ok: false, error: error instanceof Error ? error.message : fallback, status: 502 };
}

function jsonWarning(values: Array<string | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export async function pushEventToEventbrite({
  db,
  eventId,
  platform = "eventbrite",
  accountId,
  requireApproved = false,
  requirePushEnabled = false,
}: PushOptions): Promise<EventbritePushResult> {
  const eventSql = [
    "SELECT id, title, description, starts_at, ends_at, timezone, status, account_id,",
    "image_url, price_min, venue_name, address, suburb, city, state, push_id, push_url",
    "FROM events WHERE id = ?",
    accountId ? "AND account_id = ?" : "",
  ].filter(Boolean).join(" ");
  const event = await db.prepare(eventSql)
    .bind(...(accountId ? [eventId, accountId] : [eventId]))
    .first<EventRow>();

  if (!event) return { ok: false, error: "Event not found", status: 404 };
  if (requireApproved && event.status !== "approved") {
    return { ok: false, error: "Only approved events can be pushed", status: 422 };
  }

  const integration = await db.prepare(
    "SELECT id, access_token, token_expiry, push_enabled, config FROM integrations WHERE account_id = ? AND platform = ?"
  ).bind(event.account_id, platform).first<IntegrationRow>();

  if (!integration) return { ok: false, error: `No ${platform} integration connected`, status: 422 };
  if (requirePushEnabled && !integration.push_enabled) {
    return { ok: false, error: "Push is not enabled for this integration", status: 422 };
  }
  if (!integration.access_token) return { ok: false, error: "Integration has no access token", status: 422 };
  if (integration.token_expiry && new Date(integration.token_expiry) < new Date()) {
    return { ok: false, error: "Eventbrite access token has expired. Reconnect the integration.", status: 422 };
  }

  let config: Record<string, unknown> = {};
  try {
    config = JSON.parse(integration.config ?? "{}") as Record<string, unknown>;
  } catch {
    config = {};
  }
  const orgId = typeof config.org_id === "string" ? config.org_id : "";
  if (!orgId) return { ok: false, error: "Eventbrite org_id missing. Reconnect the integration.", status: 422 };

  const timezone = event.timezone || "Australia/Sydney";
  const endsAt = event.ends_at || twoHoursAfter(event.starts_at);
  let startUtc: string;
  let endUtc: string;
  try {
    startUtc = eventbriteUtc(event.starts_at);
    endUtc = eventbriteUtc(endsAt);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid event date", status: 422 };
  }

  const logo = await uploadEventbriteLogo(integration.access_token, event.image_url);
  let stalePushWarning: string | null = null;
  let existingStatus: string | null = null;
  let existingVenueId: string | null = null;

  if (event.push_id) {
    const existingRes = await fetch(`https://www.eventbriteapi.com/v3/events/${event.push_id}/`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${integration.access_token}`,
      },
    });

    if (existingRes.status === 404) {
      stalePushWarning = "The previous Eventbrite listing no longer exists, so a new one was created.";
      await markEventExternalRefStale(db, platform, event.push_id, "Eventbrite returned 404 for the previous listing.");
      await db.prepare(
        "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
      ).bind(eventId).run();
    } else if (!existingRes.ok) {
      const existingBody = await existingRes.json().catch(() => ({})) as EventbriteCreateResponse;
      return {
        ok: false,
        error: `Eventbrite could not verify the existing listing: ${eventbriteErrorMessage(existingBody, existingRes.status)}`,
        status: 502,
      };
    } else {
      const existingBody = await existingRes.json().catch(() => ({})) as EventbriteCreateResponse;
      existingStatus = existingBody.status ?? null;
      existingVenueId = existingBody.venue_id ?? null;
      if (isStaleEventbriteStatus(existingStatus)) {
        stalePushWarning = `The previous Eventbrite listing was ${existingStatus}, so a new one was created.`;
        await markEventExternalRefStale(db, platform, event.push_id, `Eventbrite status was ${existingStatus}.`);
        await db.prepare(
          "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
        ).bind(eventId).run();
      }
    }
  }

  let venueId: string | null = null;
  try {
    venueId = await ensureEventbriteVenue(integration.access_token, orgId, event, existingVenueId);
  } catch (error) {
    return errorResult(error);
  }

  const descriptionHtml = eventbriteDescriptionHtml(event.description);
  const eventPayload = {
    event: {
      name: { html: event.title },
      summary: eventbriteSummary(event),
      start: { utc: startUtc, timezone },
      end: { utc: endUtc, timezone },
      ...(logo.logoId ? { logo_id: logo.logoId } : {}),
      ...(venueId ? { venue_id: venueId } : {}),
      currency: "AUD",
      ...(venueId ? {} : { online_event: false }),
      listed: true,
    },
  };

  if (event.push_id && !stalePushWarning) {
    const updateRes = await fetch(`https://www.eventbriteapi.com/v3/events/${event.push_id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${integration.access_token}`,
      },
      body: JSON.stringify(eventPayload),
    });
    const updateBody = await updateRes.json().catch(() => ({})) as EventbriteCreateResponse;
    if (!updateRes.ok) {
      return {
        ok: false,
        error: `Eventbrite rejected the update: ${eventbriteErrorMessage(updateBody, updateRes.status)}`,
        status: 502,
      };
    }

    try {
      await updateEventbriteStructuredDescription(integration.access_token, event.push_id, descriptionHtml);
    } catch (error) {
      const result = errorResult(error);
      return { ...result, push_url: event.push_url ?? undefined };
    }

    const eventbriteUrl = updateBody.url ?? event.push_url ?? `https://www.eventbrite.com.au/e/${event.push_id}`;
    await db.prepare(
      "UPDATE events SET push_platform = ?, push_url = ?, push_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
    ).bind(platform, eventbriteUrl, eventId).run();
    await upsertEventExternalRef(db, {
      eventId,
      accountId: event.account_id,
      platform,
      externalId: event.push_id,
      externalUrl: eventbriteUrl,
      direction: "pushed_to",
      status: "shared",
    });

    let publishWarning: string | null = null;
    if (existingStatus && existingStatus !== "live") {
      try {
        await ensureEventbriteTicketClass(integration.access_token, event.push_id, event);
        const publishError = await publishEventbriteEvent(integration.access_token, event.push_id);
        if (publishError) publishWarning = `Eventbrite did not publish the updated listing: ${publishError}`;
      } catch (error) {
        if (error instanceof EventbritePushError) publishWarning = error.message;
        else throw error;
      }
    }

    if (publishWarning) {
      await db.prepare(
        "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
      ).bind(eventId).run();
      return { ok: false, error: publishWarning, status: 502, push_url: eventbriteUrl };
    }

    const warning = jsonWarning([logo.warning]);
    return { ok: true, action: "updated", push_url: eventbriteUrl, ...(warning ? { warning } : {}) };
  }

  const createRes = await fetch(`https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${integration.access_token}`,
    },
    body: JSON.stringify(eventPayload),
  });
  const createBody = await createRes.json().catch(() => ({})) as EventbriteCreateResponse;
  if (!createRes.ok || !createBody.id) {
    return {
      ok: false,
      error: `Eventbrite rejected the event: ${eventbriteErrorMessage(createBody, createRes.status)}`,
      status: 502,
    };
  }

  const eventbriteId = createBody.id;
  const eventbriteUrl = createBody.url ?? `https://www.eventbrite.com.au/e/${eventbriteId}`;

  try {
    await updateEventbriteStructuredDescription(integration.access_token, eventbriteId, descriptionHtml);
    await ensureEventbriteTicketClass(integration.access_token, eventbriteId, event);
  } catch (error) {
    const result = errorResult(error);
    await db.prepare(
      "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
    ).bind(eventId).run();
    return { ...result, push_url: eventbriteUrl };
  }

  const publishError = await publishEventbriteEvent(integration.access_token, eventbriteId);
  if (publishError) {
    await db.prepare(
      "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
    ).bind(eventId).run();
    return {
      ok: false,
      error: jsonWarning([
        stalePushWarning,
        `Eventbrite created a draft but rejected publishing: ${publishError}`,
        logo.warning,
      ]),
      status: 502,
      push_url: eventbriteUrl,
    };
  }

  await db.prepare(
    "UPDATE events SET push_platform = ?, push_id = ?, push_url = ?, push_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
  ).bind(platform, eventbriteId, eventbriteUrl, eventId).run();
  await upsertEventExternalRef(db, {
    eventId,
    accountId: event.account_id,
    platform,
    externalId: eventbriteId,
    externalUrl: eventbriteUrl,
    direction: "pushed_to",
    status: "shared",
  });

  const warning = jsonWarning([stalePushWarning, logo.warning]);
  return {
    ok: true,
    action: stalePushWarning ? "created" : undefined,
    push_url: eventbriteUrl,
    ...(warning ? { warning } : {}),
  };
}
