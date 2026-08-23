CREATE TABLE IF NOT EXISTS integrations (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  account_id    TEXT NOT NULL,
  platform      TEXT NOT NULL,
  access_token  TEXT,
  refresh_token TEXT,
  token_expiry  TEXT,
  config        TEXT,
  last_synced   TEXT,
  sync_status   TEXT DEFAULT 'idle',
  sync_error    TEXT,
  auto_approve  INTEGER DEFAULT 0,
  push_enabled  INTEGER DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(account_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_integrations_account ON integrations(account_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_source_id ON events(source, source_id) WHERE source_id IS NOT NULL;
