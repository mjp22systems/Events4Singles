# Events4Singles Source Of Truth

Last updated: 2026-08-13

This document is the working project bible for the rebuilt Events4Singles website, staging database, legacy migration, and planned backend/admin console. It captures decisions made during the rebuild so they are not trapped in chat history.

## Source Coverage

This document has now been seeded from:

- The current Codex task conversation through 2026-08-13.
- Cortex memories for Events4Singles decisions and session checkpoints.
- Claude Code local memory files in `C:\Users\Matt\.claude\projects\D--Projects-Clients-Dad-Events4singles\memory`.
- Claude Code transcript files:
  - `C:\Users\Matt\.claude\projects\D--Projects-Clients-Dad-Events4singles\a4d3da05-e78b-4bb7-af8c-ca0d6995e62f.jsonl`
  - `C:\Users\Matt\.claude\projects\D--Projects-Clients-Dad-Events4singles\8446afb3-daa6-49ca-93b8-96ebc47d7441.jsonl`
- Project-root audit/render docs:
  - `D:\Projects\Clients\Dad\Events4singles\docs\data-model-and-render-contract.md`
  - `D:\Projects\Clients\Dad\Events4singles\docs\render-cross-reference.md`
  - `D:\Projects\Clients\Dad\Events4singles\docs\render-field-map.csv`
- Rich scrape audit outputs in `D:\Projects\Clients\Dad\Events4singles\scrape-audit`.

Treat this file as the human-readable decision source. Treat the render/data docs and CSV as technical appendices.

## Current Build

- New app lives in `D:\Projects\Clients\Dad\Events4singles\new`.
- Current public dev target is `dev.events4singles.com`, deployed through Cloudflare Pages project `events4singles-v2`.
- The app is a static Next.js build backed at build time by SQLite.
- The active staging source is `listings.staging.db` when present. `src/lib/db.ts` prefers `E4S_DB_PATH`, then `listings.staging.db`, then `listings.db`.
- Public listing/category/city pages are template-driven from database queries in `src/lib/data.ts`.
- Current stylesheet source is `public/site.css`; `src/app/layout.tsx` links it with a cache-busting query string, currently `/site.css?v=20260813-restore`.
- Local development port convention is `10400` for the original new app and `10402` for the richer staging variant.
- Earlier Claude memory named the stack as Next.js 16, TypeScript, `better-sqlite3`, `site.css`, static generation, and Cloudflare Pages.

## Platform Direction

The project is intentionally SQLite-first, Supabase-later:

- Scrape legacy sources into SQLite.
- Verify visually and structurally on dev.
- Clean duplicates, images, banners, SEO, and rendering rules.
- Migrate to Supabase only after data is clean enough to justify a cloud source of truth.

Original future stack intent from Claude sessions:

- Supabase for auth, row-level security, and production database.
- Stripe for listing packages and paid add-ons.
- Advertiser portal for self-service listing management.
- Admin console for category/listing/banner/settings/SEO control.
- Cloudflare Pages remains the deploy target.

The legacy live site should not be disturbed until the new site is approved for launch and redirects/DNS are explicitly ready.

## Legacy Migration Model

Legacy Events for Singles content came from multiple sources:

- FrontPage/static legacy website folders.
- Backup folders and old `EventsForSingles.com` archives.
- Joomla/old database exports.
- WordPress backup/image archives.
- Scraped legacy HTML and banner/image assets.

Known file/source locations investigated or referenced:

- `D:\Projects\Clients\Dad\Events4singles\legacy\site`
- `F:\Work\Websites\Frontpage Sites\events4singles`
- `F:\Work\Websites\Backups\events4singles.com`
- `F:\Work\Websites\Backups\events4singles`
- `F:\Work\Admin\Dad\Events 4 Singles`
- `C:\Users\Matt\OneDrive\Cloud\Business\Dad Businesses\E4S-25-10-16.txt`
- `C:\Users\Matt\OneDrive\Cloud\Business\Dad Businesses\E4SDBase.txt`
- WordPress backup/image archive `EventsForSingles.zip`, especially `wp-content/uploads`

Important migration assumptions:

