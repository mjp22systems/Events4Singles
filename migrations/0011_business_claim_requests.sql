CREATE TABLE IF NOT EXISTS business_claim_requests (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  account_id     TEXT NOT NULL,
  clerk_user_id  TEXT NOT NULL,
  portal_email   TEXT,
  business_name  TEXT NOT NULL,
  website        TEXT,
  city           TEXT,
  contact_email  TEXT,
  phone          TEXT,
  message        TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',
  resolved_business_id INTEGER,
  admin_notes    TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at    TEXT,
  FOREIGN KEY (account_id) REFERENCES advertiser_accounts(id),
  FOREIGN KEY (resolved_business_id) REFERENCES businesses(id)
);

CREATE INDEX IF NOT EXISTS idx_bcr_status ON business_claim_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_bcr_account ON business_claim_requests(account_id);
