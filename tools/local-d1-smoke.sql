PRAGMA foreign_keys=OFF;
PRAGMA defer_foreign_keys=TRUE;

DROP TABLE IF EXISTS admin_activity_log;
DROP TABLE IF EXISTS admin_sessions;
DROP TABLE IF EXISTS listing_images;
DROP TABLE IF EXISTS listing_placements;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS redirects;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS analytics_daily;
DROP TABLE IF EXISTS analytics_events;
DROP TABLE IF EXISTS advertiser_account_businesses;
DROP TABLE IF EXISTS business_claim_requests;
DROP TABLE IF EXISTS listing_transfer_requests;
DROP TABLE IF EXISTS event_external_refs;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS integrations;
DROP TABLE IF EXISTS advertiser_accounts;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS advertisers;

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  meta TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS advertisers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_name TEXT,
  phone TEXT,
  mobile TEXT,
  email TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  advertiser_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  merged_into_business_id INTEGER,
  merged_at INTEGER,
  profile_slug TEXT,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  parent_slug TEXT REFERENCES categories(slug),
  sort_order INTEGER DEFAULT 0,
  description TEXT,
  seo_intro TEXT,
  banner_row_count INTEGER DEFAULT 1,
  seo_title TEXT,
  seo_description TEXT,
  hero_image_url TEXT,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS cities (
  slug TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  state TEXT,
  region TEXT,
  seo_title TEXT,
  seo_description TEXT
);

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER REFERENCES businesses(id),
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  promo TEXT,
  contact_name TEXT,
  phone TEXT,
  mobile TEXT,
  email TEXT,
  web TEXT,
  image_url TEXT,
  licence_no TEXT,
  location_state TEXT,
  location_city TEXT,
  location TEXT,
  listing_type TEXT DEFAULT 'standard',
  status TEXT DEFAULT 'active',
  confidence_score INTEGER DEFAULT 0,
  source_file TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  advertiser_id INTEGER REFERENCES advertisers(id),
  abn TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  trading_hours TEXT,
  contact_hours TEXT,
  unclaimed_flag INTEGER DEFAULT 0,
  hide_contact INTEGER DEFAULT 0,
  deleted_at INTEGER,
  deleted_reason TEXT,
  merged_into_listing_id INTEGER,
  ai_moderation_status TEXT,
  ai_moderation_reason TEXT,
  slug TEXT
);

CREATE TABLE IF NOT EXISTS listing_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS listing_placements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  category_slug TEXT REFERENCES categories(slug),
  city_slug TEXT REFERENCES cities(slug),
  sort_order INTEGER DEFAULT 0,
  position_type TEXT DEFAULT 'organic',
  is_active INTEGER DEFAULT 1,
  starts_at TEXT,
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER REFERENCES businesses(id),
  image_url TEXT,
  click_url TEXT,
  alt_text TEXT,
  page_scope TEXT DEFAULT 'category',
  category_slug TEXT REFERENCES categories(slug),
  city_slug TEXT REFERENCES cities(slug),
  slot_position INTEGER,
  is_active INTEGER DEFAULT 1,
  starts_at TEXT,
  expires_at TEXT,
  account_id TEXT,
  title TEXT,
  link_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  placement TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS redirects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  timezone TEXT NOT NULL DEFAULT 'Australia/Sydney',
  venue_name TEXT,
  address TEXT,
  suburb TEXT,
  city TEXT NOT NULL,
  state TEXT,
  price_min INTEGER,
  price_max INTEGER,
  ticket_url TEXT,
  image_url TEXT,
  source TEXT NOT NULL DEFAULT 'admin',
  source_id TEXT,
  source_url TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  account_id TEXT,
  push_platform TEXT,
  push_id TEXT,
  push_url TEXT,
  push_at TEXT,
  is_visible INTEGER NOT NULL DEFAULT 1,
  registration_mode TEXT DEFAULT 'auto',
  UNIQUE(source, source_id)
);

CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics_daily (
  surface TEXT NOT NULL,
  surface_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (surface, surface_id, event_type, city, date)
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  surface TEXT NOT NULL,
  surface_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  city TEXT,
  device TEXT,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS advertiser_accounts (
  id TEXT NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  clerk_user_id TEXT NOT NULL,
  business_id INTEGER,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_sub_id TEXT,
  sub_status TEXT NOT NULL DEFAULT 'inactive',
  sub_expires_at TEXT,
  billing_email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  display_name TEXT,
  portal_email TEXT,
  account_role TEXT NOT NULL DEFAULT 'advertiser'
);

CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  account_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TEXT,
  config TEXT,
  last_synced TEXT,
  sync_status TEXT DEFAULT 'idle',
  sync_error TEXT,
  auto_approve INTEGER DEFAULT 0,
  push_enabled INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(account_id, platform)
);

