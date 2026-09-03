INSERT INTO categories (
  slug,
  label,
  parent_slug,
  sort_order,
  description,
  seo_intro,
  banner_row_count,
  seo_title,
  seo_description,
  hero_image_url,
  status
) VALUES
  (
    'dinner_parties',
    'Dinner Parties',
    NULL,
    20,
    'Hosted dinner parties, Dinner for Six style tables and shared dining events where singles can meet over a meal.',
    'Singles dinner parties create a warmer pace for meeting people, from intimate Dinner for Six style tables through to hosted shared meals with more time for real conversation.',
    1,
    'Singles Dinner Parties and Dinner for Six Australia | Events4Singles',
    'Find singles dinner parties, hosted dinners, Dinner for Six style tables and social dining events in Australia.',
    '/images/categories/heroes/dinner-for-six.webp',
    'active'
  ),
  (
    'adventure_for_singles',
    'Adventure for Singles',
    NULL,
    40,
    'Sport, adventure, outdoor activities and active days out for singles who prefer doing something together.',
    'Adventure for singles brings sport, active outings and outdoor experiences into one place for people who would rather meet while moving, exploring or sharing something memorable.',
    1,
    'Adventure, Sport and Outdoor Activities for Singles Australia | Events4Singles',
    'Find sport, adventure activities, outdoor experiences and active events for singles in Australia.',
    '/images/categories/heroes/adventure-for-singles.webp',
    'active'
  ),
  (
    'solo_travel',
    'Solo Travel',
    NULL,
    44,
    'Solo travel, tours for singles, group trips and getaways built for independent guests.',
    'Solo travel listings help independent singles find tours, group trips and getaways designed to feel comfortable when you are travelling on your own but still want shared company.',
    1,
    'Solo Travel and Tours for Singles Australia | Events4Singles',
    'Find solo travel, tours for singles, group trips and getaway options for Australian singles.',
    '/images/categories/heroes/tours4singles.webp',
    'active'
  )
ON CONFLICT(slug) DO UPDATE SET
  label = excluded.label,
  parent_slug = excluded.parent_slug,
  sort_order = excluded.sort_order,
  description = excluded.description,
  seo_intro = excluded.seo_intro,
  banner_row_count = excluded.banner_row_count,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  hero_image_url = excluded.hero_image_url,
  status = excluded.status;

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
      WHEN 'tours4singles' THEN 'solo_travel'
    END AS new_category_slug,
    city_slug,
    sort_order,
    position_type,
    is_active,
    starts_at,
    expires_at
  FROM listing_placements
  WHERE category_slug IN ('dinner_for_six', 'sport_adventure', 'tours4singles')
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
WHERE category_slug IN ('dinner_for_six', 'sport_adventure', 'tours4singles');

UPDATE banners SET category_slug = 'dinner_parties' WHERE category_slug = 'dinner_for_six';
UPDATE banners SET category_slug = 'adventure_for_singles' WHERE category_slug = 'sport_adventure';
UPDATE banners SET category_slug = 'solo_travel' WHERE category_slug = 'tours4singles';

UPDATE events SET category = 'dinner_parties' WHERE category = 'dinner_for_six';
UPDATE events SET category = 'adventure_for_singles' WHERE category = 'sport_adventure';
UPDATE events SET category = 'solo_travel' WHERE category = 'tours4singles';

UPDATE categories
SET status = 'merged'
WHERE slug IN ('dinner_for_six', 'sport_adventure', 'tours4singles');

INSERT INTO redirects (from_path, to_path, entity_type, entity_id)
VALUES
  ('/dinner-for-six', '/dinner-parties', 'category', 'dinner_parties'),
  ('/dinner-for-six/:city', '/dinner-parties/:city', 'category', 'dinner_parties'),
  ('/dinner_for_six.htm', '/dinner-parties', 'category', 'dinner_parties'),
  ('/sport-adventure', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/sport-adventure/:city', '/adventure-for-singles/:city', 'category', 'adventure_for_singles'),
  ('/sport_adventure.htm', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/golf', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/golf/:city', '/adventure-for-singles/:city', 'category', 'adventure_for_singles'),
  ('/golf.htm', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/nosmo.htm', '/adventure-for-singles', 'category', 'adventure_for_singles'),
  ('/tours4singles', '/solo-travel', 'category', 'solo_travel'),
  ('/tours4singles/:city', '/solo-travel/:city', 'category', 'solo_travel'),
  ('/tours4singles.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/accomonline.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/firstclasstravel.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/spiritofthewest.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/tripmate.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/travel_for_singles.htm', '/solo-travel', 'category', 'solo_travel')
ON CONFLICT(from_path) DO UPDATE SET
  to_path = excluded.to_path,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id;
