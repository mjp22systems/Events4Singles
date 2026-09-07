CREATE TABLE IF NOT EXISTS advertiser_billing_sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  account_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  checkout_mode TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'created',
  amount_label TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (account_id) REFERENCES advertiser_accounts(id)
);

CREATE INDEX IF NOT EXISTS idx_abs_account ON advertiser_billing_sessions(account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_abs_stripe_session ON advertiser_billing_sessions(stripe_session_id);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

