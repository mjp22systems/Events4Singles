-- Collapse legacy/alias category buckets into the keeper public categories.
-- This is intentionally idempotent so it can repair production databases where
-- earlier taxonomy cleanup code deployed but D1 still exposes retired buckets.

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
  source.listing_id,
  source.new_category_slug,
  source.city_slug,
  source.sort_order,
  source.position_type,
  source.is_active,
  source.starts_at,
  source.expires_at
FROM (
  SELECT
    listing_id,
    CASE category_slug
      WHEN 'dinner_for_six' THEN 'dinner_parties'
      WHEN 'sport_adventure' THEN 'adventure_for_singles'
      WHEN 'golf' THEN 'adventure_for_singles'
      WHEN 'tours4singles' THEN 'solo_travel'
      WHEN 'travel_for_singles' THEN 'solo_travel'
      WHEN 'walks4singles' THEN 'social_walks'
    END AS new_category_slug,
    city_slug,
    sort_order,
    position_type,
    is_active,
    starts_at,
    expires_at
  FROM listing_placements
  WHERE category_slug IN (
    'dinner_for_six',
    'sport_adventure',
    'golf',
    'tours4singles',
    'travel_for_singles',
    'walks4singles'
  )
) AS source
WHERE source.new_category_slug IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM listing_placements AS existing
    WHERE existing.listing_id = source.listing_id
      AND existing.category_slug = source.new_category_slug
      AND COALESCE(existing.city_slug, '') = COALESCE(source.city_slug, '')
  );

DELETE FROM listing_placements
WHERE category_slug IN (
  'dinner_for_six',
  'sport_adventure',
  'golf',
  'tours4singles',
  'travel_for_singles',
  'walks4singles'
);

UPDATE banners
SET category_slug = CASE category_slug
  WHEN 'dinner_for_six' THEN 'dinner_parties'
  WHEN 'sport_adventure' THEN 'adventure_for_singles'
  WHEN 'golf' THEN 'adventure_for_singles'
  WHEN 'tours4singles' THEN 'solo_travel'
  WHEN 'travel_for_singles' THEN 'solo_travel'
  WHEN 'walks4singles' THEN 'social_walks'
  ELSE category_slug
END
WHERE category_slug IN (
  'dinner_for_six',
  'sport_adventure',
  'golf',
  'tours4singles',
  'travel_for_singles',
  'walks4singles'
);

UPDATE events
SET category = CASE category
  WHEN 'dinner_for_six' THEN 'dinner_parties'
  WHEN 'sport_adventure' THEN 'adventure_for_singles'
  WHEN 'golf' THEN 'adventure_for_singles'
  WHEN 'tours4singles' THEN 'solo_travel'
  WHEN 'travel_for_singles' THEN 'solo_travel'
  WHEN 'walks4singles' THEN 'social_walks'
  ELSE category
END
WHERE category IN (
  'dinner_for_six',
  'sport_adventure',
  'golf',
  'tours4singles',
  'travel_for_singles',
  'walks4singles'
);

UPDATE categories
SET status = 'merged'
WHERE slug IN (
  'dinner_for_six',
  'sport_adventure',
  'golf',
  'tours4singles',
  'travel_for_singles',
  'walks4singles'
);

INSERT INTO redirects (from_path, to_path, entity_type, entity_id)
VALUES
  ('/dinner-for-six', '/dinner-parties', 'category', 'dinner_parties'),
  ('/dinner-for-six/:city', '/dinner-parties/:city', 'category', 'dinner_parties'),
  ('/dinner_for_six.htm', '/dinner-parties', 'category', 'dinner_parties'),
  ('/dinner_for_six_:city.htm', '/dinner-parties/:city', 'category', 'dinner_parties'),
  ('/sport-adventure', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/sport-adventure/:city', '/adventure-for-singles/:city', 'category', 'adventure_for_singles'),
  ('/sport_adventure.htm', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/sport_adventure_:city.htm', '/adventure-for-singles/:city', 'category', 'adventure_for_singles'),
  ('/golf', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/golf/:city', '/adventure-for-singles/:city', 'category', 'adventure_for_singles'),
  ('/golf.htm', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/golf_:city.htm', '/adventure-for-singles/:city', 'category', 'adventure_for_singles'),
  ('/tours4singles', '/solo-travel', 'category', 'solo_travel'),
  ('/tours4singles/:city', '/solo-travel/:city', 'category', 'solo_travel'),
  ('/tours4singles.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/tours4singles_:city.htm', '/solo-travel/:city', 'category', 'solo_travel'),
  ('/travel-for-singles', '/solo-travel', 'category', 'solo_travel'),
  ('/travel-for-singles/:city', '/solo-travel/:city', 'category', 'solo_travel'),
  ('/travel_for_singles.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/travel_for_singles_:city.htm', '/solo-travel/:city', 'category', 'solo_travel'),
  ('/walks4singles', '/social-walks', 'category', 'social_walks'),
  ('/walks4singles/:city', '/social-walks/:city', 'category', 'social_walks'),
  ('/walks4singles.htm', '/social-walks', 'category', 'social_walks'),
  ('/walks4singles_:city.htm', '/social-walks/:city', 'category', 'social_walks')
ON CONFLICT(from_path) DO UPDATE SET
  to_path = excluded.to_path,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id;
