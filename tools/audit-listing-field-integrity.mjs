import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod.*\.sql$/i.test(name))
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

function compact(value) {
  return clean(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

function words(value) {
  return compact(value).split(/\s+/).filter(Boolean);
}

function titleCase(value) {
  return clean(value)
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase())
    .replace(/\bNsw\b/g, "NSW")
    .replace(/\bVic\b/g, "VIC")
    .replace(/\bQld\b/g, "QLD")
    .replace(/\bSa\b/g, "SA")
    .replace(/\bWa\b/g, "WA")
    .replace(/\bAct\b/g, "ACT")
    .replace(/\bNt\b/g, "NT");
}

function normalizedDomain(value) {
  const raw = clean(value).split(/[|,;\s]+/).find((part) => /\.[a-z]{2,}/i.test(part)) ?? "";
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.hostname.toLowerCase().replace(/^www\./, "").replace(/\.(com|net|org)\.au$/, "").replace(/\.(com|net|org)$/, "");
  } catch {
    return raw.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0].replace(/\.(com|net|org)\.au$/, "").replace(/\.(com|net|org)$/, "");
  }
}

function normalizedPhone(value) {
  const digits = clean(value).replace(/\D+/g, "");
  return digits.length >= 8 ? digits.replace(/^0+/, "") : "";
}

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith("--")) args.set(process.argv[i], process.argv[i + 1] ?? true);
}

const dumpPath = args.get("--dump") ? path.resolve(root, args.get("--dump")) : latestDumpPath();
const { businesses, listings, listing_placements: placements, cities, categories } = loadDumpTables(dumpPath, [
  "businesses",
  "listings",
  "listing_placements",
  "cities",
  "categories",
]);

const businessById = new Map(businesses.map((business) => [Number(business.id), business]));
const categoriesBySlug = new Map(categories.map((category) => [clean(category.slug), category]));
const citiesBySlug = new Map(cities.map((city) => [clean(city.slug), city]));
const placementsByListing = new Map();
for (const placement of placements) {
  const id = Number(placement.listing_id);
  if (!placementsByListing.has(id)) placementsByListing.set(id, []);
  placementsByListing.get(id).push(placement);
}

const cityAliases = new Map();
for (const city of cities) {
  if (["online", "national", "international", "tbc", "no_location"].includes(clean(city.slug))) continue;
  cityAliases.set(compact(city.label), { city: clean(city.label), state: clean(city.state), slug: clean(city.slug), kind: "city" });
  cityAliases.set(compact(city.slug), { city: clean(city.label), state: clean(city.state), slug: clean(city.slug), kind: "city" });
}

const localityHints = new Map([
  ["lane cove", { location: "Lane Cove", city: "Sydney", state: "NSW", confidence: "high" }],
  ["murwillumbah", { location: "Murwillumbah", city: "Byron Bay", state: "NSW", confidence: "review" }],
  ["via murwillumbah", { location: "Via Murwillumbah", city: "Byron Bay", state: "NSW", confidence: "review" }],
  ["hornsby", { location: "Hornsby", city: "Sydney", state: "NSW", confidence: "high" }],
  ["castle hill", { location: "Castle Hill", city: "Sydney", state: "NSW", confidence: "high" }],
  ["penrith", { location: "Penrith", city: "Sydney", state: "NSW", confidence: "high" }],
  ["liverpool", { location: "Liverpool", city: "Sydney", state: "NSW", confidence: "high" }],
  ["surry hills", { location: "Surry Hills", city: "Sydney", state: "NSW", confidence: "high" }],
  ["leichhardt", { location: "Leichhardt", city: "Sydney", state: "NSW", confidence: "high" }],
  ["kenthurst", { location: "Kenthurst", city: "Sydney", state: "NSW", confidence: "high" }],
  ["nerang", { location: "Nerang", city: "Gold Coast", state: "QLD", confidence: "high" }],
  ["southport", { location: "Southport", city: "Gold Coast", state: "QLD", confidence: "high" }],
  ["abbotsford", { location: "Abbotsford", city: "Melbourne", state: "VIC", confidence: "high" }],
  ["parramatta", { location: "Parramatta", city: "Sydney", state: "NSW", confidence: "high" }],
  ["campbelltown", { location: "Campbelltown", city: "Sydney", state: "NSW", confidence: "high" }],
  ["point lookout", { location: "Point Lookout", city: "Brisbane", state: "QLD", confidence: "review" }],
]);

const serviceSuffixes = [
  "upscale dating agency & matchmaking service",
  "dating agency & matchmaking service",
  "matchmaking service",
  "marketing services",
  "image consultancy",
  "dance classes",
  "dance company",
  "dance academy",
  "latin dance co",
  "dating services directory",
  "photography for online profiles",
];

