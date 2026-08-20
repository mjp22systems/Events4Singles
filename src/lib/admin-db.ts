import { getD1 } from "./db";

// ── Listings ───────────────────────────────────────────────────────────────

export interface AdminListing {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  promo: string | null;
  contact_name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  web: string | null;
  image_url: string | null;
  location: string | null;
  location_city: string | null;
  location_state: string | null;
  placement_categories: string | null;
  placement_cities: string | null;
  status: string | null;
  listing_type: string | null;
  confidence_score: number | null;
  business_id: number | null;
  business_name: string | null;
  unclaimed_flag: number;
  ai_moderation_status: string | null;
  abn: string | null;
  licence_no: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  trading_hours: string | null;
  contact_hours: string | null;
  source_file: string | null;
  advertiser_id: number | null;
  created_at: string | number | null;
  updated_at: string | number | null;
  expires_at: string | number | null;
  deleted_at: string | number | null;
  deleted_reason: string | null;
}

export async function listListings(opts: {
  status?: string;
  search?: string;
  city?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<AdminListing[]> {
  const db = await getD1();
  const { status, search, city, category, limit = 50, offset = 0 } = opts;

  let where = "WHERE l.deleted_at IS NULL";
  const params: (string | number)[] = [];

  if (status && status !== "all") {
    where += " AND l.status = ?";
    params.push(status);
  }
  if (search) {
    where += " AND (l.title LIKE ? OR b.name LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (city) {
    where += " AND EXISTS (SELECT 1 FROM listing_placements lp_c WHERE lp_c.listing_id = l.id AND lp_c.city_slug = ?)";
    params.push(city);
  }
  if (category) {
    where += " AND EXISTS (SELECT 1 FROM listing_placements lp_k WHERE lp_k.listing_id = l.id AND lp_k.category_slug = ?)";
    params.push(category);
  }

  const { results } = await db
    .prepare(
      `SELECT l.id, l.title, l.tagline, l.description, l.phone, l.mobile,
              l.email, l.web, l.image_url, l.status, l.listing_type,
              l.confidence_score, l.business_id, l.location_city, l.location_state,
              b.name AS business_name,
              COALESCE(l.unclaimed_flag, 0) AS unclaimed_flag,
              l.ai_moderation_status, l.deleted_at,
              (SELECT GROUP_CONCAT(DISTINCT lp.category_slug)
               FROM listing_placements lp WHERE lp.listing_id = l.id) AS placement_categories,
              (SELECT GROUP_CONCAT(DISTINCT lp.city_slug)
               FROM listing_placements lp WHERE lp.listing_id = l.id) AS placement_cities
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       ${where}
       ORDER BY l.id DESC
       LIMIT ? OFFSET ?`
    )
    .bind(...params, limit, offset)
    .all<AdminListing>();
  return results;
}

export async function countListings(opts: {
  status?: string;
  search?: string;
  city?: string;
  category?: string;
}): Promise<number> {
  const db = await getD1();
  const { status, search, city, category } = opts;

  let where = "WHERE l.deleted_at IS NULL";
  const params: (string | number)[] = [];

  if (status && status !== "all") {
    where += " AND l.status = ?";
    params.push(status);
  }
  if (search) {
    where += " AND (l.title LIKE ? OR b.name LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (city) {
    where += " AND EXISTS (SELECT 1 FROM listing_placements lp_c WHERE lp_c.listing_id = l.id AND lp_c.city_slug = ?)";
    params.push(city);
  }
  if (category) {
    where += " AND EXISTS (SELECT 1 FROM listing_placements lp_k WHERE lp_k.listing_id = l.id AND lp_k.category_slug = ?)";
    params.push(category);
  }

  const row = await db
    .prepare(
      `SELECT COUNT(*) as n FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       ${where}`
    )
    .bind(...params)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function getListingById(id: number): Promise<AdminListing | null> {
  const db = await getD1();
  return db
    .prepare(
      `SELECT l.*, b.name AS business_name
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       WHERE l.id = ?`
    )
    .bind(id)
    .first<AdminListing>() ?? null;
}

export async function updateListing(id: number, fields: Partial<AdminListing>): Promise<void> {
  const db = await getD1();
  const allowed = [
    "title", "tagline", "description", "promo",
    "contact_name", "phone", "mobile", "email", "web", "image_url",
    "location", "location_city", "location_state",
    "status", "listing_type", "business_id", "unclaimed_flag",
    "abn", "licence_no", "facebook_url", "instagram_url",
    "tiktok_url", "youtube_url", "linkedin_url",
    "trading_hours", "contact_hours", "ai_moderation_status",
  ];
  const updates = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!updates.length) return;

  const set = updates.map((k) => `${k} = ?`).join(", ");
  const vals = updates.map((k) => (fields as Record<string, unknown>)[k]);

  await db.prepare(`UPDATE listings SET ${set} WHERE id = ?`).bind(...vals, id).run();
}

export async function softDeleteListing(id: number, reason: string): Promise<void> {
  const db = await getD1();
  await db
    .prepare(`UPDATE listings SET deleted_at = strftime('%s','now'), deleted_reason = ?, status = 'deleted' WHERE id = ?`)
    .bind(reason, id)
    .run();
}

// ── Businesses ─────────────────────────────────────────────────────────────

export interface AdminBusiness {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  advertiser_id: number | null;
  merged_into_business_id: number | null;
  listing_count: number;
}

export interface BusinessListing {
  id: number;
  title: string;
  status: string | null;
  listing_type: string | null;
  location_city: string | null;
  unclaimed_flag: number;
  confidence_score: number | null;
}

export async function listBusinesses(search?: string): Promise<AdminBusiness[]> {
  const db = await getD1();
  const where = search ? "WHERE b.name LIKE ?" : "";
  const params = search ? [`%${search}%`] : [];

  const { results } = await db
    .prepare(
      `SELECT b.id, b.name, b.description, b.website,
              COUNT(l.id) AS listing_count
       FROM businesses b
       LEFT JOIN listings l ON l.business_id = b.id AND l.deleted_at IS NULL
       ${where}
       GROUP BY b.id
       ORDER BY b.name ASC`
    )
    .bind(...params)
    .all<AdminBusiness>();
  return results;
}

export async function getBusinessById(id: number): Promise<AdminBusiness | null> {
  const db = await getD1();
  return db
    .prepare(
      `SELECT b.id, b.name, b.description, b.logo_url, b.website, b.advertiser_id,
              b.merged_into_business_id,
              COUNT(l.id) AS listing_count
       FROM businesses b
       LEFT JOIN listings l ON l.business_id = b.id AND l.deleted_at IS NULL
       WHERE b.id = ?
       GROUP BY b.id`
    )
    .bind(id)
    .first<AdminBusiness>() ?? null;
}

export async function updateBusiness(id: number, fields: Partial<AdminBusiness>): Promise<void> {
  const db = await getD1();
  const allowed = ["name", "description", "logo_url", "website"];
  const updates = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!updates.length) return;
  const set = updates.map((k) => `${k} = ?`).join(", ");
  const vals = updates.map((k) => (fields as Record<string, unknown>)[k]);
  await db.prepare(`UPDATE businesses SET ${set} WHERE id = ?`).bind(...vals, id).run();
}

export async function getListingsForBusiness(businessId: number): Promise<BusinessListing[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT id, title, status, listing_type, location_city,
              COALESCE(unclaimed_flag, 0) AS unclaimed_flag,
              confidence_score
       FROM listings
       WHERE business_id = ? AND deleted_at IS NULL
       ORDER BY id DESC`
    )
    .bind(businessId)
    .all<BusinessListing>();
  return results;
}

export async function mergeBusiness(sourceId: number, targetId: number): Promise<void> {
  const db = await getD1();
  const now = Math.floor(Date.now() / 1000);
  await db.batch([
    db.prepare(`UPDATE listings SET business_id = ? WHERE business_id = ?`).bind(targetId, sourceId),
    db.prepare(`UPDATE businesses SET merged_into_business_id = ?, merged_at = ? WHERE id = ?`).bind(targetId, now, sourceId),
  ]);
}

// ── Categories ─────────────────────────────────────────────────────────────

export interface AdminCategory {
  slug: string;
  label: string;
  description: string | null;
  parent_slug: string | null;
  sort_order: number | null;
  banner_row_count: number;
  seo_title: string | null;
  seo_description: string | null;
  hero_image_url: string | null;
  listing_count: number;
}

export async function listCategories(): Promise<AdminCategory[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT c.*,
              COALESCE(c.banner_row_count, 1) AS banner_row_count,
              COUNT(lp.listing_id) AS listing_count
       FROM categories c
       LEFT JOIN listing_placements lp ON lp.category_slug = c.slug
       GROUP BY c.slug
       ORDER BY c.sort_order ASC, c.label ASC`
    )
    .bind()
    .all<AdminCategory>();
  return results;
}

