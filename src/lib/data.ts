import { getD1 } from "./db";
import { slugToLabel, toCategoryChildUrlSegment, toUrlSlug, toListingSlug, toProfileSlug, idFromProfileSlug } from "./constants";
import { canonicalEventSlug } from "./event-slugs";
import type { Listing, Category, City, Banner, Business } from "./types";
import {
  CANONICAL_CATEGORY_BY_SLUG,
  CANONICAL_CATEGORY_REPAIRS,
  canonicalCategoryToCategory,
  categoryScopeAliases,
} from "./category-taxonomy";

const SUPPRESSED_CATEGORIES = new Set([
  "tbc",
  "events",
  "art_galleries",
  "finance_mortgage",
  "golf",
  "lotto4singles",
  "singles_news",
  "singles_products",
  "sms-phone-dating",
  "special_offers",
  "spiritual_path",
  "toastmasters",
  "travel_for_singles",
  "walks4singles",
]);
const SUPPRESSED_BANNER_CATEGORIES = new Set(["nightclubs"]);
const SUPPRESSED_PUBLIC_CITIES = new Set([
  "tbc",
  "national",
  "online",
  "no_location",
  "international",
]);
const SUPPRESSED_PUBLIC_CITY_SQL = "'tbc','national','online','no_location','international'";

function placeholders(values: unknown[]): string {
  return values.map(() => "?").join(", ");
}

function normalizeBanners(rows: Banner[]): Banner[] {
  return rows.map((banner) => {
    const profileHref = banner.business_id
      ? `/profile/${banner.business_profile_slug || toProfileSlug(banner.business_id, banner.business_name || banner.alt_text || "profile")}`
      : null;
    return {
      ...banner,
      click_url: profileHref || "/advertise",
      alt_text: banner.alt_text || banner.business_name || "Advertiser tile",
    };
  });
}

async function getCategoryScopeSlugs(categoryDbSlug: string): Promise<string[]> {
  const canonicalCategory = CANONICAL_CATEGORY_BY_SLUG.get(categoryDbSlug);
  if (SUPPRESSED_CATEGORIES.has(categoryDbSlug) && !canonicalCategory) return [];

  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT slug
    FROM categories
    WHERE COALESCE(status, 'active') = 'active'
      AND (slug = ? OR parent_slug = ?)
    ORDER BY CASE WHEN slug = ? THEN 0 ELSE 1 END, COALESCE(sort_order, 999), label COLLATE NOCASE ASC
  `).bind(categoryDbSlug, categoryDbSlug, categoryDbSlug).all<{ slug: string }>();

  const aliases = categoryScopeAliases(categoryDbSlug);
  const slugs = new Set([
    ...results.map((row) => row.slug),
    ...(canonicalCategory ? [categoryDbSlug] : []),
    ...aliases,
  ]);

  return [...slugs].filter(
    (slug) => slug === categoryDbSlug || aliases.includes(slug) || !SUPPRESSED_CATEGORIES.has(slug),
  );
}

async function countActiveListingsForCategorySlugs(categorySlugs: string[]): Promise<number> {
  if (categorySlugs.length === 0) return 0;

  const db = await getD1();
  const categoryPlaceholders = placeholders(categorySlugs);
  const row = await db.prepare(`
    SELECT COUNT(DISTINCT l.id) AS listing_count
    FROM listing_placements p
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.category_slug IN (${categoryPlaceholders})
      AND COALESCE(p.is_active, 1) = 1
  `).bind(...categorySlugs).first<{ listing_count: number }>();

  return row?.listing_count ?? 0;
}

// ── Listings ─────────────────────────────────────────────────────────────────

export async function getListingsForCategory(categoryDbSlug: string): Promise<Listing[]> {
  const categorySlugs = await getCategoryScopeSlugs(categoryDbSlug);
  if (categorySlugs.length === 0) return [];

  const db = await getD1();
  const categoryPlaceholders = placeholders(categorySlugs);
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
               AND p2.category_slug IN (${categoryPlaceholders})
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id
               AND p2.category_slug IN (${categoryPlaceholders})
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_labels
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE category_slug IN (${categoryPlaceholders})
    ) p ON p.listing_id = l.id
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.status = 'active'
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC
    LIMIT 300
  `).bind(...categorySlugs, ...categorySlugs, ...categorySlugs).all<Listing>();
  return results;
}