CREATE TABLE IF NOT EXISTS advertiser_account_businesses (
  account_id TEXT NOT NULL,
  business_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner',
  is_primary INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (account_id, business_id),
  FOREIGN KEY (account_id) REFERENCES advertiser_accounts(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS business_claim_requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  account_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  portal_email TEXT,
  business_name TEXT NOT NULL,
  website TEXT,
  city TEXT,
  contact_email TEXT,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  resolved_business_id INTEGER,
  admin_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT,
  FOREIGN KEY (account_id) REFERENCES advertiser_accounts(id),
  FOREIGN KEY (resolved_business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS listing_transfer_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  from_business_id INTEGER NOT NULL REFERENCES businesses(id),
  to_email TEXT NOT NULL,
  to_business_id INTEGER REFERENCES businesses(id),
  status TEXT NOT NULL DEFAULT 'pending_acceptance',
  disclaimer_accepted INTEGER DEFAULT 0,
  payment_confirmed INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS event_external_refs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  event_id TEXT NOT NULL,
  account_id TEXT,
  platform TEXT NOT NULL,
  external_id TEXT NOT NULL,
  external_url TEXT,
  direction TEXT NOT NULL DEFAULT 'linked',
  status TEXT NOT NULL DEFAULT 'linked',
  last_seen_at TEXT,
  last_synced_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(platform, external_id)
);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  data BLOB NOT NULL,
  source TEXT NOT NULL DEFAULT 'admin',
  purpose TEXT NOT NULL DEFAULT 'event_image',
  public_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_city_starts ON events(city, starts_at);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);
CREATE INDEX IF NOT EXISTS idx_ad_surface ON analytics_daily(surface, surface_id, date);
CREATE INDEX IF NOT EXISTS idx_ae_surface ON analytics_events(surface, surface_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_events_account ON events(account_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_profile_slug ON businesses(profile_slug) WHERE profile_slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_integrations_account ON integrations(account_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_source_id ON events(source, source_id) WHERE source_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_aa_id_unique ON advertiser_accounts(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_aa_clerk_unique ON advertiser_accounts(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_aab_account ON advertiser_account_businesses(account_id);
CREATE INDEX IF NOT EXISTS idx_aab_business ON advertiser_account_businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_banners_account ON banners(account_id);
CREATE INDEX IF NOT EXISTS idx_bcr_status ON business_claim_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_bcr_account ON business_claim_requests(account_id);
CREATE INDEX IF NOT EXISTS idx_aa_clerk ON advertiser_accounts(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_events_push_platform ON events(push_platform) WHERE push_platform IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_is_visible ON events(is_visible);
CREATE INDEX IF NOT EXISTS idx_event_external_refs_event ON event_external_refs(event_id);
CREATE INDEX IF NOT EXISTS idx_event_external_refs_account ON event_external_refs(account_id);
CREATE INDEX IF NOT EXISTS idx_event_external_refs_platform ON event_external_refs(platform);
CREATE INDEX IF NOT EXISTS idx_media_assets_created ON media_assets(created_at);
CREATE INDEX IF NOT EXISTS idx_media_assets_account ON media_assets(account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_media_assets_purpose ON media_assets(purpose);

INSERT OR IGNORE INTO advertisers (id, name, email) VALUES
  (1, 'Smoke Advertiser', 'smoke@example.test');

INSERT OR IGNORE INTO businesses (id, name, description, website, advertiser_id, profile_slug, status) VALUES
  (1, 'Smoke Business', 'Local smoke-test business', 'https://example.test', 1, 'smoke-business', 'active');

INSERT OR IGNORE INTO categories (slug, label, sort_order, description, status) VALUES
  ('speed-dating', 'Speed Dating', 10, 'Local smoke-test category', 'active'),
  ('dinner-parties', 'Dinner Parties', 20, 'Local smoke-test category', 'active');

INSERT OR IGNORE INTO cities (slug, label, state, region) VALUES
  ('brisbane', 'Brisbane', 'QLD', 'South East Queensland'),
  ('sydney', 'Sydney', 'NSW', 'New South Wales');

INSERT OR IGNORE INTO listings (
  id, business_id, title, tagline, description, phone, email, web, image_url,
  location_state, location_city, location, listing_type, status, confidence_score, slug
) VALUES
  (1, 1, 'Smoke Listing', 'Local smoke-test listing', 'Used only for local admin smoke tests.', '0700000000', 'smoke@example.test', 'https://example.test', '/images/categories/cards/speed-dating.webp', 'QLD', 'Brisbane', 'Brisbane QLD', 'standard', 'active', 100, 'smoke-listing'),
  (2, 1, 'Smoke No Image Listing', 'Local smoke-test listing without an image', 'Used only for local admin listing-review smoke tests.', '0700000000', 'smoke@example.test', 'https://example.test', NULL, 'QLD', 'Brisbane', 'Brisbane QLD', 'standard', 'active', 100, 'smoke-no-image-listing');

INSERT OR IGNORE INTO listing_placements (id, listing_id, category_slug, city_slug, sort_order, position_type, is_active) VALUES
  (1, 1, 'speed-dating', 'brisbane', 1, 'organic', 1),
  (2, 2, 'speed-dating', 'brisbane', 2, 'organic', 1);

INSERT OR IGNORE INTO banners (
  id, business_id, image_url, click_url, alt_text, page_scope, category_slug, city_slug,
  slot_position, is_active, account_id, title, link_url, status, placement, created_at
) VALUES
  (1, 1, '/images/categories/cards/speed-dating.webp', 'https://example.test', 'Smoke banner', 'category', 'speed-dating', 'brisbane', 1, 1, 'smoke-admin', 'Smoke Banner', 'https://example.test', 'pending', 'homepage', datetime('now'));

INSERT OR IGNORE INTO advertiser_accounts (
  id, clerk_user_id, business_id, plan, sub_status, billing_email, display_name, portal_email, account_role
) VALUES
  ('smoke-admin', 'smoke-admin', 1, 'free', 'active', 'smoke@example.test', 'Smoke Admin', 'smoke@example.test', 'super_admin'),
  ('smoke-advertiser', 'smoke-advertiser', 1, 'free', 'active', 'advertiser@example.test', 'Smoke Advertiser', 'advertiser@example.test', 'advertiser');

INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status) VALUES
  ('smoke-admin', 1, 'owner', 1, 'active'),
  ('smoke-advertiser', 1, 'owner', 1, 'active');

INSERT OR IGNORE INTO business_claim_requests (
  id, account_id, clerk_user_id, portal_email, business_name, website, city, contact_email, phone, message, status
) VALUES
  ('smoke-claim', 'smoke-advertiser', 'smoke-advertiser', 'advertiser@example.test', 'Smoke Business Claim', 'https://example.test', 'Brisbane', 'advertiser@example.test', '0700000000', 'Local smoke-test claim.', 'pending');

INSERT OR IGNORE INTO integrations (
  id, account_id, platform, access_token, refresh_token, sync_status, auto_approve, push_enabled
) VALUES
  ('smoke-integration', 'smoke-advertiser', 'eventbrite', 'local-smoke-token', 'local-smoke-refresh', 'idle', 0, 0);

INSERT OR IGNORE INTO events (
  id, title, slug, description, starts_at, ends_at, venue_name, address, suburb, city, state,
  price_min, price_max, ticket_url, image_url, source, source_id, source_url, category,
  status, submitted_by, account_id, registration_mode
) VALUES
  ('smoke-event', 'Smoke Event', 'smoke-event', 'Used only for local admin smoke tests.', datetime('now', '+7 days'), datetime('now', '+7 days', '+2 hours'), 'Smoke Venue', '1 Test Street', 'Brisbane', 'Brisbane', 'QLD', 0, 0, 'https://example.test/tickets', '/images/categories/cards/speed-dating.webp', 'admin', 'smoke-event', 'https://example.test/event', 'speed-dating', 'pending', 'smoke-admin', 'smoke-advertiser', 'auto');

INSERT OR IGNORE INTO redirects (id, from_path, to_path, entity_type, entity_id) VALUES
  (1, '/old-smoke-page', '/admin/dashboard', 'smoke', 'smoke');

INSERT OR IGNORE INTO site_settings (key, value) VALUES
  ('smoke_local_d1', 'ready');
