CREATE TABLE IF NOT EXISTS advertiser_account_businesses (
  account_id  TEXT NOT NULL,
  business_id INTEGER NOT NULL,
  role        TEXT NOT NULL DEFAULT 'owner',
  is_primary  INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'active',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (account_id, business_id),
  FOREIGN KEY (account_id) REFERENCES advertiser_accounts(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status)
SELECT id, business_id, 'owner', 1, 'active'
FROM advertiser_accounts
WHERE business_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_aab_account ON advertiser_account_businesses(account_id);
CREATE INDEX IF NOT EXISTS idx_aab_business ON advertiser_account_businesses(business_id);