export async function getListingsForPage(
  categoryDbSlug: string,
  cityDbSlug: string | null
): Promise<Listing[]> {
  const categorySlugs = await getCategoryScopeSlugs(categoryDbSlug);
  if (categorySlugs.length === 0) return [];

  const db = await getD1();
  const categoryPlaceholders = placeholders(categorySlugs);
  const cityClause = cityDbSlug ? "AND city_slug = ?" : "AND city_slug IS NULL";
  const baseArgs: (string | null)[] = [
    categoryDbSlug,
    cityDbSlug,
    cityDbSlug,
    ...categorySlugs,
    ...categorySlugs,
    ...categorySlugs,
  ];
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
               AND p2.category_slug IN (${categoryPlaceholders})
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id
               AND p2.category_slug IN (${categoryPlaceholders})
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_labels
    FROM listings l
    JOIN (
      SELECT DISTINCT listing_id FROM listing_placements
      WHERE category_slug IN (${categoryPlaceholders}) ${cityClause}
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
           l.business_id,
           b.name AS business_name, b.website AS business_website,
           b.advertiser_id AS business_advertiser_id,
           MAX(CASE WHEN p.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL}) THEN p.city_slug END) AS city_slug,
           MAX(CASE WHEN p.category_slug NOT IN (${[...SUPPRESSED_CATEGORIES].map((slug) => `'${slug}'`).join(",")}) THEN p.category_slug END) AS category_slug,
           GROUP_CONCAT(DISTINCT CASE WHEN p.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL}) THEN p.city_slug END) AS city_slugs,
           GROUP_CONCAT(DISTINCT CASE WHEN p.category_slug NOT IN (${[...SUPPRESSED_CATEGORIES].map((slug) => `'${slug}'`).join(",")}) THEN p.category_slug END) AS category_slugs
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    LEFT JOIN listing_placements p ON p.listing_id = l.id
    WHERE l.status = 'active'
      AND l.listing_type IN ('featured', 'premium')
    GROUP BY l.id
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC,
      COALESCE(b.name, l.title) COLLATE NOCASE ASC
    LIMIT ?
  `).bind(limit).all<Listing>();
  return results;
}

export async function getAllFeaturedListings(limit = 200): Promise<Listing[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT l.id, l.title, l.tagline, l.description, l.promo,
           l.phone, l.mobile, l.email, l.web, l.image_url,
           l.location, l.location_city, l.location_state,
           l.listing_type, l.confidence_score,
           l.business_id,
           b.name AS business_name, b.website AS business_website,
           b.advertiser_id AS business_advertiser_id,
           MAX(CASE WHEN p.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL}) THEN p.city_slug END) AS city_slug,
           MAX(CASE WHEN p.category_slug NOT IN (${[...SUPPRESSED_CATEGORIES].map((slug) => `'${slug}'`).join(",")}) THEN p.category_slug END) AS category_slug,
           GROUP_CONCAT(DISTINCT CASE WHEN p.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL}) THEN p.city_slug END) AS city_slugs,
           GROUP_CONCAT(DISTINCT CASE WHEN p.category_slug NOT IN (${[...SUPPRESSED_CATEGORIES].map((slug) => `'${slug}'`).join(",")}) THEN p.category_slug END) AS category_slugs,
           GROUP_CONCAT(DISTINCT CASE WHEN p.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL}) THEN COALESCE(ci.label, p.city_slug) END) AS city_labels
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    LEFT JOIN listing_placements p ON p.listing_id = l.id
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    WHERE l.status = 'active'
      AND l.listing_type IN ('featured', 'premium')
    GROUP BY l.id
    ORDER BY
      CASE l.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END,
      l.confidence_score DESC,
      COALESCE(b.name, l.title) COLLATE NOCASE ASC
    LIMIT ?
  `).bind(limit).all<Listing>();
  return results;
}

