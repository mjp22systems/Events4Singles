import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const useRemote = process.argv.includes("--remote");
const wrangler = path.join(projectRoot, "node_modules", ".bin", process.platform === "win32" ? "wrangler.cmd" : "wrangler");

const sql = "SELECT bn.id, bn.business_id, bn.image_url, COALESCE(NULLIF(bn.link_url, ''), NULLIF(bn.click_url, '')) AS stored_click_url, bn.alt_text, bn.title, bn.page_scope, bn.category_slug, bn.city_slug, bn.slot_position, COALESCE(bn.is_active, 1) AS is_active, b.id AS matched_business_id, b.name AS business_name, b.profile_slug AS business_profile_slug, c.slug AS matched_category_slug, ci.slug AS matched_city_slug FROM banners bn LEFT JOIN businesses b ON b.id = bn.business_id LEFT JOIN categories c ON c.slug = bn.category_slug LEFT JOIN cities ci ON ci.slug = bn.city_slug WHERE COALESCE(bn.is_active, 1) = 1 ORDER BY COALESCE(bn.page_scope, ''), COALESCE(bn.category_slug, ''), COALESCE(bn.city_slug, ''), COALESCE(bn.slot_position, 999), bn.id";

if (useRemote && !process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_API_TOKEN_DAD) {
  process.env.CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN_DAD;
}

function runQuery() {
  const args = ["d1", "execute", "events4singles", "--command", sql, "--json"];
  if (useRemote) args.splice(3, 0, "--remote");
  const command = [wrangler, ...args].map((arg) => `"${String(arg).replace(/"/g, '\\"')}"`).join(" ");
  const output = execSync(command, {
    cwd: projectRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED || "0",
    },
  });
  const parsed = JSON.parse(output);
  return parsed.flatMap((chunk) => chunk.results || []);
}

function localPublicPath(url) {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return null;
  return path.join(projectRoot, "public", url.replace(/^\/+/, ""));
}

const rows = runQuery();
const issues = [];
const scopeCounts = new Map();

for (const row of rows) {
  const scopeKey = [
    row.page_scope || "(blank)",
    row.category_slug || "",
    row.city_slug || "",
  ].join(" / ");
  const count = scopeCounts.get(scopeKey) || { total: 0, linked: 0 };
  count.total += 1;
  if (row.business_id) count.linked += 1;
  scopeCounts.set(scopeKey, count);

  const imagePath = localPublicPath(row.image_url);
  const rowIssues = [];

  if (!row.business_id) rowIssues.push("no business_id");
  if (row.business_id && !row.matched_business_id) rowIssues.push("business_id does not match an active business row");
  if (!row.image_url) rowIssues.push("missing image_url");
  if (imagePath && !existsSync(imagePath)) rowIssues.push("local image missing from public/");
  if (row.page_scope === "category" && !row.category_slug) rowIssues.push("category scope without category_slug");
  if (row.page_scope === "city" && !row.city_slug) rowIssues.push("city scope without city_slug");
  if (row.category_slug && !row.matched_category_slug) rowIssues.push("category_slug does not match categories");
  if (row.city_slug && !row.matched_city_slug) rowIssues.push("city_slug does not match cities");
  if (!row.page_scope && !row.category_slug && !row.city_slug) rowIssues.push("global/broad scope");

  if (rowIssues.length) {
    issues.push({
      id: row.id,
      title: row.title || row.alt_text || row.business_name || "(untitled)",
      scope: scopeKey,
      image_url: row.image_url,
      stored_click_url: row.stored_click_url,
      issues: rowIssues,
    });
  }
}

console.log(`Banner tile audit (${useRemote ? "remote" : "local"})`);
console.log(`Active banners: ${rows.length}`);
console.log(`Linked to businesses: ${rows.filter((row) => row.business_id).length}`);
console.log(`Needs cleanup: ${issues.length}`);
console.log("");
console.log("Scopes:");
for (const [scope, count] of scopeCounts) {
  console.log(`- ${scope}: ${count.total} total, ${count.linked} linked`);
}

if (issues.length) {
  console.log("");
  console.log("Issues:");
  for (const issue of issues) {
    console.log(`- #${issue.id} ${issue.title}`);
    console.log(`  scope: ${issue.scope}`);
    console.log(`  issues: ${issue.issues.join(", ")}`);
    if (issue.image_url) console.log(`  image: ${issue.image_url}`);
    if (issue.stored_click_url) console.log(`  stored URL: ${issue.stored_click_url}`);
  }
}
