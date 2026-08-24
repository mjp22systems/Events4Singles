import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const listingCardFile = path.join(projectRoot, "src", "components", "listing-card.tsx");
const homePageFile = path.join(projectRoot, "src", "app", "(public)", "page.tsx");
const listingPageFile = path.join(projectRoot, "src", "app", "(public)", "listing", "[slug]", "page.tsx");
const listingsPageFile = path.join(projectRoot, "src", "app", "(public)", "listings", "page.tsx");
const featuredListingsPageFile = path.join(projectRoot, "src", "app", "(public)", "featured-listings", "page.tsx");
const dataFile = path.join(projectRoot, "src", "lib", "data.ts");
const adminCssFile = path.join(projectRoot, "public", "admin.css");
const publicLayoutFile = path.join(projectRoot, "src", "app", "(public)", "layout.tsx");
const publicRouteResetFile = path.join(projectRoot, "src", "components", "public-route-state-reset.tsx");
const homeFeaturedFile = path.join(projectRoot, "src", "components", "home-featured.tsx");
const adminEditDrawerFile = path.join(projectRoot, "src", "components", "admin-edit-drawer.tsx");
const profileEditDrawerFile = path.join(projectRoot, "src", "components", "profile-edit-drawer.tsx");

test("listing cards route claimed business records to the profile page", () => {
  const source = readFileSync(listingCardFile, "utf8");

  assert.match(source, /toProfileSlug/);
  assert.match(source, /listing\.business_id\s*\?/);
  assert.match(source, /\/profile\/\$\{toProfileSlug/);
  assert.match(source, /View profile/);
  assert.match(source, /Contact Name Not Listed/);
  assert.match(source, /Phone Not Listed/);
  assert.match(source, /Email Not Listed/);
  assert.match(source, /Website Not Listed/);
  assert.match(source, /Address Not Listed/);
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
  const featuredListingsSource = readFileSync(featuredListingsPageFile, "utf8");
  const homeFeaturedSource = readFileSync(homeFeaturedFile, "utf8");
  const dataSource = readFileSync(dataFile, "utf8");

  assert.match(homeSource, /href="\/featured-listings"/);
  assert.match(listingsSource, /redirect\(query\.toString\(\) \? `\/featured-listings/);
  assert.match(dataSource, /export async function getAllFeaturedListings/);
  assert.match(featuredListingsSource, /getAllFeaturedListings/);
  assert.match(featuredListingsSource, /e4s-page-hero/);
  assert.match(featuredListingsSource, /PageSidebar/);
  assert.match(featuredListingsSource, /mode="featured"/);
  assert.match(featuredListingsSource, /categoryFacets/);
  assert.match(featuredListingsSource, /cityFacets/);
  assert.match(featuredListingsSource, /AdvertiseCard/);
  assert.doesNotMatch(featuredListingsSource, /showFeatureSlot=\{false\}/);
  assert.doesNotMatch(homeFeaturedSource, /Refine Listings/);
});

test("listing detail pages stay accessible but are not indexed", () => {
  const source = readFileSync(listingPageFile, "utf8");

  assert.match(source, /robots:\s*\{/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*true/);
});

test("public admin edit styles do not leak after route changes", () => {
  const adminCss = readFileSync(adminCssFile, "utf8");
  const publicLayout = readFileSync(publicLayoutFile, "utf8");
  const routeReset = readFileSync(publicRouteResetFile, "utf8");

  assert.match(adminCss, /body:has\(\.e4s-header\)\.e4s-fixed-header/);
  assert.match(adminCss, /body:has\(\.e4s-admin-bar\) \.e4s-header/);
  assert.match(adminCss, /background: var\(--e4s-page-bg/);
  assert.doesNotMatch(adminCss, /body:has\(\.e4s-header\)\.e4s-fixed-header\s*\{[^}]*background:\s*#ffffff/s);
  assert.doesNotMatch(adminCss, /^\.e4s-header\s*\{/m);
  assert.match(publicLayout, /<PublicRouteStateReset \/>/);
  assert.match(routeReset, /usePathname/);
  assert.match(routeReset, /classList\.remove\("drawer-open"\)/);
});

test("public edit drawers keep profile and listing fields distinct", () => {
  const listingDrawer = readFileSync(adminEditDrawerFile, "utf8");
  const profileDrawer = readFileSync(profileEditDrawerFile, "utf8");

  assert.match(listingDrawer, /Listing Title/);
  assert.match(listingDrawer, /Contact Name/);
  assert.match(listingDrawer, /Social Media/);
  assert.doesNotMatch(listingDrawer, /Business name \(shown as heading/);
  assert.doesNotMatch(listingDrawer, /confidence_score/);
  assert.doesNotMatch(listingDrawer, /Confidence score/);

  assert.match(profileDrawer, /Business Name/);
  assert.match(profileDrawer, /Profile Contact/);
  assert.match(profileDrawer, /Facebook URL/);
});
