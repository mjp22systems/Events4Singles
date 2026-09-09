-- Pause additional stale or inaccurate review-bucket listings found after the
-- first URL-health sweep.

WITH stale_listing_urls(listing_id, business_id, reason) AS (
  VALUES
    (392, 392, 'DNS failure for serendipitybeautyretreat.com.au; exact-name search did not find a current replacement.'),
    (816, 817, 'learn2date.com returns only a hosting/service-provider error page; exact-name search did not find a useful current replacement.'),
    (817, 818, 'everblue.com.au is live but now presents a Mackay compliance/safety business, not the imported life-coach listing.')
)
UPDATE listings
SET status = 'paused',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Paused from launch: stale review-bucket listing with dead, placeholder, or mismatched current website during the 2026-09-10 sweep.'
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
WHERE listing_id IN (392, 816, 817);

UPDATE businesses
SET status = 'paused',
    updated_at = datetime('now')
WHERE id IN (392, 817, 818)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.id NOT IN (392, 816, 817)
  );

UPDATE banners
SET is_active = 0,
    status = 'paused',
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE business_id IN (392, 817, 818)
  AND COALESCE(is_active, 1) = 1;
