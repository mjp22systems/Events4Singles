-- Launch relevance and hard-dead URL cleanup.
--
-- Finance/mortgage and business-resource rows are outside the Events4Singles
-- launch taxonomy, so they are soft-deleted. Confirmed hard URL failures are
-- paused rather than deleted so a future claim/update flow can recover them.

UPDATE listings
SET status = 'deleted',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Deleted from launch: finance, mortgage, or unrelated business-resource listing outside the Events4Singles directory structure.'
    ),
    ai_moderation_status = 'launch_irrelevant',
    ai_moderation_reason = COALESCE(
      ai_moderation_reason,
      'Removed from public launch set because it does not fit the Events4Singles singles/events/dating/services taxonomy.'
    ),
    updated_at = datetime('now')
WHERE id IN (10, 38, 141, 189, 297, 517, 820)
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET status = 'deleted',
    updated_at = datetime('now')
WHERE id IN (10, 38, 141, 189, 297, 517, 821)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.id NOT IN (10, 38, 141, 189, 297, 517, 820)
  );

UPDATE listing_placements
SET is_active = 0,
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE category_slug = 'finance_mortgage'
   OR listing_id IN (10, 38, 141, 189, 297, 517, 820);

UPDATE banners
SET is_active = 0,
    status = 'archived',
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE category_slug = 'finance_mortgage'
   OR business_id IN (10, 38, 141, 189, 297, 517, 821);

UPDATE categories
SET status = 'archived',
    banner_row_count = 0
WHERE slug = 'finance_mortgage';

UPDATE listings
SET status = 'paused',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Paused from launch: external website returned a hard failure during the 2026-09-07 URL audit. Retained for future claim or updated URL review.'
    ),
    ai_moderation_status = 'launch_url_review',
    ai_moderation_reason = COALESCE(
      ai_moderation_reason,
      CASE id
        WHEN 25 THEN 'URL audit returned 404 for amazingcoaching.com.au.'
        WHEN 59 THEN 'URL audit returned 400 for bookofmatches.com.'
        WHEN 84 THEN 'URL audit returned 410 for christiandatingsearch.com.'
        WHEN 86 THEN 'URL audit returned 410 for christiandatingsearch.com.'
        WHEN 96 THEN 'URL audit returned 404 for clubsalsa.com.au/classes/dance_classes.php.'
        WHEN 97 THEN 'URL audit returned 404 for clubsalsa.com.au/classes/dance_classes.php.'
        WHEN 109 THEN 'URL audit returned 526 for dancecorp.com.au.'
        WHEN 110 THEN 'URL audit returned 526 for dancecorp.com.au.'
        WHEN 166 THEN 'URL audit returned 404 for netspeed.com.au/gabysdancestudio.'
        WHEN 196 THEN 'URL audit returned 404 for jazzinthevines.com.au.'
        WHEN 229 THEN 'URL audit returned 404 for latinmotion.com.au.'
        WHEN 237 THEN 'URL audit returned 404 for lebop.com.au.'
        WHEN 247 THEN 'URL audit returned 404 for amazingcoaching.com.au.'
        WHEN 358 THEN 'URL audit returned 404 for quicksilver-cruises.com/bookings.php.'
        WHEN 373 THEN 'URL audit returned 404 for rsvp.com.au/index.jsp.'
        WHEN 374 THEN 'URL audit returned 404 for rsvp.com.au/singles+travel/trips+holidays.jsp.'
        WHEN 381 THEN 'URL audit returned 404 for salsawarriors.com.'
        WHEN 382 THEN 'URL audit returned 404 for salsawarriors.com.'
        WHEN 453 THEN 'URL audit returned 404 for swingtimeaustralia.com/nsw/nsw.php.'
        WHEN 454 THEN 'URL audit returned 404 for swingtimeaustralia.com/qld.'
        WHEN 472 THEN 'URL audit returned 404 for akvaryumhobisi.com/tengotango.'
        WHEN 484 THEN 'URL audit returned 404 for taic.com.au/05_corp.html.'
        WHEN 533 THEN 'URL audit returned 404 for yahoo.com.'
        WHEN 538 THEN 'URL audit returned 404 for turfbar.com.au.'
        WHEN 564 THEN 'URL audit returned 404 for bennettslane.com.'
        WHEN 598 THEN 'URL audit returned 404 for hostamurder.com.au.'
        WHEN 697 THEN 'URL audit returned 404 for events.humanitix.com/wine-tasting-singles-edition.'
        WHEN 761 THEN 'URL audit returned 404 for sheonabeach.com.au/brisbane-online-dating-profile-photos-pics-relaxed-casual-candid.'
        WHEN 777 THEN 'URL audit returned 404 for sacredself.com.au.'
        WHEN 824 THEN 'URL audit returned 404 for richerlives.com.au/hwsolutions.'
        ELSE 'URL audit returned a hard failure.'
      END
    ),
    unclaimed_flag = 1,
    updated_at = datetime('now')
WHERE id IN (
  25, 59, 84, 86, 96, 97, 109, 110, 166, 196,
  229, 237, 247, 358, 373, 374, 381, 382, 453, 454,
  472, 484, 533, 538, 564, 598, 697, 761, 777, 824
)
  AND COALESCE(status, 'active') = 'active';

UPDATE listing_placements
SET is_active = 0,
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE listing_id IN (
  25, 59, 84, 86, 96, 97, 109, 110, 166, 196,
  229, 237, 247, 358, 373, 374, 381, 382, 453, 454,
  472, 484, 533, 538, 564, 598, 697, 761, 777, 824
);

UPDATE businesses
SET status = 'paused',
    updated_at = datetime('now')
WHERE id IN (
  25, 59, 86, 96, 109, 110, 166, 196, 229, 237,
  247, 358, 373, 374, 381, 452, 472, 484, 577, 538,
  564, 598, 697, 761, 778, 825
)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.id NOT IN (
        25, 59, 84, 86, 96, 97, 109, 110, 166, 196,
        229, 237, 247, 358, 373, 374, 381, 382, 453, 454,
        472, 484, 533, 538, 564, 598, 697, 761, 777, 824
      )
  );

UPDATE banners
SET is_active = 0,
    status = 'paused',
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE business_id IN (
  25, 59, 86, 96, 109, 110, 166, 196, 229, 237,
  247, 358, 373, 374, 381, 452, 472, 484, 577, 538,
  564, 598, 697, 761, 778, 825
)
  AND COALESCE(is_active, 1) = 1;
