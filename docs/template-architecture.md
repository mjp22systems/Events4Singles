# Events4Singles Template Architecture

Last updated: 2026-08-26

## Goal

Public pages should read as a small set of predictable templates, not one-off page structures. Shared chrome, body primitives, listing cards, and support blocks should have one owner each.

## Public Page Flow

```text
RootLayout
  PublicLayout
    Nav
    PageMain / template variant
      PageHero
      PageIntro
      PageBody
      PageFoot
    Footer
```

## Canonical Owners

- `src/components/nav.tsx` owns the public header.
- `src/components/footer.tsx` and `src/components/footer-content.tsx` own the public footer.
- `src/components/public-page.tsx` owns shared public page primitives.
- `src/components/listing-directory-page.tsx` owns the category, city, category-city, and featured-listings page scaffold.
- `src/components/listing-card.tsx` owns real listing cards.
- `src/components/listings-section.tsx` owns listing sort/filter/list rendering.
- `src/components/feature-slot-card.tsx` owns the sponsored listing placeholder.
- `src/components/advertise-card.tsx` owns the sidebar advertise tile.
- `src/components/online-card.tsx` owns online-only listing cards.

## Public Body Template Types

1. `HomeTemplate`: homepage sections, featured areas, newsletter, resources.
2. `InfoPageTemplate`: about, contact, privacy, terms, locations.
3. `IndexPageTemplate`: cities, categories, businesses.
4. `ListingDirectoryTemplate`: category, city, category-city, featured listings.
5. `ListingDetailTemplate`: listing detail and related listings.
6. `EventTemplate`: event index and event detail pages.
7. `ArticleTemplate`: dating resource hub and article pages.
8. `AdvertiseTemplate`: advertising sales page and preview/demo sections.

## Class Naming Rule

Use semantic component names:

```css
.e4s-page {}
.e4s-page__body {}
.e4s-page-foot {}
.e4s-listing-card {}
.e4s-listing-card__media {}
```

Avoid new generated or accidental names:

```css
.e4s-inline-* {}
.random-box {}
.section2 {}
```

Existing `*-inline-*` classes are migration scaffolding only. Replace them gradually with canonical component classes.

## CSS Ownership

- `public/site.css` owns public layout, surfaces, spacing, and responsive structure.
- `public/admin.css` owns admin layout, surfaces, spacing, and responsive structure.
- `public/portal.css` owns portal layout, surfaces, spacing, and responsive structure.
- `public/typography.css` owns all font, text colour, size, weight, line-height, label, heading, caption, and button text rules.

## Migration Order

1. Keep public chrome canonical: no page should duplicate header or footer markup.
2. Move repeated page shells into `src/components/public-page.tsx`.
3. Move repeated directory scaffolds into `src/components/listing-directory-page.tsx`.
4. Move listing display variations into reusable listing/card components.
5. Replace generated `e4s-inline-*`, `a-inline-*`, and `p-inline-*` classes with semantic classes.
6. Dedupe CSS after the JSX structure is stable.

## Current Template Coverage

- Public header and footer have one owner each.
- Info pages use `InfoPage`: about, contact, locations, privacy, terms, dating resources hub, and dating resource articles.
- Index pages use `IndexPage` or `PublicMain`: cities, categories, businesses, and events.
- Listing directory pages use `ListingDirectoryPage`: category overview, city overview, category-city child pages, and featured listings.
- Remaining direct public page templates are intentional families: homepage, pathway pages, listing detail internals, event detail internals, advertise experience, and portal preview.
