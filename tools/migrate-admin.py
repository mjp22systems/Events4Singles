"""
migrate-admin.py — adds admin portal tables and columns to listings.db (or listings.staging.db)

Run: python tools/migrate-admin.py
"""
import sqlite3
import os
import sys

DB_CANDIDATES = [
    os.path.join(os.path.dirname(__file__), "..", "listings.staging.db"),
    os.path.join(os.path.dirname(__file__), "..", "listings.db"),
]

db_path = None
for candidate in DB_CANDIDATES:
    if os.path.exists(candidate):
        db_path = os.path.abspath(candidate)
        break

if not db_path:
    print("ERROR: no listings.db or listings.staging.db found.", file=sys.stderr)
    sys.exit(1)

print(f"Migrating: {db_path}")

con = sqlite3.connect(db_path)
cur = con.cursor()

migrations = [
    # ── New tables ─────────────────────────────────────────────────────────
    """
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS admin_activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_type TEXT NOT NULL,
      actor_id   TEXT,
      action     TEXT NOT NULL,
      entity_type TEXT,
      entity_id   TEXT,
      meta       TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS analytics_events (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type   TEXT NOT NULL,
      listing_id   INTEGER REFERENCES listings(id),
      banner_id    INTEGER REFERENCES banners(id),
      session_hash TEXT,
      page_url     TEXT,
      referrer     TEXT,
      created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_analytics_listing
      ON analytics_events(listing_id, event_type, created_at)
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_analytics_banner
      ON analytics_events(banner_id, event_type, created_at)
    """,
    """
    CREATE TABLE IF NOT EXISTS redirects (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      from_path   TEXT NOT NULL UNIQUE,
      to_path     TEXT NOT NULL,
      entity_type TEXT,
      entity_id   TEXT,
      created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS listing_transfer_requests (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id       INTEGER NOT NULL REFERENCES listings(id),
      from_business_id INTEGER NOT NULL REFERENCES businesses(id),
      to_email         TEXT NOT NULL,
      to_business_id   INTEGER REFERENCES businesses(id),
      status           TEXT NOT NULL DEFAULT 'pending_acceptance',
      disclaimer_accepted INTEGER DEFAULT 0,
      payment_confirmed   INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
    """,
]

# ALTER TABLE — add columns if missing
def add_column_if_missing(table, col, definition):
    cur.execute(f"PRAGMA table_info({table})")
    cols = {row[1] for row in cur.fetchall()}
    if col not in cols:
        cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {definition}")
        print(f"  + {table}.{col}")
    else:
        print(f"  . {table}.{col} (already exists)")

for sql in migrations:
    cur.execute(sql)

print("\nAltering existing tables...")

# listings
add_column_if_missing("listings", "unclaimed_flag",         "INTEGER DEFAULT 0")
add_column_if_missing("listings", "hide_contact",           "INTEGER DEFAULT 0")
add_column_if_missing("listings", "deleted_at",             "INTEGER")
add_column_if_missing("listings", "deleted_reason",         "TEXT")
add_column_if_missing("listings", "merged_into_listing_id", "INTEGER")
add_column_if_missing("listings", "ai_moderation_status",   "TEXT")
add_column_if_missing("listings", "ai_moderation_reason",   "TEXT")

# businesses
add_column_if_missing("businesses", "merged_into_business_id", "INTEGER")
add_column_if_missing("businesses", "merged_at",               "INTEGER")

# categories
add_column_if_missing("categories", "banner_row_count", "INTEGER DEFAULT 1")
add_column_if_missing("categories", "seo_title",        "TEXT")
add_column_if_missing("categories", "seo_description",  "TEXT")
add_column_if_missing("categories", "hero_image_url",   "TEXT")

# cities
add_column_if_missing("cities", "seo_title",       "TEXT")
add_column_if_missing("cities", "seo_description", "TEXT")

con.commit()
con.close()
print("\nDone.")