export async function getFeaturedListingCategories(): Promise<Category[]> {
  const db = await getD1();
  const suppressed = [...SUPPRESSED_CATEGORIES];
  const placeholders = suppressed.map(() => "?").join(",");
  const { results } = await db.prepare(`
    SELECT p.category_slug AS slug, c.label, c.parent_slug,
           c.description, c.seo_title, c.seo_description, c.seo_intro, c.hero_image_url,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.category_slug IS NOT NULL
      AND p.category_slug NOT IN (${placeholders})
      AND l.listing_type IN ('featured', 'premium')
    GROUP BY p.category_slug
    ORDER BY listing_count DESC, COALESCE(c.label, p.category_slug) COLLATE NOCASE ASC
  `).bind(...suppressed).all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; hero_image_url: string | null; listing_count: number;
  }>();
  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.slug) && r.listing_count > 0)
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getFeaturedListingCities(): Promise<City[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state, ci.seo_title, ci.seo_description,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.city_slug IS NOT NULL
      AND l.listing_type IN ('featured', 'premium')
    GROUP BY p.city_slug
    ORDER BY listing_count DESC, COALESCE(ci.label, p.city_slug) COLLATE NOCASE ASC
  `).all<{ slug: string; label: string | null; state: string | null; seo_title: string | null; seo_description: string | null; listing_count: number }>();
  return results
    .filter((r) => !SUPPRESSED_PUBLIC_CITIES.has(r.slug) && r.listing_count > 0)
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getAllBusinessesForDirectory(): Promise<{ id: number; name: string; profile_slug: string | null }[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT b.id, b.name, b.profile_slug
    FROM businesses b
    WHERE b.name IS NOT NULL
      AND TRIM(b.name) != ''
      AND COALESCE(b.status, 'active') = 'active'
      AND b.merged_into_business_id IS NULL
    GROUP BY b.id
    ORDER BY b.name COLLATE NOCASE ASC
  `).all<{ id: number; name: string; profile_slug: string | null }>();
  return results;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT c.slug, c.label, c.parent_slug,
           c.description, c.seo_title, c.seo_description, c.seo_intro, c.hero_image_url,
           COUNT(DISTINCT l.id) AS listing_count
    FROM categories c
    LEFT JOIN categories scope ON (scope.slug = c.slug OR scope.parent_slug = c.slug)
      AND COALESCE(scope.status, 'active') = 'active'
    LEFT JOIN listing_placements p ON p.category_slug = scope.slug
    LEFT JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE COALESCE(c.status, 'active') = 'active'
    GROUP BY c.slug
    ORDER BY COALESCE(c.sort_order, 999), listing_count DESC, c.label COLLATE NOCASE ASC
  `).bind().all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; hero_image_url: string | null; listing_count: number;
  }>();

  const categories = results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.slug) && !r.parent_slug && r.listing_count > 0)
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));

  const present = new Set(categories.map((category) => category.slug));
  for (const canonicalCategory of CANONICAL_CATEGORY_REPAIRS) {
    if (present.has(canonicalCategory.slug) || canonicalCategory.parent_slug) continue;

    const listingCount = await countActiveListingsForCategorySlugs([
      canonicalCategory.slug,
      ...categoryScopeAliases(canonicalCategory.slug),
    ]);
    categories.push(canonicalCategoryToCategory(canonicalCategory, listingCount));
    present.add(canonicalCategory.slug);
  }

  return categories.sort((a, b) => {
    const aOrder = CANONICAL_CATEGORY_BY_SLUG.get(a.slug)?.sort_order ?? 999;
    const bOrder = CANONICAL_CATEGORY_BY_SLUG.get(b.slug)?.sort_order ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (b.listing_count !== a.listing_count) return b.listing_count - a.listing_count;
    return a.label.localeCompare(b.label);
  });
}

export async function getCategoryMeta(dbSlug: string): Promise<Category | null> {
  if (SUPPRESSED_CATEGORIES.has(dbSlug)) return null;

  const db = await getD1();
  const row = await db.prepare(`
    SELECT c.slug, c.label, c.parent_slug,
           c.description, c.seo_title, c.seo_description, c.seo_intro, c.hero_image_url,
           COUNT(DISTINCT l.id) AS listing_count
    FROM categories c
    LEFT JOIN categories scope ON (scope.slug = c.slug OR scope.parent_slug = c.slug)
      AND COALESCE(scope.status, 'active') = 'active'
    LEFT JOIN listing_placements p ON p.category_slug = scope.slug
    LEFT JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE c.slug = ? AND COALESCE(c.status, 'active') = 'active'
    GROUP BY c.slug
  `).bind(dbSlug).first<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; hero_image_url: string | null; listing_count: number;
  }>();
  if (!row) {
    const canonicalCategory = CANONICAL_CATEGORY_BY_SLUG.get(dbSlug);
    if (!canonicalCategory) return null;

    const listingCount = await countActiveListingsForCategorySlugs([
      canonicalCategory.slug,
      ...categoryScopeAliases(canonicalCategory.slug),
    ]);
    return canonicalCategoryToCategory(canonicalCategory, listingCount);
  }
  return { ...row, label: row.label || slugToLabel(row.slug) };
}

export async function getSubcategoriesForCategory(parentDbSlug: string): Promise<Category[]> {
  if (SUPPRESSED_CATEGORIES.has(parentDbSlug)) return [];

  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT c.slug, c.label, c.parent_slug,
           c.description, c.seo_title, c.seo_description, c.seo_intro, c.hero_image_url,
           COUNT(DISTINCT l.id) AS listing_count
    FROM categories c
    LEFT JOIN listing_placements p ON p.category_slug = c.slug
    LEFT JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE c.parent_slug = ? AND COALESCE(c.status, 'active') = 'active'
    GROUP BY c.slug
    ORDER BY COALESCE(c.sort_order, 999), listing_count DESC, c.label COLLATE NOCASE ASC
  `).bind(parentDbSlug).all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; hero_image_url: string | null; listing_count: number;
  }>();

  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.slug))
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
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
  return results
    .filter((r) => !SUPPRESSED_PUBLIC_CITIES.has(r.slug) && r.listing_count > 0)
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getCitiesForCategory(categoryDbSlug: string): Promise<City[]> {
  const categorySlugs = await getCategoryScopeSlugs(categoryDbSlug);
  if (categorySlugs.length === 0) return [];

  const db = await getD1();
  const categoryPlaceholders = placeholders(categorySlugs);
  const { results } = await db.prepare(`
    SELECT p.city_slug AS slug, ci.label, ci.state, ci.seo_title, ci.seo_description,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    LEFT JOIN cities ci ON ci.slug = p.city_slug
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.category_slug IN (${categoryPlaceholders}) AND p.city_slug IS NOT NULL
    GROUP BY p.city_slug
    ORDER BY listing_count DESC
  `).bind(...categorySlugs).all<{ slug: string; label: string | null; state: string | null; seo_title: string | null; seo_description: string | null; listing_count: number }>();
  return results
    .filter((r) => !SUPPRESSED_PUBLIC_CITIES.has(r.slug) && r.listing_count > 0)
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

export async function getListingsForCity(cityDbSlug: string): Promise<Listing[]> {
  if (SUPPRESSED_PUBLIC_CITIES.has(cityDbSlug)) return [];

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
               AND p3.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci3.label, p4.city_slug))
             FROM listing_placements p4
             LEFT JOIN cities ci3 ON ci3.slug = p4.city_slug
             WHERE p4.listing_id = l.id
               AND p4.city_slug IS NOT NULL
               AND p4.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
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
               AND p3.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci3.label, p4.city_slug))
             FROM listing_placements p4
             LEFT JOIN cities ci3 ON ci3.slug = p4.city_slug
             WHERE p4.listing_id = l.id
               AND p4.city_slug IS NOT NULL
               AND p4.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
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
      AND (p.city_slug IS NULL OR p.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL}))
    ORDER BY p.category_slug, p.city_slug
  `).bind(listingId, ...suppressed).all<ListingPlacement>();
  return results;
}

export async function getBusinessListings(businessId: number, excludeId: number): Promise<Listing[]> {
  const db = await getD1();
  const suppressed = [...SUPPRESSED_CATEGORIES];
  const placeholders = suppressed.map(() => "?").join(",");
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
               AND p2.category_slug NOT IN (${placeholders})
           ) AS category_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.city_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_labels
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.business_id = ? AND l.id != ? AND l.status = 'active'
    ORDER BY l.confidence_score DESC
  `).bind(...suppressed, businessId, excludeId).all<Listing>();

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
  if (SUPPRESSED_CATEGORIES.has(categorySlug)) return [];

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
  if (SUPPRESSED_PUBLIC_CITIES.has(cityDbSlug)) return null;

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
    SELECT COALESCE(c.parent_slug, c.slug) AS slug,
           display.label,
           display.parent_slug,
           display.description,
           display.seo_title,
           display.seo_description,
           display.seo_intro,
           display.hero_image_url,
           COUNT(DISTINCT p.listing_id) AS listing_count
    FROM listing_placements p
    JOIN categories c ON c.slug = p.category_slug
    JOIN categories display ON display.slug = COALESCE(c.parent_slug, c.slug)
    JOIN listings l ON l.id = p.listing_id AND l.status = 'active'
    WHERE p.city_slug = ?
      AND p.category_slug IS NOT NULL
      AND COALESCE(c.status, 'active') = 'active'
      AND COALESCE(display.status, 'active') = 'active'
    GROUP BY COALESCE(c.parent_slug, c.slug)
    ORDER BY listing_count DESC
  `).bind(cityDbSlug).all<{
    slug: string; label: string | null; parent_slug: string | null;
    description: string | null; seo_title: string | null; seo_description: string | null; seo_intro: string | null; hero_image_url: string | null; listing_count: number;
  }>();
  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.slug))
    .map((r) => ({ ...r, label: r.label || slugToLabel(r.slug) }));
}

// ── Banners ───────────────────────────────────────────────────────────────────

export async function getBannersForPage(
  categoryDbSlug: string,
  cityDbSlug?: string | null
): Promise<Banner[]> {
  if (SUPPRESSED_CATEGORIES.has(categoryDbSlug)) return [];
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
      SELECT bn.id,
             bn.image_url,
             COALESCE(NULLIF(bn.link_url, ''), NULLIF(bn.click_url, '')) AS click_url,
             COALESCE(NULLIF(bn.alt_text, ''), NULLIF(bn.title, ''), b.name, 'Advertiser tile') AS alt_text,
             bn.placement,
             bn.business_id,
             b.name AS business_name,
             b.profile_slug AS business_profile_slug
      FROM banners bn
      LEFT JOIN businesses b ON b.id = bn.business_id
      WHERE bn.page_scope = 'category' AND bn.category_slug = ? AND bn.city_slug = ? AND bn.is_active = 1
      ORDER BY bn.slot_position LIMIT ?
    `).bind(categoryDbSlug, cityDbSlug, SLOTS).all<Banner>();
    addRows(normalizeBanners(results));
    return banners;
  }

  const { results } = await db.prepare(`
    SELECT bn.id,
           bn.image_url,
           COALESCE(NULLIF(bn.link_url, ''), NULLIF(bn.click_url, '')) AS click_url,
           COALESCE(NULLIF(bn.alt_text, ''), NULLIF(bn.title, ''), b.name, 'Advertiser tile') AS alt_text,
           bn.placement,
           bn.business_id,
           b.name AS business_name,
           b.profile_slug AS business_profile_slug
    FROM banners bn
    LEFT JOIN businesses b ON b.id = bn.business_id
    WHERE bn.page_scope = 'category' AND bn.category_slug = ? AND bn.city_slug IS NULL AND bn.is_active = 1
    ORDER BY bn.slot_position LIMIT ?
  `).bind(categoryDbSlug, SLOTS).all<Banner>();
  addRows(normalizeBanners(results));
  return banners;
}

