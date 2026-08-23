import { getD1 } from "./db";
import { slugToLabel, toUrlSlug, toListingSlug, idFromProfileSlug } from "./constants";
import { canonicalEventSlug } from "./event-slugs";
import type { Listing, Category, City, Banner, Business } from "./types";

const SUPPRESSED_CATEGORIES = new Set(["events"]);
const SUPPRESSED_BANNER_CATEGORIES = new Set(["nightclubs"]);


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
           b.advertiser_id AS business_advertiser_id,
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
           b.advertiser_id AS business_advertiser_id,
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
           b.name AS business_name, b.website AS business_website,
           b.advertiser_id AS business_advertiser_id,
           MAX(p.city_slug) AS city_slug,
           MAX(p.category_slug) AS category_slug,
           GROUP_CONCAT(DISTINCT p.city_slug) AS city_slugs,
           GROUP_CONCAT(DISTINCT p.category_slug) AS category_slugs
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    LEFT JOIN listing_placements p ON p.listing_id = l.id
    WHERE l.confidence_score >= 80 AND l.email != '' AND l.status = 'active'
    GROUP BY l.id
    ORDER BY l.confidence_score DESC
    LIMIT ?
  `).bind(limit).all<Listing>();
  return results;
}

export async function getAllBusinessesForDirectory(): Promise<{ id: number; name: string; profile_slug: string | null }[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT b.id, b.name, b.profile_slug
    FROM businesses b
    INNER JOIN listings l ON l.business_id = b.id AND l.status = 'active'
    WHERE b.name IS NOT NULL AND b.name != ''
    GROUP BY b.id
    ORDER BY b.name ASC
  `).all<{ id: number; name: string; profile_slug: string | null }>();
  return results;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_title, c.seo_description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.category_slug IS NOT NULL
    GROUP BY p.category_slug
    ORDER BY listing_count DESC
  `).bind().all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; listing_count: number;
  }>();
  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.slug))
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getCategoryMeta(dbSlug: string): Promise<Category | null> {
  const db = await getD1();
  const row = await db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_title, c.seo_description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.category_slug = ?
    GROUP BY p.category_slug
  `).bind(dbSlug).first<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; listing_count: number;
  }>();
  if (!row) return null;
  return { ...row, label: row.label || slugToLabel(row.slug) };
}

// ── Cities ────────────────────────────────────────────────────────────────────

export async function getAllCities(): Promise<City[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state, ci.seo_title, ci.seo_description,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active' AND l.listing_type != 'online'
    WHERE p.city_slug IS NOT NULL
    GROUP BY p.city_slug
    ORDER BY listing_count DESC
  `).bind().all<{ slug: string; label: string | null; state: string | null; seo_title: string | null; seo_description: string | null; listing_count: number }>();
  return results.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getCitiesForCategory(categoryDbSlug: string): Promise<City[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state, ci.seo_title, ci.seo_description,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.category_slug = ? AND p.city_slug IS NOT NULL
    GROUP BY p.city_slug
    ORDER BY listing_count DESC
  `).bind(categoryDbSlug).all<{ slug: string; label: string | null; state: string | null; seo_title: string | null; seo_description: string | null; listing_count: number }>();
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
           b.advertiser_id AS business_advertiser_id,
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
    WHERE l.status = 'active' AND l.listing_type != 'online'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 200
  `).bind(cityDbSlug, cityDbSlug, cityDbSlug).all<Listing>();

  // Deduplicate by business_id — same business can appear in multiple categories for this city.
  // Query is ordered by confidence_score DESC so first occurrence per business wins.
  const seenBusiness = new Set<number>();
  return results.filter((l) => {
    if (!l.business_id) return true;
    if (seenBusiness.has(l.business_id)) return false;
    seenBusiness.add(l.business_id);
    return true;
  });
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
           b.advertiser_id AS business_advertiser_id,
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

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const db = await getD1();
  const suppressed = [...SUPPRESSED_CATEGORIES];
  const placeholders = suppressed.map(() => "?").join(",");
  return db.prepare(`
    SELECT l.id, l.slug, l.title, l.tagline, l.description, l.promo,
           l.contact_name, l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.status, l.confidence_score,
           l.unclaimed_flag, l.hide_contact,
           l.business_id,
           l.licence_no, l.abn,
           l.facebook_url, l.instagram_url, l.tiktok_url,
           l.youtube_url, l.linkedin_url,
           l.trading_hours, l.contact_hours,
           b.name    AS business_name,
           b.website AS business_website,
           b.advertiser_id AS business_advertiser_id,
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
    WHERE l.slug = ? AND l.status = 'active'
    LIMIT 1
  `).bind(...suppressed, slug).first<Listing>() ?? null;
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

export async function getBusinessListings(businessId: number, excludeId: number): Promise<Listing[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT DISTINCT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           b.name AS business_name, b.website AS business_website,
           b.advertiser_id AS business_advertiser_id,
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
    WHERE l.business_id = ? AND l.id != ? AND l.status = 'active'
    ORDER BY l.confidence_score DESC
  `).bind(businessId, excludeId).all<Listing>();

  return results;
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
           b.advertiser_id AS business_advertiser_id,
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
    SELECT p.city_slug AS slug, ci.label, ci.state, ci.seo_title, ci.seo_description,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active' AND l.listing_type != 'online'
    WHERE p.city_slug = ?
    GROUP BY p.city_slug
  `).bind(cityDbSlug).first<{ slug: string; label: string | null; state: string | null; seo_title: string | null; seo_description: string | null; listing_count: number }>();
  if (!row) return null;
  return { ...row, label: row.label || slugToLabel(row.slug) };
}

export async function getCategoriesForCity(cityDbSlug: string): Promise<Category[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_title, c.seo_description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.city_slug = ? AND p.category_slug IS NOT NULL
    GROUP BY p.category_slug
    ORDER BY listing_count DESC
  `).bind(cityDbSlug).all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; listing_count: number;
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

// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfileData {
  business: Business | null;
  listings: Listing[];
}

export async function getProfileData(slugOrId: string): Promise<ProfileData> {
  const db = await getD1();

  // Resolution order:
  // 1. custom profile_slug (paid upgrade, exact match)
  // 2. numeric ID suffix extracted from name-slug-{id} format
  let businessId: number | null = null;
  const customSlugRow = await db.prepare(
    "SELECT id FROM businesses WHERE profile_slug = ?"
  ).bind(slugOrId).first<{ id: number }>() ?? null;

  if (customSlugRow) {
    businessId = customSlugRow.id;
  } else {
    businessId = idFromProfileSlug(slugOrId);
  }

  if (businessId === null) return { business: null, listings: [] };

  const business = await db.prepare(`
    SELECT id, name, description, logo_url, website, advertiser_id, profile_slug
    FROM businesses WHERE id = ?
  `).bind(businessId).first<Business>() ?? null;

  const { results: listings } = await db.prepare(`
    SELECT DISTINCT l.id, l.title, l.tagline, l.description, l.promo,
           l.contact_name, l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           l.licence_no, l.abn,
           l.facebook_url, l.instagram_url, l.tiktok_url,
           l.youtube_url, l.linkedin_url,
           l.trading_hours, l.contact_hours,
           b.name AS business_name, b.website AS business_website,
           b.advertiser_id AS business_advertiser_id,
           NULL AS category_slug, NULL AS city_slug,
           NULL AS category_label, NULL AS city_label,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.category_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id AND p2.category_slug IS NOT NULL
           ) AS category_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.city_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id AND p2.city_slug IS NOT NULL
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id AND p2.city_slug IS NOT NULL
           ) AS city_labels
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.business_id = ? AND l.status = 'active'
    ORDER BY l.confidence_score DESC
    LIMIT 50
  `).bind(businessId).all<Listing>();

  return { business, listings };
}

// ── Events ────────────────────────────────────────────────────────────────────

export interface PublicEvent {
  id: string;
  slug: string | null;
  title: string;
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
  push_platform: string | null;
  push_url: string | null;
  registration_mode: string | null;
  image_url: string | null;
  source: string;
  source_url: string | null;
  category: string | null;
  account_id: string | null;
  host_business_id: number | null;
  host_business_name: string | null;
  host_business_logo_url: string | null;
  host_business_website: string | null;
  host_business_profile_slug: string | null;
  host_account_name: string | null;
}

