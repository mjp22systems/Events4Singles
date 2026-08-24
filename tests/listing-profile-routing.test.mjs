import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const listingCardFile = path.join(projectRoot, "src", "components", "listing-card.tsx");
const homePageFile = path.join(projectRoot, "src", "app", "(public)", "page.tsx");
const listingPageFile = path.join(projectRoot, "src", "app", "(public)", "listing", "[slug]", "page.tsx");
const listingsPageFile = path.join(projectRoot, "src", "app", "(public)", "listings", "page.tsx");
const dataFile = path.join(projectRoot, "src", "lib", "data.ts");

test("listing cards route claimed business records to the profile page", () => {
  const source = readFileSync(listingCardFile, "utf8");

  assert.match(source, /toProfileSlug/);
  assert.match(source, /listing\.business_id\s*\?/);
  assert.match(source, /\/profile\/\$\{toProfileSlug/);
  assert.match(source, /View profile/);
});

test("homepage featured listings include business ids and only use paid tiers", () => {
  const source = readFileSync(dataFile, "utf8");

  const featuredQuery = source.slice(
    source.indexOf("export async function getFeaturedListings"),
    source.indexOf("export async function getAllFeaturedListings")
  );

  assert.match(featuredQuery, /l\.business_id/);
  assert.match(featuredQuery, /l\.listing_type IN \('featured', 'premium'\)/);
  assert.match(featuredQuery, /ORDER BY RANDOM\(\)/);
  assert.doesNotMatch(featuredQuery, /l\.confidence_score >= 80/);
});

test("featured listings directory is wired as the homepage view-all target", () => {
  const homeSource = readFileSync(homePageFile, "utf8");
  const listingsSource = readFileSync(listingsPageFile, "utf8");
  const dataSource = readFileSync(dataFile, "utf8");

  assert.match(homeSource, /href="\/listings"/);
  assert.match(dataSource, /export async function getAllFeaturedListings/);
  assert.match(dataSource, /export async function getFeaturedListingCategories/);
  assert.match(dataSource, /export async function getFeaturedListingCities/);
  assert.match(listingsSource, /getAllFeaturedListings/);
  assert.match(listingsSource, /e4s-page-hero/);
  assert.match(listingsSource, /PageSidebar/);
  assert.match(listingsSource, /mode="featured"/);
  assert.match(listingsSource, /AdvertiseCard/);
  assert.doesNotMatch(listingsSource, /showFeatureSlot=\{false\}/);
});

test("listing detail pages stay accessible but are not indexed", () => {
  const source = readFileSync(listingPageFile, "utf8");

  assert.match(source, /robots:\s*\{/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*true/);
});
