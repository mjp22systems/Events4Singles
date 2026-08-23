-- Fix advertiser_accounts.business_id from TEXT to INTEGER
-- SQLite requires table recreation to change column type
ALTER TABLE advertiser_accounts RENAME TO advertiser_accounts_old;

CREATE TABLE advertiser_accounts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  clerk_user_id TEXT UNIQUE NOT NULL,
  business_id INTEGER,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_sub_id TEXT,
  sub_status TEXT NOT NULL DEFAULT 'inactive',
  sub_expires_at TEXT,
  billing_email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO advertiser_accounts
  SELECT id, clerk_user_id, CAST(business_id AS INTEGER), plan,
         stripe_customer_id, stripe_sub_id, sub_status, sub_expires_at,
         billing_email, created_at, updated_at
  FROM advertiser_accounts_old;

DROP TABLE advertiser_accounts_old;

CREATE INDEX IF NOT EXISTS idx_aa_clerk ON advertiser_accounts(clerk_user_id);
