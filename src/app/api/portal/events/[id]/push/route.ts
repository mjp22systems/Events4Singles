import { currentUser } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { eventbriteDescriptionHtml } from "@/lib/eventbrite-format";
import { uploadEventbriteLogo } from "@/lib/eventbrite-media";
import { markEventExternalRefStale, upsertEventExternalRef } from "@/lib/event-external-refs";
import {
  ensureEventbriteTicketClass,
  ensureEventbriteVenue,
  eventbriteSummary,
  EventbritePushError,
  isStaleEventbriteStatus,
  publishEventbriteEvent,
  updateEventbriteStructuredDescription,
} from "@/lib/eventbrite-push";
import { getAccount } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

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
  platform: string;
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

function errorText(body: EventbriteCreateResponse, status: number): string {
  return body.error_description ?? body.error ?? String(status);
}

function twoHoursAfter(iso: string): string {
  return new Date(new Date(iso).getTime() + 2 * 60 * 60 * 1000).toISOString();
}

function eventbriteUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid event date: ${iso}`);
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await getAccount(user.id);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });

  const body = await req.json().catch(() => ({})) as { platform?: string };
  const platform = body.platform ?? "eventbrite";

  const event = await env.DB.prepare(
    "SELECT id, title, description, starts_at, ends_at, timezone, status, account_id, image_url, price_min, venue_name, address, suburb, city, state, push_id, push_url FROM events WHERE id = ? AND account_id = ?"
  ).bind(id, account.id).first<EventRow>();

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  if (event.status !== "approved") return NextResponse.json({ error: "Only approved events can be pushed" }, { status: 422 });

  const integration = await env.DB.prepare(
    "SELECT id, platform, access_token, token_expiry, push_enabled, config FROM integrations WHERE account_id = ? AND platform = ?"
  ).bind(account.id, platform).first<IntegrationRow>();

  if (!integration) return NextResponse.json({ error: `No ${platform} integration connected` }, { status: 422 });
  if (!integration.push_enabled) return NextResponse.json({ error: "Push is not enabled for this integration" }, { status: 422 });
  if (!integration.access_token) return NextResponse.json({ error: "Integration has no access token" }, { status: 422 });

  if (integration.token_expiry && new Date(integration.token_expiry) < new Date()) {
    return NextResponse.json({ error: "Eventbrite access token has expired — reconnect your integration" }, { status: 422 });
  }

  let config: Record<string, unknown> = {};
  try { config = JSON.parse(integration.config ?? "{}") as Record<string, unknown>; } catch { /* empty */ }
  const orgId = typeof config.org_id === "string" ? config.org_id : "";
  if (!orgId) return NextResponse.json({ error: "Eventbrite org_id missing — reconnect your integration" }, { status: 422 });

  const timezone = event.timezone || "Australia/Sydney";
  const endsAt = event.ends_at || twoHoursAfter(event.starts_at);
  let startUtc: string;
  let endUtc: string;
  try {
    startUtc = eventbriteUtc(event.starts_at);
    endUtc = eventbriteUtc(endsAt);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid event date" },
      { status: 422 },
    );
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
      await markEventExternalRefStale(env.DB, platform, event.push_id, "Eventbrite returned 404 for the previous listing.");
      await env.DB.prepare(
        "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
      ).bind(id).run();
    } else if (!existingRes.ok) {
      const existingBody = await existingRes.json().catch(() => ({})) as EventbriteCreateResponse;
      return NextResponse.json(
        { error: `Eventbrite could not verify the existing listing: ${errorText(existingBody, existingRes.status)}` },
        { status: 502 }
      );
    } else {
      const existingBody = await existingRes.json().catch(() => ({})) as EventbriteCreateResponse;
      existingStatus = existingBody.status ?? null;
      existingVenueId = existingBody.venue_id ?? null;
      if (isStaleEventbriteStatus(existingStatus)) {
        stalePushWarning = `The previous Eventbrite listing was ${existingStatus}, so a new one was created.`;
        await markEventExternalRefStale(env.DB, platform, event.push_id, `Eventbrite status was ${existingStatus}.`);
        await env.DB.prepare(
          "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
        ).bind(id).run();
      }
    }
  }

  let venueId: string | null = null;
  try {
    venueId = await ensureEventbriteVenue(integration.access_token, orgId, event, existingVenueId);
  } catch (error) {
    if (error instanceof EventbritePushError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    throw error;
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
      return NextResponse.json(
        { error: `Eventbrite rejected the update: ${errorText(updateBody, updateRes.status)}` },
        { status: 502 }
      );
    }

    try {
      await updateEventbriteStructuredDescription(integration.access_token, event.push_id, descriptionHtml);
    } catch (error) {
      if (error instanceof EventbritePushError) {
        return NextResponse.json({ error: error.message, push_url: event.push_url }, { status: error.statusCode });
      }
      throw error;
    }

    const eventbriteUrl = updateBody.url ?? event.push_url ?? `https://www.eventbrite.com.au/e/${event.push_id}`;
    await env.DB.prepare(
      "UPDATE events SET push_platform = ?, push_url = ?, push_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
    ).bind(platform, eventbriteUrl, id).run();
    await upsertEventExternalRef(env.DB, {
      eventId: id,
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
        if (error instanceof EventbritePushError) {
          publishWarning = error.message;
        } else {
          throw error;
        }
      }
    }

    if (publishWarning) {
      await env.DB.prepare(
        "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
      ).bind(id).run();

      return NextResponse.json(
        { error: publishWarning, push_url: eventbriteUrl },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      action: "updated",
      push_url: eventbriteUrl,
      ...([publishWarning, logo.warning].filter(Boolean).length ? { warning: [publishWarning, logo.warning].filter(Boolean).join(" ") } : {}),
    });
  }

  const createRes = await fetch(`https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${integration.access_token}`,
    },
    body: JSON.stringify(eventPayload),
  });

  const createBody = await createRes.json() as EventbriteCreateResponse;
  if (!createRes.ok || !createBody.id) {
    return NextResponse.json(
      { error: `Eventbrite rejected the event: ${errorText(createBody, createRes.status)}` },
      { status: 502 }
    );
  }

  const eventbriteId = createBody.id;
  const eventbriteUrl = createBody.url ?? `https://www.eventbrite.com.au/e/${eventbriteId}`;

  try {
    await updateEventbriteStructuredDescription(integration.access_token, eventbriteId, descriptionHtml);
  } catch (error) {
    if (error instanceof EventbritePushError) {
      return NextResponse.json(
        { error: error.message, push_url: eventbriteUrl },
        { status: error.statusCode },
      );
    }
    throw error;
  }

  try {
    await ensureEventbriteTicketClass(integration.access_token, eventbriteId, event);
  } catch (error) {
    if (error instanceof EventbritePushError) {
      await env.DB.prepare(
        "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
      ).bind(id).run();

      return NextResponse.json(
        { error: error.message, push_url: eventbriteUrl },
        { status: error.statusCode },
      );
    }
    throw error;
  }

  const publishError = await publishEventbriteEvent(integration.access_token, eventbriteId);

  if (publishError) {
    await env.DB.prepare(
      "UPDATE events SET push_platform = NULL, push_id = NULL, push_url = NULL, updated_at = datetime('now') WHERE id = ?"
    ).bind(id).run();

    return NextResponse.json({
      error: [
        stalePushWarning,
        `Eventbrite created a draft but rejected publishing: ${publishError}`,
        logo.warning,
      ].filter(Boolean).join(" "),
      push_url: eventbriteUrl,
    }, { status: 502 });
  }

  await env.DB.prepare(
    "UPDATE events SET push_platform = ?, push_id = ?, push_url = ?, push_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
  ).bind(platform, eventbriteId, eventbriteUrl, id).run();
  await upsertEventExternalRef(env.DB, {
    eventId: id,
    accountId: event.account_id,
    platform,
    externalId: eventbriteId,
    externalUrl: eventbriteUrl,
    direction: "pushed_to",
    status: "shared",
  });

  const warning = [stalePushWarning, logo.warning].filter(Boolean).join(" ");
  return NextResponse.json({ ok: true, action: stalePushWarning ? "created" : undefined, push_url: eventbriteUrl, ...(warning ? { warning } : {}) });
}
