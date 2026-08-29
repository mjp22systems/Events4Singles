import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith("--")) {
    args.set(process.argv[i], process.argv[i + 1]?.startsWith("--") ? true : process.argv[i + 1] ?? true);
  }
}

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod-(?:before-location-sweep-)?\d{8}-\d{6}\.sql$/i.test(name))
    .map((name) => ({ name, fullPath: path.join(outDir, name) }))
    .sort((a, b) => b.name.localeCompare(a.name));
  if (!files.length) throw new Error(`No production SQL dump found in ${outDir}.`);
  return files[0].fullPath;
}

function parseSqlValues(valuesSql) {
  const values = [];
  let current = "";
  let inString = false;
  for (let i = 0; i < valuesSql.length; i += 1) {
    const char = valuesSql[i];
    const next = valuesSql[i + 1];
    if (inString) {
      if (char === "'" && next === "'") {
        current += "'";
        i += 1;
      } else if (char === "'") {
        inString = false;
      } else {
        current += char;
      }
      continue;
    }
    if (char === "'") {
      inString = true;
      continue;
    }
    if (char === ",") {
      values.push(coerceSqlValue(current));
      current = "";
      continue;
    }
    current += char;
  }
  values.push(coerceSqlValue(current));
  return values;
}

function coerceSqlValue(value) {
  const trimmed = value.trim();
  if (/^null$/i.test(trimmed)) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function loadDumpTables(dumpPath, wantedTables) {
  const tables = Object.fromEntries(wantedTables.map((table) => [table, []]));
  const sql = readFileSync(dumpPath, "utf8");
  const lines = sql.split(/\r?\n/);
  const insertPattern = /^INSERT INTO "([^"]+)" \(([^)]+)\) VALUES\((.*)\);$/;
  for (const line of lines) {
    const match = line.match(insertPattern);
    if (!match) continue;
    const [, table, columnsSql, valuesSql] = match;
    if (!wantedTables.includes(table)) continue;
    const columns = columnsSql.split(",").map((column) => column.replace(/"/g, ""));
    const values = parseSqlValues(valuesSql);
    const row = {};
    columns.forEach((column, index) => {
      row[column] = values[index] ?? null;
    });
    tables[table].push(row);
  }
  return tables;
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function compact(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function normaliseTitle(value) {
  return clean(value)
    .replace(/\s+[–-]\s+/g, " - ")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s*,\s*/g, ", ");
}

function cityMentionSet(value, cities) {
  const text = ` ${compact(value)} `;
  const out = new Set();
  for (const city of cities) {
    if (["online", "national", "international", "tbc", "no_location"].includes(city.slug)) continue;
    const label = compact(city.label);
    const slugLabel = compact(city.slug);
    if ((label && text.includes(` ${label} `)) || (slugLabel && text.includes(` ${slugLabel} `))) {
      out.add(city.slug);
    }
  }
  return out;
}

function titleCitySuffix(title, cities) {
  const normalized = normaliseTitle(title);
  const match = normalized.match(/^(.+?) - ([A-Z][A-Za-z' ]+?)(?:\s+(?:NSW|VIC|QLD|SA|WA|TAS|ACT|NT))?$/);
  if (!match) return null;
  const [, base, suffix] = match;
  const city = cities.find((item) => compact(item.label) === compact(suffix));
  if (!city) return null;
  return { base: clean(base), citySlug: city.slug, suffix: clean(suffix) };
}

function shouldMoveDashRightToTagline(title) {
  const normalized = normaliseTitle(title);
  const match = normalized.match(/^(.+?) - (.+)$/);
  if (!match) return null;
  const [, base, right] = match;
  const words = clean(right).split(/\s+/).length;
  if (
    /!$/.test(right) ||
    /\b(?:premier|revive|enjoy|liveliest|save up to|social life|upcoming dates)\b/i.test(right) ||
    words >= 5
  ) {
    return { base: clean(base), tagline: clean(right) };
  }
  return null;
}

function placementCitiesFor(id, placements) {
  return new Set(
    placements
      .filter((placement) => Number(placement.listing_id) === Number(id) && placement.city_slug)
      .map((placement) => placement.city_slug),
  );
}

const dumpPath = args.get("--dump") ? path.resolve(root, args.get("--dump")) : latestDumpPath();
const migrationPath = args.get("--migration") ? path.resolve(root, args.get("--migration")) : null;
const { businesses, listings, listing_placements: placements, cities } = loadDumpTables(dumpPath, ["businesses", "listings", "listing_placements", "cities"]);
const businessById = new Map(businesses.map((business) => [Number(business.id), business]));

const updates = [];
const businessUpdates = [];
const review = [];

function addUpdate(listing, fields, reason) {
  const changed = Object.entries(fields).some(([field, value]) => clean(listing[field]) !== clean(value));
  if (!changed) return;
  updates.push({
    id: Number(listing.id),
    title: clean(listing.title),
    before: {
      title: clean(listing.title),
      tagline: clean(listing.tagline),
      location: clean(listing.location),
      location_city: clean(listing.location_city),
      location_state: clean(listing.location_state),
      listing_type: clean(listing.listing_type),
    },
    after: fields,
    reason,
  });
}

function addBusinessUpdate(listing, fields, reason) {
  const business = businessById.get(Number(listing.business_id));
  if (!business) return;
  const changed = Object.entries(fields).some(([field, value]) => clean(business[field]) !== clean(value));
  if (!changed) return;
  businessUpdates.push({
    id: Number(business.id),
    name: clean(business.name),
    before: {
      name: clean(business.name),
      website: clean(business.website),
    },
    after: fields,
    reason,
  });
}

function mirrorBusinessNameIfPolluted(listing, cleanTitle, reason) {
  const business = businessById.get(Number(listing.business_id));
  if (!business) return;
  if (clean(business.name) === clean(listing.title)) {
    addBusinessUpdate(listing, { name: cleanTitle }, reason);
  }
}

for (const listing of listings) {
  const title = clean(listing.title);
  const tagline = clean(listing.tagline);
  const placementCities = placementCitiesFor(listing.id, placements);
  const titleCities = cityMentionSet(title, cities);

  if (clean(listing.listing_type) === "event_org") {
    addUpdate(listing, { listing_type: "event_organizer" }, "normalise legacy listing_type event_org");
  }

  if (Number(listing.id) === 51) {
    addUpdate(listing, { title: "Blink Speed Dating", location: null, location_city: "National", location_state: null }, "remove city-list pollution already represented by city placements");
    mirrorBusinessNameIfPolluted(listing, "Blink Speed Dating", "mirror title cleanup into matching business name");
    continue;
  }

  if (Number(listing.id) === 558) {
    addUpdate(listing, { title: "AusLatin Productions", tagline: "Surrender to the Rhythm!", location: "Hornsby & Castle Hill" }, "move Sydney placement and suburbs/tagline out of title");
    mirrorBusinessNameIfPolluted(listing, "AusLatin Productions", "mirror title cleanup into matching business name");
    continue;
  }

  if (!tagline) {
    const suffix = titleCitySuffix(title, cities);
    if (suffix && placementCities.has(suffix.citySlug)) {
      addUpdate(listing, { title: suffix.base }, "remove trailing city already represented by placement");
      mirrorBusinessNameIfPolluted(listing, suffix.base, "mirror title cleanup into matching business name");
      continue;
    }

    const taglineMove = shouldMoveDashRightToTagline(title);
    if (taglineMove) {
      addUpdate(listing, { title: taglineMove.base, tagline: taglineMove.tagline }, "move promotional dash fragment into tagline");
      mirrorBusinessNameIfPolluted(listing, taglineMove.base, "mirror title cleanup into matching business name");
      continue;
    }
  }

  if (titleCities.size > 1) {
    review.push({
      id: Number(listing.id),
      title,
      location: clean(listing.location),
      location_city: clean(listing.location_city),
      placement_cities: [...placementCities].join(", "),
      reason: `multiple city names in title: ${[...titleCities].join(", ")}`,
    });
  } else if (/\b(?:speed dating|dinner parties|dance classes|online dating|dating agency|singles events)\b/i.test(title)) {
    review.push({
      id: Number(listing.id),
      title,
      location: clean(listing.location),
      location_city: clean(listing.location_city),
      placement_cities: [...placementCities].join(", "),
      reason: "category/tag-like words may be part of the business name or may be title pollution",
    });
  } else if (/\b\d{4}[\d ]{2,}\b/.test(title)) {
    review.push({
      id: Number(listing.id),
      title,
      location: clean(listing.location),
      location_city: clean(listing.location_city),
      placement_cities: [...placementCities].join(", "),
      reason: "phone-like number in title",
    });
  }
}

const merged = new Map();
for (const update of updates) {
  if (!merged.has(update.id)) {
    merged.set(update.id, update);
    continue;
  }
  const existing = merged.get(update.id);
  existing.after = { ...existing.after, ...update.after };
  existing.reason = `${existing.reason}; ${update.reason}`;
}

const mergedBusinessUpdates = new Map();
for (const update of businessUpdates) {
  if (!mergedBusinessUpdates.has(update.id)) {
    mergedBusinessUpdates.set(update.id, update);
    continue;
  }
  const existing = mergedBusinessUpdates.get(update.id);
  existing.after = { ...existing.after, ...update.after };
  existing.reason = `${existing.reason}; ${update.reason}`;
}

const statements = [
  "-- Title/type/location cleanup sweep.",
  "-- Generated by tools/generate-title-field-cleanup.mjs from a production D1 export.",
  "-- Obvious title pollution is moved to the correct field; ambiguous cases stay in the review report.",
  "",
];

for (const update of [...merged.values()].sort((a, b) => a.id - b.id)) {
  const assignments = Object.entries(update.after).map(([field, value]) => `${field} = ${sqlValue(value)}`);
  assignments.push("updated_at = datetime('now')");
  statements.push(`UPDATE listings SET ${assignments.join(", ")} WHERE id = ${update.id};`);
}

if (mergedBusinessUpdates.size) statements.push("");
for (const update of [...mergedBusinessUpdates.values()].sort((a, b) => a.id - b.id)) {
  const assignments = Object.entries(update.after).map(([field, value]) => `${field} = ${sqlValue(value)}`);
  assignments.push("updated_at = datetime('now')");
  statements.push(`UPDATE businesses SET ${assignments.join(", ")} WHERE id = ${update.id};`);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outDir, `title-field-cleanup-candidates-${stamp}.json`);
const sqlPath = migrationPath || path.join(outDir, `title-field-cleanup-candidates-${stamp}.sql`);
writeFileSync(reportPath, JSON.stringify({ dump_path: dumpPath, updates: [...merged.values()], business_updates: [...mergedBusinessUpdates.values()], review }, null, 2));
writeFileSync(sqlPath, `${statements.join("\n")}\n`);

console.log(JSON.stringify({
  listing_updates: merged.size,
  business_updates: mergedBusinessUpdates.size,
  review_only: review.length,
}, null, 2));
console.log(`Report: ${reportPath}`);
console.log(`Migration: ${sqlPath}`);
