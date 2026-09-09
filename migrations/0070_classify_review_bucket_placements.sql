-- Classify high-confidence review-bucket placements from the public business directory audit.
--
-- Owner direction on 2026-09-09: use obvious title/content logic to reduce the
-- legacy `events`, `tbc`, and missing-location review filters, but leave vague
-- records in review for manual decisions.

INSERT OR IGNORE INTO cities (slug, label, state, region, seo_title, seo_description)
VALUES
  ('national', 'National', '', NULL, NULL, NULL),
  ('online', 'Online', '', NULL, NULL, NULL);

WITH category_map(listing_id, category_slug) AS (
  VALUES
    (8, 'dinner_parties'),
    (768, 'speed_dating'),
    (779, 'speed_dating'),
    (527, 'social_clubs'),
    (782, 'intro_agencies'),
    (577, 'dinner_parties'),
    (767, 'adventure_for_singles'),
    (155, 'social_clubs'),
    (163, 'dance_tango'),
    (784, 'intro_agencies'),
    (785, 'social_clubs'),
    (602, 'social_clubs'),
    (788, 'social_clubs'),
    (251, 'online_dating'),
    (328, 'dance_party_clubs'),
    (623, 'intro_agencies'),
    (372, 'dinner_parties'),
    (630, 'dance_classes'),
    (630, 'dance_salsa'),
    (630, 'dance_latin_style'),
    (775, 'dance_party_clubs'),
    (775, 'dance_latin_style'),
    (391, 'intro_agencies'),
    (540, 'intro_agencies'),
    (402, 'social_clubs'),
    (418, 'social_clubs'),
    (645, 'intro_agencies'),
    (477, 'social_clubs'),
    (670, 'social_clubs'),
    (547, 'seminars'),
    (764, 'intro_agencies'),
    (509, 'intro_agencies'),
    (776, 'social_clubs'),
    (680, 'social_clubs'),
    (808, 'dance_classes'),
    (808, 'dance_salsa'),
    (809, 'solo_travel'),
    (812, 'intro_agencies'),
    (814, 'social_clubs'),
    (815, 'solo_travel'),
    (816, 'seminars'),
    (817, 'life_coaches'),
    (822, 'social_clubs'),
    (822, 'dance_party_clubs')
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
  p.listing_id,
  cm.category_slug,
  p.city_slug,
  p.sort_order,
  p.position_type,
  1,
  p.starts_at,
  p.expires_at
FROM listing_placements p
JOIN category_map cm ON cm.listing_id = p.listing_id
WHERE COALESCE(p.is_active, 1) = 1
  AND p.category_slug IN ('events', 'tbc')
  AND NOT EXISTS (
    SELECT 1
    FROM listing_placements existing
    WHERE existing.listing_id = p.listing_id
      AND existing.category_slug = cm.category_slug
      AND COALESCE(existing.city_slug, '') = COALESCE(p.city_slug, '')
      AND COALESCE(existing.is_active, 1) = 1
  );

UPDATE listing_placements
SET is_active = 0
WHERE COALESCE(is_active, 1) = 1
  AND category_slug IN ('events', 'tbc')
  AND listing_id IN (
    8, 768, 779, 527, 782, 577, 767, 155, 163, 784, 785, 602, 788, 251,
    328, 623, 372, 630, 775, 391, 540, 402, 418, 645, 477, 670, 547,
    764, 509, 776, 680, 808, 809, 812, 814, 815, 816, 817, 822
  );

UPDATE listing_placements
SET city_slug = CASE listing_id
  WHEN 813 THEN 'national'
  WHEN 818 THEN 'sydney'
  WHEN 819 THEN 'sydney'
  WHEN 814 THEN 'brisbane'
  WHEN 809 THEN 'national'
  ELSE city_slug
END
WHERE COALESCE(is_active, 1) = 1
  AND city_slug = 'tbc'
  AND listing_id IN (813, 818, 819, 814, 809);

UPDATE listing_placements
SET city_slug = CASE lower(trim(l.location_city))
  WHEN 'adelaide' THEN 'adelaide'
  WHEN 'brisbane' THEN 'brisbane'
  WHEN 'cairns' THEN 'cairns'
  WHEN 'canberra' THEN 'canberra'
  WHEN 'central coast' THEN 'central_coast'
  WHEN 'darwin' THEN 'darwin'
  WHEN 'geelong' THEN 'geelong'
  WHEN 'gold coast' THEN 'gold_coast'
  WHEN 'hobart' THEN 'hobart'
  WHEN 'international' THEN 'international'
  WHEN 'melbourne' THEN 'melbourne'
  WHEN 'national' THEN 'national'
  WHEN 'newcastle' THEN 'newcastle'
  WHEN 'online' THEN 'online'
  WHEN 'perth' THEN 'perth'
  WHEN 'sydney' THEN 'sydney'
  WHEN 'toowoomba' THEN 'toowoomba'
  WHEN 'wollongong' THEN 'wollongong'
  ELSE city_slug
END
FROM listings l
WHERE listing_placements.listing_id = l.id
  AND COALESCE(listing_placements.is_active, 1) = 1
  AND listing_placements.city_slug IS NULL
  AND lower(trim(COALESCE(l.location_city, ''))) IN (
    'adelaide',
    'brisbane',
    'cairns',
    'canberra',
    'central coast',
    'darwin',
    'geelong',
    'gold coast',
    'hobart',
    'international',
    'melbourne',
    'national',
    'newcastle',
    'online',
    'perth',
    'sydney',
    'toowoomba',
    'wollongong'
  );
