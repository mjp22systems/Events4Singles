import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });
const includeUrlHealth = process.argv.includes("--url-health") && !process.argv.includes("--no-url-health");

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod-(?:post-\d{4}-)?\d{8}-\d{6}\.sql$/i.test(name))
    .map((name) => ({ name, fullPath: path.join(outDir, name) }))
    .sort((a, b) => b.name.localeCompare(a.name));
  if (!files.length) {
    throw new Error(`No production SQL dump found in ${outDir}. Export D1 before auditing.`);
  }
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

const dumpPath = latestDumpPath();
const dumpTables = loadDumpTables(dumpPath, ["businesses", "listings", "listing_placements", "banners", "events", "categories", "cities"]);
const businesses = dumpTables.businesses;
const listings = dumpTables.listings;
const placements = dumpTables.listing_placements;
const banners = dumpTables.banners;
const events = dumpTables.events;
const categories = dumpTables.categories;
const cities = dumpTables.cities;

const businessById = new Map(businesses.map((row) => [Number(row.id), row]));
const categoryBySlug = new Map(categories.map((row) => [row.slug, row]));
const cityBySlug = new Map(cities.map((row) => [row.slug, row]));
const placementsByListing = new Map();
for (const placement of placements) {
  const id = Number(placement.listing_id);
  if (!placementsByListing.has(id)) placementsByListing.set(id, []);
  placementsByListing.get(id).push(placement);
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compact(value) {
  return clean(value).toLowerCase();
}

function normalizeName(value) {
  return compact(value)
    .replace(/&/g, "and")
    .replace(/\b(pty|ltd|limited|inc|the|australia|australian)\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function normalizePhone(value) {
  return clean(value).replace(/[^\d]+/g, "");
}

function normalizeEmail(value) {
  return clean(value).toLowerCase();
}

function normalizeUrl(value) {
  const raw = clean(value);
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    url.hash = "";
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const pathname = url.pathname.replace(/\/+$/, "");
    return `${host}${pathname === "/" ? "" : pathname}`;
  } catch {
    return raw.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
  }
}

function domainOf(value) {
  const normalized = normalizeUrl(value);
  return normalized.split("/")[0] || "";
}

function splitValues(value, kind) {
  const text = clean(value);
  if (!text) return [];
  if (kind === "email") return [...new Set((text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).map(normalizeEmail))];
  if (kind === "phone") return [...new Set((text.match(/(?:\+?61|0)[\d\s().-]{7,}/g) || []).map(normalizePhone).filter((v) => v.length >= 8))];
  if (kind === "url") return [...new Set((text.match(/(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s,;)]*)?/gi) || []).map(normalizeUrl))];
  return [];
}

function richness(row) {
  const fields = [
    row.name,
    row.title,
    row.description,
    row.tagline,
    row.contact_name,
    row.phone,
    row.mobile,
    row.email,
    row.web,
    row.website,
    row.image_url,
    row.logo_url,
  ];
  return fields.reduce((score, value) => score + (clean(value) ? 1 : 0), 0);
}

function businessDisplayNameForListing(listing) {
  return clean(businessById.get(Number(listing.business_id))?.name || listing.title);
}

function issueRow(kind, severity, row, detail, suggestion = "") {
  return {
    kind,
    severity,
    listing_id: row?.id || "",
    business_id: row?.business_id || "",
    title: clean(row?.title || row?.name || ""),
    business_name: row?.business_id ? clean(businessById.get(Number(row.business_id))?.name || "") : clean(row?.name || ""),
    detail,
    suggestion,
  };
}

const duplicateBusinessGroups = [];
const groupedBusinesses = new Map();
for (const business of businesses.filter((row) => compact(row.status || "active") !== "deleted")) {
  const keys = [
    `name:${normalizeName(business.name)}`,
    domainOf(business.website) ? `domain:${domainOf(business.website)}` : "",
    normalizeEmail(business.email) ? `email:${normalizeEmail(business.email)}` : "",
    normalizePhone(business.phone) ? `phone:${normalizePhone(business.phone)}` : "",
    normalizePhone(business.mobile) ? `mobile:${normalizePhone(business.mobile)}` : "",
  ].filter((key) => key && !key.endsWith(":"));

  for (const key of keys) {
    if (!groupedBusinesses.has(key)) groupedBusinesses.set(key, new Set());
    groupedBusinesses.get(key).add(Number(business.id));
  }
}

