export type EventExternalRefDirection = "imported_from" | "pushed_to" | "linked";
export type EventExternalRefStatus = "linked" | "shared" | "stale" | "error";

export type EventExternalRefInput = {
  eventId: string;
  accountId: string | null;
  platform: string;
  externalId: string;
  externalUrl?: string | null;
  direction: EventExternalRefDirection;
  status?: EventExternalRefStatus;
  lastError?: string | null;
};

export type EventExternalRefMatch = {
  event_id: string;
  direction: EventExternalRefDirection;
  status: EventExternalRefStatus;
};

let ensured = false;

export async function ensureEventExternalRefsTable(db: D1Database): Promise<void> {
  if (ensured) return;
  await db.prepare(`
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
    )
  `).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_event_external_refs_event ON event_external_refs(event_id)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_event_external_refs_account ON event_external_refs(account_id)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_event_external_refs_platform ON event_external_refs(platform)").run();
  ensured = true;
}

export async function findEventByExternalRef(
  db: D1Database,
  platform: string,
  externalId: string,
  accountId?: string | null,
): Promise<EventExternalRefMatch | null> {
  await ensureEventExternalRefsTable(db);
  const accountClause = accountId ? "AND (account_id = ? OR account_id IS NULL)" : "";
  const params = accountId ? [platform, externalId, accountId] : [platform, externalId];
  return db.prepare(
    `SELECT event_id, direction, status
     FROM event_external_refs
     WHERE platform = ? AND external_id = ? ${accountClause}
     ORDER BY updated_at DESC
     LIMIT 1`
  ).bind(...params).first<EventExternalRefMatch>();
}

export async function upsertEventExternalRef(db: D1Database, input: EventExternalRefInput): Promise<void> {
  await ensureEventExternalRefsTable(db);
  await db.prepare(`
    INSERT INTO event_external_refs (
      event_id, account_id, platform, external_id, external_url,
      direction, status, last_seen_at, last_synced_at, last_error
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
    ON CONFLICT(platform, external_id) DO UPDATE SET
      event_id = excluded.event_id,
      account_id = COALESCE(excluded.account_id, event_external_refs.account_id),
      external_url = COALESCE(excluded.external_url, event_external_refs.external_url),
      direction = CASE
        WHEN event_external_refs.direction != excluded.direction THEN 'linked'
        ELSE excluded.direction
      END,
      status = excluded.status,
      last_seen_at = datetime('now'),
      last_synced_at = datetime('now'),
      last_error = excluded.last_error,
      updated_at = datetime('now')
  `).bind(
    input.eventId,
    input.accountId,
    input.platform,
    input.externalId,
    input.externalUrl ?? null,
    input.direction,
    input.status ?? "linked",
    input.lastError ?? null,
  ).run();
}

export async function markEventExternalRefStale(
  db: D1Database,
  platform: string,
  externalId: string,
  message: string | null = null,
): Promise<void> {
  await ensureEventExternalRefsTable(db);
  await db.prepare(`
    UPDATE event_external_refs
    SET status = 'stale',
        last_error = ?,
        updated_at = datetime('now')
    WHERE platform = ? AND external_id = ?
  `).bind(message, platform, externalId).run();
}
