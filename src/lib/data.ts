import { getD1 } from "./db";
import { slugToLabel, toUrlSlug, toListingSlug } from "./constants";
import type { Listing, Category, City, Banner } from "./types";

const SUPPRESSED_CATEGORIES = new Set(["events"]);
const SUPPRESSED_BANNER_CATEGORIES = new Set(["nightclubs"]);

function companyMatchKey(name: string | null | undefined) {
  return (name || "")
    .toLowerCase()
    .replace(/\bfirends\b/g, "friends")
    .replace(/&/g, " and ")
    .replace(/[.…]+.*$/g, "")
    .replace(/\b(sydney|melbourne|brisbane|perth|adelaide|canberra|hobart|darwin|gold coast|sunshine coast|central coast|newcastle|wollongong|geelong|cairns|toowoomba|byron bay)\b/g, "")
    .replace(/\b(north|south|east|west|metro|metropolitan|cbd|city)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Listings ─────────────────────────────────────────────────────────────────

export async function getListingsForCategory(categoryDbSlug: string): Promise<Listing[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           b.name    AS business_name,
           b.website AS business_website,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.city_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.category_slug = ?
               AND p2.city_slug IS NOT NULL
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id
               AND p2.category_slug = ?
               AND p2.city_slug IS NOT NULL
           ) AS city_labels
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE category_slug = ?
    ) p ON p.listing_id = l.id
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status = 'active'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 300
  `).bind(categoryDbSlug, categoryDbSlug, categoryDbSlug).all<Listing>();
  return results;
}

export async function getListingsForPage(
  categoryDbSlug: string,
  cityDbSlug: string | null
): Promise<Listing[]> {
  const db = await getD1();
  const cityClause = cityDbSlug ? "AND city_slug = ?" : "AND city_slug IS NULL";
  const baseArgs: (string | null)[] = [categoryDbSlug, cityDbSlug, cityDbSlug, categoryDbSlug, categoryDbSlug, categoryDbSlug];
  const args = cityDbSlug ? [...baseArgs, cityDbSlug] : baseArgs;

  const { results } = await db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           b.name    AS business_name,
           b.website AS business_website,
           ? AS category_slug,
           ? AS city_slug,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.category_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.city_slug = ?
               AND p2.category_slug IS NOT NULL
           ) AS category_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.city_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.category_slug = ?
               AND p2.city_slug IS NOT NULL
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id
               AND p2.category_slug = ?
               AND p2.city_slug IS NOT NULL
           ) AS city_labels
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE category_slug = ? ${cityClause}
    ) p ON p.listing_id = l.id
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status = 'active'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 200
  `).bind(...args).all<Listing>();
  return results;
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           b.name AS business_name, b.website AS business_website
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.confidence_score >= 80 AND l.email != '' AND l.status = 'active'
    ORDER BY l.confidence_score DESC
    LIMIT ?
  `).bind(limit).all<Listing>();
  return results;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE p.category_slug IS NOT NULL
    GROUP BY p.category_slug
    ORDER BY listing_count DESC
  `).bind().all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_intro: string | null; listing_count: number;
  }>();
  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.slug))
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getCategoryMeta(dbSlug: string): Promise<Category | null> {
  const db = await getD1();
  const row = await db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE p.category_slug = ?
    GROUP BY p.category_slug
  `).bind(dbSlug).first<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_intro: string | null; listing_count: number;
  }>();
  if (!row) return null;
  return { ...row, label: row.label || slugToLabel(row.slug) };
}

// ── Cities ────────────────────────────────────────────────────────────────────

export async function getAllCities(): Promise<City[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE p.city_slug IS NOT NULL
    GROUP BY p.city_slug
    ORDER BY listing_count DESC
  `).bind().all<{ slug: string; label: string | null; state: string | null; listing_count: number }>();
  return results.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getCitiesForCategory(categoryDbSlug: string): Promise<City[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE p.category_slug = ? AND p.city_slug IS NOT NULL
    GROUP BY p.city_slug
    ORDER BY listing_count DESC
  `).bind(categoryDbSlug).all<{ slug: string; label: string | null; state: string | null; listing_count: number }>();
  return results.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getListingsForCity(cityDbSlug: string): Promise<Listing[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           b.name    AS business_name,
           b.website AS business_website,
           ? AS city_slug,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.category_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.city_slug = ?
               AND p2.category_slug IS NOT NULL
           ) AS category_slugs
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE city_slug = ?
    ) p ON p.listing_id = l.id
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status = 'active'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 200
  `).bind(cityDbSlug, cityDbSlug, cityDbSlug).all<Listing>();
  return results;
}

