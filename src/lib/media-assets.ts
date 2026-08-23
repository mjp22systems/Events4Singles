export type MediaAssetPurpose = "event_image" | "banner" | "profile";

export type MediaAsset = {
  id: string;
  account_id: string | null;
  filename: string;
  content_type: string;
  byte_size: number;
  source: string;
  purpose: MediaAssetPurpose;
  public_url: string;
  alt_text: string | null;
  created_at: string;
};

export type MediaAssetWithData = MediaAsset & {
  data: ArrayBuffer;
};

let ensured = false;

async function columnNames(db: D1Database, table: string): Promise<Set<string>> {
  const rows = await db.prepare(`PRAGMA table_info(${table})`).all<{ name: string }>();
  return new Set(rows.results.map((row) => row.name));
}

async function ensureColumn(db: D1Database, columns: Set<string>, name: string, ddl: string): Promise<void> {
  if (columns.has(name)) return;
  await db.prepare(`ALTER TABLE media_assets ADD COLUMN ${ddl}`).run();
  columns.add(name);
}

export async function ensureMediaAssetsTable(db: D1Database): Promise<void> {
  if (ensured) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id           TEXT PRIMARY KEY,
      account_id   TEXT,
      filename     TEXT NOT NULL,
      content_type TEXT NOT NULL,
      byte_size    INTEGER NOT NULL,
      data         BLOB NOT NULL,
      source       TEXT NOT NULL DEFAULT 'admin',
      purpose      TEXT NOT NULL DEFAULT 'event_image',
      public_url   TEXT NOT NULL,
      alt_text     TEXT,
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `).run();

  const columns = await columnNames(db, "media_assets");
  await ensureColumn(db, columns, "account_id", "account_id TEXT");
  await ensureColumn(db, columns, "purpose", "purpose TEXT NOT NULL DEFAULT 'event_image'");
  await ensureColumn(db, columns, "alt_text", "alt_text TEXT");
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_media_assets_created ON media_assets(created_at)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_media_assets_account ON media_assets(account_id, created_at)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_media_assets_purpose ON media_assets(purpose)").run();
  ensured = true;
}

export async function createMediaAsset(
  db: D1Database,
  input: {
    accountId: string | null;
    filename: string;
    contentType: string;
    byteSize: number;
    data: ArrayBuffer;
    source: string;
    purpose?: MediaAssetPurpose;
    altText?: string | null;
  },
): Promise<MediaAsset> {
  await ensureMediaAssetsTable(db);
  const id = crypto.randomUUID().replace(/-/g, "");
  const publicUrl = `/media/${id}`;
  await db.prepare(`
    INSERT INTO media_assets (
      id, account_id, filename, content_type, byte_size, data,
      source, purpose, public_url, alt_text
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    input.accountId,
    input.filename,
    input.contentType,
    input.byteSize,
    input.data,
    input.source,
    input.purpose ?? "event_image",
    publicUrl,
    input.altText ?? null,
  ).run();

  return {
    id,
    account_id: input.accountId,
    filename: input.filename,
    content_type: input.contentType,
    byte_size: input.byteSize,
    source: input.source,
    purpose: input.purpose ?? "event_image",
    public_url: publicUrl,
    alt_text: input.altText ?? null,
    created_at: new Date().toISOString(),
  };
}

export async function getMediaAsset(db: D1Database, id: string): Promise<MediaAssetWithData | null> {
  await ensureMediaAssetsTable(db);
  return db.prepare(`
    SELECT id, account_id, filename, content_type, byte_size, data,
           source, purpose, public_url, alt_text, created_at
    FROM media_assets
    WHERE id = ?
  `).bind(id).first<MediaAssetWithData>();
}

export async function listMediaAssetsForAccount(
  db: D1Database,
  accountId: string,
  purpose: MediaAssetPurpose = "event_image",
  limit = 60,
): Promise<MediaAsset[]> {
  await ensureMediaAssetsTable(db);
  const rows = await db.prepare(`
    SELECT id, account_id, filename, content_type, byte_size,
           source, purpose, public_url, alt_text, created_at
    FROM media_assets
    WHERE account_id = ?
      AND purpose = ?
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(accountId, purpose, limit).all<MediaAsset>();
  return rows.results;
}

export async function listMediaAssets(
  db: D1Database,
  purpose: MediaAssetPurpose = "event_image",
  limit = 120,
): Promise<MediaAsset[]> {
  await ensureMediaAssetsTable(db);
  const rows = await db.prepare(`
    SELECT id, account_id, filename, content_type, byte_size,
           source, purpose, public_url, alt_text, created_at
    FROM media_assets
    WHERE purpose = ?
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(purpose, limit).all<MediaAsset>();
  return rows.results;
}
