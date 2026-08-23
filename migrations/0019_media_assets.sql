CREATE TABLE IF NOT EXISTS media_assets (
  id           TEXT PRIMARY KEY,
  account_id   TEXT,
  filename     TEXT NOT NULL,
  content_type TEXT NOT NULL,
  byte_size    INTEGER NOT NULL,
  data         BLOB NOT NULL,
  source       TEXT NOT NULL DEFAULT 'admin',
  purpose      TEXT NOT NULL DEFAULT 'event_image',
  public_url   TEXT NOT NULL,
  alt_text     TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_media_assets_created ON media_assets(created_at);
CREATE INDEX IF NOT EXISTS idx_media_assets_account ON media_assets(account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_media_assets_purpose ON media_assets(purpose);
