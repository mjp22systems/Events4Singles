import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const imagesDir = path.join(publicDir, "images");
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"]);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char]);
}

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod-\d{8}-\d{6}\.sql$/i.test(name))
    .map((name) => ({ name, fullPath: path.join(outDir, name) }))
    .sort((a, b) => b.name.localeCompare(a.name));
  return files[0]?.fullPath || null;
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

function loadReferencedImagePathsFromDump(dumpPath) {
  if (!dumpPath) return new Set();
  const references = new Set();
  const sql = readFileSync(dumpPath, "utf8");
  const insertPattern = /^INSERT INTO "([^"]+)" \(([^)]+)\) VALUES\((.*)\);$/;
  const imageFieldPattern = /(image|logo|photo|banner|icon|thumbnail|avatar)/i;

  for (const line of sql.split(/\r?\n/)) {
    const match = line.match(insertPattern);
    if (!match) continue;
    const [, , columnsSql, valuesSql] = match;
    const columns = columnsSql.split(",").map((column) => column.replace(/"/g, ""));
    const values = parseSqlValues(valuesSql);
    columns.forEach((column, index) => {
      if (!imageFieldPattern.test(column)) return;
      const value = String(values[index] || "");
      for (const ref of value.matchAll(/\/images\/[^'"<>,\s)]+/gi)) {
        references.add(normalizeImagePath(ref[0]));
      }
    });
  }
  return references;
}

function normalizeImagePath(value) {
  const clean = String(value || "").trim().replace(/\\/g, "/");
  const withoutQuery = clean.split(/[?#]/)[0];
  return withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
}

function rootImageFiles() {
  return readdirSync(imagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => {
      const fullPath = path.join(imagesDir, entry.name);
      return {
        filename: entry.name,
        path: `/images/${entry.name}`,
        size: statSync(fullPath).size,
        ext: path.extname(entry.name).toLowerCase(),
      };
    })
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

function isLayoutJunk(file) {
  const stem = path.basename(file.filename, file.ext).toLowerCase();
  const lower = file.filename.toLowerCase();
  const tokens = stem.split(/[^a-z0-9]+/).filter(Boolean);
  const tokenSet = new Set(tokens);
  const prefixTokens = [
    "spacer",
    "pixel",
    "clear",
    "shim",
    "blank",
    "bullet",
    "arrow",
    "arrows",
    "divider",
    "line",
    "vline",
    "hline",
    "border",
    "corner",
    "button",
    "nav",
    "dot",
    "trans",
  ];
  const exactNames = new Set([
    "1x1",
    "transparent",
    "barbg",
    "bg",
    "b_login",
    "left",
    "right",
  ]);
  const reasons = [];

  if (file.size < 500) reasons.push("tiny file under 500 bytes");
  if (exactNames.has(stem)) reasons.push("generic layout filename");
  if (/^bg[_\-.]/i.test(lower) || /^background[_\-.]/i.test(lower)) {
    reasons.push("background/layout filename");
  }
  if (/^dance_classes_b\d+$/i.test(stem)) {
    reasons.push("legacy dance navigation/button slice");
  }
  if (prefixTokens.some((token) => tokenSet.has(token) || stem.startsWith(`${token}_`) || stem.startsWith(`${token}-`))) {
    reasons.push("layout/helper filename token");
  }

  return [...new Set(reasons)];
}

function table(rows, columns) {
  return `<table><thead><tr>${columns.map((column) => `<th>${esc(column.label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${column.html ? column.value(row) : esc(column.value(row))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const dumpPath = latestDumpPath();
const liveReferences = loadReferencedImagePathsFromDump(dumpPath);
const looseImages = rootImageFiles();
const files = looseImages.map((file) => {
  const junkReasons = isLayoutJunk(file);
  const liveReferenced = liveReferences.has(normalizeImagePath(file.path));
  const classification = junkReasons.length
    ? liveReferenced
      ? "layout/helper-looking but referenced"
      : "safe quarantine candidate"
    : "plausible business/legacy image";
  return {
    ...file,
    junkReasons,
    liveReferenced,
    classification,
  };
});

const summary = {
  dump_path: dumpPath,
  loose_root_images_checked: files.length,
  plausible_business_or_legacy_images: files.filter((file) => file.classification === "plausible business/legacy image").length,
  safe_quarantine_candidates: files.filter((file) => file.classification === "safe quarantine candidate").length,
  layout_helper_looking_but_referenced: files.filter((file) => file.classification === "layout/helper-looking but referenced").length,
  live_db_referenced: files.filter((file) => file.liveReferenced).length,
};

const safeCandidates = files.filter((file) => file.classification === "safe quarantine candidate");
const referencedJunk = files.filter((file) => file.classification === "layout/helper-looking but referenced");
const tinyCandidates = safeCandidates.filter((file) => file.junkReasons.includes("tiny file under 500 bytes"));

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `loose-image-junk-audit-${timestamp}.json`);
const htmlPath = path.join(outDir, `loose-image-junk-audit-${timestamp}.html`);
const quarantineScriptPath = path.join(outDir, `loose-image-quarantine-candidates-${timestamp}.ps1`);

writeFileSync(jsonPath, JSON.stringify({ summary, safeCandidates, referencedJunk, files }, null, 2));
writeFileSync(
  quarantineScriptPath,
  [
    "# Review before running. This moves only unreferenced obvious layout/helper images from public/images root.",
    "$root = Resolve-Path (Join-Path $PSScriptRoot '..\\..')",
    "$quarantine = Join-Path $PSScriptRoot 'loose-image-quarantine'",
    "New-Item -ItemType Directory -Force -Path $quarantine | Out-Null",
    ...safeCandidates.map((file) => {
      const from = `Join-Path $root 'public\\images\\${file.filename.replace(/'/g, "''")}'`;
      const to = `Join-Path $quarantine '${file.filename.replace(/'/g, "''")}'`;
      return `if (Test-Path -LiteralPath (${from})) { Move-Item -LiteralPath (${from}) -Destination (${to}) }`;
    }),
  ].join("\n"),
);

const columns = [
  { label: "file", value: (row) => row.filename },
  { label: "bytes", value: (row) => row.size },
  { label: "reason", value: (row) => row.junkReasons.join("; ") },
  { label: "live DB ref", value: (row) => row.liveReferenced ? "yes" : "no" },
];

writeFileSync(htmlPath, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Loose Image Junk Audit</title>
<style>
body{font-family:Arial,sans-serif;margin:24px;color:#123;line-height:1.45}
h1,h2{color:#006c68}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin:16px 0 24px}
.metric{border:1px solid #cbdedd;border-radius:8px;padding:12px;background:#f8ffff}
.metric strong{display:block;font-size:28px;color:#8d2547}
table{border-collapse:collapse;width:100%;margin:12px 0 28px;font-size:13px}
th,td{border:1px solid #d8e5e4;padding:7px;vertical-align:top}
th{background:#e9f5f4;text-align:left}
code{background:#f3f5f5;padding:2px 4px;border-radius:4px}
</style>
</head>
<body>
<h1>Loose Image Junk Audit</h1>
<p>This only checks direct files in <code>public/images</code>. It does not classify category, hero, site, or subfolder assets for removal.</p>
<div class="grid">
${Object.entries(summary).filter(([, value]) => typeof value === "number").map(([key, value]) => `<div class="metric"><span>${esc(key.replace(/_/g, " "))}</span><strong>${esc(value)}</strong></div>`).join("")}
</div>
<h2>Safe Quarantine Candidates</h2>
<p>These are obvious layout/helper-looking direct root images with no live DB reference found in the latest production dump. The generated PowerShell file moves them to quarantine rather than deleting them.</p>
${table(safeCandidates, columns)}
<h2>Referenced Helper-Looking Files</h2>
<p>These look like layout assets but are still referenced somewhere, so they should not be removed without a separate visual/code review.</p>
${table(referencedJunk, columns)}
<h2>Tiny Candidate Subset</h2>
${table(tinyCandidates, columns)}
</body>
</html>`);

console.log(JSON.stringify({
  summary,
  jsonPath,
  htmlPath,
  quarantineScriptPath,
}, null, 2));
