import { getD1 } from "./db";
import { ensureEventExternalRefsTable } from "./event-external-refs";
import { canonicalEventSlug } from "./event-slugs";
import {
  createMediaAsset as createSharedMediaAsset,
  ensureMediaAssetsTable as ensureSharedMediaAssetsTable,
  getMediaAsset as getSharedMediaAsset,
  listMediaAssets as listSharedMediaAssets,
  type MediaAsset,
  type MediaAssetPurpose,
  type MediaAssetWithData,
} from "./media-assets";

export type { MediaAsset } from "./media-assets";
export type MediaAssetBlob = MediaAssetWithData;

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

export interface AdminListingPlacement {
  category_slug: string | null;
  city_slug: string | null;
  sort_order: number | null;
  position_type: string | null;
  is_active: number | null;
}

export async function listListings(opts: {
  status?: string;
  search?: string;
  city?: string;
  category?: string;
  businessId?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<AdminListing[]> {
  const db = await getD1();
  const { status, search, city, category, businessId, sort, limit = 50, offset = 0 } = opts;

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
  if (businessId) {
    where += " AND l.business_id = ?";
    params.push(businessId);
  }

  const LISTING_ORDER: Record<string, string> = {
    id_asc: "l.id ASC",
    title_asc: "l.title ASC",
    title_desc: "l.title DESC",
    status: "l.status ASC",
    score_desc: "l.confidence_score DESC",
    city_asc: "l.location_city ASC",
  };
  const orderBy = LISTING_ORDER[sort ?? ""] ?? "l.id DESC";
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
       ORDER BY ${orderBy}
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
  businessId?: number;
}): Promise<number> {
  const db = await getD1();
  const { status, search, city, category, businessId } = opts;

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
  if (businessId) {
    where += " AND l.business_id = ?";
    params.push(businessId);
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

export async function getPlacementsForListing(id: number): Promise<AdminListingPlacement[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT category_slug, city_slug, sort_order, position_type, is_active
       FROM listing_placements
       WHERE listing_id = ? AND COALESCE(is_active, 1) = 1
       ORDER BY sort_order ASC, category_slug ASC, city_slug ASC`
    )
    .bind(id)
    .all<AdminListingPlacement>();
  return results;
}

export async function replaceListingPlacements(
  id: number,
  placements: Pick<AdminListingPlacement, "category_slug" | "city_slug">[],
): Promise<void> {
  const db = await getD1();
  const seen = new Set<string>();
  const clean = placements
    .map((placement) => ({
      category_slug: placement.category_slug || null,
      city_slug: placement.city_slug || null,
    }))
    .filter((placement) => placement.category_slug || placement.city_slug)
    .filter((placement) => {
      const key = `${placement.category_slug ?? ""}:${placement.city_slug ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  await db.prepare("DELETE FROM listing_placements WHERE listing_id = ?").bind(id).run();
  if (!clean.length) return;

  await db.batch(
    clean.map((placement, index) =>
      db
        .prepare(
          `INSERT INTO listing_placements
             (listing_id, category_slug, city_slug, sort_order, position_type, is_active)
           VALUES (?, ?, ?, ?, 'organic', 1)`
        )
        .bind(id, placement.category_slug, placement.city_slug, index)
    )
  );
}

export async function listListingImageOptions(limit = 300): Promise<string[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT DISTINCT image_url
       FROM listings
       WHERE image_url IS NOT NULL AND image_url != ''
       ORDER BY image_url ASC
       LIMIT ?`
    )
    .bind(limit)
    .all<{ image_url: string }>();
  return results.map((row) => row.image_url);
}

// ── Media Library ───────────────────────────────────────────────────────────

export async function ensureMediaAssetsTable(): Promise<void> {
  const db = await getD1();
  await ensureSharedMediaAssetsTable(db);
}

export async function createMediaAsset(fields: {
  filename: string;
  contentType: string;
  byteSize: number;
  data: ArrayBuffer;
  source?: string;
  purpose?: MediaAssetPurpose;
}): Promise<MediaAsset> {
  const db = await getD1();
  return createSharedMediaAsset(db, {
    accountId: null,
    filename: fields.filename,
    contentType: fields.contentType,
    byteSize: fields.byteSize,
    data: fields.data,
    source: fields.source ?? "admin",
    purpose: fields.purpose ?? "event_image",
  });
}

export async function getMediaAssetMeta(id: string): Promise<MediaAsset | null> {
  const db = await getD1();
  const asset = await getSharedMediaAsset(db, id);
  if (!asset) return null;
  const { data: _data, ...meta } = asset;
  return meta;
}

export async function getMediaAssetBlob(id: string): Promise<MediaAssetBlob | null> {
  const db = await getD1();
  return getSharedMediaAsset(db, id);
}

export async function listMediaAssets(limit = 120, purpose: MediaAssetPurpose = "event_image"): Promise<MediaAsset[]> {
  const db = await getD1();
  return listSharedMediaAssets(db, purpose, limit);
}

export async function listEventImageOptions(limit = 200): Promise<MediaAsset[]> {
  await ensureMediaAssetsTable();
  const db = await getD1();
  const media = await listMediaAssets(Math.ceil(limit / 2), "event_image");
  const { results } = await db
    .prepare(
      `SELECT DISTINCT image_url
       FROM events
       WHERE image_url IS NOT NULL AND image_url != ''
       ORDER BY image_url ASC
       LIMIT ?`
    )
    .bind(limit)
    .all<{ image_url: string }>();
  const seen = new Set(media.map((item) => item.public_url));
  const existing = results
    .filter((row) => !seen.has(row.image_url))
    .map((row, index) => ({
      id: `event-url-${index}`,
      account_id: null,
      filename: row.image_url.split("/").pop() || row.image_url,
      content_type: "external/url",
      byte_size: 0,
      public_url: row.image_url,
      source: "event",
      purpose: "event_image" as const,
      alt_text: null,
      created_at: "",
    }));
  return [...media, ...existing].slice(0, limit);
}

export async function listCategoryImageOptions(limit = 200): Promise<MediaAsset[]> {
  await ensureMediaAssetsTable();
  const db = await getD1();
  const media = await listMediaAssets(Math.ceil(limit / 2), "category_image");
  const { results } = await db
    .prepare(
      `SELECT DISTINCT hero_image_url
       FROM categories
       WHERE hero_image_url IS NOT NULL AND hero_image_url != ''
       ORDER BY hero_image_url ASC
       LIMIT ?`
    )
    .bind(limit)
    .all<{ hero_image_url: string }>();
  const seen = new Set(media.map((item) => item.public_url));
  const existing = results
    .filter((row) => !seen.has(row.hero_image_url))
    .map((row, index) => ({
      id: `category-url-${index}`,
      account_id: null,
      filename: row.hero_image_url.split("/").pop() || row.hero_image_url,
      content_type: "external/url",
      byte_size: 0,
      public_url: row.hero_image_url,
      source: "category",
      purpose: "category_image" as const,
      alt_text: null,
      created_at: "",
    }));
  return [...media, ...existing].slice(0, limit);
}

export async function updateListing(id: number, fields: Partial<AdminListing>): Promise<void> {
  const db = await getD1();
  const allowed = [
    "title", "tagline", "description", "promo",
    "contact_name", "phone", "mobile", "email", "web", "image_url",
    "location", "location_city", "location_state",
    "status", "listing_type", "business_id", "unclaimed_flag", "hide_contact",
    "confidence_score",
    "abn", "licence_no", "facebook_url", "instagram_url",
    "tiktok_url", "youtube_url", "linkedin_url",
    "trading_hours", "contact_hours", "ai_moderation_status",
  ];
  const updates = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!updates.length) return;

  const set = updates.map((k) => `${k} = ?`).join(", ");
  const vals = updates.map((k) => (fields as Record<string, unknown>)[k]);

  await db.prepare(`UPDATE listings SET ${set}, updated_at = datetime('now') WHERE id = ?`).bind(...vals, id).run();
}

export async function createListing(fields: {
  title: string;
  businessId?: number | null;
  status?: string;
  listingType?: string;
  locationCity?: string | null;
}): Promise<number | null> {
  const db = await getD1();
  const created = await db
    .prepare(
      `INSERT INTO listings (title, business_id, status, listing_type, location_city)
       VALUES (?, ?, ?, ?, ?)
       RETURNING id`
    )
    .bind(
      fields.title,
      fields.businessId ?? null,
      fields.status ?? "pending",
      fields.listingType ?? "standard",
      fields.locationCity ?? null,
    )
    .first<{ id: number }>();
  return created?.id ?? null;
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
  contact_name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  status: string | null;
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

export async function listBusinesses(search?: string, sort = "name_asc"): Promise<AdminBusiness[]> {
  const db = await getD1();
  const where = search ? "WHERE b.name LIKE ?" : "";
  const params = search ? [`%${search}%`] : [];
  const orderBy = {
    name_asc: "b.name ASC",
    name_desc: "b.name DESC",
    listings_desc: "listing_count DESC, b.name ASC",
    listings_asc: "listing_count ASC, b.name ASC",
    newest: "b.id DESC",
  }[sort] ?? "b.name ASC";

  const { results } = await db
    .prepare(
      `SELECT b.id, b.name, b.description, b.logo_url, b.website,
              b.contact_name, b.phone, b.mobile, b.email,
              b.facebook_url, b.instagram_url, b.tiktok_url, b.youtube_url, b.linkedin_url,
              COALESCE(b.status, 'active') AS status,
              b.advertiser_id, b.merged_into_business_id,
              COUNT(l.id) AS listing_count
       FROM businesses b
       LEFT JOIN listings l ON l.business_id = b.id AND l.deleted_at IS NULL
       ${where}
       GROUP BY b.id
       ORDER BY ${orderBy}`
    )
    .bind(...params)
    .all<AdminBusiness>();
  return results;
}

export async function getBusinessById(id: number): Promise<AdminBusiness | null> {
  const db = await getD1();
  return db
    .prepare(
      `SELECT b.id, b.name, b.description, b.logo_url, b.website,
              b.contact_name, b.phone, b.mobile, b.email,
              b.facebook_url, b.instagram_url, b.tiktok_url, b.youtube_url, b.linkedin_url,
              b.advertiser_id,
              COALESCE(b.status, 'active') AS status,
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
  const allowed = [
    "name", "description", "logo_url", "website",
    "contact_name", "phone", "mobile", "email",
    "facebook_url", "instagram_url", "tiktok_url", "youtube_url", "linkedin_url",
    "status",
  ];
  const updates = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!updates.length) return;
  const set = updates.map((k) => `${k} = ?`).join(", ");
  const vals = updates.map((k) => (fields as Record<string, unknown>)[k]);
  await db.prepare(`UPDATE businesses SET ${set}, updated_at = datetime('now') WHERE id = ?`).bind(...vals, id).run();
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
  seo_intro: string | null;
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
  const allowed = ["label", "description", "banner_row_count", "seo_title", "seo_description", "seo_intro", "hero_image_url", "sort_order"];
  const updates = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!updates.length) return;

  const set = updates.map((k) => `${k} = ?`).join(", ");
  const vals = updates.map((k) => (fields as Record<string, unknown>)[k]);

  await db.prepare(`UPDATE categories SET ${set} WHERE slug = ?`).bind(...vals, slug).run();
}

export async function deleteCategory(slug: string): Promise<void> {
  const db = await getD1();
  await db.batch([
    db.prepare("DELETE FROM listing_placements WHERE category_slug = ?").bind(slug),
    db.prepare("DELETE FROM categories WHERE slug = ?").bind(slug),
  ]);
}

export async function createCategory(fields: {
  slug: string;
  label: string;
  sortOrder?: number | null;
  bannerRowCount?: number | null;
}): Promise<void> {
  const db = await getD1();
  await db
    .prepare(
      `INSERT INTO categories (slug, label, sort_order, banner_row_count)
       VALUES (?, ?, ?, ?)`
    )
    .bind(fields.slug, fields.label, fields.sortOrder ?? 0, fields.bannerRowCount ?? 1)
    .run();
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

export async function deleteCity(slug: string): Promise<void> {
  const db = await getD1();
  await db.batch([
    db.prepare("DELETE FROM listing_placements WHERE city_slug = ?").bind(slug),
    db.prepare("DELETE FROM cities WHERE slug = ?").bind(slug),
  ]);
}

export async function createCity(fields: {
  slug: string;
  label: string;
  state?: string | null;
  region?: string | null;
}): Promise<void> {
  const db = await getD1();
  await db
    .prepare(
      `INSERT INTO cities (slug, label, state, region)
       VALUES (?, ?, ?, ?)`
    )
    .bind(fields.slug, fields.label, fields.state ?? null, fields.region ?? null)
    .run();
}

export async function getNoImageListings(limit = 100): Promise<ToolListing[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT l.id, l.title, l.image_url, l.confidence_score, l.status,
              b.name AS business_name
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       WHERE l.deleted_at IS NULL AND (l.image_url IS NULL OR l.image_url = '')
       ORDER BY l.id DESC
       LIMIT ?`
    )
    .bind(limit)
    .all<ToolListing>();
  return results;
}

export async function getLowConfidenceListings(threshold = 70, limit = 100): Promise<ToolListing[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT l.id, l.title, l.image_url, l.confidence_score, l.status,
              b.name AS business_name
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       WHERE l.deleted_at IS NULL AND l.confidence_score IS NOT NULL AND l.confidence_score < ?
       ORDER BY l.confidence_score ASC
       LIMIT ?`
    )
    .bind(threshold, limit)
    .all<ToolListing>();
  return results;
}

export async function getUnplacedListings(limit = 100): Promise<ToolListing[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT l.id, l.title, l.image_url, l.confidence_score, l.status,
              b.name AS business_name
       FROM listings l
       LEFT JOIN businesses b ON b.id = l.business_id
       WHERE l.deleted_at IS NULL
         AND NOT EXISTS (SELECT 1 FROM listing_placements lp WHERE lp.listing_id = l.id)
       ORDER BY l.id DESC
       LIMIT ?`
    )
    .bind(limit)
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
  account_id: string | null;
  push_platform: string | null;
  push_id: string | null;
  push_url: string | null;
  push_at: string | null;
  registration_mode: string | null;
  is_visible: number;
  created_at: string;
  updated_at: string;
}

// ── Advertiser Accounts / Users ────────────────────────────────────────────

export interface AdminAdvertiserAccount {
  id: string;
  clerk_user_id: string;
  business_id: number | null;
  display_name: string | null;
  portal_email: string | null;
  account_role: "super_admin" | "admin" | "advertiser";
  plan: string;
  sub_status: string;
  billing_email: string | null;
  created_at: string;
  updated_at: string;
  businesses: string | null;
  business_count: number;
}

export type AdminAccountProfile = Pick<
  AdminAdvertiserAccount,
  "id" | "clerk_user_id" | "display_name" | "portal_email" | "billing_email" | "account_role" | "plan" | "sub_status" | "created_at" | "updated_at"
>;

async function tableHasColumn(tableName: string, columnName: string): Promise<boolean> {
  const db = await getD1();
  const { results } = await db.prepare(`PRAGMA table_info(${tableName})`).all<{ name: string }>();
  return results.some((column) => column.name === columnName);
}

export async function getAdminAccountById(accountId: string): Promise<AdminAccountProfile | null> {
  const db = await getD1();
  const hasAccountRole = await tableHasColumn("advertiser_accounts", "account_role");
  const roleExpr = hasAccountRole ? "COALESCE(account_role, 'advertiser')" : "'admin'";
  const row = await db
    .prepare(
      `SELECT id, clerk_user_id, display_name, portal_email, billing_email,
              ${roleExpr} AS account_role,
              plan, sub_status, created_at, updated_at
       FROM advertiser_accounts
       WHERE id = ?`
    )
    .bind(accountId)
    .first<AdminAccountProfile>();
  return row ?? null;
}

export async function findAdminAccountForLogin(): Promise<AdminAccountProfile | null> {
  const db = await getD1();
  const hasAccountRole = await tableHasColumn("advertiser_accounts", "account_role");
  const roleExpr = hasAccountRole ? "COALESCE(account_role, 'advertiser')" : "'admin'";
  const configuredId = process.env.ADMIN_ACCOUNT_ID;
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredClerkId = process.env.ADMIN_CLERK_USER_ID;
  const conditions: string[] = [];
  const params: string[] = [];

  if (configuredId) {
    conditions.push("id = ?");
    params.push(configuredId);
  }
  if (configuredClerkId) {
    conditions.push("clerk_user_id = ?");
    params.push(configuredClerkId);
  }
  if (configuredEmail) {
    conditions.push("(portal_email = ? OR billing_email = ?)");
    params.push(configuredEmail, configuredEmail);
  }

  const configuredWhere = conditions.length ? `AND (${conditions.join(" OR ")})` : "";
  const configured = conditions.length
    ? await db
        .prepare(
          `SELECT id, clerk_user_id, display_name, portal_email, billing_email,
                  ${roleExpr} AS account_role,
                  plan, sub_status, created_at, updated_at
           FROM advertiser_accounts
           WHERE ${hasAccountRole ? "COALESCE(account_role, 'advertiser') IN ('super_admin', 'admin')" : "1 = 1"}
             ${configuredWhere}
           ORDER BY ${hasAccountRole ? "CASE COALESCE(account_role, 'advertiser') WHEN 'super_admin' THEN 0 ELSE 1 END," : ""}
                    updated_at DESC
           LIMIT 1`
        )
        .bind(...params)
        .first<AdminAccountProfile>()
    : null;
  if (configured) return configured;

  const fallback = await db
    .prepare(
      `SELECT id, clerk_user_id, display_name, portal_email, billing_email,
              ${roleExpr} AS account_role,
              plan, sub_status, created_at, updated_at
       FROM advertiser_accounts
       WHERE ${hasAccountRole ? "COALESCE(account_role, 'advertiser') IN ('super_admin', 'admin')" : "1 = 1"}
       ORDER BY ${hasAccountRole ? "CASE COALESCE(account_role, 'advertiser') WHEN 'super_admin' THEN 0 ELSE 1 END," : ""}
                updated_at DESC
       LIMIT 1`
    )
    .first<AdminAccountProfile>();
  return fallback ?? null;
}

export async function listAdvertiserAccounts(opts: {
  search?: string;
  plan?: string;
  status?: string;
  role?: string;
  sort?: string;
} = {}): Promise<AdminAdvertiserAccount[]> {
  const db = await getD1();
  const hasAccountRole = await tableHasColumn("advertiser_accounts", "account_role");
  const roleExpr = hasAccountRole ? "COALESCE(a.account_role, 'advertiser')" : "'advertiser'";
  const params: string[] = [];
  const conditions: string[] = [];
  if (opts.search) {
    conditions.push("(a.display_name LIKE ? OR a.portal_email LIKE ? OR a.billing_email LIKE ? OR a.clerk_user_id LIKE ? OR b.name LIKE ?)");
    params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.plan && opts.plan !== "all") {
    conditions.push("a.plan = ?");
    params.push(opts.plan);
  }
  if (opts.status && opts.status !== "all") {
    conditions.push("a.sub_status = ?");
    params.push(opts.status);
  }
  if (opts.role && opts.role !== "all") {
    if (!hasAccountRole && opts.role !== "advertiser") return [];
    conditions.push(`${roleExpr} = ?`);
    params.push(opts.role);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderBy = {
    name_asc: "COALESCE(NULLIF(a.display_name, ''), a.portal_email, a.billing_email, a.clerk_user_id) ASC",
    name_desc: "COALESCE(NULLIF(a.display_name, ''), a.portal_email, a.billing_email, a.clerk_user_id) DESC",
    email_asc: "COALESCE(a.portal_email, a.billing_email, '') ASC",
    newest: "a.created_at DESC",
    updated: "a.updated_at DESC",
    businesses_desc: "business_count DESC, COALESCE(NULLIF(a.display_name, ''), a.portal_email, a.billing_email, a.clerk_user_id) ASC",
  }[opts.sort ?? "name_asc"] ?? "COALESCE(NULLIF(a.display_name, ''), a.portal_email, a.billing_email, a.clerk_user_id) ASC";

  const { results } = await db
    .prepare(
      `SELECT a.id, a.clerk_user_id, a.business_id, ${roleExpr} AS account_role, a.plan, a.sub_status,
              a.display_name, a.portal_email, a.billing_email, a.created_at, a.updated_at,
              GROUP_CONCAT(DISTINCT b.id || ':' || b.name || ':' || COALESCE(aab.role, 'owner') || ':' || COALESCE(aab.is_primary, 0)) AS businesses,
              COUNT(DISTINCT b.id) AS business_count
       FROM advertiser_accounts a
       LEFT JOIN advertiser_account_businesses aab ON aab.account_id = a.id AND aab.status = 'active'
       LEFT JOIN businesses b ON b.id = aab.business_id OR b.id = a.business_id
       ${where}
       GROUP BY a.id
       ORDER BY ${orderBy}`
    )
    .bind(...params)
    .all<AdminAdvertiserAccount>();
  return results;
}

export async function createBusiness(fields: {
  name: string;
  website?: string | null;
  description?: string | null;
  logoUrl?: string | null;
}): Promise<number | null> {
  const db = await getD1();
  const created = await db
    .prepare(
      `INSERT INTO businesses (name, website, description, logo_url)
       VALUES (?, ?, ?, ?)
       RETURNING id`
    )
    .bind(fields.name, fields.website ?? null, fields.description ?? null, fields.logoUrl ?? null)
    .first<{ id: number }>();
  return created?.id ?? null;
}

export async function createAdvertiserAccount(fields: {
  clerkUserId: string;
  displayName?: string | null;
  portalEmail?: string | null;
  billingEmail?: string | null;
  plan?: string;
  businessId?: number | null;
  role?: string;
  isPrimary?: boolean;
}): Promise<string | null> {
  const db = await getD1();
  const created = await db
    .prepare(
      `INSERT INTO advertiser_accounts (clerk_user_id, display_name, portal_email, billing_email, plan)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(clerk_user_id) DO UPDATE SET
         display_name = COALESCE(excluded.display_name, advertiser_accounts.display_name),
         portal_email = COALESCE(excluded.portal_email, advertiser_accounts.portal_email),
         billing_email = COALESCE(excluded.billing_email, advertiser_accounts.billing_email),
         updated_at = datetime('now')
       RETURNING id`
    )
    .bind(
      fields.clerkUserId,
      fields.displayName ?? null,
      fields.portalEmail ?? fields.billingEmail ?? null,
      fields.billingEmail ?? fields.portalEmail ?? null,
      fields.plan ?? "free",
    )
    .first<{ id: string }>();

  if (!created) return null;
  if (fields.businessId) {
    await linkAccountBusiness(created.id, fields.businessId, fields.role ?? "owner", fields.isPrimary ?? true);
  }
  return created.id;
}

export async function updateAdvertiserAccount(
  accountId: string,
  fields: {
    displayName?: string | null;
    portalEmail?: string | null;
    billingEmail?: string | null;
  },
): Promise<void> {
  const db = await getD1();
  await db
    .prepare(
      `UPDATE advertiser_accounts
       SET display_name = ?,
           portal_email = ?,
           billing_email = ?,
           updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(fields.displayName ?? null, fields.portalEmail ?? null, fields.billingEmail ?? null, accountId)
    .run();
}

export async function updateAdvertiserAccountStatus(accountId: string, subStatus: string): Promise<void> {
  const db = await getD1();
  await db
    .prepare("UPDATE advertiser_accounts SET sub_status = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(subStatus, accountId)
    .run();
}

export async function linkAccountBusiness(
  accountId: string,
  businessId: number,
  role = "owner",
  isPrimary = false,
): Promise<void> {
  const db = await getD1();
  const batch = [];
  if (isPrimary) {
    batch.push(
      db.prepare("UPDATE advertiser_account_businesses SET is_primary = 0 WHERE account_id = ?").bind(accountId),
      db.prepare("UPDATE advertiser_accounts SET business_id = ?, updated_at = datetime('now') WHERE id = ?").bind(businessId, accountId),
    );
  }
  batch.push(
    db
      .prepare(
        `INSERT INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status)
         VALUES (?, ?, ?, ?, 'active')
         ON CONFLICT(account_id, business_id) DO UPDATE SET
           role = excluded.role,
           is_primary = excluded.is_primary,
           status = 'active',
           updated_at = datetime('now')`
      )
      .bind(accountId, businessId, role, isPrimary ? 1 : 0),
  );
  await db.batch(batch);
}

export async function unlinkAccountBusiness(accountId: string, businessId: number): Promise<void> {
  const db = await getD1();
  await db.batch([
    db.prepare("DELETE FROM advertiser_account_businesses WHERE account_id = ? AND business_id = ?").bind(accountId, businessId),
    db.prepare("UPDATE advertiser_accounts SET business_id = NULL, updated_at = datetime('now') WHERE id = ? AND business_id = ?").bind(accountId, businessId),
  ]);
}

// ── Business claim requests ────────────────────────────────────────────────

export interface AdminBusinessClaimRequest {
  id: string;
  account_id: string;
  clerk_user_id: string;
  portal_email: string | null;
  business_name: string;
  website: string | null;
  city: string | null;
  contact_email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  resolved_business_id: number | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export async function listBusinessClaimRequests(status = "pending"): Promise<AdminBusinessClaimRequest[]> {
  const db = await getD1();
  const where = status === "all" ? "" : "WHERE status = ?";
  const params = status === "all" ? [] : [status];
  const { results } = await db
    .prepare(
      `SELECT *
       FROM business_claim_requests
       ${where}
       ORDER BY created_at DESC`
    )
    .bind(...params)
    .all<AdminBusinessClaimRequest>();
  return results;
}

export async function approveBusinessClaimRequest(id: string): Promise<number | null> {
  const db = await getD1();
  const request = await db
    .prepare("SELECT * FROM business_claim_requests WHERE id = ?")
    .bind(id)
    .first<AdminBusinessClaimRequest>();
  if (!request || request.status !== "pending") return null;

  const created = await db
    .prepare(
      `INSERT INTO businesses (name, website, description)
       VALUES (?, ?, ?)
       RETURNING id`
    )
    .bind(request.business_name, request.website, request.message)
    .first<{ id: number }>();
  if (!created) return null;

  await linkAccountBusiness(request.account_id, created.id, "owner", true);
  await db
    .prepare(
      `UPDATE business_claim_requests
       SET status = 'approved',
           resolved_business_id = ?,
           resolved_at = datetime('now'),
           updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(created.id, id)
    .run();
  return created.id;
}

export async function rejectBusinessClaimRequest(id: string, notes?: string): Promise<void> {
  const db = await getD1();
  await db
    .prepare(
      `UPDATE business_claim_requests
       SET status = 'rejected',
           admin_notes = ?,
           resolved_at = datetime('now'),
           updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(notes ?? null, id)
    .run();
}

const EVENT_UPDATE_ALLOWLIST = new Set([
  "title", "slug", "description", "starts_at", "ends_at", "timezone",
  "venue_name", "address", "suburb", "city", "state",
  "price_min", "price_max", "ticket_url", "image_url",
  "source_url", "category", "status", "submitted_by", "account_id",
  "registration_mode",
]);

export async function listEvents(opts: {
  status?: string;
  search?: string;
  city?: string;
  source?: string;
  sort?: string;
  page?: number;
  limit?: number;
} = {}): Promise<AdminEvent[]> {
  const db = await getD1();
  const limit = opts.limit ?? 50;
  const offset = ((opts.page ?? 1) - 1) * limit;
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (opts.status) { conditions.push("status = ?"); params.push(opts.status); }
  if (opts.search) {
    conditions.push("(title LIKE ? OR venue_name LIKE ? OR city LIKE ? OR category LIKE ?)");
    params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.city) { conditions.push("city = ?"); params.push(opts.city); }
  if (opts.source) { conditions.push("source = ?"); params.push(opts.source); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const EVENT_ORDER: Record<string, string> = {
    date_desc: "starts_at DESC",
    title_asc: "title ASC",
    title_desc: "title DESC",
    city_asc: "city ASC, starts_at ASC",
    status: "status ASC, starts_at ASC",
  };
  const eventOrderBy = EVENT_ORDER[opts.sort ?? ""] ?? "starts_at ASC";
  const { results } = await db
    .prepare(`SELECT * FROM events ${where} ORDER BY ${eventOrderBy} LIMIT ? OFFSET ?`)
    .bind(...params, limit, offset)
    .all<AdminEvent>();
  return results;
}

export async function countEvents(opts: { status?: string; search?: string; city?: string; source?: string } = {}): Promise<number> {
  const db = await getD1();
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (opts.status) { conditions.push("status = ?"); params.push(opts.status); }
  if (opts.search) {
    conditions.push("(title LIKE ? OR venue_name LIKE ? OR city LIKE ? OR category LIKE ?)");
    params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.city) { conditions.push("city = ?"); params.push(opts.city); }
  if (opts.source) { conditions.push("source = ?"); params.push(opts.source); }

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
  const slug = fields.slug ?? canonicalEventSlug({
    id,
    title: fields.title ?? "event",
    starts_at: fields.starts_at ?? new Date().toISOString(),
    city: fields.city,
  });
  await db
    .prepare(`INSERT INTO events (id, title, slug, description, starts_at, ends_at, timezone, venue_name, address, suburb, city, state, price_min, price_max, ticket_url, image_url, source, source_id, source_url, category, status, submitted_by, account_id, registration_mode)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
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
      fields.account_id ?? null,
      fields.registration_mode ?? "auto",
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

// ── Integrations ─────────────────────────────────────────────────────────────

export type IntegrationPlatform = "eventbrite" | "meetup" | "humanitix" | "trybooking" | "ical";

export interface Integration {
  id: string;
  account_id: string;
  platform: IntegrationPlatform;
  access_token: string | null;
  refresh_token: string | null;
  token_expiry: string | null;
  config: string | null;
  last_synced: string | null;
  sync_status: "idle" | "syncing" | "error";
  sync_error: string | null;
  auto_approve: number;
  push_enabled: number;
  created_at: string;
  updated_at: string;
}

export interface AdminIntegrationHealth extends Integration {
  billing_email: string | null;
  business_name: string | null;
  event_count: number;
}

export async function listAdminIntegrations(opts: {
  search?: string;
  platform?: string;
  status?: string;
  sort?: string;
} = {}): Promise<AdminIntegrationHealth[]> {
  const db = await getD1();
  await ensureEventExternalRefsTable(db);
  const conditions: string[] = [];
  const params: string[] = [];
  if (opts.search) {
    conditions.push("(a.billing_email LIKE ? OR b.name LIKE ? OR i.account_id LIKE ?)");
    params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.platform) {
    conditions.push("i.platform = ?");
    params.push(opts.platform);
  }
  if (opts.status) {
    conditions.push("i.sync_status = ?");
    params.push(opts.status);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const INTEGRATION_ORDER: Record<string, string> = {
    updated_desc: "i.updated_at DESC",
    updated_asc: "i.updated_at ASC",
    platform_asc: "i.platform ASC, i.updated_at DESC",
    status: "i.sync_status ASC, i.updated_at DESC",
    events_desc: "event_count DESC, i.updated_at DESC",
    account_asc: "COALESCE(b.name, a.billing_email, i.account_id) ASC",
  };
  const orderBy = INTEGRATION_ORDER[opts.sort ?? ""] ?? INTEGRATION_ORDER.updated_desc;
  const { results } = await db.prepare(`
    SELECT i.*,
           a.billing_email,
           b.name AS business_name,
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
    LEFT JOIN advertiser_accounts a ON a.id = i.account_id
    LEFT JOIN businesses b ON b.id = a.business_id
    ${where}
    GROUP BY i.id
    ORDER BY ${orderBy}
  `).bind(...params).all<AdminIntegrationHealth>();
  return results;
}

export interface AdminBanner {
  id: string;
  account_id: string | null;
  title: string | null;
  image_url: string;
  link_url: string | null;
  click_url: string | null;
  alt_text: string | null;
  status: string | null;
  placement: string | null;
  created_at: string | null;
  billing_email: string | null;
  business_name: string | null;
}

export async function listAdminBanners(opts: {
  search?: string;
  status?: string;
  placement?: string;
  sort?: string;
} = {}): Promise<AdminBanner[]> {
  const db = await getD1();
  const conditions: string[] = [];
  const params: string[] = [];
  if (opts.search) {
    conditions.push("(bn.title LIKE ? OR bn.image_url LIKE ? OR bn.link_url LIKE ? OR bn.click_url LIKE ? OR a.billing_email LIKE ? OR b.name LIKE ?)");
    params.push(
      `%${opts.search}%`,
      `%${opts.search}%`,
      `%${opts.search}%`,
      `%${opts.search}%`,
      `%${opts.search}%`,
      `%${opts.search}%`,
    );
  }
  if (opts.status) {
    conditions.push("COALESCE(bn.status, 'active') = ?");
    params.push(opts.status);
  }
  if (opts.placement) {
    conditions.push("(bn.placement = ? OR bn.page_scope = ? OR bn.category_slug = ? OR bn.city_slug = ?)");
    params.push(opts.placement, opts.placement, opts.placement, opts.placement);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderBy = {
    newest: "COALESCE(bn.created_at, '') DESC, bn.id DESC",
    oldest: "COALESCE(bn.created_at, '') ASC, bn.id ASC",
    title_asc: "COALESCE(bn.title, bn.alt_text, '') ASC, bn.id DESC",
    status: "COALESCE(bn.status, 'active') ASC, COALESCE(bn.created_at, '') DESC",
  }[opts.sort ?? "newest"] ?? "COALESCE(bn.created_at, '') DESC, bn.id DESC";
  const { results } = await db
    .prepare(
      `SELECT bn.id, bn.account_id, bn.title, bn.image_url, bn.link_url, bn.click_url, bn.alt_text,
              COALESCE(bn.status, 'active') AS status,
              bn.placement, bn.created_at,
              a.billing_email,
              b.name AS business_name
       FROM banners bn
       LEFT JOIN advertiser_accounts a ON a.id = bn.account_id
       LEFT JOIN businesses b ON b.id = a.business_id
       ${where}
       ORDER BY ${orderBy}`
    )
    .bind(...params)
    .all<AdminBanner>();
  return results;
}

export async function updateBanner(id: string | number, status: string): Promise<void> {
  const db = await getD1();
  await db.prepare(`UPDATE banners SET status = ? WHERE id = ?`).bind(status, String(id)).run();
}

export async function deleteBanner(id: string | number): Promise<void> {
  const db = await getD1();
  await db.prepare(`DELETE FROM banners WHERE id = ?`).bind(String(id)).run();
}

export async function createAdminBanner(fields: {
  imageUrl: string;
  linkUrl?: string | null;
  title?: string | null;
  status?: string;
  placement?: string | null;
}): Promise<string | number | null> {
  const db = await getD1();
  const created = await db
    .prepare(
      `INSERT INTO banners (image_url, link_url, title, status, placement, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))
       RETURNING id`
    )
    .bind(fields.imageUrl, fields.linkUrl ?? null, fields.title ?? null, fields.status ?? "pending", fields.placement ?? null)
    .first<{ id: string | number }>();
  return created?.id ?? null;
}

export async function listAdminBannerPlacements(): Promise<string[]> {
  const db = await getD1();
  const { results } = await db
    .prepare(
      `SELECT DISTINCT value
       FROM (
         SELECT placement AS value FROM banners WHERE placement IS NOT NULL AND placement != ''
         UNION
         SELECT page_scope AS value FROM banners WHERE page_scope IS NOT NULL AND page_scope != ''
         UNION
         SELECT category_slug AS value FROM banners WHERE category_slug IS NOT NULL AND category_slug != ''
         UNION
         SELECT city_slug AS value FROM banners WHERE city_slug IS NOT NULL AND city_slug != ''
       )
       ORDER BY value ASC`
    )
    .all<{ value: string }>();
  return results.map((row) => row.value);
}

export async function getIntegrationById(id: string): Promise<Integration | null> {
  const db = await getD1();
  return db.prepare("SELECT * FROM integrations WHERE id = ?").bind(id).first<Integration>() ?? null;
}

export async function listRunnableIntegrations(): Promise<Integration[]> {
  const db = await getD1();
  const { results } = await db
    .prepare("SELECT * FROM integrations WHERE sync_status != 'syncing' ORDER BY updated_at ASC")
    .all<Integration>();
  return results;
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

export async function listRedirects(limit = 100): Promise<AdminRedirect[]> {
  const db = await getD1();
  const { results } = await db
    .prepare("SELECT * FROM redirects ORDER BY created_at DESC LIMIT ?")
    .bind(limit)
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
