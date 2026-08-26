-- Keep Dinner for Six as its own top-level category.
-- The pre-cleanup database had both Dinner Parties and Dinner for Six as top-level categories.
UPDATE categories
SET parent_slug = NULL
WHERE slug = 'dinner_for_six';
