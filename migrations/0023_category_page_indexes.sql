CREATE INDEX IF NOT EXISTS idx_listing_placements_category_listing_city
  ON listing_placements(category_slug, listing_id, city_slug);

CREATE INDEX IF NOT EXISTS idx_listing_placements_city_listing_category
  ON listing_placements(city_slug, listing_id, category_slug);

CREATE INDEX IF NOT EXISTS idx_listing_placements_listing_category_city
  ON listing_placements(listing_id, category_slug, city_slug);

CREATE INDEX IF NOT EXISTS idx_listings_status_type_confidence
  ON listings(status, listing_type, confidence_score);

DELETE FROM redirects
WHERE from_path IN ('/psychology', '/healing-and-happiness')
  AND to_path = '/dating-resources/wellbeing-and-the-single-life';
