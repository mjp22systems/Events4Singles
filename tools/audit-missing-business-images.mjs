import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const imagesDir = path.join(publicDir, "images");
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"]);
const GENERIC_PARTS = [
  "/images/categories/",
  "/images/site/",
  "advertise",
  "your-logo",
  "placeholder",
  "default",
  "home-cat-",
  "home-city-",
  "location-photo-",
];
const GENERIC_STEMS = new Set([
  "adelaide",
  "brisbane",
  "canberra",
  "cairns",
  "darwin",
  "geelong",
  "gold coast",
  "hobart",
  "melbourne",
  "newcastle",
  "perth",
  "sydney",
  "toowoomba",
  "wollongong",
  "dating",
  "friends",
  "personals",
  "singles",
  "social",
  "walk",
  "who",
  "bot",
  "cons",
  "introductions",
]);
const REJECT_PARTS = [
  "spacer",
  "pixel",
  "clear",
  "blank",
  "1x1",
  "icon",
  "arrow",
  "bullet",
  "line",
  "bg_",
  "background",
  "e4s_logo",
  "logo_dis",
];

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod-\d{8}-\d{6}\.sql$/i.test(name))
    .map((name) => ({ name, fullPath: path.join(outDir, name) }))
    .sort((a, b) => b.name.localeCompare(a.name));
  if (!files.length) throw new Error(`No production SQL dump found in ${outDir}`);
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

function walkImages(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(fullPath, files);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    const rel = `/${path.relative(publicDir, fullPath).replace(/\\/g, "/")}`;
    files.push({
      path: rel,
      fullPath,
      filename: entry.name,
      stem: path.basename(entry.name, ext),
      size: statSync(fullPath).size,
    });
  }
  return files;
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function norm(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(pty|ltd|limited|inc|the|australia|australian|for|singles|single|dating|dance|classes|club|school|studio|company|co|com|au|www|http|https)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return new Set(norm(value).split(" ").filter((token) => token.length >= 3));
}

