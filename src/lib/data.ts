import { getDb } from "./db";
import { slugToLabel, toUrlSlug } from "./constants";
import type { Listing, Category, City, Banner } from "./types";

// ── Listings ─────────────────────────────────────────────────────────────────

export function getListingsForCategory(categoryDbSlug: string): Listing[] {
  const db = getDb();
  return db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           b.name    AS business_name,
           b.website AS business_website
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE category_slug = ?
    ) p ON p.listing_id = l.id
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status != 'suspended'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 300
  `).all(categoryDbSlug) as Listing[];
}

export function getListingsForPage(
  categoryDbSlug: string,
  cityDbSlug: string | null
): Listing[] {
  const db = getDb();
  const cityClause = cityDbSlug ? "AND city_slug = ?" : "AND city_slug IS NULL";
  const args: unknown[] = cityDbSlug ? [categoryDbSlug, cityDbSlug] : [categoryDbSlug];

  return db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           b.name    AS business_name,
           b.website AS business_website
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE category_slug = ? ${cityClause}
    ) p ON p.listing_id = l.id
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status != 'suspended'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 200
  `).all(...args) as Listing[];
}

export function getFeaturedListings(limit = 6): Listing[] {
  const db = getDb();
  return db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           b.name AS business_name, b.website AS business_website
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.confidence_score >= 80 AND l.email != '' AND l.status != 'suspended'
    ORDER BY l.confidence_score DESC
    LIMIT ?
  `).all(limit) as Listing[];
}

// ── Categories ────────────────────────────────────────────────────────────────

export function getAllCategories(): Category[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    GROUP BY p.category_slug
    ORDER BY listing_count DESC
  `).all() as Array<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_intro: string | null; listing_count: number;
  }>;
  return rows.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export function getCategoryMeta(dbSlug: string): Category | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE p.category_slug = ?
    GROUP BY p.category_slug
  `).get(dbSlug) as { slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_intro: string | null; listing_count: number; } | undefined;
  if (!row) return null;
  return { ...row, label: row.label || slugToLabel(row.slug) };
}

// ── Cities ────────────────────────────────────────────────────────────────────

export function getAllCities(): City[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE p.city_slug IS NOT NULL
    GROUP BY p.city_slug
    ORDER BY listing_count DESC
  `).all() as Array<{ slug: string; label: string | null; state: string | null; listing_count: number }>;
  return rows.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export function getCitiesForCategory(categoryDbSlug: string): City[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE p.category_slug = ? AND p.city_slug IS NOT NULL
    GROUP BY p.city_slug
    ORDER BY listing_count DESC
  `).all(categoryDbSlug) as Array<{ slug: string; label: string | null; state: string | null; listing_count: number }>;
  return rows.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export function getListingsForCity(cityDbSlug: string): Listing[] {
  const db = getDb();
  return db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           b.name    AS business_name,
           b.website AS business_website
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE city_slug = ?
    ) p ON p.listing_id = l.id
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status != 'suspended'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 200
  `).all(cityDbSlug) as Listing[];
}

export function getListingById(id: number): Listing | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           b.name    AS business_name,
           b.website AS business_website
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.id = ? AND l.status != 'suspended'
  `).get(id) as Listing | undefined;
  return row ?? null;
}

export function getAllListingIds(): number[] {
  const db = getDb();
  const rows = db.prepare(
    "SELECT id FROM listings WHERE status != 'suspended' ORDER BY id"
  ).all() as { id: number }[];
  return rows.map((r) => r.id);
}

export function getCityMeta(cityDbSlug: string): City | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE p.city_slug = ?
    GROUP BY p.city_slug
  `).get(cityDbSlug) as { slug: string; label: string | null; state: string | null; listing_count: number } | undefined;
  if (!row) return null;
  return { ...row, label: row.label || slugToLabel(row.slug) };
}

export function getCategoriesForCity(cityDbSlug: string): Category[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_intro,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE p.city_slug = ? AND p.category_slug IS NOT NULL
    GROUP BY p.category_slug
    ORDER BY listing_count DESC
  `).all(cityDbSlug) as Array<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_intro: string | null; listing_count: number;
  }>;
  return rows.map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

// ── Banners ───────────────────────────────────────────────────────────────────

export function getBannersForPage(
  categoryDbSlug: string,
  cityDbSlug?: string | null
): Banner[] {
  const db = getDb();
  const SLOTS = 6;
  const banners: Banner[] = [];

  if (cityDbSlug) {
    const cityRows = db.prepare(`
      SELECT id, image_url, click_url, alt_text FROM banners
      WHERE category_slug = ? AND city_slug = ? AND is_active = 1
      ORDER BY slot_position LIMIT ?
    `).all(categoryDbSlug, cityDbSlug, SLOTS) as Banner[];
    banners.push(...cityRows);
  }

  if (banners.length < SLOTS) {
    const existing = new Set(banners.map((b) => b.id));
    const catRows = db.prepare(`
      SELECT id, image_url, click_url, alt_text FROM banners
      WHERE category_slug = ? AND city_slug IS NULL AND is_active = 1
      ORDER BY slot_position LIMIT ?
    `).all(categoryDbSlug, SLOTS) as Banner[];
    for (const b of catRows) {
      if (!existing.has(b.id) && banners.length < SLOTS) banners.push(b);
    }
  }

  return banners;
}

export function getBannersForCity(cityDbSlug: string): Banner[] {
  const db = getDb();
  return db.prepare(`
    SELECT id, image_url, click_url, alt_text FROM banners
    WHERE page_scope = 'city' AND city_slug = ? AND is_active = 1
    ORDER BY slot_position
  `).all(cityDbSlug) as Banner[];
}

// ── Static params for SSG ─────────────────────────────────────────────────────

export function getAllCategoryParams(): { category: string }[] {
  const db = getDb();
  const rows = db.prepare(
    "SELECT DISTINCT category_slug FROM listing_placements ORDER BY category_slug"
  ).all() as { category_slug: string }[];
  return rows.map((r) => ({ category: toUrlSlug(r.category_slug) }));
}

export function getAllCategoryCityParams(): { category: string; city: string }[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT DISTINCT category_slug, city_slug FROM listing_placements
    WHERE city_slug IS NOT NULL
  `).all() as { category_slug: string; city_slug: string }[];
  return rows.map((r) => ({
    category: toUrlSlug(r.category_slug),
    city: toUrlSlug(r.city_slug),
  }));
}
