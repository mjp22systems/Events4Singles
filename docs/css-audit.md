# Events4Singles CSS Audit

Current stylesheet: `public/site.css`

## Summary

The CSS is functional and now easier to navigate, but it is not yet cleanly canonical or minimal. It is a hybrid stylesheet with:

- legacy FrontPage-style utility classes near the top
- modern `e4s-*` component/page classes later in the file
- some duplicate selectors used as overrides
- several inline React styles still bypassing the stylesheet
- a small number of broad/global rules that can leak into components

## Highest-Risk Findings

1. Global link states were too broad.
   - `a:visited` and `a:active` were globally setting pale mint text.
   - This caused the listing detail back button to become unreadable once visited.
   - Fixed by aligning global visited/active links with the normal link color, while component buttons keep their own states.

2. Legacy utilities are mixed with modern components.
   - About 467 legacy utility selectors remain.
   - These should be treated as compatibility CSS unless we prove they are unused.
   - Do not delete them in bulk until legacy HTML/content rendering is fully retired.

3. Duplicate selectors exist.
   - The audit found 41 duplicate selector definitions.
   - Some are intentional responsive/page overrides.
   - Others should eventually be merged into canonical component blocks.

4. Inline styles remain in React pages/components.
   - Most are on the home page and a few small controls.
   - These should gradually move into named `e4s-*` classes.

5. `!important` is still present.
   - Some usage is legitimate for visually hidden/accessibility helpers.
   - Other usage is compensating for cascade conflicts and should be reduced.

## Recommended Cleanup Order

1. Protect modern components from global legacy rules.
2. Move inline styles into named classes.
3. Merge duplicate modern component selectors.
4. Keep legacy utility classes isolated under a documented compatibility section.
5. Only remove legacy utilities after an unused-selector check against generated/static legacy content.

## Current Rule

Prefer canonical `e4s-*` component classes for all new app UI. Treat old utility classes as legacy compatibility, not a pattern to extend.

## Cache-Busting Note

The app links the stylesheet as `/site.css?v=...` from `src/app/layout.tsx`.

That query string is not a separate CSS file or a stored version history. It is a browser cache-busting token so Chrome/CDNs fetch the latest `public/site.css`. The source of truth remains one file: `public/site.css`.

## What "Clean" Still Requires

The current stylesheet is organized, not fully simplified. A truly clean stylesheet would require:

- moving inline React styles into named classes
- deleting unused legacy utilities only after a generated-content usage check
- merging duplicate modern component selectors
- splitting `site.css` into smaller files or CSS modules once legacy compatibility is isolated
- replacing broad utility color classes with a small token-based palette