export async function getListingById(id: number): Promise<Listing | null> {
  const db = await getD1();
  const suppressed = [...SUPPRESSED_CATEGORIES];
  const placeholders = suppressed.map(() => "?").join(",");
  return db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.contact_name, l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           l.licence_no, l.abn,
           l.facebook_url, l.instagram_url, l.tiktok_url,
           l.youtube_url, l.linkedin_url,
           l.trading_hours, l.contact_hours,
           b.name    AS business_name,
           b.website AS business_website,
           p.category_slug,
           p.city_slug,
           c.label   AS category_label,
           ci.label  AS city_label,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.category_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.category_slug IS NOT NULL
               AND p2.category_slug NOT IN (${placeholders})
           ) AS category_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT p3.city_slug)
             FROM listing_placements p3
             WHERE p3.listing_id = l.id
               AND p3.city_slug IS NOT NULL
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci3.label, p4.city_slug))
             FROM listing_placements p4
             LEFT JOIN cities ci3 ON ci3.slug = p4.city_slug
             WHERE p4.listing_id = l.id
               AND p4.city_slug IS NOT NULL
           ) AS city_labels
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    LEFT JOIN listing_placements p ON p.listing_id = l.id
    LEFT JOIN categories c ON c.slug = p.category_slug
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE l.id = ? AND l.status = 'active'
    LIMIT 1
  `).bind(...suppressed, id).first<Listing>() ?? null;
}

export interface ListingPlacement {
  category_slug: string;
  city_slug: string | null;
  category_label: string | null;
  city_label: string | null;
}

export async function getListingPlacements(listingId: number): Promise<ListingPlacement[]> {
  const db = await getD1();
  const suppressed = [...SUPPRESSED_CATEGORIES];
  const placeholders = suppressed.map(() => "?").join(",");
  const { results } = await db.prepare(`
    SELECT p.category_slug, p.city_slug,
           c.label AS category_label,
           ci.label AS city_label
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE p.listing_id = ?
      AND (p.category_slug IS NULL OR p.category_slug NOT IN (${placeholders}))
    ORDER BY p.category_slug, p.city_slug
  `).bind(listingId, ...suppressed).all<ListingPlacement>();
  return results;
}

export async function getBusinessListings(businessId: number, excludeId: number, businessName?: string | null): Promise<Listing[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT DISTINCT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           b.name AS business_name, b.website AS business_website,
           NULL AS category_slug, NULL AS city_slug,
           NULL AS category_label, NULL AS city_label,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.category_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.category_slug IS NOT NULL
           ) AS category_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.city_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.city_slug IS NOT NULL
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id
               AND p2.city_slug IS NOT NULL
           ) AS city_labels
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.id != ? AND l.status = 'active'
    ORDER BY l.confidence_score DESC
  `).bind(excludeId).all<Listing>();

  const parentKey = companyMatchKey(businessName);
  const seen = new Set<number>();
  return results.filter((row) => {
    const isSameBusiness = row.business_id === businessId;
    const isSameParentName = parentKey
      ? companyMatchKey(row.business_name || row.title) === parentKey
      : false;
    if (!isSameBusiness && !isSameParentName) return false;
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

export async function getAllListingParams(): Promise<{ slug: string }[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT l.id, l.title, b.name AS business_name
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status = 'active'
    ORDER BY l.id
  `).bind().all<{ id: number; title: string; business_name: string | null }>();
  return results.map((r) => ({ slug: toListingSlug(r.id, r.business_name || r.title) }));
}

export async function getRelatedListings(categorySlug: string, citySlug: string | null, excludeId: number, limit = 4): Promise<Listing[]> {
  const db = await getD1();
  const cityClause = citySlug ? "AND p.city_slug = ?" : "AND p.city_slug IS NULL";
  const args = citySlug ? [categorySlug, citySlug, excludeId, limit] : [categorySlug, excludeId, limit];
  const { results } = await db.prepare(`
    SELECT DISTINCT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           b.name AS business_name, b.website AS business_website,
           NULL AS category_slug, NULL AS city_slug,
           NULL AS category_label, NULL AS city_label
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    JOIN listing_placements p ON p.listing_id = l.id
    WHERE p.category_slug = ? ${cityClause}
      AND l.id != ?
      AND l.status = 'active'
    ORDER BY l.confidence_score DESC
    LIMIT ?
  `).bind(...args).all<Listing>();
  return results;
}

export async function getCityMeta(cityDbSlug: string): Promise<City | null> {
  const db = await getD1();
  const row = await db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE p.city_slug = ?
    GROUP BY p.city_slug
  `).bind(cityDbSlug).first<{ slug: string; label: string | null; state: string | null; listing_count: number }>();
  if (!row) return null;
  return { ...row, label: row.label || slugToLabel(row.slug) };
}

export async function getCategoriesForCity(cityDbSlug: string): Promise<Category[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE p.city_slug = ? AND p.category_slug IS NOT NULL
    GROUP BY p.category_slug
    ORDER BY listing_count DESC
  `).bind(cityDbSlug).all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_intro: string | null; listing_count: number;
  }>();
  return results.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

// ── Banners ───────────────────────────────────────────────────────────────────

export async function getBannersForPage(
  categoryDbSlug: string,
  cityDbSlug?: string | null
): Promise<Banner[]> {
  if (SUPPRESSED_BANNER_CATEGORIES.has(categoryDbSlug)) return [];

  const db = await getD1();
  const SLOTS = 12;
  const banners: Banner[] = [];
  const seen = new Set<number>();

  function addRows(rows: Banner[]) {
    for (const b of rows) {
      if (!seen.has(b.id) && banners.length < SLOTS) {
        seen.add(b.id);
        banners.push(b);
      }
    }
  }

  if (cityDbSlug) {
    const { results } = await db.prepare(`
      SELECT id, image_url, click_url, alt_text FROM banners
      WHERE page_scope = 'category' AND category_slug = ? AND city_slug = ? AND is_active = 1
      ORDER BY slot_position LIMIT ?
    `).bind(categoryDbSlug, cityDbSlug, SLOTS).all<Banner>();
    addRows(results);
    return banners;
  }

  const { results } = await db.prepare(`
    SELECT id, image_url, click_url, alt_text FROM banners
    WHERE page_scope = 'category' AND category_slug = ? AND city_slug IS NULL AND is_active = 1
    ORDER BY slot_position LIMIT ?
  `).bind(categoryDbSlug, SLOTS).all<Banner>();
  addRows(results);
  return banners;
}

export async function getBannersForCity(cityDbSlug: string): Promise<Banner[]> {
  const db = await getD1();
  const SLOTS = 12;
  const banners: Banner[] = [];
  const seen = new Set<number>();

  const { results } = await db.prepare(`
    SELECT id, image_url, click_url, alt_text FROM banners
    WHERE page_scope = 'city' AND city_slug = ? AND is_active = 1
    ORDER BY slot_position LIMIT ?
  `).bind(cityDbSlug, SLOTS).all<Banner>();
  for (const b of results) {
    if (!seen.has(b.id) && banners.length < SLOTS) {
      seen.add(b.id);
      banners.push(b);
    }
  }
  return banners;
}

// ── Static params for SSG ─────────────────────────────────────────────────────

export async function getAllCategoryParams(): Promise<{ category: string }[]> {
  const db = await getD1();
  const { results } = await db.prepare(
    "SELECT DISTINCT category_slug FROM listing_placements WHERE category_slug IS NOT NULL ORDER BY category_slug"
  ).bind().all<{ category_slug: string }>();
  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.category_slug))
    .map((r) => ({ category: toUrlSlug(r.category_slug) }));
}

export async function getAllCategoryCityParams(): Promise<{ category: string; city: string }[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT DISTINCT category_slug, city_slug FROM listing_placements
    WHERE category_slug IS NOT NULL AND city_slug IS NOT NULL
  `).bind().all<{ category_slug: string; city_slug: string }>();
  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.category_slug))
    .map((r) => ({
      category: toUrlSlug(r.category_slug),
      city: toUrlSlug(r.city_slug),
    }));
}
