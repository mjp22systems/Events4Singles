-- Remaining obvious listing merges after field-integrity cleanup.
-- Keeps richer canonical rows and preserves placements/claim ownership.

UPDATE listings
SET title = 'Dance Amanda',
    tagline = 'West Coast Swing, Argentine Tango, Salsa, Samba, Zumba',
    mobile = COALESCE(NULLIF(mobile, ''), '0421192080'),
    location = 'Perth',
    location_city = 'Perth',
    location_state = 'WA',
    updated_at = datetime('now')
WHERE id = 106;

UPDATE businesses
SET name = 'Dance Amanda',
    updated_at = datetime('now')
WHERE id = 106;

UPDATE listings
SET title = 'Nuroc Dance Company',
    tagline = 'Modern Jive partner dance',
    location = 'Kenthurst',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 311;

UPDATE businesses
SET name = 'Nuroc Dance Company',
    updated_at = datetime('now')
WHERE id = 311;

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (12, 12, 11, 11),
    (113, 113, 112, 112),
    (576, 576, 102, 102),
    (595, 595, 177, 177),
    (213, 213, 212, 212),
    (611, 611, 259, 259),
    (613, 613, 270, 270),
    (617, 617, 311, 311)
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
    (12, 12, 11, 11),
    (113, 113, 112, 112),
    (576, 576, 102, 102),
    (595, 595, 177, 177),
    (213, 213, 212, 212),
    (611, 611, 259, 259),
    (613, 613, 270, 270),
    (617, 617, 311, 311)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Remaining obvious duplicate of listing #' || (
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
    (12, 12, 11, 11),
    (113, 113, 112, 112),
    (576, 576, 102, 102),
    (595, 595, 177, 177),
    (213, 213, 212, 212),
    (611, 611, 259, 259),
    (613, 613, 270, 270),
    (617, 617, 311, 311)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = businesses.id LIMIT 1),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (12, 12, 11, 11),
    (113, 113, 112, 112),
    (576, 576, 102, 102),
    (595, 595, 177, 177),
    (213, 213, 212, 212),
    (611, 611, 259, 259),
    (613, 613, 270, 270),
    (617, 617, 311, 311)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id;

DELETE FROM advertiser_account_businesses
WHERE business_id IN (12, 113, 576, 595, 213, 611, 613, 617);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (12, 12, 11, 11),
    (113, 113, 112, 112),
    (576, 576, 102, 102),
    (595, 595, 177, 177),
    (213, 213, 212, 212),
    (611, 611, 259, 259),
    (613, 613, 270, 270),
    (617, 617, 311, 311)
)
UPDATE business_claim_requests
SET resolved_business_id = (
      SELECT keep_business_id FROM m WHERE merge_business_id = business_claim_requests.resolved_business_id LIMIT 1
    ),
    updated_at = datetime('now')
WHERE resolved_business_id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (12, 12, 11, 11),
    (113, 113, 112, 112),
    (576, 576, 102, 102),
    (595, 595, 177, 177),
    (213, 213, 212, 212),
    (611, 611, 259, 259),
    (613, 613, 270, 270),
    (617, 617, 311, 311)
)
UPDATE banners
SET business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = banners.business_id LIMIT 1)
WHERE business_id IN (SELECT merge_business_id FROM m);
