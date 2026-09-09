-- Retire legacy product/prize category buckets.
--
-- Owner decision on 2026-09-09: Lotto for Singles and Singles Products can
-- be removed from the public launch taxonomy. Preserve rows for audit, but
-- stop them participating in public listing/category surfaces.

UPDATE listings
SET status = 'archived',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Archived from launch: owner removed Lotto for Singles and Singles Products from the public category taxonomy.'
    ),
    ai_moderation_status = 'launch_owner_removed',
    ai_moderation_reason = COALESCE(
      ai_moderation_reason,
      'Removed from public launch set because product/prize listings do not fit the current Events4Singles event, dating, social, travel, dance, or wellbeing taxonomy.'
    ),
    updated_at = datetime('now')
WHERE id IN (
  SELECT DISTINCT listing_id
  FROM listing_placements
  WHERE category_slug IN ('lotto4singles', 'singles_products')
)
  AND COALESCE(status, 'active') = 'active';

UPDATE listing_placements
SET is_active = 0,
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE category_slug IN ('lotto4singles', 'singles_products');

UPDATE businesses
SET status = 'archived',
    updated_at = datetime('now')
WHERE id IN (
  SELECT DISTINCT l.business_id
  FROM listings l
  JOIN listing_placements lp ON lp.listing_id = l.id
  WHERE lp.category_slug IN ('lotto4singles', 'singles_products')
    AND l.business_id IS NOT NULL
)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
  );

UPDATE banners
SET is_active = 0,
    status = 'archived',
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE category_slug IN ('lotto4singles', 'singles_products')
   OR business_id IN (
    SELECT DISTINCT l.business_id
    FROM listings l
    JOIN listing_placements lp ON lp.listing_id = l.id
    WHERE lp.category_slug IN ('lotto4singles', 'singles_products')
      AND l.business_id IS NOT NULL
   );

UPDATE categories
SET status = 'archived',
    banner_row_count = 0
WHERE slug IN ('lotto4singles', 'singles_products');

INSERT INTO redirects (from_path, to_path, entity_type, entity_id)
VALUES
  ('/lotto4singles', '/dating-resources', 'category', 'lotto4singles'),
  ('/lotto4singles.htm', '/dating-resources', 'category', 'lotto4singles'),
  ('/singles-products', '/dating-resources', 'category', 'singles_products'),
  ('/singles_products.htm', '/dating-resources', 'category', 'singles_products')
ON CONFLICT(from_path) DO UPDATE SET
  to_path = excluded.to_path,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id;