export async function getBannersForCity(cityDbSlug: string): Promise<Banner[]> {
  const db = await getD1();
  const SLOTS = 12;
  const banners: Banner[] = [];
  const seen = new Set<number>();

  const { results } = await db.prepare(`
    SELECT bn.id,
           bn.image_url,
           COALESCE(NULLIF(bn.link_url, ''), NULLIF(bn.click_url, '')) AS click_url,
           COALESCE(NULLIF(bn.alt_text, ''), NULLIF(bn.title, ''), b.name, 'Advertiser tile') AS alt_text,
           bn.placement,
           bn.business_id,
           b.name AS business_name,
           b.profile_slug AS business_profile_slug
    FROM banners bn
    LEFT JOIN businesses b ON b.id = bn.business_id
    WHERE bn.page_scope = 'city' AND bn.city_slug = ? AND bn.is_active = 1
    ORDER BY bn.slot_position LIMIT ?
  `).bind(cityDbSlug, SLOTS).all<Banner>();
  for (const b of normalizeBanners(results)) {
    if (!seen.has(b.id) && banners.length < SLOTS) {
      seen.add(b.id);
      banners.push(b);
    }
  }
  return banners;
}

export async function getFeaturedDirectoryBanners(): Promise<Banner[]> {
  const db = await getD1();
  const { results } = await db.prepare(`
    SELECT bn.id,
           bn.image_url,
           COALESCE(NULLIF(bn.link_url, ''), NULLIF(bn.click_url, '')) AS click_url,
           COALESCE(NULLIF(bn.alt_text, ''), NULLIF(bn.title, ''), b.name, 'Advertiser tile') AS alt_text,
           bn.placement,
           bn.business_id,
           b.name AS business_name,
           b.profile_slug AS business_profile_slug
    FROM banners bn
    LEFT JOIN businesses b ON b.id = bn.business_id
    WHERE bn.is_active = 1
      AND bn.image_url IS NOT NULL
      AND bn.image_url != ''
      AND (
        bn.page_scope IN ('listings', 'homepage', 'site', 'global')
        OR (bn.category_slug IS NULL AND bn.city_slug IS NULL)
      )
    ORDER BY
      CASE bn.page_scope
        WHEN 'listings' THEN 0
        WHEN 'homepage' THEN 1
        WHEN 'site' THEN 2
        WHEN 'global' THEN 3
        ELSE 4
      END,
      COALESCE(bn.slot_position, 999),
      bn.id DESC
    LIMIT 12
  `).all<Banner>();
  return normalizeBanners(results);
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
    SELECT DISTINCT
      COALESCE(c.parent_slug, p.category_slug) AS category_slug,
      CASE WHEN c.parent_slug IS NOT NULL THEN p.category_slug ELSE NULL END AS subcategory_slug,
      p.city_slug
    FROM listing_placements p
    LEFT JOIN categories c ON c.slug = p.category_slug
    WHERE p.category_slug IS NOT NULL AND p.city_slug IS NOT NULL
  `).bind().all<{ category_slug: string; subcategory_slug: string | null; city_slug: string }>();
  return results
    .filter((r) => !SUPPRESSED_CATEGORIES.has(r.category_slug))
    .map((r) => ({
      category: r.subcategory_slug
        ? `${toUrlSlug(r.category_slug)}/${toCategoryChildUrlSegment(r.category_slug, r.subcategory_slug)}`
        : toUrlSlug(r.category_slug),
      city: toUrlSlug(r.city_slug),
    }));
}

// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfileData {
  business: Business | null;
  listings: Listing[];
  banners: ProfileBanner[];
  events: PublicEvent[];
  nextEvent: PublicEvent | null;
  totalEvents: number;
}

export type ProfileEventFilter = "upcoming" | "past";

export interface ProfileBanner extends Banner {
  title: string | null;
  placement: string | null;
}

export async function getProfileData(slugOrId: string, eventFilter: ProfileEventFilter = "upcoming"): Promise<ProfileData> {
  const db = await getD1();
  const suppressed = [...SUPPRESSED_CATEGORIES];
  const categoryPlaceholders = placeholders(suppressed);

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

  if (businessId === null) {
    return { business: null, listings: [], banners: [], events: [], nextEvent: null, totalEvents: 0 };
  }

  const business = await db.prepare(`
    SELECT id, name, description, logo_url, website,
           contact_name, phone, mobile, email,
           facebook_url, instagram_url, tiktok_url, youtube_url, linkedin_url,
           advertiser_id, profile_slug
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
             WHERE p2.listing_id = l.id
               AND p2.category_slug IS NOT NULL
               AND p2.category_slug NOT IN (${categoryPlaceholders})
           ) AS category_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT p2.city_slug)
             FROM listing_placements p2
             WHERE p2.listing_id = l.id
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_slugs,
           (
             SELECT GROUP_CONCAT(DISTINCT COALESCE(ci2.label, p2.city_slug))
             FROM listing_placements p2
             LEFT JOIN cities ci2 ON ci2.slug = p2.city_slug
             WHERE p2.listing_id = l.id
               AND p2.city_slug IS NOT NULL
               AND p2.city_slug NOT IN (${SUPPRESSED_PUBLIC_CITY_SQL})
           ) AS city_labels
    FROM listings l
    LEFT JOIN businesses b ON b.id = l.business_id
    WHERE l.business_id = ? AND l.status = 'active'
    ORDER BY l.confidence_score DESC
    LIMIT 50
  `).bind(...suppressed, businessId).all<Listing>();

  const { results: accountRows } = await db.prepare(`
    SELECT id FROM advertiser_accounts WHERE business_id = ?
    UNION
    SELECT account_id AS id
    FROM advertiser_account_businesses
    WHERE business_id = ? AND status = 'active'
  `).bind(businessId, businessId).all<{ id: string }>();
  const accountIds = accountRows.map((row) => row.id).filter(Boolean);

  let banners: ProfileBanner[] = [];
  let events: PublicEvent[] = [];
  let nextEvent: PublicEvent | null = null;
  let totalEvents = 0;

  const bannerAccountFilter = accountIds.length > 0
    ? `business_id = ? OR account_id IN (${accountIds.map(() => "?").join(",")})`
    : "business_id = ?";
  const bannerBindParams = accountIds.length > 0 ? [businessId, ...accountIds] : [businessId];
  const { results: bannerRows } = await db.prepare(`
    SELECT id,
           image_url,
           COALESCE(NULLIF(link_url, ''), NULLIF(click_url, ''), '/advertise') AS click_url,
           COALESCE(NULLIF(alt_text, ''), NULLIF(title, ''), 'Advertiser banner') AS alt_text,
           title,
           placement
    FROM banners
    WHERE (${bannerAccountFilter})
      AND COALESCE(is_active, 1) = 1
      AND image_url IS NOT NULL
      AND image_url != ''
    ORDER BY COALESCE(slot_position, 999), COALESCE(created_at, '') DESC, id DESC
    LIMIT 12
  `).bind(...bannerBindParams).all<ProfileBanner>();
  banners = bannerRows;

  if (accountIds.length > 0) {
    const accountPlaceholders = accountIds.map(() => "?").join(",");

    const now = new Date().toISOString();
    const countRow = await db.prepare(`
      SELECT COUNT(*) AS count
      FROM events
      WHERE account_id IN (${accountPlaceholders})
        AND status = 'approved'
        AND COALESCE(is_visible, 1) = 1
    `).bind(...accountIds).first<{ count: number }>();
    totalEvents = countRow?.count ?? 0;

    nextEvent = await db.prepare(`
      SELECT ${PUBLIC_EVENT_FIELDS}
      FROM events
      WHERE account_id IN (${accountPlaceholders})
        AND status = 'approved'
        AND COALESCE(is_visible, 1) = 1
        AND starts_at >= ?
      ORDER BY starts_at ASC
      LIMIT 1
    `).bind(...accountIds, now).first<PublicEvent>() ?? null;

    const eventWindow = eventFilter === "past" ? "starts_at < ?" : "starts_at >= ?";
    const eventOrder = eventFilter === "past" ? "starts_at DESC" : "starts_at ASC";
    const { results: eventRows } = await db.prepare(`
      SELECT ${PUBLIC_EVENT_FIELDS}
      FROM events
      WHERE account_id IN (${accountPlaceholders})
        AND status = 'approved'
        AND COALESCE(is_visible, 1) = 1
        AND ${eventWindow}
      ORDER BY ${eventOrder}
      LIMIT 12
    `).bind(...accountIds, now).all<PublicEvent>();
    events = eventRows;
  }

  return { business, listings, banners, events, nextEvent, totalEvents };
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

const PUBLIC_EVENT_LIST_FIELDS = `
  id, slug, title, description, starts_at, ends_at, timezone, venue_name, address, suburb, city, state,
  price_min, price_max, ticket_url, push_platform, push_url, registration_mode, image_url, source,
  source_url, category, account_id,
  NULL AS host_business_id,
  NULL AS host_business_name,
  NULL AS host_business_logo_url,
  NULL AS host_business_website,
  NULL AS host_business_profile_slug,
  NULL AS host_account_name
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
    .prepare(`SELECT ${PUBLIC_EVENT_LIST_FIELDS} FROM events WHERE ${conditions.join(" AND ")} ORDER BY starts_at ASC LIMIT ?`)
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
