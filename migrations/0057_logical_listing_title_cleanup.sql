-- Logical listing title cleanup.
-- Moves obvious scraped location/tagline/presenter text out of listing names and
-- merges high-confidence duplicate rows while preserving placements and ownership.

UPDATE listings
SET title = 'Big Hit Profiles',
    tagline = 'Photos, advice, profile makeovers',
    updated_at = datetime('now')
WHERE id = 49;

UPDATE businesses
SET name = 'Big Hit Profiles',
    updated_at = datetime('now')
WHERE id = 49;

UPDATE listings
SET title = 'PS Murray Princess',
    tagline = 'Captain Cook Cruises presents',
    updated_at = datetime('now')
WHERE id = 73;

UPDATE businesses
SET name = 'Captain Cook Cruises',
    updated_at = datetime('now')
WHERE id = 73;

UPDATE listings
SET title = 'Kilikanoon',
    location = 'Clare Valley',
    location_city = 'No Location Review',
    location_state = 'SA',
    updated_at = datetime('now')
WHERE id = 93;

UPDATE businesses
SET name = 'Kilikanoon',
    updated_at = datetime('now')
WHERE id = 93;

UPDATE listings
SET title = 'Dating ''n More',
    tagline = 'Free Dating Site and Forum',
    updated_at = datetime('now')
WHERE id = 120;

UPDATE businesses
SET name = 'Dating ''n More',
    updated_at = datetime('now')
WHERE id = 120;

UPDATE listings
SET title = 'Eastern Europe Fully Guided Tour',
    tagline = '2015',
    listing_type = 'event_organizer',
    updated_at = datetime('now')
WHERE id = 583;

UPDATE businesses
SET name = 'Eastern Europe Fully Guided Tour',
    updated_at = datetime('now')
WHERE id = 583;

UPDATE listings
SET title = 'Fusion Dance and Lifestyle Studio',
    location = 'Fitzroy',
    location_city = 'Melbourne',
    location_state = 'VIC',
    updated_at = datetime('now')
WHERE id = 164;

UPDATE businesses
SET name = 'Fusion Dance and Lifestyle Studio',
    updated_at = datetime('now')
WHERE id = 164;

UPDATE listings
SET title = 'World Of Fitness',
    location = 'Hornsby',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 181;

UPDATE businesses
SET name = 'World Of Fitness',
    updated_at = datetime('now')
WHERE id = 181;

UPDATE listings
SET title = 'Stuart Range Estates',
    location = 'Kingaroy',
    location_city = 'Brisbane',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 215;

UPDATE businesses
SET name = 'Stuart Range Estates',
    updated_at = datetime('now')
WHERE id = 215;

UPDATE listings
SET title = 'Chateau de Puy Chenin',
    tagline = 'Bed & Breakfast France',
    location = 'La Rochelle',
    location_city = 'International',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 219;

UPDATE businesses
SET name = 'Chateau de Puy Chenin',
    updated_at = datetime('now')
WHERE id = 219;

UPDATE listings
SET title = 'Newcastle Jazz Festival',
    listing_type = 'event_organizer',
    location = 'Newcastle',
    location_city = 'Newcastle',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 304;

UPDATE businesses
SET name = 'Newcastle Jazz Festival',
    updated_at = datetime('now')
WHERE id = 304;

UPDATE listing_placements
SET is_active = 0
WHERE listing_id = 304
  AND category_slug = 'jazz'
  AND city_slug = 'sydney';

UPDATE listings
SET tagline = 'Life Coaching',
    contact_name = 'Celia Bray',
    location = 'Hobart',
    location_city = 'Hobart',
    location_state = 'TAS',
    updated_at = datetime('now')
WHERE id = 314;

UPDATE listings
SET title = 'Headshots Brisbane',
    tagline = 'Dating profile photography',
    contact_name = 'Sheona Beach',
    location = 'Brisbane',
    location_city = 'Brisbane',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 760;

UPDATE businesses
SET name = 'Headshots Brisbane',
    updated_at = datetime('now')
WHERE id = 760;

UPDATE listings
SET title = 'Sacred Self',
    tagline = 'Australia wide, International',
    location = 'Sydney',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 777;

UPDATE businesses
SET name = 'Sacred Self',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 777);

UPDATE listings
SET title = 'PIPERS New Zealand Pages',
    tagline = 'Singles & Dating - New Zealand Web Sites',
    location = 'New Zealand',
    location_city = 'International',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 405;

UPDATE businesses
SET name = 'PIPERS New Zealand Pages',
    updated_at = datetime('now')
WHERE id = 405;

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (417, 417, 416, 416),
    (421, 421, 420, 420),
    (561, 561, 49, 49)
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
    (417, 417, 416, 416),
    (421, 421, 420, 420),
    (561, 561, 49, 49)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Logical title cleanup merged duplicate into listing #' || (
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
    (417, 417, 416, 416),
    (421, 421, 420, 420),
    (561, 561, 49, 49)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = businesses.id LIMIT 1),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (417, 417, 416, 416),
    (421, 421, 420, 420),
    (561, 561, 49, 49)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id;

DELETE FROM advertiser_account_businesses
WHERE business_id IN (417, 421, 561);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (417, 417, 416, 416),
    (421, 421, 420, 420),
    (561, 561, 49, 49)
)
UPDATE business_claim_requests
SET resolved_business_id = (
      SELECT keep_business_id FROM m WHERE merge_business_id = business_claim_requests.resolved_business_id LIMIT 1
    ),
    updated_at = datetime('now')
WHERE resolved_business_id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (417, 417, 416, 416),
    (421, 421, 420, 420),
    (561, 561, 49, 49)
)
UPDATE banners
SET business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = banners.business_id LIMIT 1)
WHERE business_id IN (SELECT merge_business_id FROM m);
