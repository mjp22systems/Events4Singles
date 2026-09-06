-- Archive content-empty legacy rows from public launch review.

UPDATE listings
SET status = 'archived',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Archived from launch: content-empty legacy listing with insufficient public profile detail.'
    ),
    ai_moderation_status = 'launch_archived',
    ai_moderation_reason = COALESCE(
      ai_moderation_reason,
      'Content-empty legacy listing hidden from launch pending manual review.'
    ),
    updated_at = datetime('now')
WHERE id IN (6, 218, 289, 308, 331, 419, 459, 510, 555, 573, 636, 672)
  AND COALESCE(status, 'active') = 'active'
  AND COALESCE(
    NULLIF(TRIM(description), ''),
    NULLIF(TRIM(tagline), ''),
    NULLIF(TRIM(promo), '')
  ) IS NULL;

UPDATE businesses
SET status = 'archived',
    updated_at = datetime('now')
WHERE id IN (6, 218, 289, 308, 331, 419, 459, 510, 555, 573, 636, 672)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.deleted_at IS NULL
  );
