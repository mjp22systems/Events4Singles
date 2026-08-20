import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface AdvertiserAccount {
  id: string;
  clerk_user_id: string;
  business_id: string | null;
  plan: string;
  stripe_customer_id: string | null;
  stripe_sub_id: string | null;
  sub_status: string;
  sub_expires_at: string | null;
  billing_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  account_id: string;
  title: string | null;
  image_url: string;
  link_url: string;
  status: string;
  placement: string | null;
  created_at: string;
}

export interface AnalyticsSummary {
  event_type: string;
  surface: string;
  surface_id: string;
  total: number;
}

async function db() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export async function getOrCreateAccount(clerkUserId: string, email?: string): Promise<AdvertiserAccount> {
  const d = await db();
  const existing = await d
    .prepare("SELECT * FROM advertiser_accounts WHERE clerk_user_id = ?")
    .bind(clerkUserId)
    .first<AdvertiserAccount>();
  if (existing) return existing;

  await d
    .prepare(
      "INSERT INTO advertiser_accounts (clerk_user_id, billing_email) VALUES (?, ?)"
    )
    .bind(clerkUserId, email ?? null)
    .run();

  return d
    .prepare("SELECT * FROM advertiser_accounts WHERE clerk_user_id = ?")
    .bind(clerkUserId)
    .first<AdvertiserAccount>() as Promise<AdvertiserAccount>;
}

export async function getAccount(clerkUserId: string): Promise<AdvertiserAccount | null> {
  const d = await db();
  return d
    .prepare("SELECT * FROM advertiser_accounts WHERE clerk_user_id = ?")
    .bind(clerkUserId)
    .first<AdvertiserAccount>();
}

export async function updateAccount(
  clerkUserId: string,
  fields: Partial<Pick<AdvertiserAccount, "business_id" | "billing_email" | "plan" | "stripe_customer_id" | "stripe_sub_id" | "sub_status" | "sub_expires_at">>
): Promise<void> {
  const d = await db();
  const sets = Object.keys(fields).map((k) => `${k} = ?`).join(", ");
  const vals = [...Object.values(fields), clerkUserId];
  await d
    .prepare(`UPDATE advertiser_accounts SET ${sets}, updated_at = datetime('now') WHERE clerk_user_id = ?`)
    .bind(...vals)
    .run();
}

export async function getListingsForAccount(businessId: string) {
  const d = await db();
  const rows = await d
    .prepare(
      `SELECT l.id, l.title, l.tagline, l.status, l.location_city, l.location_state,
              GROUP_CONCAT(DISTINCT lp.category_slug) as placement_categories,
              GROUP_CONCAT(DISTINCT lp.city_slug) as placement_cities
       FROM listings l
       LEFT JOIN listing_placements lp ON lp.listing_id = l.id
       WHERE l.business_id = ? AND l.status != 'deleted'
       GROUP BY l.id
       ORDER BY l.title`
    )
    .bind(businessId)
    .all();
  return rows.results;
}

export async function getEventsForAccount(businessId: string) {
  const d = await db();
  const rows = await d
    .prepare(
      `SELECT id, title, starts_at, city, status, source
       FROM events
       WHERE submitted_by = ? OR source = 'advertiser'
       ORDER BY starts_at DESC
       LIMIT 50`
    )
    .bind(businessId)
    .all();
  return rows.results;
}

export async function getBannersForAccount(accountId: string): Promise<Banner[]> {
  const d = await db();
  const rows = await d
    .prepare("SELECT * FROM banners WHERE account_id = ? ORDER BY created_at DESC")
    .bind(accountId)
    .all();
  return rows.results as unknown as Banner[];
}

export async function createBanner(accountId: string, imageUrl: string, linkUrl: string, title?: string): Promise<void> {
  const d = await db();
  await d
    .prepare("INSERT INTO banners (account_id, image_url, link_url, title) VALUES (?, ?, ?, ?)")
    .bind(accountId, imageUrl, linkUrl, title ?? null)
    .run();
}

export async function getAnalyticsSummary(
  surfaceIds: string[],
  days = 30
): Promise<AnalyticsSummary[]> {
  if (!surfaceIds.length) return [];
  const d = await db();
  const placeholders = surfaceIds.map(() => "?").join(",");
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const rows = await d
    .prepare(
      `SELECT surface, surface_id, event_type, SUM(count) as total
       FROM analytics_daily
       WHERE surface_id IN (${placeholders}) AND date >= ?
       GROUP BY surface, surface_id, event_type`
    )
    .bind(...surfaceIds, cutoff)
    .all();
  return rows.results as unknown as AnalyticsSummary[];
}

export async function getAnalyticsDaily(
  surfaceIds: string[],
  days = 30
): Promise<{ surface_id: string; event_type: string; date: string; count: number }[]> {
  if (!surfaceIds.length) return [];
  const d = await db();
  const placeholders = surfaceIds.map(() => "?").join(",");
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const rows = await d
    .prepare(
      `SELECT surface_id, event_type, date, count
       FROM analytics_daily
       WHERE surface_id IN (${placeholders}) AND date >= ?
       ORDER BY date ASC`
    )
    .bind(...surfaceIds, cutoff)
    .all();
  return rows.results as { surface_id: string; event_type: string; date: string; count: number }[];
}
