-- Second-pass logical title cleanup for clear title/contact qualifier cases.

UPDATE listings
SET title = 'Swing Dance Brisbane',
    tagline = '',
    location = 'Brisbane',
    location_city = 'Brisbane',
    location_state = 'QLD',
    updated_at = datetime('now')
WHERE id = 446;

UPDATE businesses
SET name = 'Swing Dance Brisbane',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 446);

UPDATE listing_placements
SET is_active = 0
WHERE listing_id = 446
  AND city_slug = 'adelaide';

UPDATE listings
SET title = 'Your Dating Bestie',
    contact_name = 'Elly Klein',
    updated_at = datetime('now')
WHERE id = 713;

UPDATE businesses
SET name = 'Your Dating Bestie',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 713);