- Legacy listing pages and city/category pages were not always structurally clean.
- Some old titles were contaminated by body text, and some bodies began mid-sentence.
- Tables within tables and FrontPage HTML can place content into wrong scrape fields unless parsed carefully.
- A listing found on a city page can inherit that city as a placement if the listing itself lacks explicit city details.
- A listing found under category-page city headings can inherit that city/category placement.
- Legacy banner tiles are a separate display source from listing records and should not bleed from parent category pages into child city/category pages.
- Joomla SQL dumps can be a cleaner listing text source than table-scraped FrontPage HTML when they contain `stdlisting`, `listingheading`, `listingcontent`, and `listingcontact` structure.
- Joomla dumps are UTF-16 and need explicit UTF-16 reading.
- The legacy `events_[city].htm` pattern is city/location evidence, not a real `events` category placement.
- Old category pages may contain city/state headings as section dividers; listings below those headings inherit that location until the next heading.

## Legacy Cleanup Findings

Older Claude Code cleanup/audit work found:

- Legacy site is a FrontPage-era static HTML site, roughly 2001-2012, with shared borders, WebBot directives, inline tables, inline styles, and old scripts.
- Dead script/code sources included Widgetbox, `absolutebmxe`, old `urchin.js`, and Flash-era behavior.
- `.com.au` references were corrected toward `.com`, including email and visual references.
- The broken-background issue during cleanup was caused by missing `banner-e4s-2.jpg`, not the dead-script removal.
- Link/image audit found large-scale old-site problems: hundreds of missing images, many `_blank` inconsistencies, and very high inline-style debt.
- Decision: patching all FrontPage pages directly is poor leverage; the new database-driven platform is the real fix.

## Rich Scrape Audit

Rich scrape tool:

- `D:\Projects\Clients\Dad\Events4singles\tools\rich-scrape-legacy.py`

Main outputs:

- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\rich-listings-audit.db`
- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\rich-scrape-summary.json`
- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\title_body_suspects.csv`
- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\category_conflicts.csv`
- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\location_conflicts.csv`
- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\missing_images.csv`
- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\missing_context.csv`
- `D:\Projects\Clients\Dad\Events4singles\scrape-audit\image_suggestions.csv`

Audit result snapshot:

- 4,385 listing candidates.
- 996 canonical listing identities.
- 9,953 inventoried image files.
- Major sources included current legacy, frontpage backup, dotcom backup, admin archive, Joomla May 2016, and Joomla October 2016.
- Review buckets included category conflicts, location conflicts, missing image candidates, missing context, and likely title/body bleed records.

This audit should remain the evidence pool for any later second-pass import, image matching, and manual review queue.

## Data Model

Current public-facing tables used by the app:

- `businesses`: business/customer grouping record.
- `listings`: individual listing/content/contact record.
- `listing_placements`: where a listing displays by `category_slug` and/or `city_slug`.
- `banners`: advertising tile records for city/category banner rows.
- `categories`, `cities`: navigation, labels, and page metadata.

Current relationship:

- One `business_id` can own many listing IDs.
- One listing can have many placements across categories and cities.
- Listing URLs are still listing-based: `/listing/{name}-{listing_id}`.
- Detail pages show the listing plus other listings grouped under the same business/customer logic.

Intended extended schema from Claude memory:

- `businesses`: canonical business/brand/customer identity, with future `advertiser_id`.
- `listings`: specific service/branch/offering, with content, contact, location, image, status, confidence, source, and expiry fields.
- `listing_placements`: category/city display rows with sort order and paid/organic position type.
- `banners`: independent tile ad placements with page scope, slot position, start/end dates, and active flag.
- `listing_images`: multiple image candidates/alternates, with primary ordering.
- `advertisers` or Supabase auth user mapping later connects account access to one or more businesses.

Future backend relationship:

- Account/login owns or can manage one or more businesses.
- Business owns one or more listings.
- Listings can be moved between businesses by admin, claim token, transfer token, or verified ownership flow.
- Parent/child businesses may be added later with `parent_business_id` if franchises need separate child ownership under a parent brand.

## ID Policy

IDs are permanent audit identifiers.

- Do not reuse deleted listing IDs.
- Do not reuse deleted business IDs.
- Gaps in ID numbers are normal and should not be filled.
- New records should always use the next database sequence value.
- Deleting should normally mean status change, not hard deletion.

Recommended statuses:

- `active`: public and visible.
- `paused`: hidden temporarily, can return.
- `expired`: hidden due to plan/date expiry.
- `archived`: retained for history, not public.
- `deleted`: intentionally removed from public/admin active views, content retained.
- `merged`: old record retained, redirects/points to canonical record.

Recommended future fields:

- `deleted_at`
- `deleted_reason`
- `merged_into_listing_id`
- `merged_into_business_id`
- `created_by_account_id`
- `updated_by_account_id`

If a business leaves and comes back, reactivate or clone from the old record rather than reusing another ID.

## Business Consolidation Decisions

The initial staging database imported many businesses one-to-one with listings, so many `business_id` values originally matched `listing.id`.

Completed consolidations:

- Exact-name duplicate sweep consolidated clear duplicate business names.
- Contact-based sweep consolidated high-confidence groups with shared phone/mobile/email.
- `Connection Social Links` listings `134` and `258` now share `Business ID 134`.
- `Brisbane Walks` listing `303` and `Sydney Walks` listing `518` now share `Business ID 303`.
- `After Work Social Club`, `Eastern Europe Fully Guided Tour 2015`, `Singles Holiday Travel`, and `Singles World Travel` now share `Business ID 89`.

Backups made before consolidation:

- `listings.staging.before-business-consolidation-2026-08-13T07-37-07-822Z.db`
- `listings.staging.before-contact-consolidation-2026-08-13T08-29-37-199Z.db`

Manual review groups intentionally left unmerged:

- `WHAT'S ON`
- `Speed Dating`
- `Australian Link Back Partners`
- shared `events4singles` admin contacts
- old web-hosting/domain/SEO snippets
- scraped fragments such as `Where:`, quote snippets, and malformed promotional lines

