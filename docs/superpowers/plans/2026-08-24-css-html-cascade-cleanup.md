# CSS HTML Cascade Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce public CSS cascade debt, color drift, duplicate selectors, and legacy HTML/CSS mismatch while preserving the current visual design.

**Architecture:** Treat `public/site.css` as the public-site source of truth, with `public/admin.css` and `public/portal.css` remaining separate route-owned surfaces. Consolidate by page family, moving late overrides into owning sections and deleting only rules proven unused by markup and browser checks.

**Tech Stack:** Next.js 16 App Router, static route CSS in `public/*.css`, Playwright E2E, `tools/audit-css.mjs`, Cloudflare Workers deploy via `npm run deploy:dad`.

**Spec:** `docs/css-html-architecture.md`

## Global Constraints

- Keep public, admin, and portal CSS separate: `e4s-`, `a-`, and `p-` prefixes.
- Every public content page must render exactly one `main#site-content`.
- Do not replace current visual design during cleanup; preserve computed layout unless a bug is explicitly fixed.
- Do not remove a CSS selector only because it appears unused in a static scan; verify route coverage or search-generated markup first.
- Use page-by-page commits and run focused responsive checks before each commit.
- Do not deploy CSS refactors without browser verification.

---

## File Structure

- Modify: `public/site.css`
  - Public website stylesheet. Main cleanup target.
- Modify: `public/admin.css`
  - Admin stylesheet. Clean only after public CSS work is stable.
- Modify: `public/portal.css`
  - Portal stylesheet. Clean separately from public CSS.
- Modify: `src/app/(public)/**/*.tsx`
  - Public route markup, only where CSS cleanup reveals inconsistent wrappers or dead class names.
- Modify: `src/components/**/*.tsx`
  - Shared public components, only where class names are legacy or inconsistent.
- Modify: `tools/audit-css.mjs`
  - Add stricter reporting for colors, duplicate selectors, and non-ASCII comment markers if needed.
- Test: `tests/e2e/public-structure.spec.ts`
  - Guard public HTML structure.
- Test: `tests/e2e/responsive-css.spec.ts`
  - Guard responsive overflow and menu behavior.
- Create: `tests/e2e/public-css-contract.spec.ts`
  - Add page-specific CSS regression checks as cleanup proceeds.

---

### Task 1: Establish CSS Metrics Gates

**Files:**
- Modify: `tools/audit-css.mjs`
- Create: `tests/css-audit-baseline.test.mjs`

**Interfaces:**
- Consumes: current CSS files under `public/`.
- Produces: machine-readable metrics for line count, duplicate selectors, color literals, `!important`, and non-ASCII characters.

- [ ] **Step 1: Add CSS audit JSON export**

Add `--json-only` support to `tools/audit-css.mjs` so tests can parse exact metrics without console prose.

- [ ] **Step 2: Add baseline test**

Create `tests/css-audit-baseline.test.mjs` with assertions that current metrics do not regress:

```js
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const output = execFileSync("node", ["tools/audit-css.mjs", "--json-only"], { encoding: "utf8" });
const { report } = JSON.parse(output);
const site = report.find((entry) => entry.file === "public/site.css");

assert(site.lines <= 9544);
assert(site.duplicateSelectors <= 265);
assert(site.importantCount <= 292);
assert(site.unusedClassCandidates <= 162);
```

- [ ] **Step 3: Run the baseline test**

Run: `node tests/css-audit-baseline.test.mjs`

Expected: PASS.

- [ ] **Step 4: Commit**

Run:

```bash
git add tools/audit-css.mjs tests/css-audit-baseline.test.mjs
git commit -m "Add CSS audit regression baseline"
```

---

### Task 2: Normalize Comment Encoding and Section TOC

**Files:**
- Modify: `public/site.css`
- Modify: `public/admin.css`

**Interfaces:**
- Consumes: current section comments and decorative rulers.
- Produces: ASCII-only comments and a TOC whose order matches the actual stylesheet order.

- [ ] **Step 1: Replace decorative Unicode comments**

