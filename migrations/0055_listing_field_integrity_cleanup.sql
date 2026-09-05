-- Listing field-integrity cleanup.
-- Moves location/service text out of titles and suppresses obvious scraped
-- heading rows by merging them into the real canonical listing.

UPDATE listings
SET title = 'Bikram''s Yoga College of India',
    location = 'Lane Cove',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 50;

UPDATE businesses
SET name = 'Bikram''s Yoga College of India',
    updated_at = datetime('now')
WHERE id = 50;

UPDATE listings
SET title = 'Della Cory',
    tagline = 'Upscale Dating Agency & Matchmaking Service',
    updated_at = datetime('now')
WHERE id = 123;

UPDATE businesses
SET name = 'Della Cory',
    updated_at = datetime('now')
WHERE id = 123;

UPDATE listings
SET title = 'Crystal Creek',
    location = 'Via Murwillumbah',
    location_city = 'Byron Bay',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 101;

UPDATE businesses
SET name = 'Crystal Creek',
    updated_at = datetime('now')
WHERE id = 101;

UPDATE listing_placements
SET city_slug = 'byron_bay'
WHERE listing_id IN (101, 143)
  AND category_slug = 'retreats_for_singles'
  AND city_slug = 'sydney';

UPDATE listings
SET title = 'Latin Energy Productions',
    tagline = 'The home of Salsa and more!',
    updated_at = datetime('now')
WHERE id = 221;

UPDATE businesses
SET name = 'Latin Energy Productions',
    updated_at = datetime('now')
WHERE id = 221;

UPDATE listings
SET title = 'Lifeforce Enterprises',
    tagline = 'Personal development, personal well being, life skills',
    updated_at = datetime('now')
WHERE id = 245;

UPDATE businesses
SET name = 'Lifeforce Enterprises',
    updated_at = datetime('now')
WHERE id = 245;

UPDATE listings
SET title = 'Cuban Dance Academy',
    location = '1/469 Johnston St, Abbotsford',
    location_city = 'Melbourne',
    location_state = 'VIC',
    updated_at = datetime('now')
WHERE id = 102;

UPDATE businesses
SET name = 'Cuban Dance Academy',
    updated_at = datetime('now')
WHERE id = 102;

UPDATE listings
SET title = 'Keeping Up Appearances',
    tagline = 'Image Consultancy',
    updated_at = datetime('now')
WHERE id = 213;

UPDATE businesses
SET name = 'Keeping Up Appearances',
    updated_at = datetime('now')
WHERE id = 213;

UPDATE listings
SET title = 'Loves Not Blind',
    tagline = 'Photography for online profiles',
    updated_at = datetime('now')
WHERE id = 259;

UPDATE businesses
SET name = 'Loves Not Blind',
    updated_at = datetime('now')
WHERE id = 259;

UPDATE listings
SET title = 'LuvSource',
    tagline = 'Internet Dating Resource',
    updated_at = datetime('now')
WHERE id = 262;

UPDATE businesses
SET name = 'LuvSource',
    updated_at = datetime('now')
WHERE id = 262;

UPDATE listings
SET title = 'Market Street Tavern',
    tagline = 'Dance Party',
    updated_at = datetime('now')
WHERE id = 270;

UPDATE businesses
SET name = 'Market Street Tavern',
    updated_at = datetime('now')
WHERE id = 270;

UPDATE listings
SET title = 'Harmony Body and Mind',
    location = 'Nerang',
    location_city = 'Gold Coast',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 177;

UPDATE businesses
SET name = 'Harmony Body and Mind',
    updated_at = datetime('now')
WHERE id = 177;

UPDATE listing_placements
SET city_slug = 'gold_coast'
WHERE listing_id = 177
  AND city_slug = 'brisbane';

UPDATE listings
SET title = 'Shanti Yoga',
    location = 'Southport',
    location_city = 'Gold Coast',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 393;

UPDATE businesses
SET name = 'Shanti Yoga',
    updated_at = datetime('now')
WHERE id = 393;

UPDATE listing_placements
SET city_slug = 'gold_coast'
WHERE listing_id = 393
  AND city_slug = 'brisbane';

UPDATE listings
SET title = 'Network Social Club',
    location = 'Melbourne',
    location_city = 'Melbourne',
    location_state = 'VIC',
    updated_at = datetime('now')
WHERE id = 616;

UPDATE businesses
SET name = 'Network Social Club',
    updated_at = datetime('now')
WHERE id = 616;

UPDATE listings
SET title = 'Nuroc Dance Dance Company',
    location = 'Kenthurst',
    location_city = 'Sydney',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 617;

UPDATE businesses
SET name = 'Nuroc Dance Dance Company',
    updated_at = datetime('now')
WHERE id = 617;

UPDATE listings
SET email = COALESCE(NULLIF(email, ''), 'michael@linkintroductions.com.au'),
    phone = COALESCE(NULLIF(phone, ''), '08-8362-5488'),
    description = 'Respect, honesty, discretion.',
    updated_at = datetime('now')
