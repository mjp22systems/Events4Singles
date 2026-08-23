ALTER TABLE advertiser_accounts ADD COLUMN display_name TEXT;
ALTER TABLE advertiser_accounts ADD COLUMN portal_email TEXT;

UPDATE advertiser_accounts
SET portal_email = billing_email
WHERE portal_email IS NULL AND billing_email IS NOT NULL;
