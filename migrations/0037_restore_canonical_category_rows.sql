-- Restore category rows that were introduced in the taxonomy refresh but can be
-- absent after rebuilding production data from legacy scrape/import sources.

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
    'singles_mixers',
    'Singles Mixers',
    NULL,
    18,
    'Relaxed hosted socials where singles can meet new people without a heavily structured dating format.',
    'Singles mixers are a simple way to meet new people in a hosted social setting where conversation is expected and the pressure stays low.',
    1,
    'Singles Mixers Australia | Events4Singles',
    'Find singles mixers and relaxed social events for Australian singles.',
    '/images/categories/heroes/singles-mixers.webp',
    'active'
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
    '/images/categories/heroes/christian-singles.webp',
    'active'
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
    '/images/categories/heroes/lgbtqia-singles-events.webp',
    'active'
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
    '/images/categories/heroes/solo-travel.webp',
    'active'
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
    '/images/categories/heroes/social-walks.webp',
    'active'
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
    '/images/categories/heroes/dating-coaches.webp',
    'active'
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
    '/images/categories/heroes/dating-profile-photography.webp',
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
  status = 'active';

UPDATE listing_placements SET category_slug = 'solo_travel' WHERE category_slug = 'travel_for_singles';
UPDATE banners SET category_slug = 'solo_travel' WHERE category_slug = 'travel_for_singles';
UPDATE events SET category = 'solo_travel' WHERE category = 'travel_for_singles';

UPDATE listing_placements SET category_slug = 'social_walks' WHERE category_slug = 'walks4singles';
UPDATE banners SET category_slug = 'social_walks' WHERE category_slug = 'walks4singles';
UPDATE events SET category = 'social_walks' WHERE category = 'walks4singles';

INSERT INTO redirects (from_path, to_path, entity_type, entity_id) VALUES
  ('/travel-for-singles', '/solo-travel', 'category', 'solo_travel'),
  ('/travel-for-singles/:city', '/solo-travel/:city', 'category', 'solo_travel'),
  ('/travel_for_singles.htm', '/solo-travel', 'category', 'solo_travel'),
  ('/walks4singles', '/social-walks', 'category', 'social_walks'),
  ('/walks4singles/:city', '/social-walks/:city', 'category', 'social_walks'),
  ('/walks4singles.htm', '/social-walks', 'category', 'social_walks')
ON CONFLICT(from_path) DO UPDATE SET
  to_path = excluded.to_path,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id;
