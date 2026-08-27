import { getD1 } from "@/lib/db";
import type { AdvertiserAccount } from "@/lib/portal-db";

export type PortalEventActionResult = { ok: boolean; message: string };

const EVENT_FORM_FIELDS = [
  "title",
  "description",
  "starts_at",
  "ends_at",
  "venue_name",
  "address",
  "suburb",
  "city",
  "price_min",
  "price_max",
  "ticket_url",
  "image_url",
  "source_url",
  "registration_mode",
  "category",
] as const;

const EVENT_BODY_FIELDS = new Set<string>(EVENT_FORM_FIELDS);

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function required(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function cents(value: FormDataEntryValue | null, fallback: number | null) {
  const text = String(value ?? "").trim();
  if (!text) return fallback;
  const amount = Number(text);
  return Number.isFinite(amount) ? Math.round(amount * 100) : fallback;
}

function bodyValue(value: unknown) {
  if (value === undefined) return undefined;
  if (value === "") return null;
  return value;
}

export async function createPortalEvent(
  account: AdvertiserAccount,
  submittedBy: string | null,
  fd: FormData,
): Promise<void> {
  const db = await getD1();
  await db.prepare(
    `INSERT INTO events (
       title, description, starts_at, ends_at, venue_name, address, suburb, city,
       price_min, price_max, ticket_url, image_url, source_url, registration_mode,
       category, status, account_id, submitted_by
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).bind(
    required(fd.get("title")),
    nullable(fd.get("description")),
    required(fd.get("starts_at")),
    nullable(fd.get("ends_at")),
    nullable(fd.get("venue_name")),
    nullable(fd.get("address")),
    nullable(fd.get("suburb")),
    required(fd.get("city")),
    cents(fd.get("price_min"), 0),
    cents(fd.get("price_max"), null),
    nullable(fd.get("ticket_url")),
    nullable(fd.get("image_url")),
    nullable(fd.get("source_url")),
    nullable(fd.get("registration_mode")) ?? "auto",
    nullable(fd.get("category")),
    account.id,
    submittedBy,
  ).run();
}

export async function updatePortalEvent(account: AdvertiserAccount, fd: FormData): Promise<void> {
  const db = await getD1();
  await db.prepare(
    `UPDATE events SET
       title = ?, description = ?, starts_at = ?, ends_at = ?, venue_name = ?,
       address = ?, suburb = ?, city = ?, price_min = ?, price_max = ?, ticket_url = ?,
       image_url = ?, source_url = ?, registration_mode = ?,
       category = ?, status = 'pending', updated_at = datetime('now')
     WHERE id = ? AND account_id = ?`
  ).bind(
    required(fd.get("title")),
    nullable(fd.get("description")),
    required(fd.get("starts_at")),
    nullable(fd.get("ends_at")),
    nullable(fd.get("venue_name")),
    nullable(fd.get("address")),
    nullable(fd.get("suburb")),
    required(fd.get("city")),
    cents(fd.get("price_min"), 0),
    cents(fd.get("price_max"), null),
    nullable(fd.get("ticket_url")),
    nullable(fd.get("image_url")),
    nullable(fd.get("source_url")),
    nullable(fd.get("registration_mode")) ?? "auto",
    nullable(fd.get("category")),
    fd.get("id"),
    account.id,
  ).run();
}

export async function updatePortalEventFromBody(
  account: AdvertiserAccount,
  id: string,
  body: Record<string, unknown>,
): Promise<void> {
  const entries = Object.entries(body)
    .filter(([key]) => EVENT_BODY_FIELDS.has(key))
    .map(([key, value]) => [key, bodyValue(value)] as const)
    .filter(([, value]) => value !== undefined);
  if (!entries.length) return;

  const db = await getD1();
  const sets = entries.map(([key]) => `${key} = ?`).join(", ");
  await db.prepare(
    `UPDATE events
     SET ${sets}, status = 'pending', updated_at = datetime('now')
     WHERE id = ? AND account_id = ?`
  ).bind(...entries.map(([, value]) => value), id, account.id).run();
}

export async function deletePortalEvent(account: AdvertiserAccount, id: FormDataEntryValue | string | null): Promise<PortalEventActionResult> {
  const db = await getD1();
  const result = await db.prepare(
    "DELETE FROM events WHERE id = ? AND account_id = ? AND status != 'approved'"
  ).bind(id, account.id).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: "Event deleted" }
    : { ok: false, message: "Approved events cannot be deleted from the portal. Contact admin to remove a live event." };
}

export async function submitPortalEventForReview(account: AdvertiserAccount, id: FormDataEntryValue | string | null): Promise<PortalEventActionResult> {
  const db = await getD1();
  const result = await db.prepare(
    `UPDATE events
     SET status = 'pending', updated_at = datetime('now')
     WHERE id = ? AND account_id = ? AND status != 'approved'`
  ).bind(id, account.id).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: "Event submitted for admin review" }
    : { ok: false, message: "Approved events are already live. Edit the event to submit changes for review." };
}

export async function hidePortalEvent(account: AdvertiserAccount, id: FormDataEntryValue | string | null): Promise<PortalEventActionResult> {
  const db = await getD1();
  const result = await db.prepare(
    `UPDATE events
     SET status = 'hidden', updated_at = datetime('now')
     WHERE id = ? AND account_id = ?`
  ).bind(id, account.id).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: "Event hidden" }
    : { ok: false, message: "Event could not be hidden" };
}

export async function submitPortalEventsForReview(account: AdvertiserAccount, ids: string[]): Promise<PortalEventActionResult> {
  if (ids.length === 0) return { ok: false, message: "Select at least one event" };

  const db = await getD1();
  const placeholders = ids.map(() => "?").join(", ");
  const result = await db.prepare(
    `UPDATE events
     SET status = 'pending', updated_at = datetime('now')
     WHERE account_id = ? AND status != 'approved' AND id IN (${placeholders})`
  ).bind(account.id, ...ids).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: `${changed} event${changed === 1 ? "" : "s"} submitted for admin review` }
    : { ok: false, message: "No selected events needed review submission" };
}
