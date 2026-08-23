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
  hero_image_url
) VALUES
  (
    'singles_mixers',
    'Singles Mixers',
    NULL,
    18,
    'Relaxed hosted socials where singles can meet new people without a heavily structured dating format.',
    'Singles mixers are a simple way to meet new people in a hosted social setting where conversation is expected and the pressure stays low.',
    1,
    'Singles Mixers Australia | Events4Singles',
    'Find singles mixers and relaxed social events for Australian singles.',
    '/images/categories/optimized/singles-mixers.webp'
  ),
  (
    'christian_singles',
    'Christian Singles',
    NULL,
    24,
    'Faith-aligned events, groups and services for Christian singles.',
    'Christian singles listings bring together social events, dating services and community-minded ways to meet people who share similar values.',
    1,
    'Christian Singles Australia | Events4Singles',
    'Explore Christian singles events, groups and dating services in Australia.',
    '/images/categories/optimized/christian-singles.webp'
  ),
  (
    'lgbtqia_singles_events',
    'LGBTQIA+ Singles Events',
    NULL,
    26,
    'Inclusive singles events and social spaces for LGBTQIA+ communities.',
    'LGBTQIA+ singles events make it easier to find inclusive social nights, mixers and community spaces where singles can connect comfortably.',
    1,
    'LGBTQIA+ Singles Events Australia | Events4Singles',
    'Find inclusive LGBTQIA+ singles events and social spaces around Australia.',
    '/images/categories/optimized/lgbtqia-singles-events.webp'
  ),
  (
    'dating_profile_photography',
    'Dating Profile Photography',
    NULL,
    74,
    'Profile-focused portraits that help singles show up naturally online.',
    'Dating profile photography is for singles who want current, natural portraits for dating apps, profiles and first impressions.',
    1,
    'Dating Profile Photography Australia | Events4Singles',
    'Find dating profile photography and portrait services for Australian singles.',
    '/images/categories/optimized/dating-profile-photography.webp'
  ),
  (
    'dating_coaches',
    'Dating Coaches',
    NULL,
    58,
    'Dating-specific support for confidence, profiles and relationship readiness.',
    'Dating coaches can help singles improve confidence, communication, profile strategy and the way they approach modern dating.',
    1,
    'Dating Coaches Australia | Events4Singles',
    'Find dating coaches and dating confidence support for Australian singles.',
    '/images/categories/optimized/dating-coaches.webp'
  ),
  (
    'solo_travel',
    'Solo Travel',
    NULL,
    44,
    'Travel experiences built for independent singles and solo guests.',
    'Solo travel listings help independent singles find trips, tours and getaways designed to be comfortable for people travelling on their own.',
    1,
    'Solo Travel for Singles Australia | Events4Singles',
    'Find solo travel, tours and getaway options for Australian singles.',
    '/images/categories/optimized/solo-travel.webp'
  ),
  (
    'social_walks',
    'Social Walks',
    NULL,
    42,
    'Low-pressure walks and outdoor catch-ups with easy conversation.',
    'Social walks give singles a relaxed way to meet people while getting outside and doing something simple together.',
    1,
    'Social Walks for Singles Australia | Events4Singles',
    'Find social walks, walking groups and low-pressure outdoor events for singles.',
    '/images/categories/optimized/social-walks.webp'
  ),
  (
    'retreats_for_singles',
    'Retreats for Singles',
    NULL,
    62,
    'Retreats, reset weekends and reflective escapes for singles.',
    'Retreats for singles bring together wellness, self-development and time away for people who want to reset and reconnect with themselves.',
    1,
    'Retreats for Singles Australia | Events4Singles',
    'Find retreats, reset weekends and wellness escapes for Australian singles.',
    '/images/categories/optimized/retreats-for-singles.webp'
  )
ON CONFLICT(slug) DO UPDATE SET
  label = excluded.label,
  description = excluded.description,
  seo_intro = excluded.seo_intro,
  banner_row_count = excluded.banner_row_count,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  hero_image_url = excluded.hero_image_url;

UPDATE listing_placements SET category_slug = 'solo_travel' WHERE category_slug = 'travel_for_singles';
UPDATE banners SET category_slug = 'solo_travel' WHERE category_slug = 'travel_for_singles';
UPDATE events SET category = 'solo_travel' WHERE category = 'travel_for_singles';

UPDATE listing_placements SET category_slug = 'social_walks' WHERE category_slug = 'walks4singles';
UPDATE banners SET category_slug = 'social_walks' WHERE category_slug = 'walks4singles';
UPDATE events SET category = 'social_walks' WHERE category = 'walks4singles';

UPDATE listing_placements SET category_slug = 'life_coaches' WHERE category_slug = 'finance_mortgage';
UPDATE banners SET category_slug = 'life_coaches' WHERE category_slug = 'finance_mortgage';
UPDATE events SET category = 'life_coaches' WHERE category = 'finance_mortgage';

