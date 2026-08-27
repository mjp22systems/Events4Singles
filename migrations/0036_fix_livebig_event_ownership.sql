-- George/Live Big's synced events were resolving through the account's old
-- Socializing Newcastle business link. Point the owner relationship at Live Big.
UPDATE advertiser_accounts
SET business_id = 764,
    display_name = COALESCE(display_name, 'Live Big'),
    updated_at = datetime('now')
WHERE id = 'f3cbcd4876e300f46583a742b4c3ddcd'
  AND EXISTS (SELECT 1 FROM businesses WHERE id = 764 AND lower(name) = 'live big');

INSERT INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT 'f3cbcd4876e300f46583a742b4c3ddcd', 764, 'owner', 1, 'active', datetime('now'), datetime('now')
WHERE EXISTS (SELECT 1 FROM businesses WHERE id = 764 AND lower(name) = 'live big')
ON CONFLICT(account_id, business_id) DO UPDATE SET
  role = 'owner',
  is_primary = 1,
  status = 'active',
  updated_at = datetime('now');

UPDATE advertiser_account_businesses
SET is_primary = 0,
    updated_at = datetime('now')
WHERE account_id = 'f3cbcd4876e300f46583a742b4c3ddcd'
  AND business_id <> 764;
