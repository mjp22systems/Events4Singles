import { mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const imagesDir = path.join(publicDir, "images");
const outDir = path.join(root, "tmp", "image-audits");
mkdirSync(outDir, { recursive: true });

const dumpArgIndex = process.argv.indexOf("--dump");
const dumpPath = dumpArgIndex >= 0 ? process.argv[dumpArgIndex + 1] : "";
const shouldMove = process.argv.includes("--move");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"]);
const CANONICAL_SUBFOLDERS = new Set([
  "businesses",
  "categories",
  "city",
  "icons",
  "junk",
  "site",
]);

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
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

function normalizeImagePath(value) {
  const cleanPath = clean(value).replace(/\\/g, "/").split(/[?#]/)[0];
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}

function loadLiveReferences() {
  if (!dumpPath) return new Set();
  const sql = readFileSync(dumpPath, "utf8");
  const refs = new Set();
  for (const match of sql.matchAll(/\/images\/[^'"<>,\s)]+/gi)) {
    refs.add(normalizeImagePath(match[0]));
  }
  return refs;
}

function listFilesRecursive(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".open-next") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function loadRuntimeReferences() {
  const roots = [path.join(root, "src")];
  const cssFiles = readdirSync(publicDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && [".css", ".js", ".ts", ".tsx"].includes(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(publicDir, entry.name));
  const files = [
    ...roots.filter((dir) => {
      try {
        return statSync(dir).isDirectory();
      } catch {
        return false;
      }
    }).flatMap(listFilesRecursive),
    ...cssFiles,
  ];
  const refs = new Set();
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".css", ".js", ".jsx", ".ts", ".tsx", ".json"].includes(ext)) continue;
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/\/images\/[^'"`)<>,\s]+/gi)) {
      refs.add(normalizeImagePath(match[0]));
    }
  }
  return refs;
}

function rootImageFiles() {
  return readdirSync(imagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => {
      const fullPath = path.join(imagesDir, entry.name);
      return {
        filename: entry.name,
        path: `/images/${entry.name}`,
        fullPath,
        ext: path.extname(entry.name).toLowerCase(),
        stem: path.basename(entry.name, path.extname(entry.name)).toLowerCase(),
        size: statSync(fullPath).size,
      };
    })
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

function classify(file, liveRefs, runtimeRefs) {
  const name = file.filename.toLowerCase();
  const stem = file.stem;
  const tokens = stem.split(/[^a-z0-9]+/).filter(Boolean);
  const tokenSet = new Set(tokens);
  const referencedByDb = liveRefs.has(normalizeImagePath(file.path));
  const referencedByRuntime = runtimeRefs.has(normalizeImagePath(file.path));
  const protectedDynamicFallback =
    name.startsWith("advertise-here-") ||
    name.startsWith("category-hero-") ||
    name.startsWith("location-hero-") ||
    name.startsWith("location-photo-") ||
    name.startsWith("home-blog-");
  const referenced = referencedByDb || referencedByRuntime || protectedDynamicFallback;

  const reasons = [];
  let bucket = "business-candidate";
  let destination = "";
  let confidence = "review";

  const rootSiteGenerated =
    name.startsWith("category-hero-") ||
    name.startsWith("location-hero-") ||
    name.startsWith("home-cat-") ||
    name.startsWith("home-city-") ||
    name.startsWith("location-photo-") ||
    name.startsWith("home-blog-");
  const oldAdSample =
    name.startsWith("sample") ||
    /^sample\d/i.test(name) ||
    name.includes("adpromo") ||
    name.startsWith("e4s_advertise") ||
    name.includes("advertise_dance") ||
    name.includes("advertising") ||
    name.includes("advertiser");
  const oldNavOrLayout =
    name.includes("dance_nav") ||
    name.startsWith("dance_clipart") ||
    name.includes("eventscal") ||
    name.includes("event_cal") ||
    name.includes("events_cal") ||
    name.includes("calendar") ||
    name.includes("homepage") ||
    name.startsWith("button") ||
    name.startsWith("datingnavbar") ||
    name.startsWith("index_menu") ||
    name.startsWith("index_nav") ||
    name.startsWith("index_topmenu") ||
    name.startsWith("indexmenu_top") ||
    name.startsWith("index_menutop") ||
    name.startsWith("menu_") ||
    name.startsWith("mmmenu") ||
    name.startsWith("navbtn_") ||
    name.startsWith("navsector_") ||
    name.startsWith("navtop_") ||
    name.startsWith("othernav_") ||
    name.startsWith("red_bullet") ||
    name.startsWith("ozeworldhome") ||
    name.includes("pinkbullet") ||
    name.includes("home_") ||
    name.includes("_home") ||
    tokenSet.has("clipart") ||
    tokenSet.has("clip") ||
    tokenSet.has("nav") ||
    tokenSet.has("navbar") ||
    tokenSet.has("button") ||
    tokenSet.has("sample") ||
    tokenSet.has("template") ||
    tokenSet.has("placeholder");
  const visibleAdPlaceholder =
    name.startsWith("advertise-here-") ||
    name.includes("your-logo") ||
    name.includes("placeholder");
  const likelyBusinessSize =
    /\b(?:60x60|72x60|90x50|90x60|100x|104x|110x|120x|121x|122x|123x|132x|135x|150x|160x|165x|170x|180x|200x|250x|300x|468x60)\b/i.test(name) ||
    /(?:logo|banner|tile|directory|ani)/i.test(name);

  if (referenced) {
    bucket = "live-referenced-keep";
    confidence = "keep";
    if (referencedByDb) reasons.push("referenced by latest DB dump");
    if (referencedByRuntime) reasons.push("referenced by current runtime source/CSS");
    if (protectedDynamicFallback) reasons.push("protected because current code has dynamic fallback paths");
  } else if (visibleAdPlaceholder) {
    bucket = "site-asset";
    destination = "site/legacy-placeholders";
    confidence = "high";
    reasons.push("site placeholder/advertise image");
  } else if (rootSiteGenerated) {
    bucket = "site-asset";
    destination = name.startsWith("home-cat-")
      ? "site/legacy-generated/home-category"
      : "site/legacy-generated/home-location";
    confidence = "high";
    reasons.push("generated site/category/home asset sitting loose at root");
  } else if (oldAdSample || oldNavOrLayout) {
    bucket = "old-site-junk";
    destination = "junk/old-site-assets";
    confidence = "high";
    reasons.push("old website sample/navigation/layout asset");
  } else if (file.size < 700 && !likelyBusinessSize) {
    bucket = "old-site-junk";
    destination = "junk/old-site-assets";
    confidence = "medium";
    reasons.push("tiny unreferenced image without business-like sizing/name");
  } else {
    bucket = "business-candidate";
    confidence = likelyBusinessSize ? "likely" : "review";
    reasons.push(likelyBusinessSize ? "business/banner/logo-shaped filename" : "not obviously site junk; keep for review");
  }

  return { ...file, referenced, bucket, destination, confidence, reasons };
}

function moveFile(row) {
  if (!row.destination) return;
  const targetDir = path.join(imagesDir, row.destination);
  const targetPath = path.join(targetDir, row.filename);
  const normalizedTarget = path.resolve(targetPath);
  const normalizedImages = path.resolve(imagesDir);
  if (!normalizedTarget.startsWith(normalizedImages + path.sep)) {
    throw new Error(`Refusing to move outside images dir: ${targetPath}`);
  }
  mkdirSync(targetDir, { recursive: true });
  renameSync(row.fullPath, targetPath);
}

function table(rows) {
  const cols = [
    ["file", (row) => row.filename],
    ["bucket", (row) => row.bucket],
    ["confidence", (row) => row.confidence],
    ["destination", (row) => row.destination],
    ["referenced", (row) => row.referenced ? "yes" : "no"],
    ["bytes", (row) => row.size],
    ["reason", (row) => row.reasons.join("; ")],
  ];
  return `<table><thead><tr>${cols.map(([label]) => `<th>${esc(label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${cols.map(([, fn]) => `<td>${esc(fn(row))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const liveRefs = loadLiveReferences();
const runtimeRefs = loadRuntimeReferences();
const rows = rootImageFiles().map((file) => classify(file, liveRefs, runtimeRefs));
const movable = rows.filter((row) => row.destination && !row.referenced);

if (shouldMove) {
  for (const row of movable) moveFile(row);
}

const summary = {
  generated_at: new Date().toISOString(),
  dump_path: dumpPath || null,
  moved: shouldMove,
  loose_root_images_checked: rows.length,
  live_referenced_keep: rows.filter((row) => row.bucket === "live-referenced-keep").length,
  business_candidates: rows.filter((row) => row.bucket === "business-candidate").length,
  site_assets: rows.filter((row) => row.bucket === "site-asset").length,
  old_site_junk: rows.filter((row) => row.bucket === "old-site-junk").length,
  movable: movable.length,
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `loose-image-classification-${stamp}.json`);
const htmlPath = path.join(outDir, `loose-image-classification-${stamp}.html`);
const csvPath = path.join(outDir, `loose-image-classification-${stamp}.csv`);

writeFileSync(jsonPath, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
writeFileSync(csvPath, [
  "filename,bucket,confidence,destination,referenced,size,reasons",
  ...rows.map((row) => [
    row.filename,
    row.bucket,
    row.confidence,
    row.destination,
    row.referenced ? "yes" : "no",
    row.size,
    row.reasons.join("; "),
  ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")),
].join("\n"));
writeFileSync(htmlPath, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Loose Image Classification</title>
<style>
body{font-family:Arial,sans-serif;margin:24px;color:#17313a}
h1,h2{color:#006c67}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0}
.metric{background:#f7fffd;border:1px solid #c8dedb;border-radius:8px;padding:12px}
.metric strong{display:block;font-size:26px;color:#8c2d4d}
table{border-collapse:collapse;width:100%;font-size:13px;margin:12px 0 28px}
th,td{border:1px solid #d8e4e2;padding:7px;text-align:left;vertical-align:top}
th{background:#e9f5f3;position:sticky;top:0}
.scroll{overflow:auto;max-height:70vh}
</style>
</head>
<body>
<h1>Loose Image Classification</h1>
<p>Direct files in <code>/public/images</code> only. Subfolders are not reclassified.</p>
<div class="grid">${Object.entries(summary).filter(([, value]) => typeof value === "number" || typeof value === "boolean").map(([key, value]) => `<div class="metric"><span>${esc(key.replace(/_/g, " "))}</span><strong>${esc(value)}</strong></div>`).join("")}</div>
<h2>Movable Non-Business Assets</h2>
<div class="scroll">${table(movable)}</div>
<h2>Business Candidates Kept</h2>
<div class="scroll">${table(rows.filter((row) => row.bucket === "business-candidate").slice(0, 600))}</div>
<h2>Live Referenced Kept</h2>
<div class="scroll">${table(rows.filter((row) => row.bucket === "live-referenced-keep"))}</div>
</body>
</html>`);

console.log(JSON.stringify({ summary, jsonPath, htmlPath, csvPath }, null, 2));
