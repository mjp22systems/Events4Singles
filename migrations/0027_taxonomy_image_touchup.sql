UPDATE categories
SET hero_image_url = '/images/categories/optimized/dinner-for-six.webp'
WHERE slug = 'dinner_for_six';

UPDATE categories
SET hero_image_url = '/images/categories/optimized/retreats-for-singles.webp'
WHERE slug = 'retreats_for_singles';

UPDATE listing_placements
SET category_slug = 'retreats_for_singles'
WHERE category_slug = 'self_love_retreats';

DELETE FROM categories
WHERE slug = 'self_love_retreats';
