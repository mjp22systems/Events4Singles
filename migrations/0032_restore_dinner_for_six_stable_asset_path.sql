-- Keep Dinner for Six on the stable public image path now that the repaired
-- asset is deployed at that key.

UPDATE categories
SET hero_image_url = '/images/categories/optimized/dinner-for-six.webp'
WHERE slug = 'dinner_for_six';
