-- Follow-up duplicate cleanup for a misspelled Cheap-Eats-Group title/domain.

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (548, 548, 546, 546)
)
INSERT INTO listing_placements (listing_id, category_slug, city_slug, sort_order, position_type, is_active, starts_at, expires_at)
SELECT
  m.keep_listing_id,
  p.category_slug,
  p.city_slug,
  p.sort_order,
  p.position_type,
  p.is_active,
  p.starts_at,
  p.expires_at
FROM listing_placements AS p
JOIN m ON m.merge_listing_id = p.listing_id
WHERE NOT EXISTS (
  SELECT 1
  FROM listing_placements AS existing
  WHERE existing.listing_id = m.keep_listing_id
    AND COALESCE(existing.category_slug, '') = COALESCE(p.category_slug, '')
    AND COALESCE(existing.city_slug, '') = COALESCE(p.city_slug, '')
);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (548, 548, 546, 546)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Adaptive duplicate of listing #' || (
        SELECT keep_listing_id FROM m WHERE merge_listing_id = listings.id
      )
    ),
    merged_into_listing_id = (SELECT keep_listing_id FROM m WHERE merge_listing_id = listings.id),
    business_id = (SELECT keep_business_id FROM m WHERE merge_listing_id = listings.id),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_listing_id FROM m)
  AND COALESCE(status, 'active') = 'active';

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (548, 548, 546, 546)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = businesses.id LIMIT 1),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (548, 548, 546, 546)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id;

DELETE FROM advertiser_account_businesses
WHERE business_id = 548;

UPDATE business_claim_requests
SET resolved_business_id = 546,
    updated_at = datetime('now')
WHERE resolved_business_id = 548;

UPDATE banners
SET business_id = 546
WHERE business_id = 548;
