# Events4Singles CSS Architecture Cleanup

Last updated: 2026-08-26

## Current State

`public/site.css` is the active stylesheet source of truth for the public website.

Current audit metrics after the August 26 typography and template ownership pass:

- `public/site.css`: 6,005 audit-counted lines
- `public/admin.css`: 1,817 audit-counted lines
- `public/portal.css`: 1,477 audit-counted lines
- `public/typography.css`: 5,735 audit-counted lines
- `site.css`, `admin.css`, and `portal.css`: 0 typography declarations by static scan
- active React inline `style` props: 0
- public listing-directory scaffold selectors are now emitted from `src/components/listing-directory-page.tsx`
- 0 unused public class candidates after accounting for known dynamic class names
- 0 non-ASCII lines
- 0 non-ASCII comment blocks
- one file serving several jobs at once:
  - legacy FrontPage/Joomla compatibility
  - modern app shell
  - header and dropdown navigation
  - footer
  - listing cards
  - city/category templates
  - sidebars
  - listing detail
  - advertise page
  - article/events pages
  - scoped responsive safeguards

The file is large because it still contains hundreds of legacy extracted utility classes such as colour, width, table, border, and spacing classes. Those were created while preserving old content and should be treated as compatibility CSS, not as a pattern for new work.

The audit command is:

```powershell
npm run audit:css
```

The audit scans `src` plus public `.html` and `.js` assets. Do not delete a class solely because it is absent from React code; old public markup may still depend on it.

## Stylesheet Ownership

- `public/site.css` owns the public site.
- `public/admin.css` owns admin.
- `public/portal.css` owns the advertiser portal.
- `public/typography.css` owns font loading, font-family tokens, shared type scale tokens, global typography defaults, and all selector-level typography declarations for public, admin, and portal UI.
- `src/app/globals.css` should stay minimal and should not become another public style surface.

## Why The CSS Is Too Complex

### 1. Legacy compatibility is mixed with modern UI

The top part of `site.css` includes generated utility classes from old inline/table layouts. Examples include:

- `.text-*`
- `.bg-*`
- `.w-*`
- `.bdr-*`
- `.pd-*`

These should not be extended. They should either remain isolated for legacy content or be deleted after an unused-class audit.

### 2. New component CSS was added as late overrides

Recent changes added new homepage, advertising, footer, and mobile selectors late in the file. This made the cascade harder to reason about.

The cleanup pattern is to fold effective values back into the owning section, remove the appended override, and verify the related page or component.

### 3. Responsive rules are split across multiple areas

There are mobile rules near older homepage sections and again near newer rescue sections. That makes it easy for one rule to undo another.

### 4. Generated ownership classes still exist

Active React inline `style` props have been removed. The current cleanup debt is the generated `*-inline-*` class layer created during extraction. Those classes should be folded into semantic component classes once each UI surface is stable.

## Target CSS Structure

The clean end state should be either one well-structured stylesheet or a small set of imported stylesheets.

### Option A: One File, Canonical Sections

Keep `public/site.css` but make the table of contents real and strict:

1. Reset and base elements
2. Legacy compatibility utilities
3. Tokens and CSS variables
4. Shell and layout primitives
5. Header and navigation
6. Footer
7. Page hero and intro sections
8. Shell responsive adjustments
9. Listing cards
10. Page intro, banners and listing toolbar
11. Category navigation and page layouts
12. Sidebar layout
13. Info and listing detail pages
14. Advertise page
15. Articles and events pages
16. Home page
17. Blog and dating-resources pages
18. Dark-mode overrides
19. Generated extraction classes awaiting semantic consolidation

Rules:

- Each selector belongs to one owning section.
- Typography properties belong in `public/typography.css`, not in the route owner files.
- No random "final override" block unless it has a dated bug note.
- New homepage CSS must use existing `.e4s-home-*` components or section modifiers.
- New advertising CSS must use existing `.e4s-love-*` components while `/advertise` uses that implementation.
- No new `.w-*`, `.bg-*`, or `.text-*` utility classes.

