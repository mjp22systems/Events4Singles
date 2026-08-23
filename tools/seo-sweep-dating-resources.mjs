import fs from "node:fs";

const baseUrl = process.argv[2] || "http://localhost:10400";
const source = fs.readFileSync("src/content/articles.ts", "utf8");
const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const paths = ["/dating-resources", ...slugs.map((slug) => `/dating-resources/${slug}`)];

function textBetween(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function countMatches(html, pattern) {
  return (html.match(pattern) || []).length;
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#x27;|&amp;|&quot;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function gradePage(path, html, status) {
  const title = textBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = textBetween(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = textBetween(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const h1Count = countMatches(html, /<h1\b/gi);
  const h2Count = countMatches(html, /<h2\b/gi);
  const hasArticleSchema = html.includes('"@type":"Article"') || html.includes('"@type": "Article"');
  const hasBreadcrumbSchema = html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"');
  const body = textBetween(html, /<div[^>]+class="[^"]*e4s-article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const wordCount = body ? stripHtml(body).split(/\s+/).filter(Boolean).length : 0;
  const internalLinks = countMatches(html, /href="\/(?!\/)/gi);
  const externalLinks = countMatches(html, /href="https?:\/\//gi);
  const issues = [];

  if (status !== 200) issues.push(`status ${status}`);
  if (title.length < 25 || title.length > 75) issues.push(`title length ${title.length}`);
  if (description.length < 70 || description.length > 160) issues.push(`description length ${description.length}`);
  if (!canonical) issues.push("missing canonical");
  if (h1Count !== 1) issues.push(`h1 count ${h1Count}`);
  if (path !== "/dating-resources" && h2Count < 3) issues.push(`low h2 count ${h2Count}`);
  if (path !== "/dating-resources" && wordCount < 180) issues.push(`thin body ${wordCount} words`);
  if (path !== "/dating-resources" && !hasArticleSchema) issues.push("missing Article schema");
  if (path !== "/dating-resources" && !hasBreadcrumbSchema) issues.push("missing Breadcrumb schema");
  if (internalLinks < 3) issues.push(`low internal links ${internalLinks}`);
  if (path !== "/dating-resources" && externalLinks < 2) issues.push(`low external/source links ${externalLinks}`);

  return {
    path,
    status,
    titleLength: title.length,
    descriptionLength: description.length,
    h1Count,
    h2Count,
    wordCount,
    internalLinks,
    externalLinks,
    canonical: Boolean(canonical),
    articleSchema: hasArticleSchema,
    breadcrumbSchema: hasBreadcrumbSchema,
    issues,
  };
}

const results = [];

for (const path of paths) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  results.push(gradePage(path, html, response.status));
}

const issueRows = results.filter((result) => result.issues.length);

console.log(`Dating resources SEO sweep: ${results.length} pages checked against ${baseUrl}`);
console.table(
  results.map((result) => ({
    path: result.path,
    status: result.status,
    title: result.titleLength,
    desc: result.descriptionLength,
    h1: result.h1Count,
    h2: result.h2Count,
    words: result.wordCount,
    internal: result.internalLinks,
    external: result.externalLinks,
    schema: result.articleSchema ? "yes" : result.path === "/dating-resources" ? "n/a" : "no",
    issues: result.issues.length,
  })),
);

if (issueRows.length) {
  console.log("\nIssues:");
  for (const row of issueRows) {
    console.log(`- ${row.path}: ${row.issues.join("; ")}`);
  }
  process.exitCode = 1;
} else {
  console.log("\nNo SEO sweep issues found.");
}
