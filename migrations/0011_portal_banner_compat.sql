ALTER TABLE banners ADD COLUMN account_id TEXT;
ALTER TABLE banners ADD COLUMN title TEXT;
ALTER TABLE banners ADD COLUMN link_url TEXT;
ALTER TABLE banners ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE banners ADD COLUMN placement TEXT;
ALTER TABLE banners ADD COLUMN created_at TEXT;

CREATE INDEX IF NOT EXISTS idx_banners_account ON banners(account_id);