for (const [key, ids] of groupedBusinesses.entries()) {
  if (ids.size < 2) continue;
  const members = [...ids].map((id) => businessById.get(id)).filter(Boolean);
  const listingCount = (id) => listings.filter((listing) => Number(listing.business_id) === Number(id)).length;
  const bannerCount = (id) => banners.filter((banner) => Number(banner.business_id) === Number(id)).length;
  const scored = members
    .map((business) => ({
      ...business,
      listing_count: listingCount(business.id),
      banner_count: bannerCount(business.id),
      score: richness(business) + listingCount(business.id) * 3 + bannerCount(business.id),
    }))
    .sort((a, b) => b.score - a.score || Number(a.id) - Number(b.id));
  duplicateBusinessGroups.push({
    key,
    canonical_business_id: scored[0]?.id,
    confidence: key.startsWith("domain:") || key.startsWith("email:") ? "high" : "review",
    members: scored,
  });
}

const exactListingGroups = new Map();
for (const listing of listings.filter((row) => compact(row.status || "active") === "active")) {
  const placementKey = (placementsByListing.get(Number(listing.id)) || [])
    .map((p) => `${p.category_slug || ""}:${p.city_slug || ""}`)
    .sort()
    .join("|");
  const key = [
    normalizeName(listing.title),
    normalizeUrl(listing.web),
    normalizeEmail(listing.email),
    normalizePhone(listing.phone),
    normalizePhone(listing.mobile),
    placementKey,
  ].join("::");
  if (!exactListingGroups.has(key)) exactListingGroups.set(key, []);
  exactListingGroups.get(key).push(listing);
}
const duplicateListings = [...exactListingGroups.values()]
  .filter((group) => group.length > 1)
  .map((group) => ({
    confidence: "high",
    keep_listing_id: [...group].sort((a, b) => richness(b) - richness(a) || Number(a.id) - Number(b.id))[0].id,
    listings: group.map((listing) => ({
      id: listing.id,
      business_id: listing.business_id,
      title: listing.title,
      web: listing.web,
      email: listing.email,
      phone: listing.phone,
      mobile: listing.mobile,
      placements: placementsByListing.get(Number(listing.id)) || [],
    })),
  }));

