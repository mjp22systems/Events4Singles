CREATE TABLE IF NOT EXISTS event_external_refs (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  event_id       TEXT NOT NULL,
  account_id     TEXT,
  platform       TEXT NOT NULL,
  external_id    TEXT NOT NULL,
  external_url   TEXT,
  direction      TEXT NOT NULL DEFAULT 'linked',
  status         TEXT NOT NULL DEFAULT 'linked',
  last_seen_at   TEXT,
  last_synced_at TEXT,
  last_error     TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(platform, external_id)
);

CREATE INDEX IF NOT EXISTS idx_event_external_refs_event ON event_external_refs(event_id);
CREATE INDEX IF NOT EXISTS idx_event_external_refs_account ON event_external_refs(account_id);
CREATE INDEX IF NOT EXISTS idx_event_external_refs_platform ON event_external_refs(platform);

INSERT OR IGNORE INTO event_external_refs (
  event_id, account_id, platform, external_id, external_url,
  direction, status, last_seen_at, last_synced_at
)
SELECT id, account_id, COALESCE(push_platform, 'eventbrite'), push_id, push_url,
       'pushed_to', 'shared', push_at, push_at
FROM events
WHERE push_id IS NOT NULL;

INSERT OR IGNORE INTO event_external_refs (
  event_id, account_id, platform, external_id, external_url,
  direction, status, last_seen_at, last_synced_at
)
SELECT id, account_id, source, source_id, source_url,
       'imported_from', 'linked', updated_at, updated_at
FROM events
WHERE source_id IS NOT NULL;
