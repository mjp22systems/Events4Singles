import { currentUser } from "@clerk/nextjs/server";
import { getAccount } from "@/lib/portal-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
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
    `INSERT INTO events (title, description, starts_at, ends_at, venue_name, address, suburb, city, price_min, ticket_url, category, status, account_id, submitted_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).bind(
    fd.get("title"),
    fd.get("description") || null,
    fd.get("starts_at"),
    fd.get("ends_at") || null,
    fd.get("venue_name") || null,
    fd.get("address") || null,
    fd.get("suburb") || null,
    fd.get("city"),
    fd.get("price_min") ? Number(fd.get("price_min")) * 100 : 0,
    fd.get("ticket_url") || null,
    fd.get("category") || null,
    account.id,
    user.emailAddresses[0]?.emailAddress ?? null,
  ).run();
}

async function getAccountEvents(accountId: string) {
  const { env } = await getCloudflareContext({ async: true });
  const rows = await env.DB.prepare(
    `SELECT id, title, starts_at, city, status, category FROM events WHERE account_id = ? ORDER BY starts_at DESC LIMIT 50`
  ).bind(accountId).all();
  return rows.results as { id: string; title: string; starts_at: string; city: string; status: string; category: string }[];
}

export default async function PortalEvents() {
  const user = await currentUser();
  const account = await getAccount(user!.id);
  const events = account ? await getAccountEvents(account.id) : [];

  return <EventsClient events={events} createEvent={createEvent} />;
}
