import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith("--")) args.set(process.argv[i], process.argv[i + 1] ?? true);
}

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod.*\.sql$/i.test(name))
    .map((name) => ({ name, fullPath: path.join(outDir, name) }))
    .sort((a, b) => b.name.localeCompare(a.name));
  if (!files.length) throw new Error(`No production SQL dump found in ${outDir}.`);
  return files[0].fullPath;
}

function coerceSqlValue(value) {
  const trimmed = value.trim();
  if (/^null$/i.test(trimmed)) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
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

function loadDumpTables(dumpPath, wantedTables) {
  const tables = Object.fromEntries(wantedTables.map((table) => [table, []]));
  const insertPattern = /^INSERT INTO "([^"]+)" \(([^)]+)\) VALUES\((.*)\);$/;
  for (const line of readFileSync(dumpPath, "utf8").split(/\r?\n/)) {
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
  return clean(value).toLowerCase();
}

function normalizedPhone(...values) {
  const joined = values.map(clean).join(" ");
  const phone = joined.match(/(?:\+?61|0|\(?0)?[\d\s().-]{7,}/g)?.[0] ?? "";
  return phone.replace(/\D+/g, "");
}

function normalizedEmail(...values) {
  return values.map(clean).join(" ").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]?.toLowerCase() ?? "";
}

function normalizedDomain(...values) {
  const raw = values.map(clean).join(" ").match(/(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s,;)]*)?/i)?.[0] ?? "";
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return raw.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  }
}

function placementLabel(placement, categoryBySlug, cityBySlug) {
  const category = categoryBySlug.get(clean(placement.category_slug));
  const city = cityBySlug.get(clean(placement.city_slug));
  return [category?.label ?? placement.category_slug, city?.label ?? placement.city_slug].map(clean).filter(Boolean).join(" / ");
}

const dumpPath = args.get("--dump") ? path.resolve(root, String(args.get("--dump"))) : latestDumpPath();
const { businesses, listings, listing_placements: placements, categories, cities } = loadDumpTables(dumpPath, [
  "businesses",
  "listings",
  "listing_placements",
  "categories",
  "cities",
]);

const businessById = new Map(businesses.map((row) => [Number(row.id), row]));
const categoryBySlug = new Map(categories.map((row) => [clean(row.slug), row]));
const cityBySlug = new Map(cities.map((row) => [clean(row.slug), row]));
const placementsByListing = new Map();
for (const placement of placements) {
  const listingId = Number(placement.listing_id);
  if (!placementsByListing.has(listingId)) placementsByListing.set(listingId, []);
  placementsByListing.get(listingId).push(placement);
}

const staleEventPatterns = [
  /\b(?:festival|concert|showcase|gig)\b/i,
  /\b(?:tickets?|bookings?)\b.{0,80}\b(?:available|essential|close|discount|arrival)\b/i,
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}\b/i,
  /\b(?:19|20)0\d\b|\b201[0-9]\b/i,
  /\b(?:this event|the event|lineup|line-up|presented by|featuring)\b/i,
];

const irrelevantPatterns = [
  /\b(?:nutritionals?|herbals?|skincare|skin care|foam mats?|fit balls?|weight loss products?)\b/i,
  /\b(?:dating resource|dating directory|matchmaking resources|personal ads)\b/i,
  /\b(?:free online dating service|premium online dating service)\b/i,
];

