-- Remaining proofread review cleanup.

UPDATE listings
SET location = 'Melbourne',
    location_city = 'Melbourne',
    location_state = 'VIC',
    updated_at = datetime('now')
WHERE id = 175;

UPDATE listings
SET location = 'New Zealand',
    location_city = 'International',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 312;

UPDATE listings
SET title = 'Chateau de Tennessus',
    location = 'Poitou-Charentes',
    location_city = 'International',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 348;

UPDATE businesses
SET name = 'Chateau de Tennessus',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 348);

UPDATE listings
SET title = 'Sounds of Sirius',
    location = 'Australia wide',
    location_city = 'National',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 424;

UPDATE businesses
SET name = 'Sounds of Sirius',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 424);

UPDATE listings
SET title = 'L''Eveche',
    location = 'Vaison-la-Romaine, Provence',
    location_city = 'International',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 501;

UPDATE businesses
SET name = 'L''Eveche',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 501);

UPDATE listings
SET title = 'Aux Anges Gardiens',
    location = 'Villeneuve-les-Beziers, France',
    location_city = 'International',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 506;

UPDATE businesses
SET name = 'Aux Anges Gardiens',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 506);

UPDATE listings
SET location = 'Point Lookout',
    location_city = 'Brisbane',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 654;

UPDATE listings
SET title = 'Tuesday Danceroc Night at Rigby''s',
    location = 'Perth',
    location_city = 'Perth',
    location_state = 'WA',
    updated_at = datetime('now')
WHERE id = 673;

UPDATE businesses
SET name = 'Tuesday Danceroc Night at Rigby''s',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 673);

UPDATE listing_placements
SET city_slug = 'perth'
WHERE listing_id = 673
  AND city_slug IS NULL;

UPDATE listings
SET location = 'Melbourne',
    location_city = 'Melbourne',
    location_state = 'VIC',
    updated_at = datetime('now')
WHERE id = 719;

UPDATE listings
SET location = 'National',
    location_city = 'National',
    location_state = '',
    updated_at = datetime('now')
WHERE id IN (809, 813);

UPDATE listings
SET location = 'Brisbane',
    location_city = 'Brisbane',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 814;

UPDATE listings
SET location = 'Sydney',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id IN (818, 819);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (654, 654, 435, 435)
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
    (654, 654, 435, 435)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(deleted_reason, 'Proofread cleanup merged duplicate into listing #435'),
    merged_into_listing_id = 435,
    business_id = 435,
    updated_at = datetime('now')
WHERE id IN (SELECT merge_listing_id FROM m)
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET status = 'merged',
    merged_into_business_id = 435,
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id = 654;

INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 435, role, is_primary, status, created_at, datetime('now')
FROM advertiser_account_businesses
WHERE business_id = 654;

DELETE FROM advertiser_account_businesses
WHERE business_id = 654;

UPDATE business_claim_requests
SET resolved_business_id = 435,
    updated_at = datetime('now')
WHERE resolved_business_id = 654;

UPDATE banners
SET business_id = 435
WHERE business_id = 654;

UPDATE listings
SET status = 'archived',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(deleted_reason, 'Archived from launch: stale dated 2007 singles holiday listing.'),
    updated_at = datetime('now')
WHERE id = 539
  AND COALESCE(status, 'active') = 'active';
