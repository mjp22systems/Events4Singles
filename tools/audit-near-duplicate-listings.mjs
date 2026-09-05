import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod-.*\.sql$/i.test(name))
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
  const insertPattern = /^INSERT INTO "([^"]+)" \(([^)]+)\) VALUES\((.*)\);$/;
  for (const line of sql.split(/\r?\n/)) {
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

function key(value) {
  return clean(value).toLowerCase();
}

function splitUrls(value) {
  return [...new Set((clean(value).match(/(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s,;|)]*)?/gi) || []).map(normalizeUrl))];
}

function normalizeUrl(value) {
  const raw = clean(value);
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.hostname.toLowerCase().replace(/^www\./, "").replace(/\.(com|net|org)\.au$/, "").replace(/\.(com|net|org)$/, "");
  } catch {
    return raw.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0].replace(/\.(com|net|org)\.au$/, "").replace(/\.(com|net|org)$/, "");
  }
}

function normalizePhone(value) {
  const digits = clean(value).replace(/\D+/g, "");
  return digits.length >= 8 ? digits.replace(/^0+/, "") : "";
}

function normalizeEmail(value) {
  return clean(value).toLowerCase();
}

const stopWords = new Set([
  "a", "an", "and", "at", "australia", "australian", "based", "class", "classes",
  "com", "for", "in", "inc", "international", "nsw", "of", "on", "pty", "service", "services",
  "the", "to", "vic", "qld", "sa", "wa", "tas", "act", "nt", "with",
  "sydney", "melbourne", "brisbane", "perth", "adelaide", "canberra", "cairns", "darwin",
  "geelong", "hobart", "newcastle", "toowoomba", "wollongong", "gold", "coast", "central",
]);

const locationWords = new Set([
  "act", "adelaide", "australia", "brisbane", "canberra", "cairns", "castle", "central", "coast",
  "darwin", "geelong", "gold", "goulborn", "goulbourn", "goulburn", "hill", "hills", "hobart",
  "hornsby", "kenthurst", "lane", "leichhardt", "liverpool", "melbourne", "newcastle", "nsw",
  "penrith", "perth", "qld", "sa", "surry", "sydney", "tas", "toowoomba", "vic", "wa",
  "wollongong",
]);

