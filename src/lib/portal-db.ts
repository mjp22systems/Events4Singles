import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureEventExternalRefsTable } from "@/lib/event-external-refs";
import { ensureMediaAssetsTable, listMediaAssetsForAccount, type MediaAsset } from "@/lib/media-assets";

export interface AdvertiserAccount {
  id: string;
  clerk_user_id: string;
  business_id: number | null;
  display_name: string | null;
  portal_email: string | null;
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

export interface PortalBusiness {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  role: string;
  is_primary: number;
  status: string;
  listing_count: number;
}

export type BusinessClaimRequestInput = {
  business_name: string;
  website?: string | null;
  city?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  message?: string | null;
  portal_email?: string | null;
};

export type IntegrationPlatform = "eventbrite" | "meetup" | "humanitix" | "trybooking" | "ical";

export interface PortalEvent {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  suburb: string | null;
  city: string;
  price_min: number | null;
  price_max: number | null;
  ticket_url: string | null;
  image_url: string | null;
  source_url: string | null;
  category: string | null;
  status: string;
  source: string;
  push_platform: string | null;
  push_id: string | null;
  push_url: string | null;
  registration_mode: string | null;
  shared_refs: string | null;
}

export interface PortalIntegration {
  id: string;
  account_id: string;
  platform: IntegrationPlatform;
  config: string | null;
  last_synced: string | null;
  sync_status: "idle" | "syncing" | "error";
  sync_error: string | null;
  auto_approve: number;
  push_enabled: number;
  event_count: number;
}

export type PortalMediaAsset = MediaAsset;

type PortalIntegrationTokenFields = {
  access_token: string | null;
  refresh_token: string | null;
  token_expiry: string | null;
};

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
      "INSERT INTO advertiser_accounts (clerk_user_id, portal_email, billing_email) VALUES (?, ?, ?)"
    )
    .bind(clerkUserId, email ?? null, email ?? null)
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
  fields: Partial<Pick<AdvertiserAccount, "business_id" | "display_name" | "portal_email" | "billing_email" | "plan" | "stripe_customer_id" | "stripe_sub_id" | "sub_status" | "sub_expires_at">>
): Promise<void> {
  const d = await db();
  if (Object.keys(fields).length === 0) return;
  const sets = Object.keys(fields).map((k) => `${k} = ?`).join(", ");
  const vals = [...Object.values(fields), clerkUserId];
  await d
    .prepare(`UPDATE advertiser_accounts SET ${sets}, updated_at = datetime('now') WHERE clerk_user_id = ?`)
    .bind(...vals)
    .run();
}

export async function getBusinessesForAccount(account: AdvertiserAccount): Promise<PortalBusiness[]> {
  const d = await db();
  const rows = await d
    .prepare(
      `SELECT b.id, b.name, b.description, b.website, b.logo_url,
              COALESCE(aab.role, 'owner') AS role,
              COALESCE(aab.is_primary, CASE WHEN a.business_id = b.id THEN 1 ELSE 0 END) AS is_primary,
              COALESCE(aab.status, 'active') AS status,
              COUNT(l.id) AS listing_count
       FROM businesses b
       JOIN advertiser_accounts a ON a.id = ?
       LEFT JOIN advertiser_account_businesses aab
         ON aab.business_id = b.id AND aab.account_id = a.id AND aab.status = 'active'
       LEFT JOIN listings l ON l.business_id = b.id AND l.deleted_at IS NULL
       WHERE aab.account_id IS NOT NULL OR b.id = a.business_id
       GROUP BY b.id
       ORDER BY is_primary DESC, b.name ASC`
    )
    .bind(account.id)
    .all<PortalBusiness>();
  return rows.results;
}

export async function getBusinessIdsForAccount(account: AdvertiserAccount): Promise<number[]> {
  const businesses = await getBusinessesForAccount(account);
  const ids = businesses.map((business) => business.id);
  if (account.business_id && !ids.includes(account.business_id)) ids.push(account.business_id);
  return ids;
}

