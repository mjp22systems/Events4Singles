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

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function key(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function slug(value) {
  return clean(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
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

const dumpPath = args.get("--dump") ? path.resolve(root, args.get("--dump")) : latestDumpPath();
const { listings, listing_placements: placements, cities } = loadDumpTables(dumpPath, ["listings", "listing_placements", "cities"]);
const cityBySlug = new Map(cities.map((city) => [city.slug, city]));
const cityAliases = new Map();
for (const city of cities) {
  cityAliases.set(key(city.label), city.slug);
  cityAliases.set(key(city.slug), city.slug);
  cityAliases.set(city.slug, city.slug);
}
cityAliases.set("byron bay", "byron_bay");
cityAliases.set("goldcoast", "gold_coast");
cityAliases.set("sunshine coast", "sunshine_coast");
cityAliases.set("central coast", "central_coast");

const internalLocations = new Map([
  ["online", { city: "Online", location: "Online" }],
  ["national", { city: "National", location: "National" }],
  ["international", { city: "International", location: "International" }],
  ["tbc", { city: "To Be Confirmed", location: "To Be Confirmed" }],
  ["no_location", { city: "No Location Review", location: "No Location Review" }],
]);

const regionLocations = new Map([
  ["blue_mountains", "Blue Mountains"],
  ["melbourne2", "Melbourne"],
  ["riverina_nsw", "Riverina NSW"],
  ["south_australia", "South Australia"],
]);

const placementsByListing = new Map();
for (const placement of placements) {
  const id = Number(placement.listing_id);
  if (!placementsByListing.has(id)) placementsByListing.set(id, []);
  placementsByListing.get(id).push(placement);
}

function cityFromValue(value) {
  const normalized = key(value);
  return cityAliases.get(normalized) || cityAliases.get(slug(value)) || null;
}

function labelForCitySlug(citySlug) {
  return clean(cityBySlug.get(citySlug)?.label || citySlug.replace(/_/g, " "));
}

function stateForCitySlug(citySlug) {
  return clean(cityBySlug.get(citySlug)?.state || "");
}

function titleCityMentions(title) {
  const text = ` ${key(title)} `;
  const hits = new Set();
  for (const city of cities) {
    if (["tbc", "national", "online", "international", "no_location"].includes(city.slug)) continue;
    const cityKey = key(city.label);
    if (cityKey.length < 4) continue;
    const pattern = new RegExp(`(?:^| )${cityKey.replace(/\s+/g, " +")}(?: |$)`);
    if (pattern.test(text)) hits.add(city.slug);
  }
  return [...hits];
}

function strongSourceCity(sourceFile) {
  const file = key(sourceFile);
  for (const city of cities) {
    if (["tbc", "national", "online", "international", "no_location"].includes(city.slug)) continue;
    const cityKey = key(city.label);
    const slugKey = key(city.slug);
    if (file.includes(`events ${slugKey}`) || file.includes(`${slugKey} htm`) || file.includes(`${cityKey} htm`) || file.includes(` ${cityKey} `)) {
      return city.slug;
    }
  }
  return null;
}

function titleLocationFragment(title, citySlug) {
  const label = labelForCitySlug(citySlug);
  const cityRegex = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  const patterns = [
    new RegExp(`\\bLocation\\s+(${cityRegex})\\b`, "i"),
    new RegExp(`\\b(?:in|at|based\\s+in|based)\\s+(${cityRegex})\\b`, "i"),
    new RegExp(`[-–]\\s*([^,|]+\\b${cityRegex}\\b[^,|]*)`, "i"),
  ];
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match?.[1]) return clean(match[1]);
  }
  if (new RegExp(`\\b${cityRegex}\\b`, "i").test(title)) return label;
  return null;
}

const updates = [];
const placementAdds = [];
const review = [];

for (const listing of listings) {
  if (key(listing.status || "active") !== "active") continue;
  const id = Number(listing.id);
  const title = clean(listing.title);
  const currentCity = clean(listing.location_city);
  const currentLocation = clean(listing.location);
  const currentState = clean(listing.location_state);
  const listingPlacements = placementsByListing.get(id) || [];
  const cityPlacements = new Set(listingPlacements.map((p) => p.city_slug).filter(Boolean));
  const update = {};
  const reasons = [];

  const rawSlug = slug(currentCity);
  if (regionLocations.has(rawSlug)) {
    const region = regionLocations.get(rawSlug);
    update.location = currentLocation && currentLocation !== currentCity ? currentLocation : region;
    update.location_city = rawSlug === "melbourne2" ? "Melbourne" : "No Location Review";
    update.location_state = rawSlug === "melbourne2" ? "VIC" : "";
    reasons.push(`normalise raw region/location value '${currentCity}'`);
  }

  const cityFromCurrent = cityFromValue(currentCity);
  if (cityFromCurrent && cityBySlug.has(cityFromCurrent) && currentCity !== labelForCitySlug(cityFromCurrent)) {
    update.location_city = labelForCitySlug(cityFromCurrent);
    update.location_state = stateForCitySlug(cityFromCurrent);
    if (!currentLocation || currentLocation === currentCity) update.location = labelForCitySlug(cityFromCurrent);
    reasons.push(`normalise location_city '${currentCity}' to display label`);
  }

  if (internalLocations.has(rawSlug) && currentCity !== internalLocations.get(rawSlug).city) {
    update.location_city = internalLocations.get(rawSlug).city;
    if (!currentLocation || currentLocation === currentCity) update.location = internalLocations.get(rawSlug).location;
    reasons.push(`normalise internal location '${currentCity}'`);
  }

  const titleCities = titleCityMentions(title);
  const sourceCity = strongSourceCity(listing.source_file);
  const candidateCity = titleCities.length === 1 ? titleCities[0] : sourceCity;
  const safePlaceholder = ["", "no location review", "to be confirmed", "tbc"].includes(key(currentCity));

  if (candidateCity && safePlaceholder) {
    update.location_city = labelForCitySlug(candidateCity);
    update.location_state = stateForCitySlug(candidateCity);
    update.location = titleLocationFragment(title, candidateCity) || labelForCitySlug(candidateCity);
    reasons.push(`derive city from ${titleCities.length === 1 ? "title" : "source path"}`);
    if (!cityPlacements.has(candidateCity)) {
      placementAdds.push({ id, citySlug: candidateCity, categorySlugs: [...new Set(listingPlacements.map((p) => p.category_slug).filter(Boolean))], reason: reasons.at(-1) });
    }
  } else if (titleCities.length > 1) {
    review.push({ id, title, location_city: currentCity, placement_cities: [...cityPlacements].join(", "), reason: `multiple title city mentions: ${titleCities.join(", ")}` });
  } else if (titleCities.length === 1 && cityPlacements.size && !cityPlacements.has(titleCities[0])) {
    review.push({ id, title, location_city: currentCity, placement_cities: [...cityPlacements].join(", "), reason: `title mentions ${titleCities[0]} but placements differ` });
  }

  if (Object.keys(update).length) {
    updates.push({ id, title, before: { location_city: currentCity, location_state: currentState, location: currentLocation }, after: update, reasons });
  }
}

const statements = [
  "-- Location cleanup sweep: conservative title/source-derived location fixes.",
  "-- Generated by tools/generate-location-cleanup.mjs from a production D1 export.",
  "-- Regions that are not canonical city rows are kept in listings.location, not added as cities.",
  "",
];

for (const row of updates) {
  const set = Object.entries(row.after).map(([column, value]) => `${column} = ${sqlValue(value)}`);
  set.push("updated_at = datetime('now')");
  statements.push(`UPDATE listings SET ${set.join(", ")} WHERE id = ${row.id};`);
}

const seenPlacementKeys = new Set(placements.map((p) => `${p.listing_id}:${p.category_slug || ""}:${p.city_slug || ""}`));
for (const add of placementAdds) {
  const categories = add.categorySlugs.length ? add.categorySlugs : [null];
  for (const categorySlug of categories) {
    const key = `${add.id}:${categorySlug || ""}:${add.citySlug}`;
    if (seenPlacementKeys.has(key)) continue;
    seenPlacementKeys.add(key);
    statements.push(
      "INSERT INTO listing_placements (listing_id, category_slug, city_slug, sort_order, position_type, is_active) " +
      `SELECT ${add.id}, ${sqlValue(categorySlug)}, ${sqlValue(add.citySlug)}, 0, 'organic', 1 ` +
      "WHERE EXISTS (SELECT 1 FROM listings WHERE id = " + add.id + ") " +
      "AND NOT EXISTS (SELECT 1 FROM listing_placements WHERE listing_id = " + add.id +
      ` AND category_slug ${categorySlug === null ? "IS NULL" : `= ${sqlValue(categorySlug)}`} AND city_slug = ${sqlValue(add.citySlug)});`
    );
  }
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const report = {
  generated_at: new Date().toISOString(),
  dump_path: dumpPath,
  counts: {
    listing_updates: updates.length,
    placement_inserts: statements.filter((line) => line.startsWith("INSERT INTO listing_placements")).length,
    review_only: review.length,
  },
  listing_updates: updates,
  placement_inserts: placementAdds,
  review_only: review,
};

const reportPath = path.join(outDir, `location-cleanup-candidates-${stamp}.json`);
const sqlPath = args.get("--migration")
  ? path.resolve(root, args.get("--migration"))
  : path.join(outDir, `location-cleanup-candidates-${stamp}.sql`);
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(sqlPath, `${statements.join("\n")}\n`);

console.log(JSON.stringify(report.counts, null, 2));
console.log(`Report: ${reportPath}`);
console.log(`Migration: ${sqlPath}`);
