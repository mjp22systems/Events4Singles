import type { Integration, IntegrationPlatform } from "@/lib/admin-db";
import { eventbriteAdapter } from "@/lib/adapters/eventbrite";
import { icalAdapter } from "@/lib/adapters/ical";
import { meetupAdapter } from "@/lib/adapters/meetup";
import { findEventByExternalRef, ensureEventExternalRefsTable, upsertEventExternalRef } from "@/lib/event-external-refs";
import { canonicalEventSlug } from "@/lib/event-slugs";

export type Platform = IntegrationPlatform;

export interface EventDraft {
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  suburb: string | null;
  city: string | null;
  source_id: string;
  source_url: string | null;
  ticket_url: string | null;
  image_url: string | null;
  category: string | null;
}

export interface SyncAdapter {
  platform: Platform;
  fetchEvents(integration: Integration, db: D1Database): Promise<EventDraft[]>;
}

export type IntegrationScanSummary = {
  sourceCount: number;
  localCount: number;
  newCount: number;
  changedCount: number;
  matchedCount: number;
  localOnlyCount: number;
  changed: Array<{ source_id: string; title: string; fields: string[] }>;
  newEvents: Array<{ source_id: string; title: string; starts_at: string }>;
  localOnly: Array<{ source_id: string; title: string; starts_at: string }>;
};

type LocalEventForScan = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  suburb: string | null;
  city: string | null;
  source_id: string;
  source_url: string | null;
  ticket_url: string | null;
  image_url: string | null;
  category: string | null;
};

type ExistingEventForSync = {
  id: string;
  source: string;
  source_id: string | null;
};

const adapters: Partial<Record<Platform, SyncAdapter>> = {
  eventbrite: eventbriteAdapter,
  ical: icalAdapter,
  meetup: meetupAdapter,
};

export function getAdapter(platform: Platform): SyncAdapter {
  const adapter = adapters[platform];
  if (!adapter) throw new Error(`No sync adapter configured for ${platform}`);
  return adapter;
}

