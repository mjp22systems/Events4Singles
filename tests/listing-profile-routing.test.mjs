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
const promoBannersFile = path.join(projectRoot, "src", "components", "promo-banners.tsx");
const onlineCardFile = path.join(projectRoot, "src", "components", "online-card.tsx");
const pageSidebarFile = path.join(projectRoot, "src", "components", "page-sidebar.tsx");
const adminCssFile = path.join(projectRoot, "public", "admin.css");
const publicLayoutFile = path.join(projectRoot, "src", "app", "(public)", "layout.tsx");
const publicRouteResetFile = path.join(projectRoot, "src", "components", "public-route-state-reset.tsx");
const homeFeaturedFile = path.join(projectRoot, "src", "components", "home-featured.tsx");
const sidebarNavFile = path.join(projectRoot, "src", "components", "sidebar-nav.tsx");
const adminEditDrawerFile = path.join(projectRoot, "src", "components", "admin-edit-drawer.tsx");
const profileEditDrawerFile = path.join(projectRoot, "src", "components", "profile-edit-drawer.tsx");

test("listing cards route claimed business records to the profile page", () => {
  const source = readFileSync(listingCardFile, "utf8");

  assert.match(source, /toProfileSlug/);
  assert.match(source, /listing\.business_id\s*\?/);
  assert.match(source, /\/profile\/\$\{toProfileSlug/);
  assert.match(source, /View Profile/);
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
  assert.match(featuredQuery, /CASE l\.listing_type WHEN 'premium' THEN 0 WHEN 'featured' THEN 1 ELSE 2 END/);
  assert.match(featuredQuery, /l\.confidence_score DESC/);
  assert.match(featuredQuery, /COALESCE\(b\.name, l\.title\) COLLATE NOCASE ASC/);
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
  assert.match(homeFeaturedSource, /Featured Business Spot/);
});

test("promotional tiles preserve business ownership for profile surfaces", () => {
  const source = readFileSync(dataFile, "utf8");

  assert.match(source, /function normalizeBanners/);
  assert.match(source, /toProfileSlug\(banner\.business_id/);
  assert.match(source, /click_url:\s*profileHref \|\| "\/advertise"/);
  assert.match(source, /business_id = \? OR account_id IN/);
  assert.match(source, /LEFT JOIN businesses b ON b\.id = bn\.business_id/);
});

test("online dating listings stay online-only on public category routes", () => {
  const source = readFileSync(dataFile, "utf8");
  const citiesForCategory = source.slice(
    source.indexOf("export async function getCitiesForCategory"),
    source.indexOf("export async function getListingsForCity"),
  );
  const listingsForCategory = source.slice(
    source.indexOf("export async function getListingsForCategory"),
    source.indexOf("export async function getListingsForPage"),
  );

  assert.match(source, /const ONLINE_DATING_CATEGORY = "online_dating"/);
  assert.match(source, /function listingTypeClauseForCategory/);
  assert.match(listingsForCategory, /listingTypeClauseForCategory\(categoryDbSlug\)/);
  assert.match(source, /categoryDbSlug === ONLINE_DATING_CATEGORY[\s\S]*l\.listing_type = 'online'/);
  assert.match(source, /COALESCE\(l\.listing_type, ''\) != 'online'/);
  assert.match(citiesForCategory, /if \(categoryDbSlug === ONLINE_DATING_CATEGORY\) return \[\]/);
});

test("online cards render as flat profile-first rows without listing images", () => {
  const source = readFileSync(onlineCardFile, "utf8");
  const css = readFileSync(path.join(projectRoot, "public", "site.css"), "utf8");
  const typography = readFileSync(path.join(projectRoot, "public", "typography.css"), "utf8");
  const sidebar = readFileSync(pageSidebarFile, "utf8");

  assert.match(source, /toProfileSlug/);
  assert.match(source, /View Profile/);
  assert.match(source, /Visit Site/);
  assert.doesNotMatch(source, /listing\.image_url/);
  assert.doesNotMatch(source, /e4s-online-card__logo/);
  assert.doesNotMatch(source, /e4s-online-card__domain/);
  assert.doesNotMatch(css, /e4s-online-card__logo/);
  assert.doesNotMatch(typography, /e4s-online-card__domain/);
  assert.match(sidebar, /\(items\.length > 0 \|\| topItem\)/);
  assert.match(sidebar, /emptySidebarHeading/);
  assert.match(css, /e4s-sidebar-block--empty/);
  assert.match(css, /e4s-sidebar:has\(\.e4s-sidebar-block--empty\) \.e4s-sidebar-ad/);
});

test("promo banner rows always complete one or two full rows", () => {
  const source = readFileSync(promoBannersFile, "utf8");

  assert.match(source, /const SLOTS_PER_ROW = 6/);
  assert.match(source, /const MAX_SLOTS = SLOTS_PER_ROW \* 2/);
  assert.match(source, /rowTarget - visibleBanners\.length/);
  assert.doesNotMatch(source, /ADVERTISE_PLACEHOLDERS/);
  assert.doesNotMatch(source, /slotCount = banners\.length >= MAX_SLOTS \? MAX_SLOTS : SLOTS_PER_ROW/);
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

test("business directory dedupes public names and profiles expose directory pager", () => {
  const dataSource = readFileSync(dataFile, "utf8");
  const profileSource = readFileSync(path.join(projectRoot, "src", "app", "(public)", "profile", "[id]", "page.tsx"), "utf8");

  assert.match(dataSource, /ROW_NUMBER\(\) OVER \(\s*PARTITION BY lower\(trim\(b\.name\)\)/);
  assert.match(dataSource, /WHERE duplicate_rank = 1/);
  assert.match(dataSource, /export async function getBusinessDirectoryPager/);
  assert.match(dataSource, /directoryPager: BusinessDirectoryPager/);

  assert.match(profileSource, /directoryPager\.previous/);
  assert.match(profileSource, /Previous business/);
  assert.match(profileSource, /directoryPager\.next/);
  assert.match(profileSource, /Next business/);
});

test("sidebar refine links update in place without resetting scroll", () => {
  const source = readFileSync(sidebarNavFile, "utf8");

  assert.match(source, /useRouter/);
  assert.match(source, /router\.push\(href, \{ scroll: false \}\)/);
  assert.match(source, /preventDefault\(\)/);
  assert.match(source, /e4s_pin_toolbar_after_refine/);
  assert.match(source, /getPinnedToolbarTarget/);
  assert.match(source, /getToolbarAnchorTarget/);
  assert.match(source, /closeTopNavigation/);
  assert.match(source, /e4s:close-nav/);
  assert.match(source, /localStorage\.setItem\(NAV_OPEN_STORAGE_KEY, "0"\)/);
  assert.match(source, /restorePinnedToolbar/);
  assert.match(source, /e4s-sidebar-block--pending/);
});