const headingLike = new Set([
  "entertainment and night clubs",
  "christian",
  "dating",
  "dr",
  "online internet",
  "newcastle",
  "queensland",
  "sa adelaide and country areas",
  "sydney and nsw",
  "events4singles retreats4singles",
]);

const categoryLabels = new Set();
for (const category of categories) {
  categoryLabels.add(compact(category.label));
  categoryLabels.add(compact(category.slug));
}

function findLocationInText(value) {
  const text = compact(value);
  const hits = [];
  for (const [alias, detail] of localityHints) {
    if (text.includes(alias)) hits.push({ alias, ...detail });
  }
  for (const [alias, detail] of cityAliases) {
    if (alias && text.includes(alias)) hits.push({ alias, location: detail.city, city: detail.city, state: detail.state, confidence: "high" });
  }
  const unique = new Map();
  for (const hit of hits) unique.set(`${hit.location}|${hit.city}|${hit.state}`, hit);
  return [...unique.values()];
}

function splitDashFragment(title) {
  const match = clean(title).match(/^(.+?)\s+[-–]\s+(.+)$/);
  if (!match) return null;
  return { base: clean(match[1]), fragment: clean(match[2]) };
}

function suffixService(title) {
  const text = compact(title);
  for (const suffix of [...serviceSuffixes].sort((a, b) => words(b).length - words(a).length)) {
    const suffixKey = compact(suffix);
    if (text.endsWith(suffixKey)) {
      if (/^della corys?/.test(text)) {
        return { title: "Della Cory", tagline: "Upscale Dating Agency & Matchmaking Service" };
      }
      const suffixWords = words(suffix).length;
      const originalWords = clean(title).split(/\s+/);
      const base = clean(originalWords.slice(0, -suffixWords).join(" ")).replace(/['’]$/, "");
      const baseWords = words(base);
      const firstBase = baseWords[0] ?? "";
      if (baseWords.length >= 2 || /s$/.test(firstBase) || /['’]s?$/.test(clean(title).split(/\s+/)[0] ?? "")) {
        return { title: titleCase(base).replace(/\s+S$/, "s"), tagline: titleCase(suffix) };
      }
    }
  }
  return null;
}

function placementSummary(listingId) {
  return (placementsByListing.get(Number(listingId)) ?? [])
    .map((placement) => {
      const category = categoriesBySlug.get(clean(placement.category_slug));
      const city = citiesBySlug.get(clean(placement.city_slug));
      return {
        category_slug: clean(placement.category_slug),
        category: clean(category?.label) || clean(placement.category_slug),
        city_slug: clean(placement.city_slug),
        city: clean(city?.label) || clean(placement.city_slug),
      };
    })
    .sort((a, b) => `${a.category_slug}:${a.city_slug}`.localeCompare(`${b.category_slug}:${b.city_slug}`));
}

function listingEvidence(row, business) {
  return {
    phone: normalizedPhone(row.phone) || normalizedPhone(row.mobile) || normalizedPhone(business?.phone) || normalizedPhone(business?.mobile),
    email: compact(row.email || business?.email),
    domain: normalizedDomain(row.web || business?.website),
    image: clean(row.image_url || business?.logo_url),
  };
}

const activeListings = listings.filter((row) => compact(row.status || "active") === "active");
const issues = [];

function addIssue(row, kind, severity, message, proposal = {}) {
  const business = businessById.get(Number(row.business_id));
  issues.push({
    id: Number(row.id),
    business_id: Number(row.business_id),
    kind,
    severity,
    title: clean(row.title),
    business_name: clean(business?.name),
    tagline: clean(row.tagline),
    location: clean(row.location),
    location_city: clean(row.location_city),
    location_state: clean(row.location_state),
    listing_type: clean(row.listing_type),
    web: clean(row.web),
    business_website: clean(business?.website),
    placements: placementSummary(row.id),
    message,
    proposal,
  });
}

for (const row of activeListings) {
  const business = businessById.get(Number(row.business_id));
  const title = clean(row.title);
  const titleKey = compact(title);
  const businessNameKey = compact(business?.name);
  const dash = splitDashFragment(title);
  const titleLocations = findLocationInText(title);
  const descriptionLocations = findLocationInText(row.description);
  const evidence = listingEvidence(row, business);
  const titleDomainMismatch =
    evidence.domain &&
    words(title).length <= 4 &&
    !compact(evidence.domain).includes(words(titleKey)[0] ?? "") &&
    !titleKey.includes(compact(evidence.domain));

  if (headingLike.has(titleKey) || categoryLabels.has(titleKey)) {
    addIssue(row, "heading_or_category_scraped_as_listing", "critical", "Title looks like a page heading/category label rather than a business listing.", {
      action: "review_archive_or_rename",
      linked_domain: evidence.domain,
    });
  }

  if (dash) {
    const fragmentLocations = findLocationInText(dash.fragment);
    if (fragmentLocations.length) {
      const best = fragmentLocations[0];
      addIssue(row, "title_contains_location", best.confidence === "high" ? "fixable" : "review", "Dash/comma title fragment looks like location detail.", {
        title: dash.base,
        location: best.location,
        location_city: best.city,
        location_state: best.state,
      });
    } else if (/\b(?:premier|upscale|dating|matchmaking|service|services|consultancy|check website|social|dinner|dance|tour|club)\b/i.test(dash.fragment)) {
      addIssue(row, "title_contains_tagline", "fixable", "Dash title fragment looks like service/tagline text.", {
        title: dash.base,
        tagline: dash.fragment,
      });
    }
  }

  const service = suffixService(title);
  if (service && !clean(row.tagline)) {
    addIssue(row, "title_contains_service_tagline", "fixable", "Title appears to combine business name with service/category wording.", service);
  }

  if (titleLocations.length && !dash) {
    const locationNames = titleLocations.map((hit) => hit.location).join(", ");
    if (/\b(?:based|via|metro|areas|wide|national|international)\b/i.test(title) || titleLocations.length > 1) {
      addIssue(row, "title_contains_embedded_location", "review", `Title embeds location wording: ${locationNames}.`, {
        suggested_locations: titleLocations,
      });
    }
  }

  if (descriptionLocations.length && !findLocationInText(`${row.location} ${row.location_city}`).length) {
    addIssue(row, "description_mentions_location_missing_from_fields", "review", "Description mentions location detail that is not represented in listing location fields.", {
      suggested_locations: descriptionLocations,
    });
  }

  if (/@/.test(clean(row.description)) && !clean(row.email)) {
    const match = clean(row.description).match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    addIssue(row, "email_in_description", "fixable", "Description contains an email but email field is empty.", {
      email: match?.[0] ?? "",
    });
  }

  if (/(?:\+?61|0)[\d\s().-]{7,}/.test(clean(row.description)) && !(clean(row.phone) || clean(row.mobile))) {
    const match = clean(row.description).match(/(?:\+?61|0)[\d\s().-]{7,}/);
    addIssue(row, "phone_in_description", "fixable", "Description contains a phone-like value but phone/mobile fields are empty.", {
      phone: clean(match?.[0]),
    });
  }

  if (businessNameKey === titleKey && (headingLike.has(titleKey) || categoryLabels.has(titleKey)) && titleDomainMismatch) {
    addIssue(row, "business_name_domain_mismatch", "critical", "Business name also looks like a heading, while website/contact evidence points to another entity.", {
      linked_domain: evidence.domain,
    });
  }
}

const evidenceGroups = new Map();
for (const row of activeListings) {
  const business = businessById.get(Number(row.business_id));
  const evidence = listingEvidence(row, business);
  for (const [kind, value] of Object.entries(evidence)) {
    if (!value) continue;
    const key = `${kind}:${value}`;
    if (!evidenceGroups.has(key)) evidenceGroups.set(key, []);
    evidenceGroups.get(key).push(row);
  }
}

const crossLinked = [];
for (const [key, rows] of evidenceGroups) {
  if (rows.length < 2) continue;
  const titles = new Set(rows.map((row) => compact(row.title)));
  if (titles.size < 2) continue;
  crossLinked.push({
    evidence: key,
    count: rows.length,
    entries: rows.map((row) => {
      const business = businessById.get(Number(row.business_id));
      return {
        id: Number(row.id),
        business_id: Number(row.business_id),
        title: clean(row.title),
        business_name: clean(business?.name),
        status: clean(row.status),
        placements: placementSummary(row.id),
      };
    }),
  });
}

const byKind = {};
const bySeverity = {};
for (const issue of issues) {
  byKind[issue.kind] = (byKind[issue.kind] ?? 0) + 1;
  bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1;
}

const report = {
  generated_at: new Date().toISOString(),
  dump_path: dumpPath,
  counts: {
    active_listings: activeListings.length,
    issues: issues.length,
    critical: bySeverity.critical ?? 0,
    fixable: bySeverity.fixable ?? 0,
    review: bySeverity.review ?? 0,
    cross_linked_evidence_groups: crossLinked.length,
  },
  by_kind: byKind,
  issues: issues.sort((a, b) => {
    const severityRank = { critical: 0, fixable: 1, review: 2 };
    return severityRank[a.severity] - severityRank[b.severity] || a.id - b.id;
  }),
  cross_linked_evidence_groups: crossLinked.sort((a, b) => b.count - a.count || a.evidence.localeCompare(b.evidence)),
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `listing-field-integrity-audit-${stamp}.json`);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.counts, null, 2));
console.log(`JSON report: ${jsonPath}`);
