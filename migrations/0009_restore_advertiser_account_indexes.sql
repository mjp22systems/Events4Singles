CREATE UNIQUE INDEX IF NOT EXISTS idx_aa_id_unique ON advertiser_accounts(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_aa_clerk_unique ON advertiser_accounts(clerk_user_id);