Convert box-drawing rulers, arrows, and typographic dashes in CSS comments to plain ASCII.

Example:

```css
/* 05. Header and navigation -------------------------------- */
```

- [ ] **Step 2: Keep CSS-generated UI glyphs only where intentional**

Review `content: ' ->';`, `content: ' ^';`, and other generated symbols. Keep only glyphs that affect the rendered UI, and use ASCII alternatives where acceptable.

- [ ] **Step 3: Reorder or relabel section headings**

Make the section order in `public/site.css` match `docs/css-html-architecture.md`:

```text
01 Reset
02 Tokens
03 Base Elements
04 Layout Utilities
05 Header
06 Footer
07 Shared Page Primitives
08 Listing/Card Primitives
09 Page Modules
10 Responsive Overrides
```

- [ ] **Step 4: Verify no encoding-looking characters remain in comments**

Run:

```bash
node -e "const fs=require('fs'); const s=fs.readFileSync('public/site.css','utf8'); console.log([...s].filter(ch=>ch.charCodeAt(0)>127).join(''))"
```

Expected: output contains no comment-only decorative characters.

- [ ] **Step 5: Commit**

Run:

```bash
git add public/site.css public/admin.css
git commit -m "Normalize CSS comments and section order"
```

---

### Task 3: Create Public Color Token Contract

**Files:**
- Modify: `public/site.css`
- Modify: `docs/css-html-architecture.md`

**Interfaces:**
- Consumes: existing `:root` variables and hard-coded public colors.
- Produces: a compact token set used by public page modules.

- [ ] **Step 1: Define token groups**

Keep one public token group in `:root`:

```css
:root {
  --e4s-color-teal-900: #064e4d;
  --e4s-color-teal-700: #0f766e;
  --e4s-color-teal-600: #0d9488;
  --e4s-color-teal-100: #dff3f1;
  --e4s-color-teal-50: #eef8f7;
  --e4s-color-pink-700: #8b2f43;
  --e4s-color-pink-900: #6b2033;
  --e4s-color-ink: #14313f;
  --e4s-color-muted: #526875;
  --e4s-color-border: #d7ecea;
  --e4s-color-page: #f5faf9;
  --e4s-color-surface: #ffffff;
}
```

- [ ] **Step 2: Alias legacy token names**

Keep compatibility aliases until all references are migrated:

```css
:root {
  --e4s-teal-900: var(--e4s-color-teal-900);
  --e4s-teal-700: var(--e4s-color-teal-700);
  --e4s-teal-600: var(--e4s-color-teal-600);
  --e4s-teal-100: var(--e4s-color-teal-100);
  --e4s-teal-50: var(--e4s-color-teal-50);
  --e4s-pink: var(--e4s-color-pink-700);
  --e4s-ink: var(--e4s-color-ink);
  --e4s-muted: var(--e4s-color-muted);
  --e4s-border: var(--e4s-color-border);
}
```

- [ ] **Step 3: Replace repeated literals**

Replace repeated literals such as `#ffffff`, `#8b2f43`, `#f5faf9`, `#0f766e`, `#064e4d`, and `#526875` with tokens in `public/site.css`.

- [ ] **Step 4: Add color budget to audit baseline**

Assert public unique color literals decreases from 265 toward 80 or fewer.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run audit:css
npx playwright test tests/e2e/homepage.spec.ts tests/e2e/responsive-css.spec.ts --workers=1
```

- [ ] **Step 6: Commit**

Run:

```bash
git add public/site.css docs/css-html-architecture.md tests/css-audit-baseline.test.mjs
git commit -m "Consolidate public color tokens"
```

---

### Task 4: Consolidate Homepage CSS

**Files:**
- Modify: `public/site.css`
- Test: `tests/e2e/homepage.spec.ts`
- Test: `tests/e2e/responsive-css.spec.ts`

**Interfaces:**
- Consumes: current homepage markup in `src/app/(public)/page.tsx`.
- Produces: one homepage section in `public/site.css` without late override blocks.

- [ ] **Step 1: Inventory active homepage selectors**

Run:

```bash
rg -n "e4s-home" "src/app/(public)/page.tsx" src/components public/site.css
```

- [ ] **Step 2: Move late homepage overrides into the homepage section**

Fold rules from late sections named `HOMEPAGE`, `HERO`, `HOME SECTIONS`, `CAT TILES`, `FEATURED SIDEBAR`, `WHAT'S ON`, and `FEATURED LISTINGS` into the main homepage section.

