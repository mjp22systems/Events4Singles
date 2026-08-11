/**
 * Seed banners table from legacy HTML files.
 * Run from: D:\Projects\Clients\Dad\Events4singles\new
 * Usage: node scripts/seed-banners.js
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const LEGACY_DIR = path.resolve(__dirname, '../../legacy/site-clean');
const DB_PATH = path.resolve(__dirname, '../../listings.db');

// Category pages: filename → category_slug (must match categories.slug in DB)
const CATEGORY_MAP = [
  [/speed_dating/, 'speed_dating'],
  [/dinner_for_six/, 'dinner_for_six'],
  [/dinner_parties/, 'dinner_parties'],
  [/dance_class/, 'dance_classes'],
  [/social_clubs?/, 'social_clubs'],
  [/life_coaches?/, 'life_coaches'],
  [/adventure_for_singles/, 'adventure_for_singles'],
];

// City pages: filename → city_slug (must match cities.slug in DB)
const CITY_FILE_MAP = [
  [/events_sydney/, 'sydney'],
  [/events_melbourne/, 'melbourne'],
  [/events_brisbane/, 'brisbane'],
  [/events_perth/, 'perth'],
  [/events_adelaide/, 'adelaide'],
  [/events_gold_coast/, 'gold_coast'],
  [/events_canberra/, 'canberra'],
  [/events_cairns/, 'cairns'],
  [/events_darwin/, 'darwin'],
  [/events_hobart/, 'hobart'],
  [/events_geelong/, 'geelong'],
  [/events_newcastle/, 'newcastle'],
  [/events_sunshine_coast/, 'sunshine_coast'],
  [/events_central_coast/, 'centralcoast'],
  [/events_toowoomba/, 'toowoomba'],
  [/events_wollongong/, 'wollongong'],
];

// City suffix in category filenames
const CITY_SUFFIX_MAP = [
  [/_sydney/, 'sydney'],
  [/_melbourne/, 'melbourne'],
  [/_brisbane/, 'brisbane'],
  [/_perth/, 'perth'],
  [/_adelaide/, 'adelaide'],
  [/_gold_coast|_goldcoast/, 'gold_coast'],
  [/_canberra/, 'canberra'],
];

function detectCategorySlug(filename) {
  const f = filename.toLowerCase();
  for (const [re, slug] of CATEGORY_MAP) {
    if (re.test(f)) return slug;
  }
  return null;
}

function detectCitySuffixSlug(filename) {
  const f = filename.toLowerCase();
  for (const [re, slug] of CITY_SUFFIX_MAP) {
    if (re.test(f)) return slug;
  }
  return null;
}

function detectCityPageSlug(filename) {
  const f = filename.toLowerCase();
  for (const [re, slug] of CITY_FILE_MAP) {
    if (re.test(f)) return slug;
  }
  return null;
}

function extractBanners(html) {
  const sectionMatch = html.match(/class="e4s-promo-banners">([\s\S]*?)<\/section>/);
  if (!sectionMatch) return [];

  const section = sectionMatch[1];
  const banners = [];

  const linkRe = /<a(?![^>]*placeholder)[^>]+href="([^"]+)"[^>]*>\s*<img[^>]+alt="([^"]*)"[^>]+src="([^"]+)"/g;
  let m;
  while ((m = linkRe.exec(section)) !== null) {
    const [, href, alt, src] = m;
    if (src.includes('advertise-here')) continue;
    banners.push({ click_url: href, alt_text: alt, image_url: src.replace('images/', '/images/') });
  }

  return banners;
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Clear existing banners to reseed cleanly
db.prepare('DELETE FROM banners').run();
console.log('Cleared existing banners.\n');

const insert = db.prepare(`
  INSERT INTO banners (image_url, click_url, alt_text, page_scope, category_slug, city_slug, slot_position, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1)
`);

const insertMany = db.transaction((rows) => {
  for (const row of rows) {
    insert.run(row.image_url, row.click_url, row.alt_text, row.scope, row.category_slug, row.city_slug, row.slot_position);
  }
});

const seenBanners = new Set();
let total = 0;

const files = fs.readdirSync(LEGACY_DIR).filter(f => f.endsWith('.htm'));

for (const file of files) {
  const html = fs.readFileSync(path.join(LEGACY_DIR, file), 'utf8');
  const banners = extractBanners(html);
  if (banners.length === 0) continue;

  // ── City overview pages (events_*.htm) ───────────────────────────────────
  const cityPageSlug = detectCityPageSlug(file);
  if (cityPageSlug) {
    const rows = [];
    banners.forEach((b, i) => {
      const key = `city|${b.image_url}|${cityPageSlug}`;
      if (seenBanners.has(key)) return;
      seenBanners.add(key);
      rows.push({ ...b, scope: 'city', category_slug: null, city_slug: cityPageSlug, slot_position: i + 1 });
    });
    if (rows.length) { insertMany(rows); total += rows.length; }
    console.log(`${file}: ${rows.length} city banners → city=${cityPageSlug}`);
    continue;
  }

  // ── Category pages ────────────────────────────────────────────────────────
  const category_slug = detectCategorySlug(file);
  if (!category_slug) continue;

  const city_slug = detectCitySuffixSlug(file);
  const scope = city_slug ? 'category+city' : 'category';
  const rows = [];

  banners.forEach((b, i) => {
    const key = `cat|${b.image_url}|${category_slug}|${city_slug ?? ''}`;
    if (seenBanners.has(key)) return;
    seenBanners.add(key);
    rows.push({ ...b, scope, category_slug, city_slug: city_slug ?? null, slot_position: i + 1 });
  });

  if (rows.length) { insertMany(rows); total += rows.length; }
  console.log(`${file}: ${rows.length} banners → cat=${category_slug} city=${city_slug ?? 'none'}`);
}

console.log(`\nDone. ${total} banners inserted.`);

const summary = db.prepare(`
  SELECT page_scope, category_slug, city_slug, COUNT(*) as n
  FROM banners WHERE is_active=1
  GROUP BY page_scope, category_slug, city_slug
  ORDER BY page_scope, city_slug, category_slug
`).all();
console.table(summary);
