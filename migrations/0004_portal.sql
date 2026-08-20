CREATE TABLE IF NOT EXISTS advertiser_accounts (
  id                 TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  clerk_user_id      TEXT UNIQUE NOT NULL,
  business_id        TEXT,
  plan               TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_sub_id      TEXT,
  sub_status         TEXT NOT NULL DEFAULT 'inactive',
  sub_expires_at     TEXT,
  billing_email      TEXT,
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  surface     TEXT NOT NULL,
  surface_id  TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  city        TEXT,
  device      TEXT,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics_daily (
  surface     TEXT NOT NULL,
  surface_id  TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  city        TEXT NOT NULL DEFAULT '',
  date        TEXT NOT NULL,
  count       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (surface, surface_id, event_type, city, date)
);

CREATE TABLE IF NOT EXISTS banners (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  account_id TEXT NOT NULL,
  title      TEXT,
  image_url  TEXT NOT NULL,
  link_url   TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending',
  placement  TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ae_surface ON analytics_events(surface, surface_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_ad_surface ON analytics_daily(surface, surface_id, date);
CREATE INDEX IF NOT EXISTS idx_aa_clerk   ON advertiser_accounts(clerk_user_id);
