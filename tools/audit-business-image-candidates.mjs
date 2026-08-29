import { mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");
const outDir = path.join(root, "tmp", "image-audits");
mkdirSync(outDir, { recursive: true });

const dumpArgIndex = process.argv.indexOf("--dump");
const dumpPath = dumpArgIndex >= 0 ? process.argv[dumpArgIndex + 1] : "";
const shouldMove = process.argv.includes("--move");
const shouldContactSheets = process.argv.includes("--contact-sheets");
const exts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"]);

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
  const cleanPath = String(value || "").trim().replace(/\\/g, "/").split(/[?#]/)[0];
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}

function loadDbRefs() {
  if (!dumpPath) return new Set();
  const sql = readFileSync(dumpPath, "utf8");
  const refs = new Set();
  for (const match of sql.matchAll(/\/images\/[^'"<>,\s)]+/gi)) {
    refs.add(normalizeImagePath(match[0]));
  }
  return refs;
}

function rootImages() {
  return readdirSync(imagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && exts.has(path.extname(entry.name).toLowerCase()))
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

function isProtectedSiteOrRuntimeName(name) {
  return (
    name.startsWith("advertise-here-") ||
    name.startsWith("category-hero-") ||
    name.startsWith("location-hero-") ||
    name.startsWith("location-photo-") ||
    name.startsWith("home-blog-") ||
    name.startsWith("home-cat-") ||
    name.startsWith("home-exp-") ||
    name.startsWith("intent-")
  );
}

function looksBusinessLike(name) {
  return /(?:logo|banner|tile|dating|dance|singles|match|club|social|fitness|yoga|travel|dinner|party|restaurant|agency|coach|psychic|adelaide|brisbane|melbourne|perth|sydney|hobart|canberra|gold|coast|newcastle|120x|150x|160x|165x|170x|180x|200x|250x|300x|468x60)/i.test(name);
}

function oldSiteFurnitureName(name) {
  return /(?:_left|_right|_top|_bottom|spacer|dashedline|greyline|pollbar|navbar|topmenu|menutop|menu1|nav2|navbtn|button\d|red_[lm]\d|red_[btp]bg|bullet|clipart|dreamweaver|makehomepage|submit|stop\.gif|^top\.gif$|^down\.gif$|^flash\.gif$|^fon_|^icon_[eiw]\.gif$|^icon_nav|^other_|^othernav|^speciality_pages.*(?:_l|_l2|_b\d+|_over))/i.test(name);
}

function genericLooseImageName(name) {
  return /^(?:\d+|[a-z]\d+|clip_image\d+|image\d+|pic\d+|photo\d+)[_.-]/i.test(name) || /^clip_image\d+\.jpe?g$/i.test(name);
}

async function classify(file, dbRefs) {
  const name = file.filename.toLowerCase();
  const dbReferenced = dbRefs.has(normalizeImagePath(file.path));
  if (dbReferenced || isProtectedSiteOrRuntimeName(name)) {
    return {
      ...file,
      dbReferenced,
      width: null,
      height: null,
      bucket: "protected-review-only",
      destination: "",
      reason: dbReferenced ? "referenced by live DB dump; do not move without DB repair" : "protected current site/runtime fallback asset",
    };
  }

  let metadata = {};
  let stats = null;
  try {
    metadata = await sharp(file.fullPath, { animated: false }).metadata();
    stats = await sharp(file.fullPath, { animated: false }).resize(24, 24, { fit: "inside" }).stats();
  } catch (error) {
    return {
      ...file,
      dbReferenced,
      width: null,
      height: null,
      bucket: looksBusinessLike(name) ? "corrupt-business-review" : "junk",
      destination: looksBusinessLike(name) ? "businesses/legacy-corrupt-review" : "junk/low-quality-or-generic-business-candidates",
      reason: `unreadable image metadata: ${error.message}`,
    };
  }

  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const area = width * height;
  const ratio = height ? width / height : 0;
  const entropy = stats?.entropy || 0;

  if (oldSiteFurnitureName(name)) {
    return {
      ...file,
      dbReferenced,
      width,
      height,
      bucket: "junk",
      destination: "junk/low-quality-or-generic-business-candidates",
      reason: "old website furniture/navigation style filename",
    };
  }

  if (area && (width < 48 || height < 35 || area < 2600) && !looksBusinessLike(name)) {
    return {
      ...file,
      dbReferenced,
      width,
      height,
      bucket: "junk",
      destination: "junk/low-quality-or-generic-business-candidates",
      reason: "too small and not business/logo-like",
    };
  }

  if (genericLooseImageName(name) && !looksBusinessLike(name)) {
    return {
      ...file,
      dbReferenced,
      width,
      height,
      bucket: "junk-review",
      destination: "junk/low-quality-or-generic-business-candidates",
      reason: "generic non-business filename; likely imported page image rather than reusable advertiser asset",
    };
  }

  if (height > width * 1.18 && area >= 7000 && !/banner|logo|tile|120x80|468x60/i.test(name)) {
    return {
      ...file,
      dbReferenced,
      width,
      height,
      bucket: "portrait-content-candidate",
      destination: "businesses/legacy-portrait-content-candidates",
      reason: "portrait-shaped image; may be a coach/contact/headshot/flyer asset rather than a standard listing tile",
    };
  }

  if (entropy < 0.08 && !looksBusinessLike(name)) {
    return {
      ...file,
      dbReferenced,
      width,
      height,
      bucket: "junk-review",
      destination: "junk/low-quality-or-generic-business-candidates",
      reason: "near-flat/simple image and not business-like",
    };
  }

  return {
    ...file,
    dbReferenced,
    width,
    height,
    bucket: "business-candidate-keep",
    destination: "",
    reason: looksBusinessLike(name) ? "business/listing tile naming or dimensions" : "not enough evidence to junk safely",
  };
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

function htmlTable(rows) {
  return `<table><thead><tr><th>file</th><th>bucket</th><th>size</th><th>path</th><th>reason</th><th>preview</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${esc(row.filename)}</td><td>${esc(row.bucket)}</td><td>${esc(`${row.width || "?"}x${row.height || "?"}`)}</td><td>${esc(row.destination || "keep")}</td><td>${esc(row.reason)}</td><td><img src="../../public${esc(row.path)}" loading="lazy" /></td></tr>`).join("")}</tbody></table>`;
}

async function createContactSheet(name, rows) {
  const sheetDir = path.join(outDir, "contact-sheets");
  mkdirSync(sheetDir, { recursive: true });
  const cellW = 220;
  const cellH = 160;
  const cols = 5;
  const take = rows.slice(0, 100);
  const composites = [];
  for (let i = 0; i < take.length; i += 1) {
    const row = take[i];
    const x = (i % cols) * cellW;
    const y = Math.floor(i / cols) * cellH;
    let preview;
    try {
      preview = await sharp(row.fullPath, { animated: false })
        .resize(150, 90, { fit: "inside", background: "#fff" })
        .flatten({ background: "#fff" })
        .png()
        .toBuffer();
    } catch {
      preview = Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"90\"><rect width=\"150\" height=\"90\" fill=\"#fee\"/><text x=\"8\" y=\"45\" font-size=\"12\">unreadable</text></svg>");
    }
    const label = esc(row.filename).slice(0, 30);
    const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cellW}" height="${cellH}"><rect width="${cellW}" height="${cellH}" fill="#fafafa" stroke="#ddd"/><text x="8" y="118" font-size="12" font-family="Arial">${label}</text><text x="8" y="136" font-size="11" font-family="Arial" fill="#555">${esc(`${row.width || "?"}x${row.height || "?"}`)}</text></svg>`);
    composites.push({ input: frame, left: x, top: y }, { input: preview, left: x + 35, top: y + 14 });
  }
  const height = Math.max(cellH, Math.ceil(take.length / cols) * cellH);
  const sheetPath = path.join(sheetDir, `${name}.png`);
  await sharp({ create: { width: cols * cellW, height, channels: 4, background: "#fff" } })
    .composite(composites)
    .png()
    .toFile(sheetPath);
  return sheetPath;
}

const dbRefs = loadDbRefs();
const rows = [];
for (const file of rootImages()) {
  rows.push(await classify(file, dbRefs));
}
const movable = rows.filter((row) => row.destination);
if (shouldMove) {
  for (const row of movable) moveFile(row);
}
const contactSheets = shouldContactSheets ? {
  junk: await createContactSheet("junk-business-candidates", rows.filter((row) => ["junk", "junk-review", "corrupt-business-review"].includes(row.bucket))),
  portrait_content: await createContactSheet("portrait-content-candidates", rows.filter((row) => row.bucket === "portrait-content-candidate")),
} : {};

const summary = {
  generated_at: new Date().toISOString(),
  dump_path: dumpPath || null,
  moved: shouldMove,
  loose_root_images_checked: rows.length,
  protected_review_only: rows.filter((row) => row.bucket === "protected-review-only").length,
  business_candidate_keep: rows.filter((row) => row.bucket === "business-candidate-keep").length,
  portrait_content_candidates: rows.filter((row) => row.bucket === "portrait-content-candidate").length,
  corrupt_business_review: rows.filter((row) => row.bucket === "corrupt-business-review").length,
  junk: rows.filter((row) => row.bucket === "junk").length,
  junk_review: rows.filter((row) => row.bucket === "junk-review").length,
  movable: movable.length,
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `business-image-candidate-audit-${stamp}.json`);
const htmlPath = path.join(outDir, `business-image-candidate-audit-${stamp}.html`);
const csvPath = path.join(outDir, `business-image-candidate-audit-${stamp}.csv`);

writeFileSync(jsonPath, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
writeFileSync(csvPath, [
  "filename,bucket,width,height,size,destination,reason",
  ...rows.map((row) => [row.filename, row.bucket, row.width, row.height, row.size, row.destination, row.reason].map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")),
].join("\n"));
writeFileSync(htmlPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>Business Image Candidate Audit</title><style>
body{font-family:Arial,sans-serif;margin:24px;color:#17313a}h1,h2{color:#006c67}.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}.metric{border:1px solid #c8dedb;border-radius:8px;padding:12px;background:#f7fffd}.metric strong{display:block;font-size:24px;color:#8c2d4d}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #d8e4e2;padding:7px;vertical-align:top}th{position:sticky;top:0;background:#e9f5f3}img{max-width:150px;max-height:90px;object-fit:contain;background:#f8f8f8}.scroll{max-height:80vh;overflow:auto;margin-bottom:32px}
</style></head><body><h1>Business Image Candidate Audit</h1><div class="metrics">${Object.entries(summary).filter(([, value]) => typeof value === "number" || typeof value === "boolean").map(([key, value]) => `<div class="metric"><span>${esc(key.replace(/_/g, " "))}</span><strong>${esc(value)}</strong></div>`).join("")}</div>
<h2>Movable</h2><div class="scroll">${htmlTable(movable)}</div>
<h2>Kept Business Candidates</h2><div class="scroll">${htmlTable(rows.filter((row) => row.bucket === "business-candidate-keep").slice(0, 700))}</div>
<h2>Protected Review Only</h2><div class="scroll">${htmlTable(rows.filter((row) => row.bucket === "protected-review-only").slice(0, 700))}</div>
</body></html>`);

console.log(JSON.stringify({ summary, jsonPath, htmlPath, csvPath, contactSheets }, null, 2));
