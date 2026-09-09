-- Add public city placements for TBC records that only had a TBC city row.

WITH resolved_placements(listing_id, category_slug, city_slug) AS (
  VALUES
    (811, 'solo_travel', 'sydney'),
    (812, 'intro_agencies', 'brisbane')
)
INSERT INTO listing_placements (
  listing_id,
  category_slug,
  city_slug,
  sort_order,
  position_type,
  is_active,
  starts_at,
  expires_at
)
SELECT
  rp.listing_id,
  rp.category_slug,
  rp.city_slug,
  0,
  'organic',
  1,
  NULL,
  NULL
FROM resolved_placements rp
JOIN listings l ON l.id = rp.listing_id AND COALESCE(l.status, 'active') = 'active'
JOIN categories c ON c.slug = rp.category_slug
JOIN cities ci ON ci.slug = rp.city_slug
WHERE NOT EXISTS (
  SELECT 1
  FROM listing_placements existing
  WHERE existing.listing_id = rp.listing_id
    AND existing.category_slug = rp.category_slug
    AND existing.city_slug = rp.city_slug
    AND COALESCE(existing.is_active, 1) = 1
);
