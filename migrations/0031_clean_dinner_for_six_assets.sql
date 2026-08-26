-- Use fresh asset paths for the repaired Dinner for Six category image so the
-- deployed Worker asset binding cannot serve an older image at the old key.

UPDATE categories
SET hero_image_url = '/images/categories/optimized/dinner-for-six-clean.webp'
WHERE slug = 'dinner_for_six';