Backend merge feature should support:

- Move listing to another business ID.
- Merge one business into another.
- Mark old business/listing as merged rather than hard-delete.
- Keep contact, placement, and audit history.
- Optionally redirect old public listing URL to canonical listing.

## Page Rendering Rules

City pages:

- Display listings placed in that city.
- Include category filter in the sort bar.
- Sidebar browse menu lists categories for that city.
- Listing cards show location/category context where useful.

Category pages:

- Display listings placed in that category.
- Include city filter in the sort bar.
- Sidebar browse menu lists cities for that category.
- Listing cards show city badges so duplicated/branch listings can be distinguished.

Category + city pages:

- Display listings matching both category and city.
- Banner tiles must come only from exact matching scope, not parent bleed.

Listing detail pages:

- Header shows business/listing title plus `Listing ID` and `Business ID`.
- Contact panel shows contact details, social placeholders, address/location, licence/ABN where present.
- Listed-on pills show city/category placements.
- Bottom card stack shows current listing plus related same-business listings.
- Each card in the bottom stack has external ID pills above the card, not inside it.
- Current listing card gets `Currently viewing`.

Filters:

- Sort bar supports A-Z/Z-A.
- City pages filter by categories.
- Category pages filter by cities.
- Filter dropdown supports select all and deselect all.
- Clear button resets filters to the full selected set.
- Long sidebar browse menus should keep real crawlable links in the HTML, but the list area may scroll internally so the sidebar ad remains visible.
- Sidebar browse headings/sorter controls stay fixed above the internal scroll region.

## Banner Rules

- Banner tiles are separate from listings.
- `banners.page_scope` controls city/category scope.
- Nightclubs banners are suppressed because legacy nightclubs pages did not have banners.
- Child pages should not inherit parent category banner tiles unless explicitly intended.
- If there are not enough banners to fill two rows, show one row only.
- Placeholder advertise tiles should appear where needed and link to `/advertise`.
- Tile banners need exact legacy-scope matching wherever possible: city, category, or category+city.
- Banner gaps should be solved with placeholder ad slots, not by borrowing from unrelated parent/child pages.

## SEO And URLs

Current decision:

- Canonical city/category URLs should use clean hyphenated slugs.
- Old underscore URLs should redirect as legacy fallbacks.
- Use `Events4Singles` for brand identity, but plain-language metadata should include `Events for Singles` where useful.
- Browser favicon/icon should use legacy Events4Singles identity, not generic Next icons.
- Images should have business/listing-based alt/title text rather than filename-only text.
- Category/city page metadata should be database/admin editable later.
- Slug edits in admin must write redirect records automatically.