function slugifyEvent(draft: EventDraft, platform: Platform): string {
  return canonicalEventSlug({
    id: `${platform}-${draft.source_id}`,
    title: draft.title,
    starts_at: draft.starts_at,
    city: draft.city,
  });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function changedFields(draft: EventDraft, local: LocalEventForScan): string[] {
  const fields: Array<keyof EventDraft> = [
    "title",
    "description",
    "starts_at",
    "ends_at",
    "timezone",
    "venue_name",
    "address",
    "suburb",
    "city",
    "source_url",
    "ticket_url",
    "image_url",
    "category",
  ];
  return fields.filter((field) => clean(draft[field]) !== clean(local[field]));
}

export async function scanIntegration(integration: Integration, db: D1Database): Promise<IntegrationScanSummary> {
  const adapter = getAdapter(integration.platform);
  await ensureEventExternalRefsTable(db);
  const drafts = await adapter.fetchEvents(integration, db);
  const rows = await db.prepare(
    `SELECT e.id, e.title, e.description, e.starts_at, e.ends_at, e.timezone,
            e.venue_name, e.address, e.suburb, e.city,
            COALESCE(ref.external_id, e.source_id) AS source_id,
            COALESCE(ref.external_url, e.source_url) AS source_url,
            e.ticket_url, e.image_url, e.category
     FROM events e
     LEFT JOIN event_external_refs ref
       ON ref.event_id = e.id
      AND ref.platform = ?
      AND ref.status != 'stale'
     WHERE e.account_id = ?
       AND (
         (e.source = ? AND e.source_id IS NOT NULL)
         OR ref.external_id IS NOT NULL
       )`
  ).bind(integration.platform, integration.account_id, integration.platform).all<LocalEventForScan>();

  const localBySourceId = new Map(rows.results.map((event) => [event.source_id, event]));
  const sourceIds = new Set(drafts.map((draft) => draft.source_id));
  const changed: IntegrationScanSummary["changed"] = [];
  const newEvents: IntegrationScanSummary["newEvents"] = [];

  for (const draft of drafts) {
    const local = localBySourceId.get(draft.source_id);
    if (!local) {
      newEvents.push({ source_id: draft.source_id, title: draft.title, starts_at: draft.starts_at });
      continue;
    }
    const fields = changedFields(draft, local);
    if (fields.length) changed.push({ source_id: draft.source_id, title: draft.title, fields });
  }

  const localOnly = rows.results
    .filter((event) => !sourceIds.has(event.source_id))
    .map((event) => ({ source_id: event.source_id, title: event.title, starts_at: event.starts_at }));

  return {
    sourceCount: drafts.length,
    localCount: rows.results.length,
    newCount: newEvents.length,
    changedCount: changed.length,
    matchedCount: drafts.length - newEvents.length - changed.length,
    localOnlyCount: localOnly.length,
    changed: changed.slice(0, 8),
    newEvents: newEvents.slice(0, 8),
    localOnly: localOnly.slice(0, 8),
  };
}

export async function runSync(integration: Integration, db: D1Database): Promise<void> {
  const adapter = getAdapter(integration.platform);
  await ensureEventExternalRefsTable(db);
  await db.prepare("UPDATE integrations SET sync_status = ?, sync_error = NULL, updated_at = datetime('now') WHERE id = ?")
    .bind("syncing", integration.id)
    .run();

  try {
    const drafts = await adapter.fetchEvents(integration, db);
    for (const draft of drafts) {
      const status = integration.auto_approve ? "approved" : "pending";
      const city = draft.city ?? "unknown";
      const slug = slugifyEvent(draft, integration.platform);
      const refMatch = await findEventByExternalRef(db, integration.platform, draft.source_id, integration.account_id);
      const legacyMatch = refMatch ? null : await db.prepare(
        `SELECT id, source, source_id
         FROM events
         WHERE account_id = ? AND source = ? AND source_id = ?
         LIMIT 1`
      ).bind(integration.account_id, integration.platform, draft.source_id).first<ExistingEventForSync>();
      const existing = refMatch
        ? await db.prepare("SELECT id, source, source_id FROM events WHERE id = ? LIMIT 1")
          .bind(refMatch.event_id)
          .first<ExistingEventForSync>()
        : legacyMatch;

      let eventId = existing?.id;
      if (eventId) {
        const ownsSource = existing?.source === integration.platform || !existing?.source_id;
        if (ownsSource) {
          await db.prepare(`
            UPDATE events
            SET title = ?, slug = ?, description = ?, starts_at = ?, ends_at = ?, timezone = ?,
                venue_name = ?, address = ?, suburb = ?, city = ?,
                source = ?, source_id = ?, source_url = ?,
                ticket_url = ?, image_url = ?, category = ?, updated_at = datetime('now')
            WHERE id = ?
          `).bind(
            draft.title,
            slug,
            draft.description,
            draft.starts_at,
            draft.ends_at,
            draft.timezone,
            draft.venue_name,
            draft.address,
            draft.suburb,
            city,
            integration.platform,
            draft.source_id,
            draft.source_url,
            draft.ticket_url,
            draft.image_url,
            draft.category,
            eventId,
          ).run();
        } else {
          await db.prepare(`
            UPDATE events
            SET title = ?, slug = ?, description = ?, starts_at = ?, ends_at = ?, timezone = ?,
                venue_name = ?, address = ?, suburb = ?, city = ?,
                ticket_url = ?, image_url = ?, category = ?, updated_at = datetime('now')
            WHERE id = ?
          `).bind(
            draft.title,
            slug,
            draft.description,
            draft.starts_at,
            draft.ends_at,
            draft.timezone,
            draft.venue_name,
            draft.address,
            draft.suburb,
            city,
            draft.ticket_url,
            draft.image_url,
            draft.category,
            eventId,
          ).run();
        }
      } else {
        eventId = crypto.randomUUID().replace(/-/g, "");
        await db.prepare(`
          INSERT INTO events (
            id, title, slug, description, starts_at, ends_at, timezone,
            venue_name, address, suburb, city, source, source_id, source_url,
            ticket_url, image_url, category, status, account_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          eventId,
          draft.title,
          slug,
          draft.description,
          draft.starts_at,
          draft.ends_at,
          draft.timezone,
          draft.venue_name,
          draft.address,
          draft.suburb,
          city,
          integration.platform,
          draft.source_id,
          draft.source_url,
          draft.ticket_url,
          draft.image_url,
          draft.category,
          status,
          integration.account_id,
        ).run();
      }

      await upsertEventExternalRef(db, {
        eventId,
        accountId: integration.account_id,
        platform: integration.platform,
        externalId: draft.source_id,
        externalUrl: draft.source_url,
        direction: "imported_from",
        status: "linked",
      });
    }

    await db.prepare("UPDATE integrations SET sync_status = 'idle', last_synced = datetime('now'), sync_error = NULL, updated_at = datetime('now') WHERE id = ?")
      .bind(integration.id)
      .run();
  } catch (err) {
    await db.prepare("UPDATE integrations SET sync_status = 'error', sync_error = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(err instanceof Error ? err.message : String(err), integration.id)
      .run();
  }
}
