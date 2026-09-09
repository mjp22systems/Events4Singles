-- Archive active legacy business rows that no longer have any active listing.
--
-- These rows can otherwise leak into the business directory even after their
-- stale festival, promotional, product, or ambiguous listings have been
-- archived from the public launch set.

UPDATE businesses
SET status = 'archived',
    updated_at = datetime('now')
WHERE COALESCE(status, 'active') = 'active'
  AND merged_into_business_id IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
  );
