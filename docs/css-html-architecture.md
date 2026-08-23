# CSS and HTML Architecture

## Table of Contents

1. [Stylesheet Ownership](#stylesheet-ownership)
2. [Public HTML Contract](#public-html-contract)
3. [CSS Section Order](#css-section-order)
4. [Cascade Rules](#cascade-rules)
5. [Responsive Rules](#responsive-rules)
6. [Cleanup Process](#cleanup-process)
7. [Current Cleanup Targets](#current-cleanup-targets)

## Stylesheet Ownership

The site has three route-level CSS surfaces:

- `public/site.css` owns the public website.
- `public/admin.css` owns the admin console.
- `public/portal.css` owns the advertiser portal and portal preview.

`src/app/globals.css` is intentionally empty apart from the Next.js compatibility import. Public route CSS is loaded from `src/app/(public)/layout.tsx`; admin and portal layouts should own their own stylesheets.

## Public HTML Contract

Every public content page should render exactly one `main#site-content` after the shared public header and before the shared footer.

Use one of these page shapes:

- Full-width page: `<main id="site-content" className="e4s-home-page">` with section-level `.e4s-shell` wrappers.
- Shell page: `<main id="site-content" className="e4s-shell e4s-info-page">` when the whole page is a single constrained reading layout.
- Index page: `<main id="site-content" className="e4s-index-page">` with inner `.e4s-shell` sections.
- Template page: `<main id="site-content" className="e4s-category-template">` for category and city/category listing pages.
- Detail page: `<main id="site-content">` with inner detail components.

Page-specific classes should sit on the `main` when they describe the whole page. Section-specific classes should stay on their section.

## CSS Section Order

Keep `public/site.css` organized in this order:

1. Reset and browser defaults.
2. Tokens and custom properties.
3. Base elements and accessibility helpers.
4. Shared layout utilities.
5. Header and navigation.
6. Footer.
7. Shared page primitives.
8. Listing and card primitives.
9. Public page modules.
10. Responsive overrides.

Admin and portal styles should keep the same general order, with their own prefixes and route-specific modules.

## Cascade Rules

Use the stylesheet section order as the source of truth. Avoid late "final fix" sections that override earlier page modules.

When a selector needs a correction, move the corrected value into the owning section and remove the older duplicate. Prefer tokens for shared color, spacing, radius and shadow values. Use `!important` only for unavoidable legacy containment or third-party overrides, and leave a short reason beside it.

Prefix ownership should stay clear:

- `e4s-` for public site components.
- `a-` for admin components.
- `p-` for portal components.

## Responsive Rules

Responsive rules should be close to the component they modify or collected in the responsive section with a clear heading. Keep breakpoints consistent with the existing public stylesheet unless a component has a specific need.

Before committing responsive CSS, check mobile, tablet and desktop widths for:

- horizontal overflow;
- header/menu stability;
- text fitting inside controls and cards;
- hero and section spacing;
- image aspect ratios.

## Cleanup Process

1. Run the CSS audit and inventory duplicate selectors.
2. Pick one page or component family.
3. Confirm its HTML contract and stylesheet ownership.
4. Move late overrides into the owning section.
5. Remove dead duplicate declarations after verifying computed styles.
6. Run focused Playwright checks across mobile, tablet and desktop.
7. Commit the slice while the working tree is clean.

## Current Cleanup Targets

The remaining public CSS cleanup should focus on these areas first:

- Fold late homepage overrides back into the main homepage section.
- Consolidate repeated advertise page selectors, especially inventory grids and placement map rules.
- Review `!important` use in `public/site.css` and keep only the declarations needed for legacy containment.
- Convert unused legacy homepage selectors only after visual checks confirm they are no longer referenced by current markup.
- Keep admin and portal cleanup separate from public-site cleanup because their prefixes and route layouts are intentionally separate.
