CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_settings (key, value) VALUES ('notification_email', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('subscribe_from_name', 'Events4Singles');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('subscribe_from_email', 'hello@events4singles.com');