function normalizeUrl(value) {
  const raw = clean(value);
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

function domainStem(value) {
  const host = normalizeUrl(value).split("/")[0] || "";
  return host.split(".").filter((part) => !["com", "net", "org", "au", "co"].includes(part)).join(" ");
}

function imageExists(url) {
  if (!url || /^https?:\/\//i.test(url)) return Boolean(url);
  const full = path.join(publicDir, String(url).replace(/^\/+/, ""));
  try {
    return statSync(full).isFile();
  } catch {
    return false;
  }
}

function isGenericImage(url) {
  const lower = clean(url).toLowerCase();
  if (!lower) return true;
  return GENERIC_PARTS.some((part) => lower.includes(part));
}

function isRejectedImageFile(image) {
  const lower = `${image.path} ${image.filename}`.toLowerCase();
  if (image.size < 1200) return true;
  if (GENERIC_PARTS.some((part) => lower.includes(part))) return true;
  if (GENERIC_STEMS.has(norm(image.stem))) return true;
  return REJECT_PARTS.some((part) => lower.includes(part));
}

function scoreImage(record, image) {
  if (isRejectedImageFile(image)) return 0;
  const recordTokens = tokens([
    record.title,
    record.business_name,
    record.web,
    record.business_website,
    record.email && String(record.email).split("@")[0],
    domainStem(record.web),
    domainStem(record.business_website),
  ].filter(Boolean).join(" "));
  const imageTokens = tokens(`${image.stem} ${path.dirname(image.path)}`);
  if (!recordTokens.size || !imageTokens.size) return 0;

  const matches = [...recordTokens].filter((token) => imageTokens.has(token));
  const hasSpecificToken = matches.some((token) => token.length >= 6);
  const webStem = norm(domainStem(record.web || record.business_website));
  const stemNorm = norm(image.stem);
  const domainMatch = Boolean(webStem && stemNorm && (stemNorm.includes(webStem) || webStem.includes(stemNorm)));
  if (matches.length < 2 && !domainMatch && !hasSpecificToken) return 0;

  let score = matches.length * 12;
  const recordNorm = norm(`${record.title} ${record.business_name}`);
  if (recordNorm && stemNorm) {
    if (recordNorm === stemNorm) score += 70;
    if (recordNorm.includes(stemNorm) || stemNorm.includes(recordNorm)) score += 40;
  }
  if (domainMatch) score += 55;
  if (image.path.includes("/businesses/")) score += 8;
  if (image.path.includes("/categories/") || image.path.includes("/site/")) score -= 30;
  if (/\b(logo|120x80|160x90|banner)\b/i.test(image.filename)) score += 4;
  return Math.max(0, score);
}

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
  return `<table><thead><tr>${columns.map((col) => `<th>${esc(col.label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((col) => `<td>${col.html ? col.value(row) : esc(col.value(row))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const dumpPath = latestDumpPath();
const tables = loadDumpTables(dumpPath, ["businesses", "listings", "listing_placements", "listing_images", "banners"]);
const businessById = new Map(tables.businesses.map((row) => [Number(row.id), row]));
const imageRowsByListing = new Map();
for (const row of tables.listing_images || []) {
  const listingId = Number(row.listing_id);
  if (!imageRowsByListing.has(listingId)) imageRowsByListing.set(listingId, []);
  imageRowsByListing.get(listingId).push(row);
}

const images = walkImages(imagesDir);
const candidateImages = images.filter((image) => !isRejectedImageFile(image));
const rows = [];

for (const listing of tables.listings) {
  if (clean(listing.status || "active") !== "active") continue;
  const business = businessById.get(Number(listing.business_id)) || {};
  const listingImages = imageRowsByListing.get(Number(listing.id)) || [];
  const currentImage = clean(listing.image_url);
  const businessLogo = clean(business.logo_url);
  const hasGoodListingImage = currentImage && imageExists(currentImage) && !isGenericImage(currentImage);
  const hasGoodBusinessLogo = businessLogo && imageExists(businessLogo) && !isGenericImage(businessLogo);
  const hasGoodGalleryImage = listingImages.some((image) => image.url && imageExists(image.url) && !isGenericImage(image.url));
  if (hasGoodListingImage || hasGoodBusinessLogo || hasGoodGalleryImage) continue;

  const record = {
    listing_id: listing.id,
    business_id: listing.business_id,
    title: clean(listing.title),
    business_name: clean(business.name),
    web: clean(listing.web),
    business_website: clean(business.website),
    email: clean(listing.email || business.email),
    current_image: currentImage,
    business_logo: businessLogo,
    existing_gallery: listingImages.map((image) => image.url).filter(Boolean).join(" | "),
  };
  const matches = candidateImages
    .map((image) => ({ image, score: scoreImage(record, image) }))
    .filter((entry) => entry.score >= 24)
    .sort((a, b) => b.score - a.score || b.image.size - a.image.size)
    .slice(0, 5);
  rows.push({
    ...record,
    match_count: matches.length,
    confidence: matches[0]?.score >= 70 ? "high" : matches[0]?.score >= 42 ? "medium" : matches[0] ? "low" : "none",
    best_score: matches[0]?.score || 0,
    best_image: matches[0]?.image.path || "",
    best_image_size: matches[0]?.image.size || 0,
    matches: matches.map((entry) => ({
      score: entry.score,
      path: entry.image.path,
      size: entry.image.size,
    })),
  });
}

rows.sort((a, b) => b.best_score - a.best_score || a.title.localeCompare(b.title));
const summary = {
  generated_at: new Date().toISOString(),
  dump_path: dumpPath,
  total_public_images: images.length,
  usable_candidate_images: candidateImages.length,
  active_listings_checked: tables.listings.filter((row) => clean(row.status || "active") === "active").length,
  repair_candidates: rows.length,
  high_confidence: rows.filter((row) => row.confidence === "high").length,
  medium_confidence: rows.filter((row) => row.confidence === "medium").length,
  low_confidence: rows.filter((row) => row.confidence === "low").length,
  no_filename_match: rows.filter((row) => row.confidence === "none").length,
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `missing-business-image-audit-${stamp}.json`);
const htmlPath = path.join(outDir, `missing-business-image-audit-${stamp}.html`);
const sqlPath = path.join(outDir, `missing-business-image-candidates-${stamp}.sql`);
writeFileSync(jsonPath, `${JSON.stringify({ summary, rows }, null, 2)}\n`);

function sqlQuote(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

const sqlRows = rows.filter((row) => ["high", "medium"].includes(row.confidence));
const sqlLines = [
  "-- Candidate listing/business image repairs generated from filename matching.",
  "-- Review before applying. No rows have been changed by the audit script.",
];
for (const row of sqlRows) {
  sqlLines.push("");
  sqlLines.push(`-- ${row.confidence.toUpperCase()} score ${row.best_score}: listing #${row.listing_id} ${row.title}`);
  sqlLines.push(`UPDATE listings SET image_url = ${sqlQuote(row.best_image)}, updated_at = datetime('now') WHERE id = ${Number(row.listing_id)};`);
  if (row.business_id) {
    sqlLines.push(`UPDATE businesses SET logo_url = ${sqlQuote(row.best_image)}, updated_at = datetime('now') WHERE id = ${Number(row.business_id)};`);
  }
  sqlLines.push(`DELETE FROM listing_images WHERE listing_id = ${Number(row.listing_id)} AND is_primary = 1;`);
  sqlLines.push(`INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (${Number(row.listing_id)}, ${sqlQuote(row.best_image)}, ${sqlQuote(`${row.title} image`)}, 0, 1);`);
}
writeFileSync(sqlPath, `${sqlLines.join("\n")}\n`);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Missing Business Image Audit</title>
  <style>
    body { font-family: Arial, sans-serif; color: #18313a; margin: 24px; }
    h1, h2 { color: #006c67; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 20px 0; }
    .metric { border: 1px solid #c8dedb; border-radius: 8px; padding: 12px; background: #f7fffd; }
    .metric strong { display: block; color: #8c2d4d; font-size: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { border: 1px solid #d9e4e2; padding: 8px; vertical-align: top; text-align: left; }
    th { background: #e9f5f3; position: sticky; top: 0; }
    tr:nth-child(even) { background: #fbfbfb; }
    .scroll { overflow-x: auto; }
    img { max-width: 110px; max-height: 82px; object-fit: contain; background: #f4f4f4; }
    .confidence-high { color: #006c67; font-weight: 700; }
    .confidence-medium { color: #7a5a00; font-weight: 700; }
    .confidence-low, .confidence-none { color: #8c2d4d; font-weight: 700; }
    code { white-space: nowrap; }
  </style>
</head>
<body>
  <h1>Missing Business Image Audit</h1>
  <p>Generated ${esc(summary.generated_at)} from ${esc(path.basename(dumpPath))}. This is a read-only filename matching report; no database rows were changed.</p>
  <div class="summary">
    ${Object.entries(summary).filter(([key]) => !["generated_at", "dump_path"].includes(key)).map(([key, value]) => `<div class="metric"><strong>${esc(value)}</strong>${esc(key.replace(/_/g, " "))}</div>`).join("")}
  </div>
  <h2>Likely Matches</h2>
  <div class="scroll">${table(rows.filter((row) => row.confidence !== "none").slice(0, 250), [
    { label: "Confidence", value: (row) => `<span class="confidence-${esc(row.confidence)}">${esc(row.confidence)}</span>`, html: true },
    { label: "Score", value: (row) => row.best_score },
    { label: "Listing", value: (row) => `#${row.listing_id}` },
    { label: "Business", value: (row) => `#${row.business_id} ${row.business_name}` },
    { label: "Title", value: (row) => row.title },
    { label: "Current Image", value: (row) => row.current_image || row.business_logo || row.existing_gallery },
    { label: "Best Match", value: (row) => `<img src="${esc(row.best_image)}" alt=""> <br><code>${esc(row.best_image)}</code>`, html: true },
    { label: "Other Matches", value: (row) => row.matches.slice(1).map((match) => `${match.score}: ${match.path}`).join(" | ") },
  ])}</div>
  <h2>No Filename Match Yet</h2>
  <div class="scroll">${table(rows.filter((row) => row.confidence === "none").slice(0, 250), [
    { label: "Listing", value: (row) => `#${row.listing_id}` },
    { label: "Business", value: (row) => `#${row.business_id} ${row.business_name}` },
    { label: "Title", value: (row) => row.title },
    { label: "Web", value: (row) => row.web || row.business_website },
    { label: "Current Image", value: (row) => row.current_image || row.business_logo || row.existing_gallery },
  ])}</div>
</body>
</html>`;
writeFileSync(htmlPath, html);

console.log(`JSON report: ${jsonPath}`);
console.log(`HTML report: ${htmlPath}`);
console.log(`Candidate SQL: ${sqlPath}`);
console.log(JSON.stringify(summary, null, 2));
