CREATE TABLE IF NOT EXISTS not_found_hits (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  path        TEXT NOT NULL,
  normalized_path TEXT NOT NULL,
  referrer    TEXT,
  user_agent  TEXT,
  hit_count   INTEGER NOT NULL DEFAULT 1,
  first_seen  INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  last_seen   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  resolved_at INTEGER,
  UNIQUE(normalized_path)
);

CREATE INDEX IF NOT EXISTS idx_not_found_hits_last_seen ON not_found_hits(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_not_found_hits_hit_count ON not_found_hits(hit_count DESC);
