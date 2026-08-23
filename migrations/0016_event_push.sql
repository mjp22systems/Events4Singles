-- Track which events have been pushed to external platforms
ALTER TABLE events ADD COLUMN push_platform TEXT;
ALTER TABLE events ADD COLUMN push_id      TEXT;
ALTER TABLE events ADD COLUMN push_url     TEXT;
ALTER TABLE events ADD COLUMN push_at      TEXT;
ALTER TABLE events ADD COLUMN is_visible   INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_events_push_platform ON events(push_platform) WHERE push_platform IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_is_visible    ON events(is_visible);