const fieldIssues = [];
const cityLabels = new Map(cities.map((city) => [compact(city.label), city.slug]));
for (const listing of listings) {
  if (compact(listing.status || "active") !== "active") continue;
  const title = clean(listing.title);
  const description = clean(listing.description);
  const tagline = clean(listing.tagline);
  const promo = clean(listing.promo);
  const contactText = `${title} ${tagline} ${description} ${promo}`;
  const listingPlacements = placementsByListing.get(Number(listing.id)) || [];
  const placementCategories = listingPlacements.map((p) => p.category_slug).filter(Boolean);
  const placementCities = listingPlacements.map((p) => p.city_slug).filter(Boolean);

  if (splitValues(title, "email").length || splitValues(title, "phone").length || splitValues(title, "url").length) {
    fieldIssues.push(issueRow("title_contains_contact", "high", listing, "Title contains email, phone, or web-looking text.", "Move contact/web text out of title."));
  }
  if (/\b(?:street|st|road|rd|avenue|ave|drive|dr|lane|ln|court|ct|highway|hwy|level|suite|unit)\b/i.test(title) && /\d/.test(title)) {
    fieldIssues.push(issueRow("title_contains_address", "high", listing, "Title appears to contain a street address.", "Move street address into listing.location or a future address field."));
  }
  if (title.length < 3 || /^(dr|doctor|date|events?|what'?s on|new|home|click here)$/i.test(title)) {
    fieldIssues.push(issueRow("weak_title", "review", listing, "Title is too generic or looks like navigation/content residue.", "Review whether this is a real listing."));
  }
  if (!clean(listing.web) && !clean(listing.email) && !clean(listing.phone) && !clean(listing.mobile)) {
    fieldIssues.push(issueRow("no_contact_path", "review", listing, "No web, email, phone, or mobile contact path.", "Keep only if this is intentionally informational."));
  }
  if (!clean(listing.image_url)) {
    fieldIssues.push(issueRow("missing_image", "low", listing, "Listing has no image path.", "Use fallback/logo or add a sourced image."));
  }
  if (splitValues(description, "email").length || splitValues(description, "phone").length || splitValues(description, "url").length) {
    fieldIssues.push(issueRow("description_contains_contact", "review", listing, "Description contains contact details.", "Extract contact detail into phone/email/web if not already present."));
  }
  if (splitValues(tagline, "email").length || splitValues(tagline, "phone").length || splitValues(tagline, "url").length) {
    fieldIssues.push(issueRow("tagline_contains_contact", "review", listing, "Tagline contains contact details.", "Extract contact detail into phone/email/web if not already present."));
  }
  if (!placementCategories.length) {
    fieldIssues.push(issueRow("missing_category", "high", listing, "Listing has no active category placement.", "Assign a real category or internal TBC category."));
  }
  if (!placementCities.length && compact(listing.listing_type) !== "online") {
    fieldIssues.push(issueRow("missing_city", "review", listing, "Listing has no city placement.", "Assign city, online/national, or internal TBC city."));
  }
  for (const p of listingPlacements) {
    if (p.category_slug && !categoryBySlug.has(p.category_slug)) {
      fieldIssues.push(issueRow("unknown_category", "high", listing, `Placement uses missing category '${p.category_slug}'.`, "Fix or remove bad category placement."));
    }
    if (p.city_slug && !cityBySlug.has(p.city_slug)) {
      fieldIssues.push(issueRow("unknown_city", "high", listing, `Placement uses missing city '${p.city_slug}'.`, "Fix or remove bad city placement."));
    }
  }

  for (const [cityName, citySlug] of cityLabels.entries()) {
    if (!cityName || cityName.length < 4) continue;
    if (contactText.toLowerCase().includes(cityName) && placementCities.length && !placementCities.includes(citySlug)) {
      fieldIssues.push(issueRow("possible_city_mismatch", "review", listing, `Text mentions ${cityBySlug.get(citySlug)?.label}, but placements are ${placementCities.join(", ")}.`, "Check if the listing belongs to another city too."));
      break;
    }
  }

  const domain = domainOf(listing.web);
  const emailDomains = splitValues(listing.email, "email").map((email) => email.split("@")[1]).filter(Boolean);
  if (domain && emailDomains.length && !emailDomains.some((emailDomain) => domain.includes(emailDomain.replace(/^www\./, "")) || emailDomain.includes(domain))) {
    fieldIssues.push(issueRow("web_email_domain_mismatch", "review", listing, `Web domain '${domain}' differs from email domain(s) '${emailDomains.join(", ")}'.`, "Usually fine for Gmail/Bigpond, review business domains."));
  }

  const businessName = businessDisplayNameForListing(listing);
  const businessKey = normalizeName(businessName);
  const titleKey = normalizeName(title);
  if (businessKey && titleKey && businessKey !== titleKey && !businessKey.includes(titleKey) && !titleKey.includes(businessKey)) {
    fieldIssues.push(issueRow("business_listing_name_mismatch", "review", listing, `Business name '${businessName}' differs from listing title '${title}'.`, "Review ownership; may be branch/service listing under one business."));
  }
}

const relationshipIssues = [];
for (const listing of listings) {
  if (listing.business_id && !businessById.has(Number(listing.business_id))) {
    relationshipIssues.push(issueRow("orphan_listing_business", "high", listing, `Listing points to missing business_id ${listing.business_id}.`, "Reassign listing to an existing business."));
  }
}
for (const banner of banners) {
  if (banner.business_id && !businessById.has(Number(banner.business_id))) {
    relationshipIssues.push(issueRow("orphan_banner_business", "high", banner, `Banner points to missing business_id ${banner.business_id}.`, "Reassign banner to an existing business."));
  }
  if (!clean(banner.image_url)) {
    relationshipIssues.push(issueRow("banner_missing_image", "high", banner, "Banner/tile has no image URL.", "Add banner image or disable banner."));
  }
}

function urlCandidates(row) {
  const fields = [row.web, row.website, row.click_url, row.link_url, row.ticket_url, row.source_url];
  return [...new Set(fields.flatMap((field) => splitValues(field, "url")))];
}

const urlRows = [
  ...listings.flatMap((row) => urlCandidates(row).map((url) => ({ type: "listing", id: row.id, title: row.title, url }))),
  ...businesses.flatMap((row) => urlCandidates(row).map((url) => ({ type: "business", id: row.id, title: row.name, url }))),
  ...banners.flatMap((row) => urlCandidates(row).map((url) => ({ type: "banner", id: row.id, title: row.title || row.alt_text, url }))),
  ...events.flatMap((row) => urlCandidates(row).map((url) => ({ type: "event", id: row.id, title: row.title, url }))),
].filter((row) => row.url);

const uniqueUrls = new Map();
for (const row of urlRows) {
  const normalized = normalizeUrl(row.url);
  if (!uniqueUrls.has(normalized)) uniqueUrls.set(normalized, { original: row.url, normalized, refs: [] });
  uniqueUrls.get(normalized).refs.push(row);
}

async function checkUrl(url) {
  const raw = clean(url);
  const candidates = /^https?:\/\//i.test(raw) ? [raw] : [`https://${raw}`, `http://${raw}`];
  for (const candidate of candidates) {
    const result = await curlCheck(candidate);
    if (result.ok || result.status !== "000") return result;
  }
  return { status: "000", ok: false, final_url: "", error: "timeout_or_unreachable" };
}

function curlCheck(url) {
  return new Promise((resolve) => {
    const outputTarget = process.platform === "win32" ? "NUL" : "/dev/null";
    const child = spawn(
      process.platform === "win32" ? "curl.exe" : "curl",
      [
        "--location",
        "--max-time",
        "6",
        "--connect-timeout",
        "3",
        "--silent",
        "--show-error",
        "--output",
        outputTarget,
        "--write-out",
        "%{http_code}\t%{url_effective}",
        url,
      ],
      { windowsHide: true }
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      resolve({ status: "error", ok: false, final_url: "", error: error.message });
    });
    child.on("close", () => {
      const [status = "000", finalUrl = ""] = stdout.trim().split("\t");
      const statusNumber = Number(status);
      resolve({
        status,
        ok: statusNumber >= 200 && statusNumber < 400,
        final_url: finalUrl,
        error: statusNumber >= 200 && statusNumber < 400 ? "" : stderr.trim(),
      });
    });
  });
}

