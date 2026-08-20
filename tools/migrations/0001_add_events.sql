-- Migration: Add events table
-- Apply: wrangler d1 execute events4singles --file=tools/migrations/0001_add_events.sql
-- Dev:   wrangler d1 execute events4singles --local --file=tools/migrations/0001_add_events.sql

CREATE TABLE IF NOT EXISTS events (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT,
  starts_at    TEXT NOT NULL,
  ends_at      TEXT,
  timezone     TEXT NOT NULL DEFAULT 'Australia/Sydney',
  venue_name   TEXT,
  address      TEXT,
  suburb       TEXT,
  city         TEXT NOT NULL,
  state        TEXT,
  price_min    INTEGER,
  price_max    INTEGER,
  ticket_url   TEXT,
  image_url    TEXT,
  source       TEXT NOT NULL DEFAULT 'admin',
  source_id    TEXT,
  source_url   TEXT,
  category     TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  submitted_by TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(source, source_id)
);

CREATE INDEX IF NOT EXISTS idx_events_city_starts ON events(city, starts_at);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);
