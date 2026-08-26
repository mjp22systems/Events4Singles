import { getD1 } from "./db";
import { toUrlSlug } from "./constants";

export interface NotFoundHit {
  id: number;
  path: string;
  normalized_path: string;
  referrer: string | null;
  hit_count: number;
  first_seen: number;
  last_seen: number;
  resolved_at: number | null;
}

export interface NotFoundSuggestion {
  href: string;
  label: string;
  reason: string;
}

type RouteCandidate = {
  href: string;
  label: string;
  token: string;
  kind: "city" | "category";
};

function cleanPath(path: string): string {
  try {
    path = new URL(path, "https://events4singles.com").pathname;
  } catch {
    path = path.split("?")[0]?.split("#")[0] ?? "/";
  }
  path = path.trim() || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function normalizeNotFoundPath(path: string): string {
  const clean = cleanPath(path).toLowerCase();
  const withoutIndex = clean.replace(/\/index\.(html?|php|aspx?)$/i, "/");
  const withoutExt = withoutIndex.replace(/\.(html?|php|aspx?)$/i, "");
  const withoutTrailingDigits = withoutExt.replace(/([a-z])[-_ ]*\d+$/i, "$1");
  const normalized = withoutTrailingDigits
    .replace(/%20/g, "-")
    .replace(/[_\s]+/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/-+/g, "-")
    .replace(/\/$/, "");
  return normalized || "/";
}

export async function ensureNotFoundHitsTable(db?: D1Database): Promise<D1Database> {
  const d1 = db ?? await getD1();
  await d1
    .prepare(
      `CREATE TABLE IF NOT EXISTS not_found_hits (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        path        TEXT NOT NULL,
        normalized_path TEXT NOT NULL UNIQUE,
        referrer    TEXT,
        user_agent  TEXT,
        hit_count   INTEGER NOT NULL DEFAULT 1,
        first_seen  INTEGER NOT NULL DEFAULT (strftime('%s','now')),
        last_seen   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
        resolved_at INTEGER
      )`
    )
    .run();
  return d1;
}

export async function recordNotFoundHit(fields: {
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  const db = await ensureNotFoundHitsTable();
  const path = cleanPath(fields.path);
  const normalized = normalizeNotFoundPath(path);
  await db
    .prepare(
      `INSERT INTO not_found_hits (path, normalized_path, referrer, user_agent)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(normalized_path) DO UPDATE SET
         path = excluded.path,
         referrer = COALESCE(excluded.referrer, not_found_hits.referrer),
         user_agent = COALESCE(excluded.user_agent, not_found_hits.user_agent),
         hit_count = not_found_hits.hit_count + 1,
         last_seen = strftime('%s','now'),
         resolved_at = NULL`
    )
    .bind(path, normalized, fields.referrer ?? null, fields.userAgent ?? null)
    .run();
}

export async function listNotFoundHits(limit = 50): Promise<NotFoundHit[]> {
  const db = await ensureNotFoundHitsTable();
  const { results } = await db
    .prepare(
      `SELECT id, path, normalized_path, referrer, hit_count, first_seen, last_seen, resolved_at
       FROM not_found_hits
       WHERE resolved_at IS NULL
       ORDER BY hit_count DESC, last_seen DESC
       LIMIT ?`
    )
    .bind(limit)
    .all<NotFoundHit>();
  return results;
}

export async function resolveNotFoundHit(normalizedPath: string): Promise<void> {
  const db = await ensureNotFoundHitsTable();
  await db
    .prepare("UPDATE not_found_hits SET resolved_at = strftime('%s','now') WHERE normalized_path = ?")
    .bind(normalizeNotFoundPath(normalizedPath))
    .run();
}

function scoreCandidate(normalized: string, candidate: RouteCandidate): number {
  const pathParts = normalized.split("/").filter(Boolean);
  const lastPart = pathParts.at(-1) ?? "";
  const loosePath = normalized.replace(/[^a-z0-9]+/g, "-");
  let score = 0;
  if (lastPart === candidate.token) score += 100;
  if (pathParts.includes(candidate.token)) score += 80;
  if (loosePath.includes(candidate.token)) score += 50;
  const words = candidate.token.split("-");
  if (words.length > 1 && words.every((word) => loosePath.includes(word))) score += 35;
  if (candidate.kind === "city" && pathParts.length === 1) score += 10;
  return score;
}

export async function getNotFoundSuggestions(path: string, limit = 4): Promise<NotFoundSuggestion[]> {
  const db = await getD1();
  const normalized = normalizeNotFoundPath(path);
  const [{ results: cities }, { results: categories }] = await Promise.all([
    db.prepare("SELECT slug, label FROM cities ORDER BY label ASC").all<{ slug: string; label: string }>(),
    db.prepare("SELECT slug, label FROM categories ORDER BY label ASC").all<{ slug: string; label: string }>(),
  ]);

  const cityCandidates: RouteCandidate[] = cities.map((city) => ({
    href: `/${toUrlSlug(city.slug)}`,
    label: city.label,
    token: toUrlSlug(city.slug),
    kind: "city",
  }));
  const categoryCandidates: RouteCandidate[] = categories.map((category) => ({
    href: `/${toUrlSlug(category.slug)}`,
    label: category.label,
    token: toUrlSlug(category.slug),
    kind: "category",
  }));

  const scored = [...cityCandidates, ...categoryCandidates]
    .map((candidate) => ({ candidate, score: scoreCandidate(normalized, candidate) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.label.localeCompare(b.candidate.label));

  const suggestions: NotFoundSuggestion[] = [];
  const bestCity = scored.find((item) => item.candidate.kind === "city");
  const bestCategory = scored.find((item) => item.candidate.kind === "category");
  if (bestCategory && bestCity && normalized.split("/").filter(Boolean).length > 1) {
    suggestions.push({
      href: `${bestCategory.candidate.href}${bestCity.candidate.href}`,
      label: `${bestCategory.candidate.label} in ${bestCity.candidate.label}`,
      reason: "Closest category and city match",
    });
  }

  for (const item of scored) {
    if (suggestions.some((suggestion) => suggestion.href === item.candidate.href)) continue;
    suggestions.push({
      href: item.candidate.href,
      label: item.candidate.label,
      reason: item.candidate.kind === "city" ? "Closest city page" : "Closest category page",
    });
    if (suggestions.length >= limit) break;
  }

  const fallback: NotFoundSuggestion[] = [
    { href: "/cities", label: "Browse all cities", reason: "City directory" },
    { href: "/categories", label: "Browse all categories", reason: "Category directory" },
    { href: "/events", label: "Upcoming events", reason: "Current event calendar" },
  ];
  for (const item of fallback) {
    if (suggestions.length >= limit) break;
    if (!suggestions.some((suggestion) => suggestion.href === item.href)) suggestions.push(item);
  }
  return suggestions.slice(0, limit);
}
