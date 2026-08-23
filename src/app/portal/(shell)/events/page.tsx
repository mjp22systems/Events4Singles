import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateAccount, getPortalEvents, listPortalIntegrations, listPortalMediaAssets } from "@/lib/portal-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAllCategories, getAllCities } from "@/lib/data";
import EventsClient from "./events-client";

export const dynamic = "force-dynamic";

async function createEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const account = await (await import("@/lib/portal-db")).getAccount(user.id);
  if (!account) return;

  const { env } = await getCloudflareContext({ async: true });
  await env.DB.prepare(
    `INSERT INTO events (
       title, description, starts_at, ends_at, venue_name, address, suburb, city,
       price_min, price_max, ticket_url, image_url, source_url, registration_mode,
       category, status, account_id, submitted_by
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).bind(
    fd.get("title"),
    fd.get("description") || null,
    fd.get("starts_at"),
    fd.get("ends_at") || null,
    fd.get("venue_name") || null,
    fd.get("address") || null,
    fd.get("suburb") || null,
    fd.get("city"),
    fd.get("price_min") ? Math.round(Number(fd.get("price_min")) * 100) : 0,
    fd.get("price_max") ? Math.round(Number(fd.get("price_max")) * 100) : null,
    fd.get("ticket_url") || null,
    fd.get("image_url") || null,
    fd.get("source_url") || null,
    fd.get("registration_mode") || "auto",
    fd.get("category") || null,
    account.id,
    user.emailAddresses[0]?.emailAddress ?? null,
  ).run();
}

async function updateEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const account = await (await import("@/lib/portal-db")).getAccount(user.id);
  if (!account) return;

  const { env } = await getCloudflareContext({ async: true });
  await env.DB.prepare(
    `UPDATE events SET
       title = ?, description = ?, starts_at = ?, ends_at = ?, venue_name = ?,
       address = ?, suburb = ?, city = ?, price_min = ?, price_max = ?, ticket_url = ?,
       image_url = ?, source_url = ?, registration_mode = ?,
       category = ?, updated_at = datetime('now')
     WHERE id = ? AND account_id = ?`
  ).bind(
    fd.get("title"),
    fd.get("description") || null,
    fd.get("starts_at"),
    fd.get("ends_at") || null,
    fd.get("venue_name") || null,
    fd.get("address") || null,
    fd.get("suburb") || null,
    fd.get("city"),
    fd.get("price_min") ? Math.round(Number(fd.get("price_min")) * 100) : 0,
    fd.get("price_max") ? Math.round(Number(fd.get("price_max")) * 100) : null,
    fd.get("ticket_url") || null,
    fd.get("image_url") || null,
    fd.get("source_url") || null,
    fd.get("registration_mode") || "auto",
    fd.get("category") || null,
    fd.get("id"),
    account.id,
  ).run();
}

async function deleteEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await (await import("@/lib/portal-db")).getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    `DELETE FROM events WHERE id = ? AND account_id = ? AND status != 'approved'`
  ).bind(fd.get("id"), account.id).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: "Event deleted" }
    : { ok: false, message: "Approved events cannot be deleted from the portal. Contact admin to remove a live event." };
}

async function approveEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await (await import("@/lib/portal-db")).getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    `UPDATE events
     SET status = 'approved', updated_at = datetime('now')
     WHERE id = ? AND account_id = ?`
  ).bind(fd.get("id"), account.id).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: "Event approved and live" }
    : { ok: false, message: "Event could not be approved" };
}

async function hideEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await (await import("@/lib/portal-db")).getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    `UPDATE events
     SET status = 'hidden', updated_at = datetime('now')
     WHERE id = ? AND account_id = ?`
  ).bind(fd.get("id"), account.id).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: "Event hidden" }
    : { ok: false, message: "Event could not be hidden" };
}

async function approveEvents(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await (await import("@/lib/portal-db")).getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  const ids = fd.getAll("ids").map(String).filter(Boolean);
  if (ids.length === 0) return { ok: false, message: "Select at least one event" };

  const { env } = await getCloudflareContext({ async: true });
  const placeholders = ids.map(() => "?").join(", ");
  const result = await env.DB.prepare(
    `UPDATE events
     SET status = 'approved', updated_at = datetime('now')
     WHERE account_id = ? AND status != 'approved' AND id IN (${placeholders})`
  ).bind(account.id, ...ids).run();
  const changed = result.meta?.changes ?? 0;
  return changed > 0
    ? { ok: true, message: `${changed} event${changed === 1 ? "" : "s"} approved and live` }
    : { ok: false, message: "No selected events needed approval" };
}

export default async function PortalEvents() {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const [events, cities, categories, integrations, mediaAssets] = await Promise.all([
    getPortalEvents(account.id),
    getAllCities(),
    getAllCategories(),
    listPortalIntegrations(account.id),
    listPortalMediaAssets(account.id),
  ]);
  const hasPushIntegration = integrations.some(
    (i) => i.platform === "eventbrite" && i.push_enabled === 1
  );

  return <EventsClient events={events} mediaAssets={mediaAssets} cities={cities} categories={categories} hasPushIntegration={hasPushIntegration} createEvent={createEvent} updateEvent={updateEvent} deleteEvent={deleteEvent} approveEvent={approveEvent} approveEvents={approveEvents} hideEvent={hideEvent} />;
}