- [ ] **Step 3: Remove overridden homepage declarations**

Delete earlier declarations only when the later declaration has been moved into the owner section and computed styles match.

- [ ] **Step 4: Check homepage at three widths**

Run:

```bash
npx playwright test tests/e2e/homepage.spec.ts tests/e2e/responsive-css.spec.ts --workers=1
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add public/site.css tests/e2e/homepage.spec.ts tests/e2e/responsive-css.spec.ts
git commit -m "Consolidate homepage CSS"
```

---

### Task 5: Consolidate Advertise Page CSS

**Files:**
- Modify: `public/site.css`
- Create: `tests/e2e/advertise.spec.ts`

**Interfaces:**
- Consumes: current advertise markup in `src/app/(public)/advertise/page.tsx`.
- Produces: one advertise page module with no repeated advertise selector blocks.

- [ ] **Step 1: Add advertise route checks**

Create `tests/e2e/advertise.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1280]) {
  test(`advertise page layout is stable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/advertise", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main#site-content")).toHaveCount(1);
    await expect(page.locator(".e4s-advertise-pro-hero")).toBeVisible();
    await expect(page.locator(".e4s-advertise-pro-hero__actions a").first()).toBeVisible();

    const overflow = await page.evaluate(() => ({
      body: document.body.scrollWidth - document.body.clientWidth,
      doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(overflow.body).toBeLessThanOrEqual(1);
    expect(overflow.doc).toBeLessThanOrEqual(1);
  });
}
```

- [ ] **Step 2: Consolidate advertise selectors**

Merge repeated definitions for:

```text
.e4s-advertise-pro
.e4s-advertise-pro-hero
.e4s-advertise-inventory__grid
.e4s-advertise-placement-map
.e4s-advertise-section-heading
```

- [ ] **Step 3: Run advertise verification**

Run:

```bash
npx playwright test tests/e2e/advertise.spec.ts tests/e2e/public-structure.spec.ts --workers=1
npm run audit:css
```

- [ ] **Step 4: Commit**

Run:

```bash
git add public/site.css tests/e2e/advertise.spec.ts
git commit -m "Consolidate advertise page CSS"
```

---

### Task 6: Consolidate Listing and Category Template CSS

**Files:**
- Modify: `public/site.css`
- Modify: `tests/e2e/responsive-css.spec.ts`

**Interfaces:**
- Consumes: category pages, city/category pages, listing cards, detail pages.
- Produces: one category/listing module and one card primitive module.

- [ ] **Step 1: Inventory listing selectors**

Run:

```bash
rg -n "e4s-listing|e4s-category|e4s-page-with-sidebar|e4s-promo" src public/site.css
```

- [ ] **Step 2: Separate primitives from templates**

Keep `.e4s-listing-card*` in card primitives. Keep `.e4s-category-template*`, `.e4s-page-with-sidebar*`, and `.e4s-promo-banners*` in category/listing templates.

- [ ] **Step 3: Remove duplicate responsive overrides**

Move width and overflow rules into the responsive section only once per selector.

- [ ] **Step 4: Run route checks**

Run:

```bash
npx playwright test tests/e2e/responsive-css.spec.ts tests/e2e/public-structure.spec.ts --workers=1
```

- [ ] **Step 5: Commit**

Run:

```bash
git add public/site.css tests/e2e/responsive-css.spec.ts
git commit -m "Consolidate listing template CSS"
```

---

### Task 7: Remove Verified-Unused Legacy CSS

**Files:**
- Modify: `public/site.css`
- Modify: `tools/audit-css.mjs`
- Test: `tests/e2e/public-css-contract.spec.ts`

**Interfaces:**
- Consumes: unused candidates from `tools/audit-css.mjs`.
- Produces: deleted legacy selectors with browser-backed confidence.

- [ ] **Step 1: Export unused candidates by prefix**

Update `tools/audit-css.mjs` to print unused candidates grouped by likely origin:

```text
legacy color utilities
legacy table wrappers
legacy homepage
legacy listing
unknown
```

- [ ] **Step 2: Remove low-risk color utility classes**

Delete unused legacy color utilities such as:

```text
bg-grey-dark
bg-grey-mid
bg-grey-warm
bg-magenta-deep
bg-pink-blush
bg-pink-deep
bg-pink-frost
bg-pink-mid
bg-pink-mid2
bg-pink-soft
bg-pink-vivid
bg-salmon
bg-teal
bg-teal-dark
bg-teal-deep
bg-teal-frost
bg-teal-light
bg-teal-mid
bg-teal-pale
bg-teal-pale2
bg-teal-xxlight
bg-white
bodytext
bodytext01
```

- [ ] **Step 3: Verify no source usage remains**

Run:

```bash
rg -n "bg-grey-dark|bg-grey-mid|bg-grey-warm|bg-magenta-deep|bg-pink-blush|bg-pink-deep|bg-pink-frost|bg-pink-mid|bg-pink-mid2|bg-pink-soft|bg-pink-vivid|bg-salmon|bg-teal|bg-teal-dark|bg-teal-deep|bg-teal-frost|bg-teal-light|bg-teal-mid|bg-teal-pale|bg-teal-pale2|bg-teal-xxlight|bg-white|bodytext|bodytext01" src public
```

Expected: no matches outside the removed CSS.

- [ ] **Step 4: Run full public checks**

Run:

```bash
npm run audit:css
npx playwright test tests/e2e/public-structure.spec.ts tests/e2e/homepage.spec.ts tests/e2e/businesses.spec.ts tests/e2e/responsive-css.spec.ts tests/e2e/advertise.spec.ts --workers=1
npm run build
```

- [ ] **Step 5: Commit**

Run:

```bash
git add public/site.css tools/audit-css.mjs tests/e2e/public-css-contract.spec.ts
git commit -m "Remove verified unused public CSS"
```

---

### Task 8: Clean Admin and Portal Separately

**Files:**
- Modify: `public/admin.css`
- Modify: `public/portal.css`
- Test: `tests/e2e/admin-console-smoke.spec.ts`

**Interfaces:**
- Consumes: admin and portal prefixed styles.
- Produces: smaller admin and portal stylesheets without changing public-site CSS.

- [ ] **Step 1: Admin duplicate review**

Group admin duplicate table column selectors and keep repeated selectors only where breakpoints intentionally override layout.

- [ ] **Step 2: Portal duplicate review**

Group portal shell, sidebar, control row, and toolbar selectors. Keep route-owned responsive overrides close to their owning component group.

- [ ] **Step 3: Run verification**

Run:

```bash
npm run audit:css
npm run smoke:admin
```

- [ ] **Step 4: Commit**

Run:

```bash
git add public/admin.css public/portal.css
git commit -m "Consolidate admin and portal CSS"
```

---

## Success Targets

- `public/site.css` reduced from about 9,544 lines to under 6,500 lines without redesigning pages.
- Public duplicate selectors reduced from 265 to under 90.
- Public `!important` count reduced from 292 to under 100.
- Public unique hard-coded color literals reduced from 265 to under 80.
- CSS comments use ASCII unless the character is intentionally rendered in the UI.
- Public HTML keeps exactly one `main#site-content` per content page.

## Self-Review

- Spec coverage: The plan implements stylesheet ownership, HTML contract, section order, cascade rules, responsive rules, and cleanup process from `docs/css-html-architecture.md`.
- Placeholder scan: No placeholder-only implementation steps are present.
- Type consistency: New test file names and command references are consistent across tasks.
