UPDATE advertiser_accounts
SET display_name = 'Admin',
    portal_email = COALESCE(portal_email, billing_email, 'e4s@events4singles.com'),
    billing_email = COALESCE(billing_email, portal_email, 'e4s@events4singles.com'),
    updated_at = datetime('now')
WHERE portal_email = 'e4s@events4singles.com'
   OR billing_email = 'e4s@events4singles.com';

UPDATE events
SET account_id = (
      SELECT id
      FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id
      FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE source_id LIKE 'homepage-placeholder-%'
  AND EXISTS (
    SELECT 1
    FROM advertiser_accounts
    WHERE portal_email = 'e4s@events4singles.com'
       OR billing_email = 'e4s@events4singles.com'
  );