export async function updateCategory(slug: string, fields: Partial<AdminCategory>): Promise<void> {
  const db = await getD1();
  const allowed = ["label", "description", "banner_row_count", "seo_title", "seo_description", "hero_image_url", "sort_order"];
  const updates = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!updates.length) return;

  const set = updates.map((k) => `${k} = ?`).join(", ");
  const vals = updates.map((k) => (fields as Record<string, unknown>)[k]);

  await db.prepare(`UPDATE categories SET ${set} WHERE slug = ?`).bind(...vals, slug).run();
}

export async function getCategoryBySlug(slug: string): Promise<AdminCategory | null> {
  const db = await getD1();
  return db
    .prepare(
      `SELECT c.*,
              COALESCE(c.banner_row_count, 1) AS banner_row_count,
              COUNT(lp.listing_id) AS listing_count
       FROM categories c
       LEFT JOIN listing_placements lp ON lp.category_slug = c.slug
       WHERE c.slug = ?
       GROUP BY c.slug`
    )
    .bind(slug)
    .first<AdminCategory>() ?? null;
}

// ── Cities ──────────────────────────────────────────────────────────────────

export interface AdminCity {
  slug: string;
  label: string;
  state: string | null;
  region: string | null;
  seo_title: string | null;
  seo_description: string | null;
  listing_count: number;
}

