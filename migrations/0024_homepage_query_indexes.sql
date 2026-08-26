CREATE INDEX IF NOT EXISTS idx_events_status_starts_visible
  ON events(status, starts_at, is_visible);

CREATE INDEX IF NOT EXISTS idx_events_status_city_starts
  ON events(status, city, starts_at);

CREATE INDEX IF NOT EXISTS idx_events_status_category_starts
  ON events(status, category, starts_at);

CREATE INDEX IF NOT EXISTS idx_businesses_id_advertiser
  ON businesses(id, advertiser_id);