export interface PublicEventOrganiser {
  id: string;
  name: string;
}

const PUBLIC_EVENT_FIELDS = `
  id, slug, title, description, starts_at, ends_at, timezone, venue_name, address, suburb, city, state,
  price_min, price_max, ticket_url, push_platform, push_url, registration_mode, image_url, source,
  source_url, category, account_id,
  (
    SELECT b.id
    FROM advertiser_accounts aa
    LEFT JOIN advertiser_account_businesses aab ON aab.account_id = aa.id AND aab.status = 'active'
    LEFT JOIN businesses b ON b.id = COALESCE(aab.business_id, aa.business_id)
    WHERE aa.id = events.account_id
    ORDER BY COALESCE(aab.is_primary, 0) DESC, b.id ASC
    LIMIT 1
  ) AS host_business_id,
  (
    SELECT b.name
    FROM advertiser_accounts aa
    LEFT JOIN advertiser_account_businesses aab ON aab.account_id = aa.id AND aab.status = 'active'
    LEFT JOIN businesses b ON b.id = COALESCE(aab.business_id, aa.business_id)
    WHERE aa.id = events.account_id
    ORDER BY COALESCE(aab.is_primary, 0) DESC, b.id ASC
    LIMIT 1
  ) AS host_business_name,
  (
    SELECT b.logo_url
    FROM advertiser_accounts aa
    LEFT JOIN advertiser_account_businesses aab ON aab.account_id = aa.id AND aab.status = 'active'
    LEFT JOIN businesses b ON b.id = COALESCE(aab.business_id, aa.business_id)
    WHERE aa.id = events.account_id
    ORDER BY COALESCE(aab.is_primary, 0) DESC, b.id ASC
    LIMIT 1
  ) AS host_business_logo_url,
  (
    SELECT b.website
    FROM advertiser_accounts aa
    LEFT JOIN advertiser_account_businesses aab ON aab.account_id = aa.id AND aab.status = 'active'
    LEFT JOIN businesses b ON b.id = COALESCE(aab.business_id, aa.business_id)
    WHERE aa.id = events.account_id
    ORDER BY COALESCE(aab.is_primary, 0) DESC, b.id ASC
    LIMIT 1
  ) AS host_business_website,
  (
    SELECT b.profile_slug
    FROM advertiser_accounts aa
    LEFT JOIN advertiser_account_businesses aab ON aab.account_id = aa.id AND aab.status = 'active'
    LEFT JOIN businesses b ON b.id = COALESCE(aab.business_id, aa.business_id)
    WHERE aa.id = events.account_id
    ORDER BY COALESCE(aab.is_primary, 0) DESC, b.id ASC
    LIMIT 1
  ) AS host_business_profile_slug,
  (
    SELECT aa.display_name
    FROM advertiser_accounts aa
    WHERE aa.id = events.account_id
    LIMIT 1
  ) AS host_account_name
`;

export async function getUpcomingEvents(
  limit = 8,
  city?: string,
  category?: string,
  paid?: "free" | "paid",
  organiserId?: string,
): Promise<PublicEvent[]> {
  const db = await getD1();
  const now = new Date().toISOString();
  const conditions = ["status = 'approved'", "starts_at >= ?"];
  const params: (string | number)[] = [now];
  if (city) { conditions.push("city = ?"); params.push(city); }
  if (category) { conditions.push("category = ?"); params.push(category); }
  if (paid === "free") { conditions.push("(price_min = 0 OR price_min IS NULL)"); }
  if (paid === "paid") { conditions.push("price_min > 0"); }
  if (organiserId) { conditions.push("account_id = ?"); params.push(organiserId); }
  const { results } = await db
    .prepare(`SELECT ${PUBLIC_EVENT_FIELDS} FROM events WHERE ${conditions.join(" AND ")} ORDER BY starts_at ASC LIMIT ?`)
    .bind(...params, limit)
    .all<PublicEvent>();
  return results;
}