export interface ToolListing {
  id: number;
  title: string;
  image_url: string | null;
  confidence_score: number | null;
  status: string | null;
  business_name: string | null;
}

export async function listCities(): Promise<AdminCity[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT c.*,
              COUNT(lp.listing_id) AS listing_count
       FROM cities c
       LEFT JOIN listing_placements lp ON lp.city_slug = c.slug
       GROUP BY c.slug
       ORDER BY c.label ASC`
    )
    .bind()
    .all<AdminCity>();
  return results;
}

export async function getCityBySlug(slug: string): Promise<AdminCity | null> {
  const db = await getD1();
  return db
    .prepare(
      `SELECT c.*,
              COUNT(lp.listing_id) AS listing_count
       FROM cities c
       LEFT JOIN listing_placements lp ON lp.city_slug = c.slug
       WHERE c.slug = ?
       GROUP BY c.slug`
    )
    .bind(slug)
    .first<AdminCity>() ?? null;
}

export async function updateCity(slug: string, fields: Partial<AdminCity>): Promise<void> {
  const db = await getD1();
  const allowed = ["label", "state", "region", "seo_title", "seo_description"];
  const updates = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!updates.length) return;
  const set = updates.map((k) => `${k} = ?`).join(", ");
  const vals = updates.map((k) => (fields as Record<string, unknown>)[k]);
  await db.prepare(`UPDATE cities SET ${set} WHERE slug = ?`).bind(...vals, slug).run();
}

export async function getNoImageListings(): Promise<ToolListing[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT l.id, l.title, l.image_url, l.confidence_score, l.status,
              b.name AS business_name
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       WHERE l.deleted_at IS NULL AND (l.image_url IS NULL OR l.image_url = '')
       ORDER BY l.id DESC`
    )
    .bind()
    .all<ToolListing>();
  return results;
}