function titleTokens(value) {
  return key(value)
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|every|night|weekly)\b/g, " ")
    .replace(/\b(?:lane|cove|penrith|liverpool|hornsby|castle|hill|goulburn|goulbourn|surry|hills|leichhardt)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .map((token) => token.replace(/s$/, ""))
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function titleKey(value) {
  return [...new Set(titleTokens(value))].join(" ");
}

function titleSimilarity(a, b) {
  const left = new Set(titleTokens(a));
  const right = new Set(titleTokens(b));
  if (!left.size || !right.size) return 0;
  const intersection = [...left].filter((token) => right.has(token)).length;
  const smaller = Math.min(left.size, right.size);
  return intersection / smaller;
}

function locationFragments(value) {
  const fragments = [];
  const title = clean(value);
  for (const match of title.matchAll(/\s[-–]\s([^|,]+)$/g)) fragments.push(clean(match[1]));
  for (const match of title.matchAll(/,\s*([^|]+)$/g)) fragments.push(clean(match[1]));
  for (const match of title.matchAll(/\b(?:in|at)\s+([A-Z][A-Za-z' ]{2,35})$/g)) fragments.push(clean(match[1]));
  return fragments.filter(isLocationLike);
}

function isLocationLike(value) {
  const text = key(value);
  if (/\b(?:nsw|vic|qld|sa|wa|tas|act|nt)\b/.test(text)) return true;
  if (/\b(?:19|20)\d{2}\b/.test(text)) return true;
  return titleTokens(text).some((token) => locationWords.has(token));
}

function titleIssues(row) {
  const issues = [];
  const title = clean(row.title);
  const fragments = locationFragments(title);
  if (fragments.length) issues.push({ kind: "title_location_or_subtitle_fragment", fragments });
  if (/\b(?:every|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(title)) {
    issues.push({ kind: "title_contains_schedule_text" });
  }
  if (/[-–]\s*[A-Z][A-Za-z' ]+\s+(?:NSW|VIC|QLD|SA|WA|TAS|ACT|NT)\b/.test(title)) {
    issues.push({ kind: "title_contains_location_state_suffix" });
  }
  return issues;
}

function refsFor(row) {
  const urls = [...splitUrls(row.web), ...splitUrls(row.business_website)].filter(Boolean);
  return {
    domains: [...new Set(urls)],
    email: normalizeEmail(row.email),
    phone: normalizePhone(row.phone) || normalizePhone(row.mobile),
    image: clean(row.image_url),
    title_key: titleKey(row.title || row.business_name),
  };
}

function union(parent, a, b) {
  const rootA = find(parent, a);
  const rootB = find(parent, b);
  if (rootA !== rootB) parent.set(rootB, rootA);
}

function find(parent, value) {
  if (!parent.has(value)) parent.set(value, value);
  const current = parent.get(value);
  if (current === value) return value;
  const root = find(parent, current);
  parent.set(value, root);
  return root;
}

const dumpPath = process.argv.includes("--dump")
  ? path.resolve(root, process.argv[process.argv.indexOf("--dump") + 1])
  : latestDumpPath();
const { businesses, listings, listing_placements: placements } = loadDumpTables(dumpPath, ["businesses", "listings", "listing_placements"]);
const businessById = new Map(businesses.map((business) => [Number(business.id), business]));
const placementsByListing = new Map();
for (const placement of placements) {
  const id = Number(placement.listing_id);
  if (!placementsByListing.has(id)) placementsByListing.set(id, []);
  placementsByListing.get(id).push(placement);
}

const activeListings = listings
  .filter((row) => key(row.status || "active") === "active")
  .map((listing) => {
    const business = businessById.get(Number(listing.business_id)) || {};
    return {
      ...listing,
      business_name: clean(business.name),
      business_website: clean(business.website),
      placements: placementsByListing.get(Number(listing.id)) || [],
    };
  });

const parent = new Map(activeListings.map((listing) => [Number(listing.id), Number(listing.id)]));
const refs = new Map(activeListings.map((listing) => [Number(listing.id), refsFor(listing)]));
const indexes = {
  domain: new Map(),
  email: new Map(),
  phone: new Map(),
  image: new Map(),
  title: new Map(),
};

function addIndex(map, value, id) {
  if (!value) return;
  if (!map.has(value)) map.set(value, []);
  map.get(value).push(id);
}

for (const listing of activeListings) {
  const id = Number(listing.id);
  const ref = refs.get(id);
  for (const domain of ref.domains) addIndex(indexes.domain, domain, id);
  addIndex(indexes.email, ref.email, id);
  addIndex(indexes.phone, ref.phone, id);
  addIndex(indexes.image, ref.image, id);
  addIndex(indexes.title, ref.title_key, id);
}

for (const [kind, map] of Object.entries(indexes)) {
  if (kind === "image") continue;
  for (const [value, ids] of map.entries()) {
    if (ids.length < 2) continue;
    if (kind === "title" && value.split(" ").length < 2) continue;
    for (const id of ids.slice(1)) union(parent, ids[0], id);
  }
}

for (let i = 0; i < activeListings.length; i += 1) {
  for (let j = i + 1; j < activeListings.length; j += 1) {
    const a = activeListings[i];
    const b = activeListings[j];
    const aRef = refs.get(Number(a.id));
    const bRef = refs.get(Number(b.id));
    const sharedHardContact =
      aRef.domains.some((domain) => bRef.domains.includes(domain)) ||
      (aRef.email && aRef.email === bRef.email) ||
      (aRef.phone && aRef.phone === bRef.phone);
    const sharedImage = aRef.image && aRef.image === bRef.image;
    const similarity = titleSimilarity(a.title, b.title);
    if ((sharedHardContact && similarity >= 0.5) || (sharedImage && similarity >= 0.75)) {
      union(parent, Number(a.id), Number(b.id));
    }
  }
}

function richness(row) {
  return [
    row.business_name,
    row.title,
    row.tagline,
    row.description,
    row.contact_name,
    row.phone,
    row.mobile,
    row.email,
    row.web,
    row.image_url,
  ].reduce((score, value) => score + (clean(value) ? 1 : 0), 0) + clean(row.description).length / 200;
}

const groupsByRoot = new Map();
for (const listing of activeListings) {
  const rootId = find(parent, Number(listing.id));
  if (!groupsByRoot.has(rootId)) groupsByRoot.set(rootId, []);
  groupsByRoot.get(rootId).push(listing);
}

const groups = [...groupsByRoot.values()]
  .filter((group) => group.length > 1)
  .map((group) => {
    const scored = [...group].sort((a, b) => richness(b) - richness(a) || Number(a.id) - Number(b.id));
    const evidence = [];
    const values = [
      ["domain", (row) => refs.get(Number(row.id)).domains.join("|")],
      ["email", (row) => refs.get(Number(row.id)).email],
      ["phone", (row) => refs.get(Number(row.id)).phone],
      ["image", (row) => refs.get(Number(row.id)).image],
      ["title_key", (row) => refs.get(Number(row.id)).title_key],
    ];
    for (const [kind, getter] of values) {
      const counts = new Map();
      for (const row of group) {
        const value = getter(row);
        if (!value) continue;
        counts.set(value, (counts.get(value) || 0) + 1);
      }
      for (const [value, count] of counts.entries()) {
        if (count > 1) evidence.push({ kind, value, count });
      }
    }
    return {
      confidence: evidence.some((item) => ["domain", "email", "phone"].includes(item.kind)) ? "high" : "review",
      keep_listing_id: Number(scored[0].id),
      keep_business_id: Number(scored[0].business_id),
      evidence,
      listings: scored.map((row) => ({
        id: Number(row.id),
        business_id: Number(row.business_id),
        title: clean(row.title),
        business_name: clean(row.business_name),
        tagline: clean(row.tagline),
        location: clean(row.location),
        location_city: clean(row.location_city),
        email: clean(row.email),
        phone: clean(row.phone),
        mobile: clean(row.mobile),
        web: clean(row.web),
        image_url: clean(row.image_url),
        listing_type: clean(row.listing_type),
        placements: row.placements.map((p) => `${p.category_slug || ""}:${p.city_slug || ""}`).sort(),
        title_issues: titleIssues(row),
      })),
    };
  })
  .sort((a, b) => b.listings.length - a.listings.length || a.listings[0].title.localeCompare(b.listings[0].title));

const titleContamination = activeListings
  .map((row) => ({
    id: Number(row.id),
    business_id: Number(row.business_id),
    title: clean(row.title),
    business_name: clean(row.business_name),
    tagline: clean(row.tagline),
    location: clean(row.location),
    location_city: clean(row.location_city),
    issues: titleIssues(row),
  }))
  .filter((row) => row.issues.length > 0);

const contactOnlyDescriptions = activeListings
  .filter((row) => {
    const desc = clean(row.description);
    if (!desc || desc.length > 80) return false;
    return /@|(?:https?:\/\/|www\.)|(?:\+?61|0)[\d\s().-]{7,}/i.test(desc);
  })
  .map((row) => ({
    id: Number(row.id),
    business_id: Number(row.business_id),
    title: clean(row.title),
    description: clean(row.description),
    current_email: clean(row.email),
    current_phone: clean(row.phone || row.mobile),
  }));

const report = {
  generated_at: new Date().toISOString(),
  dump_path: dumpPath,
  counts: {
    active_listings: activeListings.length,
    near_duplicate_groups: groups.length,
    high_confidence_groups: groups.filter((group) => group.confidence === "high").length,
    title_contamination_rows: titleContamination.length,
    contact_only_description_rows: contactOnlyDescriptions.length,
  },
  near_duplicate_groups: groups,
  title_contamination: titleContamination,
  contact_only_descriptions: contactOnlyDescriptions,
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `near-duplicate-listing-audit-${stamp}.json`);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.counts, null, 2));
console.log(`JSON report: ${jsonPath}`);
