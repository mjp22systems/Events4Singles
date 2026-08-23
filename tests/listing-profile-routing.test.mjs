import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const listingCardFile = path.join(projectRoot, "src", "components", "listing-card.tsx");
const listingPageFile = path.join(projectRoot, "src", "app", "(public)", "listing", "[slug]", "page.tsx");

test("listing cards route claimed business records to the profile page", () => {
  const source = readFileSync(listingCardFile, "utf8");

  assert.match(source, /toProfileSlug/);
  assert.match(source, /listing\.business_id\s*\?/);
  assert.match(source, /\/profile\/\$\{toProfileSlug/);
  assert.match(source, /View profile/);
});

test("listing detail pages stay accessible but are not indexed", () => {
  const source = readFileSync(listingPageFile, "utf8");

  assert.match(source, /robots:\s*\{/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*true/);
});
