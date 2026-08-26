-- Dinner for Six is a specific dinner-party format, not a competing top-level
-- category. Keep its URL/listings/banners, but nest it under Dinner Parties.

UPDATE categories
SET parent_slug = 'dinner_parties',
    sort_order = 10
WHERE slug = 'dinner_for_six';
