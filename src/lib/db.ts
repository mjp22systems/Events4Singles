import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    const local = path.join(process.cwd(), "listings.db");
    const parent = path.join(process.cwd(), "..", "listings.db");
    const dbPath = fs.existsSync(local) ? local : parent;
    _db = new Database(dbPath, { readonly: true });
    _db.pragma("journal_mode = WAL");
  }
  return _db;
}
