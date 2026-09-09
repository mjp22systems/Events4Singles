-- Pause stale review-bucket listings after exact-name and URL-health checks.
--
-- These are organic legacy/import records with no advertiser_id and no premium
-- placement. Pausing hides them from seed browsing while retaining history for a
-- future claim, updated URL, or manual restoration.

UPDATE listings
SET web = 'https://soundhealing.com.au',
    location = 'Australia-wide',
    location_city = 'National',
    location_state = '',
    updated_at = datetime('now')
WHERE id = 125
  AND COALESCE(status, 'active') = 'active';

INSERT INTO listing_placements (
  listing_id,
  category_slug,
  city_slug,
  sort_order,
  position_type,
  is_active,
  starts_at,
  expires_at
)
SELECT
  p.listing_id,
  p.category_slug,
  'national',
  p.sort_order,
  p.position_type,
  1,
  p.starts_at,
  p.expires_at
FROM listing_placements p
JOIN listings l ON l.id = p.listing_id
JOIN categories c ON c.slug = p.category_slug
JOIN cities ci ON ci.slug = 'national'
WHERE p.listing_id = 125
  AND COALESCE(l.status, 'active') = 'active'
  AND COALESCE(p.is_active, 1) = 1
  AND p.category_slug IS NOT NULL
  AND p.city_slug IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM listing_placements existing
    WHERE existing.listing_id = p.listing_id
      AND existing.category_slug = p.category_slug
      AND existing.city_slug = 'national'
      AND COALESCE(existing.is_active, 1) = 1
  );

WITH stale_listing_urls(listing_id, business_id, reason) AS (
  VALUES
    (26, 26, 'DNS failure for angstcreative.com; no exact current replacement found.'),
    (49, 49, 'DNS failure for bighitprofiles.com; no exact current replacement found.'),
    (124, 124, 'DNS failure for devotehairdesign.com.au; no exact current replacement found and category fit is weak.'),
    (183, 183, 'DNS failure for hotfeetdance.com; no exact current replacement found.'),
    (187, 187, 'DNS failure for imageupdate.com.au; no exact current replacement found.'),
    (228, 228, 'DNS failure for atinlover.com.au and likely typo latinlover.com.au; no exact current replacement found.'),
    (246, 246, 'DNS failure for liquidtours.com.au; no exact current replacement found.'),
    (259, 259, 'DNS failure for lovesnotblind.com.au; no exact current replacement found.'),
    (323, 323, 'DNS failure for auslifecoaching.com; no exact current replacement found.'),
    (377, 377, 'DNS failure for scoolhouse.com; no exact current replacement found.'),
    (387, 387, 'DNS failure for secretsforsingles.com; no exact current replacement found.'),
    (422, 422, 'DNS failure for solutionsintros.com; no exact current replacement found.'),
    (429, 429, 'DNS failure for speeddating.net.au; no exact current replacement found.'),
    (607, 607, 'No listing URL and no exact current website found for Life Development Centre.'),
    (637, 637, 'DNS failure for prodigysports.com.au; no exact current replacement found.'),
    (644, 644, 'DNS failure for sotaitherapies.com.au; no exact current replacement found.'),
    (653, 653, 'DNS failure for spiritofthewest.com.au; appears to be a stale legacy travel attraction.'),
    (676, 676, 'No listing URL and no exact current website found for Way Forward.'),
    (810, 811, 'No listing URL and no exact current website found for Success Introductions.'),
    (821, 822, 'DNS failure for atalent.com.au; current similarly named aTalent results are unrelated.'),
    (822, 823, 'DNS failure for minglessingles.com.au; Singles Mingles Australia appears unrelated and the same-phone Wix result is not reachable.')
)
UPDATE listings
SET status = 'paused',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Paused from launch: stale review-bucket listing with dead/missing URL and no exact current replacement found during the 2026-09-10 sweep.'
    ),
    ai_moderation_status = 'launch_url_review',
    ai_moderation_reason = COALESCE(
      ai_moderation_reason,
      (
        SELECT reason
        FROM stale_listing_urls
        WHERE stale_listing_urls.listing_id = listings.id
      )
    ),
    unclaimed_flag = 1,
    updated_at = datetime('now')
WHERE id IN (SELECT listing_id FROM stale_listing_urls)
  AND COALESCE(status, 'active') = 'active'
  AND advertiser_id IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM listing_placements p
    WHERE p.listing_id = listings.id
      AND COALESCE(p.is_active, 1) = 1
      AND p.position_type IN ('featured', 'premium')
  );

UPDATE listing_placements
SET is_active = 0,
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE listing_id IN (
  26, 49, 124, 183, 187, 228, 246, 259, 323, 377, 387,
  422, 429, 607, 637, 644, 653, 676, 810, 821, 822
);

UPDATE businesses
SET status = 'paused',
    updated_at = datetime('now')
WHERE id IN (
  26, 49, 124, 183, 187, 228, 246, 259, 323, 377, 387,
  422, 429, 607, 637, 644, 653, 676, 811, 822, 823
)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.id NOT IN (
        26, 49, 124, 183, 187, 228, 246, 259, 323, 377, 387,
        422, 429, 607, 637, 644, 653, 676, 810, 821, 822
      )
  );

UPDATE banners
SET is_active = 0,
    status = 'paused',
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE business_id IN (
  26, 49, 124, 183, 187, 228, 246, 259, 323, 377, 387,
  422, 429, 607, 637, 644, 653, 676, 811, 822, 823
)
  AND COALESCE(is_active, 1) = 1;
