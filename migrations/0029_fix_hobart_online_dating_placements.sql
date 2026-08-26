-- Consolidate Tasmania into Hobart and remove online-dating listings that were
-- accidentally classified as Dinner Parties during the legacy import cleanup.

DELETE FROM listing_placements
WHERE city_slug = 'tasmania'
  AND EXISTS (
    SELECT 1
    FROM listing_placements AS existing
    WHERE existing.listing_id = listing_placements.listing_id
      AND existing.category_slug IS listing_placements.category_slug
      AND existing.city_slug = 'hobart'
  );

UPDATE listing_placements
SET city_slug = 'hobart'
WHERE city_slug = 'tasmania';

UPDATE banners
SET city_slug = 'hobart'
WHERE city_slug = 'tasmania';

UPDATE listings
SET location_city = 'Hobart'
WHERE location_city = 'Tasmania';

UPDATE listings
SET location = 'Hobart'
WHERE location = 'Tasmania';

DELETE FROM cities
WHERE slug = 'tasmania';

DELETE FROM listing_placements
WHERE listing_id IN (85, 471)
  AND category_slug = 'dinner_parties';
