-- Proofread listing titles and hide stale/low-confidence legacy rows from launch.

UPDATE listings
SET title = 'Dating Matchmakers',
    description = REPLACE(description, 'Dating Matchmakers-', 'Dating Matchmakers'),
    updated_at = datetime('now')
WHERE id = 119;

UPDATE businesses
SET name = 'Dating Matchmakers',
    description = REPLACE(description, 'Dating Matchmakers-', 'Dating Matchmakers'),
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 119);

UPDATE listings
SET title = 'Entrepreneurs Sydney Business Club',
    tagline = 'Join Now',
    updated_at = datetime('now')
WHERE id = 139;

UPDATE businesses
SET name = 'Entrepreneurs Sydney Business Club',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 139);

UPDATE listings
SET title = 'Copacabana',
    updated_at = datetime('now')
WHERE id = 100;

UPDATE businesses
SET name = 'Copacabana',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 100);

UPDATE listings
SET title = 'Forest Yoga',
    updated_at = datetime('now')
WHERE id = 590;

UPDATE businesses
SET name = 'Forest Yoga',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 590);

UPDATE listings
SET title = 'Jazz in the Tops',
    updated_at = datetime('now')
WHERE id = 197;

UPDATE businesses
SET name = 'Jazz in the Tops',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 197);

UPDATE listings
SET title = 'Fergusson Winery',
    location = 'Yarra Glen',
    location_city = 'Melbourne',
    location_state = 'VIC',
    updated_at = datetime('now')
WHERE id = 518;

UPDATE businesses
SET name = 'Fergusson Winery',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 518);

UPDATE listings
SET title = 'Strathvea Guest House',
    location = 'Healesville',
    location_city = 'Melbourne',
    location_state = 'VIC',
    updated_at = datetime('now')
WHERE id = 178;

UPDATE businesses
SET name = 'Strathvea Guest House',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 178);

UPDATE listings
SET title = 'Bimbadeen Estate',
    location = 'Mount View',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 300;

UPDATE businesses
SET name = 'Bimbadeen Estate',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 300);

UPDATE listings
SET title = 'Nulkaba House',
    location = 'Nulkaba',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 310;

UPDATE businesses
SET name = 'Nulkaba House',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 310);

UPDATE listings
SET title = 'Lake Weyba Cottages',
    location = 'Peregian Beach',
    location_city = 'Brisbane',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 338;

UPDATE businesses
SET name = 'Lake Weyba Cottages',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 338);

UPDATE listings
SET title = 'Carindale Wines',
    location = 'Pokolbin',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 349;

UPDATE businesses
SET name = 'Carindale Wines',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 349);

UPDATE listings
SET title = 'Patrick Plains Estate',
    location = 'Pokolbin',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 350;

UPDATE businesses
SET name = 'Patrick Plains Estate',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 350);

UPDATE listings
SET title = 'The Hunter Habit',
    location = 'Pokolbin',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 352;

UPDATE businesses
SET name = 'The Hunter Habit',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 352);

UPDATE listings
SET title = 'Stradbroke Island Beach Hotel',
    location = 'Point Lookout',
    location_city = 'Brisbane',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 435;

UPDATE businesses
SET name = 'Stradbroke Island Beach Hotel',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 435);

UPDATE listings
SET title = 'The Cats Corner',
    tagline = 'Vicrock.com.au',
    updated_at = datetime('now')
WHERE id = 478;

UPDATE businesses
SET name = 'The Cats Corner',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 478);

UPDATE listings
SET title = 'BookRetreats',
    tagline = 'Australia Singles Retreats',
    updated_at = datetime('now')
WHERE id = 755;

UPDATE businesses
SET name = 'BookRetreats',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 755);

UPDATE listings
SET title = 'CruiseAbout',
    tagline = 'Solo Cruises',
    updated_at = datetime('now')
WHERE id = 735;

UPDATE businesses
SET name = 'CruiseAbout',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 735);

UPDATE listings
SET title = 'CruiseAway',
    tagline = 'Singles Cruises',
    updated_at = datetime('now')
WHERE id = 732;

UPDATE businesses
SET name = 'CruiseAway',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 732);

UPDATE listings
SET title = 'PureTravel',
    tagline = 'Singles Cruises',
    updated_at = datetime('now')
WHERE id = 734;

UPDATE businesses
SET name = 'PureTravel',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 734);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (407, 407, 408, 408),
    (594, 594, 593, 593),
    (628, 628, 370, 370),
    (634, 634, 391, 391),
    (657, 657, 656, 656),
    (664, 664, 534, 534)
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
    (407, 407, 408, 408),
    (594, 594, 593, 593),
    (628, 628, 370, 370),
    (634, 634, 391, 391),
    (657, 657, 656, 656),
    (664, 664, 534, 534)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Proofread cleanup merged duplicate into listing #' || (
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
    (407, 407, 408, 408),
    (594, 594, 593, 593),
    (628, 628, 370, 370),
    (634, 634, 391, 391),
    (657, 657, 656, 656),
    (664, 664, 534, 534)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = businesses.id LIMIT 1),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (407, 407, 408, 408),
    (594, 594, 593, 593),
    (628, 628, 370, 370),
    (634, 634, 391, 391),
    (657, 657, 656, 656),
    (664, 664, 534, 534)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id;

DELETE FROM advertiser_account_businesses
WHERE business_id IN (407, 594, 628, 634, 657, 664);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (407, 407, 408, 408),
    (594, 594, 593, 593),
    (628, 628, 370, 370),
    (634, 634, 391, 391),
    (657, 657, 656, 656),
    (664, 664, 534, 534)
)
UPDATE business_claim_requests
SET resolved_business_id = (
      SELECT keep_business_id FROM m WHERE merge_business_id = business_claim_requests.resolved_business_id LIMIT 1
    ),
    updated_at = datetime('now')
WHERE resolved_business_id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (407, 407, 408, 408),
    (594, 594, 593, 593),
    (628, 628, 370, 370),
    (634, 634, 391, 391),
    (657, 657, 656, 656),
    (664, 664, 534, 534)
)
UPDATE banners
SET business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = banners.business_id LIMIT 1)
WHERE business_id IN (SELECT merge_business_id FROM m);

UPDATE listings
SET status = 'archived',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(deleted_reason, 'Archived from launch: stale dated legacy event or location-only scraped row.'),
    updated_at = datetime('now')
WHERE id IN (48, 165, 198, 307, 559, 583, 599, 609, 675)
  AND COALESCE(status, 'active') = 'active';
