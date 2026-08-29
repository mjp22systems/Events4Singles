-- One-off data release: fill out the homepage Featured Businesses section.
-- Apply against remote D1 when Cloudflare credentials are available:
-- npx wrangler d1 execute events4singles --remote --file tools/release-featured-listings-20260829.sql

UPDATE listings
SET listing_type = 'featured', updated_at = datetime('now')
WHERE id IN (
  SELECT id
  FROM listings
  WHERE status = 'active'
    AND COALESCE(listing_type, '') NOT IN ('featured', 'premium', 'online')
  ORDER BY RANDOM()
  LIMIT 4
);
