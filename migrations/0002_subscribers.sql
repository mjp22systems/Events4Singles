CREATE TABLE IF NOT EXISTS subscribers (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email        TEXT UNIQUE NOT NULL,
  first_name   TEXT,
  city         TEXT,
  status       TEXT NOT NULL DEFAULT 'active',
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
