-- Add high-confidence location evidence found during the business enrichment sweep.
--
-- These rows came from current web evidence and/or exact address text already in
-- the imported listing copy. Ambiguous regional records stay in review.

WITH location_updates(listing_id, location, location_city, location_state) AS (
  VALUES
    (32, 'Sydney', 'Sydney', 'NSW'),
    (54, 'Perth', 'Perth', 'WA'),
    (184, '321 Albany Creek Road, Bridgeman Downs, QLD 4035', 'Brisbane', 'QLD'),
    (245, 'Sydney', 'Sydney', 'NSW'),
    (362, 'Perth', 'Perth', 'WA'),
    (380, '196 Albion Street, Surry Hills, NSW 2010', 'Sydney', 'NSW'),
    (571, '20 Chester Hill Road, Chester Hill, NSW 2162', 'Sydney', 'NSW'),
    (574, '11 Brixton Street, Cottesloe, WA 6011', 'Perth', 'WA'),
    (487, '46 Lake Street, Northbridge, WA 6003', 'Perth', 'WA'),
    (502, '110 Canterbury Road, Heathmont, VIC 3135', 'Melbourne', 'VIC'),
    (525, 'Melbourne and Sydney', 'National', ''),
    (584, '5 Fern Place, Woollahra, NSW 2022', 'Sydney', 'NSW'),
    (585, 'Sydney, Canberra, Melbourne, Brisbane, Gold Coast and Adelaide', 'National', ''),
    (587, 'Sydney, Melbourne, Brisbane, Adelaide, Perth, Canberra, Newcastle, Wollongong, Gold Coast and Central Coast', 'National', ''),
    (600, 'Belconnen, Canberra, ACT', 'Canberra', 'ACT'),
    (604, '3 Tricks Court, Glen Waverley, VIC 3150', 'Melbourne', 'VIC'),
    (658, '183-185 Pitt Town Road, Kenthurst, NSW 2156', 'Sydney', 'NSW'),
    (746, '55 Exchange Place, Adelaide, SA 5000', 'Adelaide', 'SA'),
    (811, '55 Junction Road, Moorebank, NSW 2170', 'Sydney', 'NSW'),
    (812, 'Suite 4, Level 6, 138 Albert Street, Brisbane, QLD 4000', 'Brisbane', 'QLD')
)
UPDATE listings
SET location = (
      SELECT location
      FROM location_updates
      WHERE location_updates.listing_id = listings.id
    ),
    location_city = (
      SELECT location_city
      FROM location_updates
      WHERE location_updates.listing_id = listings.id
    ),
    location_state = (
      SELECT location_state
      FROM location_updates
      WHERE location_updates.listing_id = listings.id
    ),
    updated_at = datetime('now')
WHERE id IN (SELECT listing_id FROM location_updates)
  AND COALESCE(status, 'active') = 'active';

-- Yvonne Allen & Associates is an introduction agency rather than a mature-events
-- listing; current evidence shows Melbourne and Sydney offices.
UPDATE listing_placements
SET category_slug = 'intro_agencies'
WHERE listing_id = 525
  AND category_slug = 'mature_dating_events'
  AND COALESCE(is_active, 1) = 1
  AND NOT EXISTS (
    SELECT 1
    FROM listing_placements existing
    WHERE existing.listing_id = listing_placements.listing_id
      AND existing.category_slug = 'intro_agencies'
      AND COALESCE(existing.city_slug, '') = COALESCE(listing_placements.city_slug, '')
      AND COALESCE(existing.is_active, 1) = 1
  );

WITH placement_map(listing_id, city_slug) AS (
  VALUES
    (32, 'sydney'),
    (54, 'perth'),
    (184, 'brisbane'),
    (245, 'sydney'),
    (362, 'perth'),
    (380, 'sydney'),
    (571, 'sydney'),
    (574, 'perth'),
    (487, 'perth'),
    (502, 'melbourne'),
    (525, 'melbourne'),
    (525, 'sydney'),
    (584, 'sydney'),
    (585, 'sydney'),
    (585, 'canberra'),
    (585, 'melbourne'),
    (585, 'brisbane'),
    (585, 'gold_coast'),
    (585, 'adelaide'),
    (587, 'sydney'),
    (587, 'melbourne'),
    (587, 'brisbane'),
    (587, 'adelaide'),
    (587, 'perth'),
    (587, 'canberra'),
    (587, 'newcastle'),
    (587, 'wollongong'),
    (587, 'gold_coast'),
    (587, 'central_coast'),
    (600, 'canberra'),
    (604, 'melbourne'),
    (658, 'sydney'),
    (746, 'adelaide'),
    (811, 'sydney'),
    (812, 'brisbane')
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
  p.category_slug,
  pm.city_slug,
  p.sort_order,
  p.position_type,
  1,
  p.starts_at,
  p.expires_at
FROM listing_placements p
JOIN placement_map pm ON pm.listing_id = p.listing_id
WHERE COALESCE(p.is_active, 1) = 1
  AND p.category_slug IS NOT NULL
  AND p.city_slug IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM listing_placements existing
    WHERE existing.listing_id = p.listing_id
      AND existing.category_slug = p.category_slug
      AND existing.city_slug = pm.city_slug
      AND COALESCE(existing.is_active, 1) = 1
  );

UPDATE listing_placements
SET is_active = 0
WHERE listing_id IN (811, 812)
  AND city_slug = 'tbc'
  AND COALESCE(is_active, 1) = 1;