export async function createBusinessClaimRequest(
  account: AdvertiserAccount,
  input: BusinessClaimRequestInput,
): Promise<void> {
  const d = await db();
  await d
    .prepare(
      `INSERT INTO business_claim_requests
         (account_id, clerk_user_id, portal_email, business_name, website, city, contact_email, phone, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      account.id,
      account.clerk_user_id,
      input.portal_email ?? account.billing_email ?? null,
      input.business_name,
      input.website ?? null,
      input.city ?? null,
      input.contact_email ?? null,
      input.phone ?? null,
      input.message ?? null,
    )
    .run();
}

export async function getListingsForAccount(businessId: string | number) {
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

export async function getPortalEvents(accountId: string): Promise<PortalEvent[]> {
  const d = await db();
  await ensureEventExternalRefsTable(d);
  const rows = await d
    .prepare(
      `SELECT id, title, description, starts_at, ends_at, timezone, venue_name, address, suburb,
              city, price_min, price_max, ticket_url, image_url, source_url, category, status, source,
              push_platform, push_id, push_url, registration_mode,
              (
                SELECT GROUP_CONCAT(platform || '|' || COALESCE(external_url, '') || '|' || external_id, CHAR(30))
                FROM event_external_refs
                WHERE event_id = events.id
                  AND status IN ('shared', 'linked')
                  AND direction IN ('pushed_to', 'linked')
              ) AS shared_refs
       FROM events
       WHERE account_id = ?
       ORDER BY starts_at DESC
       LIMIT 100`
    )
    .bind(accountId)
    .all<PortalEvent>();
  return rows.results;
}

export async function getListingsForBusinessIds(businessIds: number[], businessId?: number) {
  if (!businessIds.length) return [];
  const allowedIds = businessId ? businessIds.filter((id) => id === businessId) : businessIds;
  if (!allowedIds.length) return [];

  const d = await db();
  const placeholders = allowedIds.map(() => "?").join(",");
  const rows = await d
    .prepare(
      `SELECT l.id, l.title, l.tagline, l.status, l.location_city, l.location_state,
              l.business_id, b.name AS business_name,
              GROUP_CONCAT(DISTINCT lp.category_slug) as placement_categories,
              GROUP_CONCAT(DISTINCT lp.city_slug) as placement_cities
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       LEFT JOIN listing_placements lp ON lp.listing_id = l.id
       WHERE l.business_id IN (${placeholders}) AND l.status != 'deleted'
       GROUP BY l.id
       ORDER BY b.name ASC, l.title ASC`
    )
    .bind(...allowedIds)
    .all();
  return rows.results;
}

export async function listPortalIntegrations(accountId: string): Promise<PortalIntegration[]> {
  const d = await db();
  await ensureEventExternalRefsTable(d);
  const rows = await d
    .prepare(
      `SELECT i.id, i.account_id, i.platform, i.config, i.last_synced, i.sync_status,
              i.sync_error, i.auto_approve, i.push_enabled,
              (
                SELECT COUNT(DISTINCT event_id)
                FROM (
                  SELECT e.id AS event_id
                  FROM events e
                  WHERE e.account_id = i.account_id
                    AND e.source = i.platform
                    AND e.source_id IS NOT NULL
                  UNION
                  SELECT ref.event_id AS event_id
                  FROM event_external_refs ref
                  WHERE ref.account_id = i.account_id
                    AND ref.platform = i.platform
                    AND ref.status != 'stale'
                )
              ) AS event_count
       FROM integrations i
       WHERE i.account_id = ?
       GROUP BY i.id
       ORDER BY i.platform ASC`
    )
    .bind(accountId)
    .all<PortalIntegration>();
  return rows.results;
}

export async function listPortalMediaAssets(accountId: string): Promise<PortalMediaAsset[]> {
  const d = await db();
  await ensureMediaAssetsTable(d);
  return listMediaAssetsForAccount(d, accountId, "event_image", 60);
}

export async function upsertPortalIntegration(
  accountId: string,
  platform: IntegrationPlatform,
  config: Record<string, unknown>,
  fields: Partial<PortalIntegrationTokenFields> = {},
): Promise<void> {
  const d = await db();
  await d
    .prepare(
      `INSERT INTO integrations (account_id, platform, access_token, refresh_token, token_expiry, config)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(account_id, platform) DO UPDATE SET
         access_token = excluded.access_token,
         refresh_token = excluded.refresh_token,
         token_expiry = excluded.token_expiry,
         config = excluded.config,
         sync_error = NULL,
         sync_status = 'idle',
         updated_at = datetime('now')`
    )
    .bind(
      accountId,
      platform,
      fields.access_token ?? null,
      fields.refresh_token ?? null,
      fields.token_expiry ?? null,
      JSON.stringify(config),
    )
    .run();
}

export async function updatePortalIntegration(
  accountId: string,
  id: string,
  fields: Partial<Pick<PortalIntegration, "auto_approve" | "push_enabled">>,
): Promise<void> {
  const d = await db();
  const allowed = Object.entries(fields).filter(([key]) => key === "auto_approve" || key === "push_enabled");
  if (!allowed.length) return;
  const sets = allowed.map(([key]) => `${key} = ?`).join(", ");
  await d
    .prepare(`UPDATE integrations SET ${sets}, updated_at = datetime('now') WHERE id = ? AND account_id = ?`)
    .bind(...allowed.map(([, value]) => value), id, accountId)
    .run();
}

export async function deletePortalIntegration(accountId: string, id: string): Promise<void> {
  const d = await db();
  await d.prepare("DELETE FROM integrations WHERE id = ? AND account_id = ?").bind(id, accountId).run();
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
