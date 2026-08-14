# Events4Singles CSS Architecture Cleanup

Last updated: 2026-08-13

## Current State

`public/site.css` is the active stylesheet source of truth.

Current rough metrics:

- 5,558 lines
- about 1,291 selector/comment/media entries detected by simple scan
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
  - patch overrides from recent work

The file is large because it still contains hundreds of legacy extracted utility classes such as colour, width, table, border, and spacing classes. Those were created while preserving old content and should be treated as compatibility CSS, not as a pattern for new work.

## Immediate Correction Made

The app layout has been put back onto the canonical stylesheet:

```tsx
<link rel="stylesheet" href="/site.css?v=20260813-restore" />
```

The query string is only a cache token. It is not a second stylesheet and not version history.

Do not point the app at copied CSS files such as:

- `site-filter-clear-20260813.css`
- `site-homepage-fix-20260813.css`
- `site-homepage-fix-20260813b.css`

Those files should be treated as temporary artifacts and can be deleted after confirming nothing references them.

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

Recent changes added new homepage and advertising selectors late in the file. This made the cascade harder to reason about.

Examples:

- `.e4s-home-pro-*`
- `.e4s-advertise-pro-*`
- final mobile override blocks

The homepage has now been restored, so `.e4s-home-pro-*` is not part of the active homepage. The advertising page still uses `.e4s-advertise-pro-*`.

### 3. Responsive rules are split across multiple areas

There are mobile rules near older homepage sections and again near newer rescue sections. That makes it easy for one rule to undo another.

### 4. Inline styles still exist

The restored homepage uses inline styles. That is structurally stable but not clean CSS architecture. A future homepage rebuild should move every style into scoped classes.

## Target CSS Structure

The clean end state should be either one well-structured stylesheet or a small set of imported stylesheets.

### Option A: One File, Canonical Sections

Keep `public/site.css` but make the table of contents real and strict:

1. Tokens
2. Reset and base elements
3. Legacy compatibility utilities
4. Shell and layout primitives
5. Header and navigation
6. Footer
7. Page hero and intro
8. Listing cards
9. Listing toolbar, filters, and sort controls
10. Promo banners and advertising tiles
11. Sidebar
12. Location/category page templates
13. Listing detail page
14. Info/static pages
15. Articles/advice/events pages
16. Advertise page
17. Homepage
18. Responsive rules by component
19. Dark mode, if retained

Rules:

- Each selector belongs to one section.
- No random "final override" block unless it has a dated bug note.
- New homepage CSS must be scoped under `.e4s-home-new`.
- New advertising CSS must be scoped under `.e4s-advertise-page`.
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

Safe first candidates after homepage restore:

- `.e4s-home-pro-*` if no page references it
- temporary final mobile containment blocks for `.e4s-home-pro`
- copied stylesheet files not referenced by layout

Keep `.e4s-advertise-pro-*` while `/advertise` uses it.

### Phase 4: Move inline homepage styles

The restored homepage currently has inline styles. Before external design implementation, either:

- leave it as a temporary baseline, or
- convert it into a clean `.e4s-home-baseline` class set.

Do not spend design effort here if the homepage is about to be replaced by an external design.

### Phase 5: Split or reorganise

After selector inventory and dead CSS removal, either:

- keep one organised `site.css`, or
- split into imported module files under `public/styles`.

Do not split until the app is visually stable, because line movement alone can make diff review harder.

## CSS Naming Rules Going Forward

Use component-scoped names:

```css
.e4s-listing-card {}
.e4s-listing-card__header {}
.e4s-listing-card__media {}
.e4s-listing-card--featured {}
```

Use page-scoped names:

```css
.e4s-home-new {}
.e4s-home-new__hero {}
.e4s-home-new__city-grid {}
.e4s-home-new__newsletter {}
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

Do not redesign inside the current `site.css` until the homepage design is selected externally.

First:

1. Keep the restored homepage live.
2. Use `external-homepage-design-handoff.md` with Framer, Relume/Figma, Webflow, or a human designer.
3. Implement the approved homepage under `.e4s-home-new`.
4. Then remove dead `.e4s-home-pro-*` CSS and any unused copied stylesheets.