export async function getLowConfidenceListings(threshold = 70): Promise<ToolListing[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT l.id, l.title, l.image_url, l.confidence_score, l.status,
              b.name AS business_name
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       WHERE l.deleted_at IS NULL AND l.confidence_score IS NOT NULL AND l.confidence_score < ?
       ORDER BY l.confidence_score ASC`
    )
    .bind(threshold)
    .all<ToolListing>();
  return results;
}

export async function getUnplacedListings(): Promise<ToolListing[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT l.id, l.title, l.image_url, l.confidence_score, l.status,
              b.name AS business_name
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       WHERE l.deleted_at IS NULL
         AND NOT EXISTS (SELECT 1 FROM listing_placements lp WHERE lp.listing_id = l.id)
       ORDER BY l.id DESC`
    )
    .bind()
    .all<ToolListing>();
  return results;
}

// ── Activity log ────────────────────────────────────────────────────────────

export async function logActivity(
  action: string,
  entityType: string,
  entityId: string | number,
  meta?: Record<string, unknown>
): Promise<void> {
  const db = await getD1();
  await db
    .prepare(
      `INSERT INTO admin_activity_log (actor_type, actor_id, action, entity_type, entity_id, meta)
       VALUES ('admin', 'admin', ?, ?, ?, ?)`
    )
    .bind(action, entityType, String(entityId), meta ? JSON.stringify(meta) : null)
    .run();
}

// ── Dashboard stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  activeListings: number;
  pendingReview: number;
  unclaimedListings: number;
  totalBusinesses: number;
  pendingEvents: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getD1();
  const [active, pending, unclaimed, businesses, pendingEvents] = await db.batch([
    db.prepare(`SELECT COUNT(*) AS n FROM listings WHERE status = 'active' AND deleted_at IS NULL`),
    db.prepare(`SELECT COUNT(*) AS n FROM listings WHERE ai_moderation_status = 'fail' AND deleted_at IS NULL`),
    db.prepare(`SELECT COUNT(*) AS n FROM listings WHERE unclaimed_flag = 1 AND deleted_at IS NULL`),
    db.prepare(`SELECT COUNT(*) AS n FROM businesses WHERE merged_into_business_id IS NULL`),
    db.prepare(`SELECT COUNT(*) AS n FROM events WHERE status = 'pending'`),
  ]);
  return {
    activeListings: (active.results[0] as { n: number }).n,
    pendingReview: (pending.results[0] as { n: number }).n,
    unclaimedListings: (unclaimed.results[0] as { n: number }).n,
    totalBusinesses: (businesses.results[0] as { n: number }).n,
    pendingEvents: (pendingEvents.results[0] as { n: number }).n,
  };
}

export interface ActivityRow {
  id: number;
  actor_type: string;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  meta: string | null;
  created_at: number;
}

