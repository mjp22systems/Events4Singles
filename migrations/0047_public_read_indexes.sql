-- Public read/merge lookup indexes.
-- DDL-only migration; safe to apply independently of data cleanup.

CREATE INDEX IF NOT EXISTS idx_businesses_merged_target
  ON businesses(merged_into_business_id)
  WHERE merged_into_business_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_businesses_status_name_id
  ON businesses(status, name, id);

CREATE INDEX IF NOT EXISTS idx_listings_business_status_confidence
  ON listings(business_id, status, confidence_score);

CREATE INDEX IF NOT EXISTS idx_banners_business_active_slot
  ON banners(business_id, is_active, slot_position, created_at);

CREATE INDEX IF NOT EXISTS idx_aab_business_status_account
  ON advertiser_account_businesses(business_id, status, account_id);

CREATE INDEX IF NOT EXISTS idx_events_account_status_visible_starts
  ON events(account_id, status, is_visible, starts_at);