## Brand And Design

- The legacy brand used a teal 3D `e4s` monogram with hot pink `events4singles` wordmark and Australia subtitle.
- The logo should not include `.com` as part of the core mark.
- Hot pink is the primary brand signal; teal is secondary/accent.
- Header phrase should read `Australian Singles Events Directory`.
- The site should look like a practical Australian singles directory with polish, not a generic landing page.
- Avoid duplicate or confusing navigation buttons; city/category browsing should be compact and purposeful.

## CSS And Frontend Decisions

- Existing stylesheet is large because it still contains legacy compatibility utilities plus modern `e4s-*` app CSS.
- New UI should use canonical `e4s-*` classes.
- Do not extend old FrontPage utility classes for new work.
- CSS has a table of contents and documented sections.
- Query-string cache busting was unreliable on `dev.events4singles.com`; use versioned CSS file paths when needed for deterministic deploys.

## Homepage Direction

The homepage still needs focused rebuild work. It should not feel like generic AI filler.

Desired homepage goals:

- Act as a useful directory front door, not a marketing-only landing page.
- Promote browsing by city and category in a compact, useful way.
- Include legacy-inspired editorial/resource areas:
  - dating tips and advice
  - singles news
  - success/help content
  - newsletter/member growth
- Include dating resources migrated or rewritten from old site material where useful.
- Include a `What's On` or events-calendar pathway, with clear distinction between directory listings and dated calendar events.
- Include a stronger advertising CTA and route users into a richer advertising/pricing page.
- Featured businesses can remain, but should feel intentional and paid-placement ready.
- Add a calendar/what's-on pathway without pretending the directory is only an event calendar.
- Improve counts and featured sections so they are data-driven or deliberately curated, not arbitrary.
- Support future membership/newsletter/giveaway growth mechanics.
- Reserve homepage promoted/featured business slots as a likely paid add-on.

## Advertising And Pricing

The advertising page needs a richer rebuild before launch.

It should explain and visually show:

- Standard listing.
- Featured listing.
- Premium/category priority placement.
- Tile banner advertising.
- Sidebar advertising.
- Homepage promoted business placement.
- Events calendar paid add-on.
- Optional newsletter/member promotion add-ons later.

Older package thinking included Free, Starter, Professional, and Premium tiers, with prices from early planning treated as drafts, not final commercial commitments.

Paid placement logic:

- A listing normally has both category and location placement where evidence supports it.
- Higher display position is a premium service, controlled by placement sort/order/position fields.
- Banner ads are separate products and should not be inferred from listing presence alone.

## Admin Console Pins

Future admin features needed:

- Listing/business merge and transfer workflow.
- Claim/transfer token for franchise or branch ownership.
- Broken image checker.
- Broken external link checker.
- Missing image asset matcher.
- Banner placement editor.
- SEO metadata editor per page/category/city/listing.
- Status/history/audit log for listing and business changes.
- Soft-delete, archive, restore, and merge records.
- Category editor for label, description, SEO intro, slug, redirects, and hero image.
- Listing editor for full CRUD, business assignment, placement management, status, and images.
- Banner editor for slot, page scope, image, click URL, active dates, and expiry.
- Settings editor for homepage featured slots, advertising copy, package details, and global SEO.

## Events Calendar

The events calendar is a Phase 2/3 feature, not the same thing as listings.

Planned architecture from Claude memory:

- `events` table with `id`, `listing_id`, `title`, `description`, `event_date`, `ticket_url`, and timestamps.
- Events can be scoped by city and/or category.
- UI should support list view and calendar grid view.
- Calendar placement is a paid add-on, ideally sold through Stripe and managed in the advertiser portal.
- Header `Events Calendar` should remain visually distinct from `Create Listing` / account actions.

## Open Work

- Build a polished homepage based on legacy strengths and current business goals.
- Create a proper advertising/pricing page with examples of listing card, featured listing, tile banner, sidebar ad, and homepage placement.
- Run a missing-image sweep and match likely local image files.
- Produce manual review reports for ambiguous business/contact merge groups.
- Document full DB schema in a machine-readable map.
- Decide whether to add `parent_business_id` now or wait until admin/franchise workflows require it.
- Eventually split CSS into cleaner files/modules once legacy compatibility is isolated.
