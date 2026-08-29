import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const constantsSource = readFileSync(path.join(projectRoot, "src", "lib", "constants.ts"), "utf8");
const categoryOverviewSource = readFileSync(path.join(projectRoot, "src", "app", "(public)", "[category]", "page.tsx"), "utf8");
const categoryCitySource = readFileSync(path.join(projectRoot, "src", "app", "(public)", "[category]", "[subcategory]", "page.tsx"), "utf8");
const subcategoryCitySource = readFileSync(path.join(projectRoot, "src", "app", "(public)", "[category]", "[subcategory]", "[city]", "page.tsx"), "utf8");
const pageSidebarSource = readFileSync(path.join(projectRoot, "src", "components", "page-sidebar.tsx"), "utf8");
const subcategoryPagerSource = readFileSync(path.join(projectRoot, "src", "components", "subcategory-pager.tsx"), "utf8");
const subcategoryNavSelectSource = readFileSync(path.join(projectRoot, "src", "components", "subcategory-nav-select.tsx"), "utf8");

test("dance child route helpers keep nested style URLs clean", () => {
  assert.match(
    constantsSource,
    /parentDbSlug === "dance_classes" && childDbSlug\.startsWith\("dance_"\)/
  );
  assert.match(
    constantsSource,
    /candidates\.push\(`dance_\$\{childDbSlug\}`\)/
  );
});

test("listing sidebars use canonical other-axis headings", () => {
  assert.match(pageSidebarSource, /heading="Other Categories"/);
  assert.match(pageSidebarSource, /heading=\{props\.subcategoryHeading \?\? "Other Styles"\}/);
  assert.match(pageSidebarSource, /heading="Other Cities"/);
  assert.match(categoryCitySource, /subcategoryHeading=\{categoryDbSlug === "dance_classes" \? "Other Styles" : undefined\}/);
  assert.match(subcategoryCitySource, /subcategoryHeading=\{parentDbSlug === "dance_classes" \? "Other Styles" : undefined\}/);
});

test("active child category pages expose a style pager axis", () => {
  assert.match(subcategoryPagerSource, /export default function SubcategoryPager/);
  assert.match(subcategoryPagerSource, /toCategoryChildUrlSegment/);
  assert.match(categoryCitySource, /<SubcategoryPager[\s\S]*currentDbSlug=\{childMeta\.slug\}/);
  assert.match(subcategoryCitySource, /<SubcategoryPager[\s\S]*currentDbSlug=\{childMeta\.slug\}[\s\S]*variant="secondary"/);
  assert.match(subcategoryCitySource, /<CategoryCityPager[\s\S]*categoryUrlSlug=\{subcategoryUrlSlug\}/);
});

test("subcategory mobile selectors land on canonical all-city routes before city refinement", () => {
  assert.match(subcategoryNavSelectSource, /const parentDbSlug = toDbSlug\(parentUrlSlug\)/);
  assert.match(subcategoryNavSelectSource, /toCategoryChildUrlSegment\(parentDbSlug, e\.target\.value\)/);
  assert.match(subcategoryNavSelectSource, /cityUrlSlug \? `\/\$\{parentUrlSlug\}\/\$\{nextSlug\}\/\$\{cityUrlSlug\}` : `\/\$\{parentUrlSlug\}\/\$\{nextSlug\}`/);
  assert.match(subcategoryPagerSource, /cityUrlSlug \? `\/\$\{parentUrlSlug\}\/\$\{childSegment\}\/\$\{cityUrlSlug\}` : `\/\$\{parentUrlSlug\}\/\$\{childSegment\}`/);
  assert.match(categoryCitySource, /<NavSelect[\s\S]*categoryUrlSlug=\{subcategoryUrlSlug\}[\s\S]*placeholder="Select city"/);
  assert.match(categoryCitySource, /<SubcategoryNavSelect[\s\S]*cityUrlSlug=\{subcategory\}/);
  assert.match(subcategoryCitySource, /<SubcategoryNavSelect[\s\S]*cityUrlSlug=\{city\}/);
});

test("child category aliases redirect to the canonical child slug", () => {
  assert.match(categoryCitySource, /permanentRedirect\(`\/\$\{category\}\/\$\{canonicalSubcategory\}`\)/);
  assert.match(subcategoryCitySource, /permanentRedirect\(`\/\$\{category\}\/\$\{canonicalSubcategory\}\/\$\{city\}`\)/);
  assert.match(constantsSource, /if \(childDbSlug\.endsWith\("_dance"\)\)/);
  assert.match(constantsSource, /candidates\.push\(styleSlug, `dance_\$\{styleSlug\}`\)/);
});

test("category overview pages expose mobile category paging without a second selector row", () => {
  assert.match(categoryOverviewSource, /<CategoryPager categories=\{parentCats\} currentDbSlug=\{dbSlug\} \/>/);
  assert.match(categoryOverviewSource, /<MobileSidePager[\s\S]*label="Category navigation"/);
  assert.match(categoryOverviewSource, /previous=\{mobilePreviousCategory \? \{ href: `\/\$\{toUrlSlug\(mobilePreviousCategory\.slug\)\}`/);
  assert.match(categoryOverviewSource, /next=\{mobileNextCategory \? \{ href: `\/\$\{toUrlSlug\(mobileNextCategory\.slug\)\}`/);
  assert.match(categoryOverviewSource, /className="e4s-category-child-nav e4s-category-child-nav--category-mobile"/);
  assert.doesNotMatch(categoryOverviewSource, /mobileSubcategories/);
  assert.doesNotMatch(categoryOverviewSource, /placeholder="Select style"/);
});