function issueFor(row) {
  const business = businessById.get(Number(row.business_id));
  const combined = [row.title, row.tagline, row.description, row.promo, row.source_file].map(clean).join(" ");
  const title = clean(row.title);
  const listingType = compact(row.listing_type);
  const placementText = (placementsByListing.get(Number(row.id)) ?? [])
    .map((placement) => placementLabel(placement, categoryBySlug, cityBySlug))
    .join(" | ");
  const phone = normalizedPhone(row.phone, row.mobile, business?.phone, business?.mobile);
  const email = normalizedEmail(row.email, business?.email);
  const domain = normalizedDomain(row.web, business?.website);

  if (!phone && !email && !domain) {
    return { kind: "no_contact", severity: "critical", recommendation: "archive_or_research", reason: "No phone, email, or URL evidence is present." };
  }

  if (!email && !domain) {
    return { kind: "phone_only", severity: "review", recommendation: "research_url_or_archive", reason: "Only a phone number is present; launch rule treats this as a business-quality warning." };
  }

  if (irrelevantPatterns.some((pattern) => pattern.test(combined))) {
    return { kind: "irrelevant_product_or_resource", severity: "critical", recommendation: "delete", reason: "Looks like a product, affiliate resource, or generic dating-directory page rather than a current Events4Singles listing." };
  }

  if (
    staleEventPatterns.filter((pattern) => pattern.test(combined)).length >= 2 &&
    (listingType.includes("jazz") || listingType.includes("speed") || listingType.includes("event") || /\bfestival\b/i.test(title))
  ) {
    return { kind: "stale_event_advert", severity: "critical", recommendation: "archive", reason: "Reads as a dated event/festival advert rather than a durable business profile." };
  }

  if (/\b(?:jazz|blues)\b/i.test(combined) && /\b(?:festival|lineup|featuring|presented by)\b/i.test(combined)) {
    if (/\b(?:club|society|association)\b/i.test(title) && !/\b(?:19|20)0\d\b|\b201[0-9]\b/i.test(combined)) {
      return { kind: "festival_or_old_event", severity: "review", recommendation: "manual_review", reason: "Jazz/blues listing is a club or society but contains festival/event wording that should be checked." };
    }
    return { kind: "festival_or_old_event", severity: "critical", recommendation: "archive", reason: "Jazz/blues listing looks like old festival promotional copy." };
  }

  if (/\b(?:click here|join now|book now|register now)\b/i.test(combined) && /\b(?:tickets?|event|seminar|workshop|package)\b/i.test(combined)) {
    return { kind: "promotional_copy", severity: "review", recommendation: "rewrite_or_archive", reason: "Listing body still reads like old website ad copy." };
  }

  return null;
}

const issues = [];
for (const row of listings.filter((listing) => compact(listing.status || "active") === "active")) {
  const issue = issueFor(row);
  if (!issue) continue;
  const business = businessById.get(Number(row.business_id));
  const rowPlacements = (placementsByListing.get(Number(row.id)) ?? [])
    .filter((placement) => String(placement.is_active ?? "1") !== "0")
    .map((placement) => placementLabel(placement, categoryBySlug, cityBySlug));
  issues.push({
    listing_id: Number(row.id),
    business_id: Number(row.business_id),
    title: clean(row.title),
    business_name: clean(business?.name),
    kind: issue.kind,
    severity: issue.severity,
    recommendation: issue.recommendation,
    reason: issue.reason,
    phone: clean(row.phone || row.mobile || business?.phone || business?.mobile),
    email: clean(row.email || business?.email),
    web: clean(row.web || business?.website),
    placements: rowPlacements.join("; "),
    description_sample: clean(row.description).slice(0, 240),
  });
}

issues.sort((a, b) => `${a.severity}:${a.kind}:${a.title}`.localeCompare(`${b.severity}:${b.kind}:${b.title}`));

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `launch-listing-quality-audit-${stamp}.json`);
const txtPath = path.join(outDir, `launch-listing-quality-audit-${stamp}.txt`);

writeFileSync(jsonPath, JSON.stringify({ dump_path: dumpPath, active_issues: issues.length, issues }, null, 2));
writeFileSync(
  txtPath,
  issues.map((issue) => `#${issue.listing_id} ${issue.title} | ${issue.kind} | ${issue.recommendation} | ${issue.placements} | ${issue.reason}`).join("\n") + "\n"
);

console.log(JSON.stringify({
  dump_path: dumpPath,
  active_issues: issues.length,
  critical: issues.filter((issue) => issue.severity === "critical").length,
  review: issues.filter((issue) => issue.severity === "review").length,
  json: jsonPath,
  text: txtPath,
}, null, 2));
