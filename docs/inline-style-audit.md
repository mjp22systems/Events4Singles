# Events4Singles Inline Style Audit

Last updated: 2026-08-26

## Current Counts

- Active React app `style={{...}}` props in `src/app`, `src/components`, and `src/lib`: 0.
- Active app DOM style mutations: 2, both in `src/components/header-height.tsx` setting runtime CSS custom properties for measured sticky-header height.
- Email template `style=` attributes in `src/lib` and `src/app/api`: 42. These are intentionally inline for email-client support.
- Legacy static HTML `style=` attributes in `public/images`: 5,623 across 19 imported `.htm/.html` files. These are not part of the current React page structure and should be quarantined or removed after a reference audit.
- Generated extracted classes now staged in owner CSS: 22 public-site classes, 53 portal classes, and 173 admin classes.

## Active Public Site Findings

- Public, portal, and admin React markup no longer uses inline `style` props.
- `src/components/header-height.tsx` writes `--e4s-header-height` and `--e4s-sticky-top` to the document root. This is a valid runtime measurement exception, because the value depends on the rendered header height.
- `src/app/(public)/portal-preview/page.tsx` is now class-based, but its extracted preview classes live in `public/site.css` because it is a public route that previews portal UI.
- Email templates in `src/lib/email.ts` and `src/app/api/contact/route.ts` intentionally use inline CSS for email client support. Moving those styles requires a CSS-inlining email build step, not ordinary web CSS extraction.

## Cleanup Plan

1. Replace generated `*-inline-*` classes with semantic owner classes where patterns repeat.
2. Public website: consolidate extracted preview and page-specific classes into named site components.
3. Portal: consolidate repeated page headers, card spacing, table rows, empty states, and action rows in `public/portal.css`.
4. Admin: consolidate repeated CRUD table, filter, modal, drawer, and metadata patterns in `public/admin.css`.
5. Email: leave inline styles until there is a dedicated email template/inliner workflow.
6. Legacy assets under `public/images`: quarantine or remove old static HTML/JS assets once confirmed unreferenced.

## Rule Going Forward

New React markup should use existing classes first. If a value is typography-related, it should come from `public/typography.css` tokens or a semantic typography utility. Inline styles are reserved only for dynamic runtime values that cannot be represented cleanly with classes.
