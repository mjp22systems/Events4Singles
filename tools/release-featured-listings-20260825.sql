-- One-off production data release for the homepage/listings featured showcase.
-- These are the production equivalents of the ten local featured seed rows used
-- while wiring the data-driven featured listing surface.

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 452 AND title = 'Arthur Murray Dance Studios' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 446 AND title = 'Dancecorp' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 499 AND title = 'Western Australia' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 159 AND title = '29 Plus Lifestyle' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 614 AND title = 'Dimitris Bar Level One' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 277 AND title = 'Knobel Executive Coaching' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 569 AND title = 'Psychic Medium' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 268 AND title = 'H.D. Chauffeur Ride' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 456 AND title = 'NOSMO' AND status = 'active';

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id = 109 AND title = 'Latin Groove' AND status = 'active';