UPDATE listing_placements SET category_slug = 'sport_adventure' WHERE category_slug = 'golf';
UPDATE banners SET category_slug = 'sport_adventure' WHERE category_slug = 'golf';
UPDATE events SET category = 'sport_adventure' WHERE category = 'golf';

UPDATE listing_placements SET category_slug = 'seminars' WHERE category_slug = 'toastmasters';
UPDATE banners SET category_slug = 'seminars' WHERE category_slug = 'toastmasters';
UPDATE events SET category = 'seminars' WHERE category = 'toastmasters';

UPDATE listing_placements SET category_slug = 'social_clubs' WHERE category_slug = 'art_galleries';
UPDATE banners SET category_slug = 'social_clubs' WHERE category_slug = 'art_galleries';
UPDATE events SET category = 'social_clubs' WHERE category = 'art_galleries';

UPDATE listing_placements SET category_slug = 'retreats_for_singles' WHERE category_slug = 'spiritual_path';
UPDATE banners SET category_slug = 'retreats_for_singles' WHERE category_slug = 'spiritual_path';
UPDATE events SET category = 'retreats_for_singles' WHERE category = 'spiritual_path';

UPDATE listing_placements SET category_slug = 'online_dating' WHERE category_slug = 'sms-phone-dating';
UPDATE banners SET category_slug = 'online_dating' WHERE category_slug = 'sms-phone-dating';
UPDATE events SET category = 'online_dating' WHERE category = 'sms-phone-dating';

UPDATE listing_placements
SET category_slug = NULL
WHERE category_slug IN ('lotto4singles', 'singles_products', 'special_offers', 'singles_news');

UPDATE banners
SET category_slug = NULL
WHERE category_slug IN ('lotto4singles', 'singles_products', 'special_offers', 'singles_news');

UPDATE events
SET category = NULL
WHERE category IN ('lotto4singles', 'singles_products', 'special_offers', 'singles_news');

DELETE FROM listing_placements
WHERE id NOT IN (
  SELECT MIN(id)
  FROM listing_placements
  GROUP BY
    listing_id,
    COALESCE(category_slug, ''),
    COALESCE(city_slug, ''),
    COALESCE(position_type, ''),
    COALESCE(is_active, 1),
    COALESCE(starts_at, ''),
    COALESCE(expires_at, '')
);

DELETE FROM categories
WHERE slug IN (
  'art_galleries',
  'finance_mortgage',
  'golf',
  'lotto4singles',
  'singles_news',
  'singles_products',
  'sms-phone-dating',
  'special_offers',
  'spiritual_path',
  'toastmasters',
  'travel_for_singles',
  'walks4singles'
);

INSERT INTO redirects (from_path, to_path, entity_type, entity_id) VALUES
  ('/travel-for-singles', '/solo-travel', 'category', 'solo_travel'),
  ('/travel_for_singles.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/walks4singles', '/social-walks', 'category', 'social_walks'),
  ('/walks4singles.htm', '/social-walks', 'category', 'social_walks'),
  ('/lotto4singles', '/dating-resources', 'category', NULL),
  ('/lotto4singles.htm', '/dating-resources', 'category', NULL),
  ('/singles-products', '/dating-resources', 'category', NULL),
  ('/singles_products.htm', '/dating-resources', 'category', NULL),
  ('/special-offers', '/advertise', 'category', NULL),
  ('/special_offers.htm', '/advertise', 'category', NULL),
  ('/singles-news', '/dating-resources', 'category', NULL),
  ('/singles_news.htm', '/dating-resources', 'category', NULL),
  ('/finance-mortgage', '/life-coaches', 'category', 'life_coaches'),
  ('/finance_mortgage.htm', '/life-coaches', 'category', 'life_coaches'),
  ('/golf', '/sport-adventure', 'category', 'sport_adventure'),
  ('/golf.htm', '/sport-adventure', 'category', 'sport_adventure'),
  ('/toastmasters', '/seminars', 'category', 'seminars'),
  ('/toastmasters.htm', '/seminars', 'category', 'seminars'),
  ('/art-galleries', '/social-clubs', 'category', 'social_clubs'),
  ('/art_galleries.htm', '/social-clubs', 'category', 'social_clubs'),
  ('/spiritual-path', '/retreats-for-singles', 'category', 'retreats_for_singles'),
  ('/spiritual_path.htm', '/retreats-for-singles', 'category', 'retreats_for_singles'),
  ('/sms-phone-dating', '/online-dating', 'category', 'online_dating'),
  ('/sms-phone-dating.htm', '/online-dating', 'category', 'online_dating')
ON CONFLICT(from_path) DO UPDATE SET
  to_path = excluded.to_path,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id;