async function mapLimit(items, limit, mapper) {
  const results = [];
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current], current);
    }
  });
  await Promise.all(workers);
  return results;
}

console.log(`Auditing ${businesses.length} businesses, ${listings.length} listings, ${placements.length} placements.`);
let urlHealth = [...uniqueUrls.values()].map((entry) => ({
  ...entry,
  status: "not_checked",
  ok: null,
  final_url: "",
}));
if (includeUrlHealth) {
  console.log(`Checking ${uniqueUrls.size} unique URLs...`);
  urlHealth = await mapLimit([...uniqueUrls.values()], 28, async (entry) => ({
    ...entry,
    ...(await checkUrl(entry.original)),
  }));
} else {
  console.log(`Skipping ${uniqueUrls.size} URL health checks. Rerun with --url-health for the slower external check.`);
}

const deadUrls = urlHealth.filter((entry) => entry.ok === false);
const report = {
  generated_at: new Date().toISOString(),
  counts: {
    businesses: businesses.length,
    listings: listings.length,
    placements: placements.length,
    banners: banners.length,
    events: events.length,
    unique_urls_checked: uniqueUrls.size,
    url_health_mode: includeUrlHealth ? "checked" : "not_checked",
    dead_or_problem_urls: deadUrls.length,
    duplicate_business_groups: duplicateBusinessGroups.length,
    exact_duplicate_listing_groups: duplicateListings.length,
    field_issue_count: fieldIssues.length,
    relationship_issue_count: relationshipIssues.length,
  },
  duplicate_business_groups: duplicateBusinessGroups,
  exact_duplicate_listing_groups: duplicateListings,
  field_issues: fieldIssues,
  relationship_issues: relationshipIssues,
  url_health: urlHealth,
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `listing-database-audit-${stamp}.json`);
const htmlPath = path.join(outDir, `listing-database-audit-${stamp}.html`);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char]);
}