### Option B: Split Stylesheets

This is cleaner long term:

```text
public/styles/
  00-tokens.css
  01-base.css
  02-legacy-compat.css
  03-shell.css
  04-header-nav.css
  05-footer.css
  06-listing-card.css
  07-listing-pages.css
  08-sidebar.css
  09-promo-banners.css
  10-listing-detail.css
  11-info-pages.css
  12-advertise.css
  13-home.css
  site.css
```

`public/styles/site.css` would import the rest in order:

```css
@import "./00-tokens.css";
@import "./01-base.css";
@import "./02-legacy-compat.css";
...
```

The app would load only one public file:

```tsx
<link rel="stylesheet" href="/styles/site.css?v=..." />
```

This is easier to maintain, but should be done in a controlled refactor with visual regression screenshots.

## Cleanup Plan

### Phase 1: Stop the bleeding

- Keep `src/app/layout.tsx` pointed at canonical `site.css`.
- Delete unused copied stylesheet files once confirmed unreferenced.
- Stop adding late rescue overrides.
- Any new homepage work must be scoped under `.e4s-home-new`.

### Phase 2: Inventory selectors

Generate a selector usage report against:

- `src/**/*.tsx`
- generated static `out/**/*.html`
- any legacy HTML still consumed by the app

Classify selectors as:

- active modern app selector
- active legacy compatibility selector
- generated but unused legacy selector
- dead experimental selector
- temporary fix selector

### Phase 3: Remove dead experiment CSS

Remove only after source search and responsive verification. Safe candidates are classes that have no source reference in `src`, no public markup/script reference, and are not generated dynamically by a component.

Keep `.e4s-advertise-pro-*` while `/advertise` uses it.

### Phase 4: Fold late overrides

When a late override is still needed, move its effective values into the component's base section or nearest responsive block. Prefer structural specificity over `!important`.

### Phase 5: Split or reorganise

After selector inventory and dead CSS removal, either:

- keep one organised `site.css`, or
- split into imported module files under `public/styles`.

Do not split until the app is visually stable, because line movement alone can make diff review harder.

Current recommendation: keep one canonical `public/site.css` until the remaining duplicate groups are mostly component breakpoints. Splitting too early will make review harder and can hide cascade changes inside import ordering.

## Current Duplicate Targets

The next cleanup passes should focus on these measured duplicate clusters:

- `public/site.css`: homepage experience tiles, navigation cells, promo banners, pathway grids, repeated 640px and 900px media blocks.
- `public/typography.css`: `body`, advertise hero headings, advertise section headings, portal sidebar link typography, portal side nav item typography.
- `public/portal.css`: shell/sidebar/form toolbar repeats, especially events toolbar and control rows.
- `public/admin.css`: table column sizing repeats for events/integrations and admin table utility classes.

## CSS Naming Rules Going Forward

Use component-scoped names:

```css
.e4s-listing-card {}
.e4s-listing-card__header {}
.e4s-listing-card__media {}
.e4s-listing-card--featured {}
```

Use page or section-scoped names:

```css
.e4s-home-section--events {}
.e4s-home-section--featured {}
.e4s-home-hero {}
.e4s-home-city-grid {}
.e4s-home-newsletter {}
```

Avoid:

```css
.green-box {}
.big-card {}
.section2 {}
.w-400p {}
.text-pink-large {}
```

## Visual QA Requirement For CSS Changes

Every meaningful CSS refactor should run:

```powershell
npm run build
```

Then capture screenshots at minimum:

- homepage desktop and mobile
- Sydney city page desktop and mobile
- a category page desktop and mobile
- a listing detail page desktop and mobile
- advertise page desktop and mobile

Do not deploy CSS refactors without a screenshot comparison.

## Practical Recommendation

Continue cleanup in small verified slices:

1. Public site CSS first: advertise page, promo banners, listing toolbar, homepage, event detail.
2. Portal CSS second: shell/sidebar/form duplicates.
3. Admin CSS third: table column sizing duplicates.
4. Only split CSS files after duplicate override debt is reduced enough that import order is obvious.
