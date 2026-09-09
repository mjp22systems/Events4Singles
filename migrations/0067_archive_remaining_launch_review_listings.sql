-- Archive remaining launch review listings.
--
-- These rows were left live after the second promotional sweep for owner review.
-- The owner decision on 2026-09-09 was to remove the full remaining review list
-- from public launch while preserving IDs for audit or future claim recovery.

UPDATE listings
SET status = 'archived',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Archived from launch: owner reviewed the remaining decision list and chose to remove it from the public launch set.'
    ),
    ai_moderation_status = 'launch_owner_removed',
    ai_moderation_reason = COALESCE(
      ai_moderation_reason,
      'Removed from public launch set after owner review of phone-only, broad-category, or ambiguous legacy listings.'
    ),
    updated_at = datetime('now')
WHERE id IN (
  30, 95, 137, 200, 204, 305, 313, 339, 483, 552,
  579, 580, 581, 601, 612, 621, 622, 624, 638, 640,
  642, 643, 769
)
  AND COALESCE(status, 'active') = 'active';

UPDATE listing_placements
SET is_active = 0,
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE listing_id IN (
  30, 95, 137, 200, 204, 305, 313, 339, 483, 552,
  579, 580, 581, 601, 612, 621, 622, 624, 638, 640,
  642, 643, 769
);

UPDATE businesses
SET status = 'archived',
    updated_at = datetime('now')
WHERE id IN (
  30, 95, 137, 200, 204, 305, 313, 339, 483, 552,
  579, 580, 581, 601, 612, 621, 622, 624, 89, 642,
  643, 769
)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.id NOT IN (
        30, 95, 137, 200, 204, 305, 313, 339, 483, 552,
        579, 580, 581, 601, 612, 621, 622, 624, 638, 640,
        642, 643, 769
      )
  );

UPDATE banners
SET is_active = 0,
    status = 'archived',
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE business_id IN (
  30, 95, 137, 200, 204, 305, 313, 339, 483, 552,
  579, 580, 581, 601, 612, 621, 622, 624, 89, 642,
  643, 769
)
  AND COALESCE(is_active, 1) = 1;