export async function getPublicEventOrganisers(): Promise<PublicEventOrganiser[]> {
  const db = await getD1();
  const now = new Date().toISOString();
  const { results } = await db
    .prepare(`
      SELECT
        events.account_id AS id,
        COALESCE(
          (
            SELECT b.name
            FROM advertiser_accounts aa
            LEFT JOIN advertiser_account_businesses aab ON aab.account_id = aa.id AND aab.status = 'active'
            LEFT JOIN businesses b ON b.id = COALESCE(aab.business_id, aa.business_id)
            WHERE aa.id = events.account_id
            ORDER BY COALESCE(aab.is_primary, 0) DESC, b.id ASC
            LIMIT 1
          ),
          (
            SELECT aa.display_name
            FROM advertiser_accounts aa
            WHERE aa.id = events.account_id
            LIMIT 1
          ),
          events.account_id
        ) AS name
      FROM events
      WHERE events.status = 'approved'
        AND events.starts_at >= ?
        AND events.account_id IS NOT NULL
      GROUP BY events.account_id
      ORDER BY name COLLATE NOCASE ASC
    `)
    .bind(now)
    .all<PublicEventOrganiser>();
  return results;
}

export async function getPublicEventById(id: string): Promise<PublicEvent | null> {
  const db = await getD1();
  return db
    .prepare(`SELECT ${PUBLIC_EVENT_FIELDS} FROM events WHERE id = ? AND status = 'approved'`)
    .bind(id)
    .first<PublicEvent>() ?? null;
}

export async function getPublicEventBySlugOrId(slugOrId: string): Promise<PublicEvent | null> {
  const db = await getD1();
  return db
    .prepare(`SELECT ${PUBLIC_EVENT_FIELDS} FROM events WHERE (slug = ? OR id = ?) AND status = 'approved' LIMIT 1`)
    .bind(slugOrId, slugOrId)
    .first<PublicEvent>() ?? null;
}

export async function getRelatedUpcomingEvents(event: PublicEvent, limit = 3): Promise<PublicEvent[]> {
  const db = await getD1();
  const now = new Date().toISOString();
  const { results } = await db
    .prepare(`
      SELECT ${PUBLIC_EVENT_FIELDS}
      FROM events
      WHERE status = 'approved'
        AND starts_at >= ?
        AND id != ?
        AND (city = ? OR (category IS NOT NULL AND category = ?))
      ORDER BY
        CASE WHEN city = ? THEN 0 ELSE 1 END,
        starts_at ASC
      LIMIT ?
    `)
    .bind(now, event.id, event.city, event.category ?? "", event.city, limit)
    .all<PublicEvent>();
  return results;
}

export async function getNextUpcomingEvents(excludeEventId: string, limit = 4): Promise<PublicEvent[]> {
  const db = await getD1();
  const now = new Date().toISOString();
  const { results } = await db
    .prepare(`
      SELECT ${PUBLIC_EVENT_FIELDS}
      FROM events
      WHERE status = 'approved'
        AND starts_at >= ?
        AND id != ?
      ORDER BY starts_at ASC
      LIMIT ?
    `)
    .bind(now, excludeEventId, limit)
    .all<PublicEvent>();
  return results;
}

export async function getEventDatePager(event: PublicEvent): Promise<{ previous: PublicEvent | null; next: PublicEvent | null }> {
  const db = await getD1();
  const [previous, next] = await Promise.all([
    db
      .prepare(`
        SELECT ${PUBLIC_EVENT_FIELDS}
        FROM events
        WHERE status = 'approved'
          AND (starts_at < ? OR (starts_at = ? AND id < ?))
        ORDER BY starts_at DESC, id DESC
        LIMIT 1
      `)
      .bind(event.starts_at, event.starts_at, event.id)
      .first<PublicEvent>(),
    db
      .prepare(`
        SELECT ${PUBLIC_EVENT_FIELDS}
        FROM events
        WHERE status = 'approved'
          AND (starts_at > ? OR (starts_at = ? AND id > ?))
        ORDER BY starts_at ASC, id ASC
        LIMIT 1
      `)
      .bind(event.starts_at, event.starts_at, event.id)
      .first<PublicEvent>(),
  ]);
  return { previous: previous ?? null, next: next ?? null };
}

export function canonicalPublicEventSlug(event: PublicEvent) {
  return event.slug ?? canonicalEventSlug(event);
}