export async function getRecentActivity(limit = 20): Promise<ActivityRow[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(`SELECT * FROM admin_activity_log ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all<ActivityRow>();
  return results;
}

// ── Events ───────────────────────────────────────────────────────────────────

export interface AdminEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  suburb: string | null;
  city: string;
  state: string | null;
  price_min: number | null;
  price_max: number | null;
  ticket_url: string | null;
  image_url: string | null;
  source: string;
  source_id: string | null;
  source_url: string | null;
  category: string | null;
  status: string;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

const EVENT_UPDATE_ALLOWLIST = new Set([
  "title", "slug", "description", "starts_at", "ends_at", "timezone",
  "venue_name", "address", "suburb", "city", "state",
  "price_min", "price_max", "ticket_url", "image_url",
  "source_url", "category", "status", "submitted_by",
]);

export async function listEvents(opts: {
  status?: string;
  city?: string;
  page?: number;
  limit?: number;
} = {}): Promise<AdminEvent[]> {
  const db = await getD1();
  const limit = opts.limit ?? 50;
  const offset = ((opts.page ?? 1) - 1) * limit;
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (opts.status) { conditions.push("status = ?"); params.push(opts.status); }
  if (opts.city) { conditions.push("city = ?"); params.push(opts.city); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { results } = await db
    .prepare(`SELECT * FROM events ${where} ORDER BY starts_at ASC LIMIT ? OFFSET ?`)
    .bind(...params, limit, offset)
    .all<AdminEvent>();
  return results;
}

export async function countEvents(opts: { status?: string; city?: string } = {}): Promise<number> {
  const db = await getD1();
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (opts.status) { conditions.push("status = ?"); params.push(opts.status); }
  if (opts.city) { conditions.push("city = ?"); params.push(opts.city); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM events ${where}`)
    .bind(...params)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function getEventById(id: string): Promise<AdminEvent | null> {
  const db = await getD1();
  return db.prepare(`SELECT * FROM events WHERE id = ?`).bind(id).first<AdminEvent>();
}

export async function createEvent(fields: Partial<AdminEvent>): Promise<{ id: string }> {
  const db = await getD1();
  const id = crypto.randomUUID().replace(/-/g, "");
  const slug = fields.slug ?? `${(fields.title ?? "event").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${id.slice(0, 6)}`;
  await db
    .prepare(`INSERT INTO events (id, title, slug, description, starts_at, ends_at, timezone, venue_name, address, suburb, city, state, price_min, price_max, ticket_url, image_url, source, source_id, source_url, category, status, submitted_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      id,
      fields.title ?? "",
      slug,
      fields.description ?? null,
      fields.starts_at ?? new Date().toISOString(),
      fields.ends_at ?? null,
      fields.timezone ?? "Australia/Sydney",
      fields.venue_name ?? null,
      fields.address ?? null,
      fields.suburb ?? null,
      fields.city ?? "",
      fields.state ?? null,
      fields.price_min ?? null,
      fields.price_max ?? null,
      fields.ticket_url ?? null,
      fields.image_url ?? null,
      fields.source ?? "admin",
      fields.source_id ?? null,
      fields.source_url ?? null,
      fields.category ?? null,
      fields.status ?? "pending",
      fields.submitted_by ?? null,
    )
    .run();
  return { id };
}

export async function updateEvent(id: string, fields: Record<string, unknown>): Promise<void> {
  const db = await getD1();
  const allowed = Object.fromEntries(
    Object.entries(fields).filter(([k]) => EVENT_UPDATE_ALLOWLIST.has(k))
  );
  if (!Object.keys(allowed).length) return;
  const sets = Object.keys(allowed).map((k) => `${k} = ?`).join(", ");
  await db
    .prepare(`UPDATE events SET ${sets}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...Object.values(allowed), id)
    .run();
}

export async function deleteEvent(id: string): Promise<void> {
  const db = await getD1();
  await db.prepare(`DELETE FROM events WHERE id = ?`).bind(id).run();
}

// ── Redirects ────────────────────────────────────────────────────────────────

export interface AdminRedirect {
  id: number;
  from_path: string;
  to_path: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: number;
}

export async function listRedirects(): Promise<AdminRedirect[]> {
  const db = await getD1();
  const { results } = await db
    .prepare("SELECT * FROM redirects ORDER BY created_at DESC")
    .all<AdminRedirect>();
  return results;
}

export async function createRedirect(from_path: string, to_path: string): Promise<void> {
  const db = await getD1();
  await db
    .prepare("INSERT OR REPLACE INTO redirects (from_path, to_path) VALUES (?, ?)")
    .bind(from_path, to_path)
    .run();
}

export async function deleteRedirect(id: number): Promise<void> {
  const db = await getD1();
  await db.prepare("DELETE FROM redirects WHERE id = ?").bind(id).run();
}
