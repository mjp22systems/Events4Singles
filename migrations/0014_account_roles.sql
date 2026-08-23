ALTER TABLE advertiser_accounts ADD COLUMN account_role TEXT NOT NULL DEFAULT 'advertiser';

UPDATE advertiser_accounts
SET display_name = 'Events for Singles',
    account_role = 'admin',
    portal_email = COALESCE(portal_email, billing_email, 'e4s@events4singles.com'),
    billing_email = COALESCE(billing_email, portal_email, 'e4s@events4singles.com'),
    updated_at = datetime('now')
WHERE portal_email = 'e4s@events4singles.com'
   OR billing_email = 'e4s@events4singles.com';

UPDATE advertiser_accounts
SET account_role = 'super_admin',
    updated_at = datetime('now')
WHERE clerk_user_id = 'MJP22'
   OR display_name = 'MJP22'
   OR display_name = 'MJP22 - Super Admin'
   OR portal_email = 'MJP22'
   OR portal_email = 'mjp22@mjp22.com';