WHERE id = 806;

UPDATE listings
SET phone = COALESCE(NULLIF(phone, ''), '08-8269-1453'),
    description = 'Come and enjoy with us!',
    updated_at = datetime('now')
WHERE id = 807;

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (84, 84, 86, 86),
    (116, 116, 118, 118),
    (127, 127, 128, 128),
    (138, 138, 660, 660),
    (143, 143, 101, 101),
    (303, 303, 630, 630),
    (315, 315, 316, 316),
    (356, 356, 221, 221),
    (375, 375, 630, 630),
    (376, 376, 630, 630),
    (455, 455, 245, 245),
    (608, 608, 245, 245),
    (631, 631, 630, 630),
    (632, 632, 668, 668),
    (639, 639, 603, 603)
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
    (84, 84, 86, 86),
    (116, 116, 118, 118),
    (127, 127, 128, 128),
    (138, 138, 660, 660),
    (143, 143, 101, 101),
    (303, 303, 630, 630),
    (315, 315, 316, 316),
    (356, 356, 221, 221),
    (375, 375, 630, 630),
    (376, 376, 630, 630),
    (455, 455, 245, 245),
    (608, 608, 245, 245),
    (631, 631, 630, 630),
    (632, 632, 668, 668),
    (639, 639, 603, 603)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Field-integrity cleanup merged scraped heading/duplicate into listing #' || (
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
    (84, 84, 86, 86),
    (116, 116, 118, 118),
    (127, 127, 128, 128),
    (138, 138, 660, 660),
    (143, 143, 101, 101),
    (303, 303, 630, 630),
    (315, 315, 316, 316),
    (356, 356, 221, 221),
    (375, 375, 630, 630),
    (376, 376, 630, 630),
    (455, 455, 245, 245),
    (608, 608, 245, 245),
    (631, 631, 630, 630),
    (632, 632, 668, 668),
    (639, 639, 603, 603)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = businesses.id LIMIT 1),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (84, 84, 86, 86),
    (116, 116, 118, 118),
    (127, 127, 128, 128),
    (138, 138, 660, 660),
    (143, 143, 101, 101),
    (303, 303, 630, 630),
    (315, 315, 316, 316),
    (356, 356, 221, 221),
    (375, 375, 630, 630),
    (376, 376, 630, 630),
    (455, 455, 245, 245),
    (608, 608, 245, 245),
    (631, 631, 630, 630),
    (632, 632, 668, 668),
    (639, 639, 603, 603)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id;

DELETE FROM advertiser_account_businesses
WHERE business_id IN (84, 116, 127, 138, 143, 303, 315, 356, 375, 376, 455, 608, 631, 632, 639);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (84, 84, 86, 86),
    (116, 116, 118, 118),
    (127, 127, 128, 128),
    (138, 138, 660, 660),
    (143, 143, 101, 101),
    (303, 303, 630, 630),
    (315, 315, 316, 316),
    (356, 356, 221, 221),
    (375, 375, 630, 630),
    (376, 376, 630, 630),
    (455, 455, 245, 245),
    (608, 608, 245, 245),
    (631, 631, 630, 630),
    (632, 632, 668, 668),
    (639, 639, 603, 603)
)
UPDATE business_claim_requests
SET resolved_business_id = (
      SELECT keep_business_id FROM m WHERE merge_business_id = business_claim_requests.resolved_business_id LIMIT 1
    ),
    updated_at = datetime('now')
WHERE resolved_business_id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (84, 84, 86, 86),
    (116, 116, 118, 118),
    (127, 127, 128, 128),
    (138, 138, 660, 660),
    (143, 143, 101, 101),
    (303, 303, 630, 630),
    (315, 315, 316, 316),
    (356, 356, 221, 221),
    (375, 375, 630, 630),
    (376, 376, 630, 630),
    (455, 455, 245, 245),
    (608, 608, 245, 245),
    (631, 631, 630, 630),
    (632, 632, 668, 668),
    (639, 639, 603, 603)
)
UPDATE banners
SET business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = banners.business_id LIMIT 1)
WHERE business_id IN (SELECT merge_business_id FROM m);

UPDATE listings
SET phone = '0295860009',
    mobile = '0407701328',
    email = COALESCE(NULLIF(email, ''), 'info@ruedisima.com.au'),
    web = COALESCE(NULLIF(web, ''), 'ruedisima.com.au'),
    location = COALESCE(NULLIF(location, ''), 'Mayfield'),
    location_city = 'Newcastle',
    location_state = 'NSW',
    updated_at = datetime('now')
WHERE id = 630;

UPDATE businesses
SET website = COALESCE(NULLIF(website, ''), 'ruedisima.com.au'),
    email = COALESCE(NULLIF(email, ''), 'info@ruedisima.com.au'),
    phone = '0295860009',
    mobile = '0407701328',
    updated_at = datetime('now')
WHERE id = 630;