function table(rows, columns) {
  return `<table><thead><tr>${columns.map((col) => `<th>${esc(col.label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((col) => `<td>${esc(col.value(row))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const fieldIssueSummary = Object.entries(fieldIssues.reduce((acc, issue) => {
  acc[issue.kind] = (acc[issue.kind] || 0) + 1;
  return acc;
}, {})).sort((a, b) => b[1] - a[1]);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Listing Database Audit</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #1f2f3b; }
    h1, h2 { color: #006c67; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 20px 0; }
    .metric { border: 1px solid #c8dedb; border-radius: 8px; padding: 12px; background: #f7fffd; }
    .metric strong { display: block; font-size: 24px; color: #8c2d4d; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0 28px; font-size: 13px; }
    th, td { border: 1px solid #d9e4e2; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #e9f5f3; position: sticky; top: 0; }
    tr:nth-child(even) { background: #fbfbfb; }
    .scroll { overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Listing Database Audit</h1>
  <p>Generated ${esc(report.generated_at)} from production D1. This is an audit report only; no database rows were changed.</p>
  <div class="summary">
    ${Object.entries(report.counts).map(([key, value]) => `<div class="metric"><strong>${esc(value)}</strong>${esc(key.replace(/_/g, " "))}</div>`).join("")}
  </div>
  <h2>Field Issue Breakdown</h2>
  <div class="scroll">${table(fieldIssueSummary.map(([kind, count]) => ({ kind, count })), [
    { label: "Issue", value: (row) => row.kind },
    { label: "Count", value: (row) => row.count },
  ])}</div>
  <h2>Likely Duplicate Business Groups</h2>
  <div class="scroll">${table(duplicateBusinessGroups.slice(0, 120).map((group) => ({
    key: group.key,
    canonical: group.canonical_business_id,
    confidence: group.confidence,
    members: group.members.map((m) => `#${m.id} ${m.name} (${m.listing_count} listings, ${m.banner_count} banners, score ${m.score})`).join(" | "),
  })), [
    { label: "Match Key", value: (row) => row.key },
    { label: "Suggested Canonical", value: (row) => row.canonical },
    { label: "Confidence", value: (row) => row.confidence },
    { label: "Members", value: (row) => row.members },
  ])}</div>
  <h2>Exact Duplicate Listing Groups</h2>
  <div class="scroll">${table(duplicateListings.slice(0, 120).map((group) => ({
    keep: group.keep_listing_id,
    listings: group.listings.map((l) => `#${l.id} business #${l.business_id} ${l.title}`).join(" | "),
  })), [
    { label: "Keep Listing", value: (row) => row.keep },
    { label: "Listings", value: (row) => row.listings },
  ])}</div>
  <h2>High/Review Field Issues</h2>
  <div class="scroll">${table(fieldIssues.filter((issue) => issue.severity !== "low").slice(0, 300), [
    { label: "Issue", value: (row) => row.kind },
    { label: "Severity", value: (row) => row.severity },
    { label: "Listing", value: (row) => row.listing_id },
    { label: "Business", value: (row) => `${row.business_id} ${row.business_name}` },
    { label: "Title", value: (row) => row.title },
    { label: "Detail", value: (row) => row.detail },
    { label: "Suggestion", value: (row) => row.suggestion },
  ])}</div>
  <h2>Relationship Issues</h2>
  <div class="scroll">${table(relationshipIssues, [
    { label: "Issue", value: (row) => row.kind },
    { label: "Severity", value: (row) => row.severity },
    { label: "ID", value: (row) => row.listing_id },
    { label: "Business", value: (row) => row.business_id },
    { label: "Title", value: (row) => row.title },
    { label: "Detail", value: (row) => row.detail },
  ])}</div>
  <h2>Dead or Problem URLs</h2>
  <div class="scroll">${table(deadUrls.slice(0, 300), [
    { label: "URL", value: (row) => row.original },
    { label: "Normalized", value: (row) => row.normalized },
    { label: "Status", value: (row) => row.status },
    { label: "Error", value: (row) => row.error || "" },
    { label: "Refs", value: (row) => row.refs.map((ref) => `${ref.type} #${ref.id} ${ref.title}`).join(" | ") },
  ])}</div>
</body>
</html>`;

writeFileSync(htmlPath, html);
console.log(`JSON report: ${jsonPath}`);
console.log(`HTML report: ${htmlPath}`);
console.log(JSON.stringify(report.counts, null, 2));
