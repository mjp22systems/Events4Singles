import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const migrationFile = path.join(projectRoot, "migrations", "0020_dating_resource_redirects.sql");
const articlesFile = path.join(projectRoot, "src", "content", "articles.ts");
const nextConfigFile = path.join(projectRoot, "next.config.ts");
const publicRedirectsFile = path.join(projectRoot, "public", "_redirects");

const expectedRedirects = new Map([
  ["/Dating.htm", "/dating-resources/dating-advice"],
  ["/dating", "/dating-resources/dating-advice"],
  ["/dating_tips.htm", "/dating-resources/dating-advice"],
  ["/dating-tips", "/dating-resources/dating-advice"],
  ["/dating_tips_men.htm", "/dating-resources/dating-tips-for-men"],
  ["/dating-tips-men", "/dating-resources/dating-tips-for-men"],
  ["/date_safe.htm", "/dating-resources/dating-safety-checklist"],
  ["/date-safe", "/dating-resources/dating-safety-checklist"],
  ["/body_language.htm", "/dating-resources/body-language"],
  ["/body-language", "/dating-resources/body-language"],
  ["/Going_out_on_a_date.htm", "/dating-resources/first-date-conversation-guide"],
  ["/going-out-on-a-date", "/dating-resources/first-date-conversation-guide"],
  ["/What_to_take_on_a_date.htm", "/dating-resources/first-date-conversation-guide"],
  ["/what-to-take-on-a-date", "/dating-resources/first-date-conversation-guide"],
  ["/flirting.htm", "/dating-resources/flirting"],
  ["/flirting", "/dating-resources/flirting"],
  ["/flirting_2.htm", "/dating-resources/flirting"],
  ["/flirting-2", "/dating-resources/flirting"],
  ["/romance.htm", "/dating-resources/finding-romance-after-40"],
  ["/romance", "/dating-resources/finding-romance-after-40"],
  ["/Commitment.htm", "/dating-resources/healthy-relationship-green-flags"],
  ["/commitment", "/dating-resources/healthy-relationship-green-flags"],
  ["/soulmate-success.htm", "/dating-resources/healthy-relationship-green-flags"],
  ["/soulmate-success", "/dating-resources/healthy-relationship-green-flags"],
  ["/spiritual_path.htm", "/dating-resources/wellbeing-and-the-single-life"],
  ["/spiritual-path", "/dating-resources/wellbeing-and-the-single-life"],
  ["/psychology.htm", "/dating-resources/wellbeing-and-the-single-life"],
  ["/psychology", "/dating-resources/wellbeing-and-the-single-life"],
  ["/healing_and_happiness.htm", "/dating-resources/wellbeing-and-the-single-life"],
  ["/healing-and-happiness", "/dating-resources/wellbeing-and-the-single-life"],
  ["/dating_resources_books.htm", "/dating-resources/dating-resource-books"],
  ["/dating-resources-books", "/dating-resources/dating-resource-books"],
  ["/dating_resources_websites.htm", "/dating-resources/dating-resource-websites"],
  ["/dating-resources-websites", "/dating-resources/dating-resource-websites"],
  ["/tips_and_links.htm", "/dating-resources"],
  ["/tips-and-links", "/dating-resources"],
  ["/date_jokes.htm", "/dating-resources"],
  ["/date-jokes", "/dating-resources"],
  ["/advice", "/dating-resources"],
  ["/advice/dating-advice", "/dating-resources/dating-advice"],
  ["/advice/dating-tips", "/dating-resources/dating-advice"],
  ["/advice/dating-mistakes-men-make", "/dating-resources/dating-tips-for-men"],
  ["/advice/date-safely", "/dating-resources/dating-safety-checklist"],
  ["/advice/body-language-and-dating", "/dating-resources/body-language"],
  ["/advice/going-out-on-a-date", "/dating-resources/first-date-conversation-guide"],
  ["/advice/what-to-take-on-a-date", "/dating-resources/first-date-conversation-guide"],
  ["/advice/flirting-guide", "/dating-resources/flirting"],
  ["/advice/flirting-tips", "/dating-resources/flirting"],
  ["/advice/romance-guide", "/dating-resources/finding-romance-after-40"],
  ["/advice/commitment-and-relationships", "/dating-resources/healthy-relationship-green-flags"],
  ["/advice/soulmate-success", "/dating-resources/healthy-relationship-green-flags"],
  ["/advice/spiritual-path", "/dating-resources/wellbeing-and-the-single-life"],
  ["/advice/psychology-and-dating", "/dating-resources/wellbeing-and-the-single-life"],
  ["/advice/healing-and-happiness", "/dating-resources/wellbeing-and-the-single-life"],
  ["/advice/dating-resource-books", "/dating-resources/dating-resource-books"],
  ["/advice/dating-resource-websites", "/dating-resources/dating-resource-websites"],
  ["/advice/dating-tips-and-links", "/dating-resources"],
]);

const expectedStaticRedirects = new Map([
  ["/dating_resources_books.htm", "/dating-resources/dating-resource-books"],
  ["/dating_resources_websites.htm", "/dating-resources/dating-resource-websites"],
  ["/dating_tips.htm", "/dating-resources/dating-advice"],
  ["/dating_tips_men.htm", "/dating-resources/dating-tips-for-men"],
  ["/date_safe.htm", "/dating-resources/dating-safety-checklist"],
  ["/body_language.htm", "/dating-resources/body-language"],
  ["/flirting.htm", "/dating-resources/flirting"],
  ["/flirting_2.htm", "/dating-resources/flirting"],
  ["/romance.htm", "/dating-resources/finding-romance-after-40"],
  ["/psychology.htm", "/dating-resources/wellbeing-and-the-single-life"],
  ["/healing_and_happiness.htm", "/dating-resources/wellbeing-and-the-single-life"],
]);

function parseRedirectRows(sql) {
  return new Map(
    [...sql.matchAll(/\('([^']+)',\s*'([^']+)',\s*'article',\s*'dating-resources'\)/g)].map((match) => [
      match[1],
      match[2],
    ]),
  );
}

test("dating resources redirect migration covers legacy article paths", () => {
  const sql = readFileSync(migrationFile, "utf8");
  const actualRedirects = parseRedirectRows(sql);

  assert.deepEqual(actualRedirects, expectedRedirects);
});

test("dating resources redirect targets exist", () => {
  const articleSource = readFileSync(articlesFile, "utf8");
  const slugs = new Set([...articleSource.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]));

  for (const target of expectedRedirects.values()) {
    if (target === "/dating-resources") continue;
    const slug = target.replace("/dating-resources/", "");
    assert.ok(slugs.has(slug), `${target} should point to an existing dating resource article`);
  }
});

test("static dating resource redirects point to the rebuilt article pages", () => {
  const nextConfig = readFileSync(nextConfigFile, "utf8");
  const publicRedirects = readFileSync(publicRedirectsFile, "utf8");

  for (const [source, destination] of expectedStaticRedirects) {
    const sourcePattern = new RegExp(`source:\\s*"${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
    const destinationPattern = new RegExp(`destination:\\s*"${destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
    const sourceIndex = nextConfig.search(sourcePattern);

    assert.notEqual(sourceIndex, -1, `Missing static redirect source ${source}`);
    assert.match(
      nextConfig.slice(sourceIndex, sourceIndex + 180),
      destinationPattern,
      `${source} should redirect directly to ${destination}`,
    );

    const publicRedirectPattern = new RegExp(
      `^${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+${destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+301$`,
      "m",
    );
    assert.match(publicRedirects, publicRedirectPattern, `public/_redirects should send ${source} to ${destination}`);
  }
});
