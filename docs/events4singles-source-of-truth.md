# Events4Singles Source Of Truth

Last updated: 2026-08-29

## Operational Source Of Truth

- Canonical repo: `D:\Projects\Clients\Dad\Events4singles\website` (`D:/Projects/Clients/Dad/Events4singles/website`).
- GitHub remote: `https://github.com/mjp22systems/Events4Singles.git`.
- Production Worker: `events4singles-v2`.
- Production D1 database: `events4singles`.
- Current production domain: `https://events4singles.com`.
- Production alias: `https://events4singles.com.au`.
- Legacy Pages domain: `https://legacy.events4singles.com`, backed by Cloudflare Pages project `events4singles`.
- Legacy-clean Pages domain: `https://legacy-clean.events4singles.com`, backed by Cloudflare Pages project `events4singles-clean`.
- No `site-clean.events4singles.com` DNS record was present on 2026-08-27.
- Deploy command: `npm run deploy:dad`.
- Cache purge command: `npm run cache:purge`.
- Project config registry: `D:\Projects\Clients\Dad\Events4singles\website\project.config.json`.
- Project config audit command from `website`: `npm run config:audit` (`node tools/audit-project-config.mjs`).
- Graphify target: run Graphify from `D:\Projects\Clients\Dad\Events4singles` when the task needs the full project picture, including repo docs and top-level audit notes. Use `.graphifyignore` to exclude generated output, dependency folders, lock/build artifacts, and images unless the task specifically asks for media analysis.
- Graphify output: `D:\Projects\Clients\Dad\Events4singles\graphify-out`, ignored by Git.
- Project memory refresh command from `website`: `npm run memory:refresh`.
- Project memory hook install command from `website`: `npm run memory:hook`.
- Project memory status command from `website`: `npm run memory:status`.
- Project memory audit log: `D:\Projects\Clients\Dad\Events4singles\graphify-out\refresh-log.jsonl`.
- Project memory failure log: `D:\Projects\Clients\Dad\Events4singles\graphify-out\refresh-errors.log`.
- Project memory lock file during active refreshes: `D:\Projects\Clients\Dad\Events4singles\graphify-out\refresh.lock`.
- Archive location for old sessions, release folders, local DB snapshots, and moved legacy non-image assets: `D:\Projects\Clients\Dad\Events4singles-archive`.

The parent folder `D:\Projects\Clients\Dad\Events4singles` is only a container. Do not create release clones, temporary worktrees, one-off deploy copies, scrape outputs, or database backup piles there. If a future release needs a disposable working copy, put it under `D:\Projects\Clients\Dad\Events4singles-archive\scratch` or another clearly named archive/scratch folder outside the active project container.

Current cleanup rule: the active repo should contain source, tracked migrations, tracked tools, tests, public assets needed by live data, and documentation. Generated folders such as `.next`, `.open-next`, `.wrangler`, reports, local SQLite snapshots, and QA screenshots are not source of truth.

Backup and scratch folders in the parent project container, including `repo-state-backups`, `website-hero-release`, `website-image-classify`, `website-image-clean-deploy`, `website-image-source-clean-deploy`, and `website-push-audit-sweep3`, are not source-of-truth inputs. Neither is `website/tmp`, which holds local DB backups and audit output. These paths must be excluded from `.graphifyignore` and should be moved to `D:\Projects\Clients\Dad\Events4singles-archive` when no longer needed.

## Project Memory Loop

The durable project memory loop is:

1. Update code, tests, docs, or source assets.
2. Run relevant verification.
3. Run `npm run memory:refresh` from `website`.
4. Run `npm run memory:status` from `website` when checking whether the graph, hook, and refresh log are healthy.
5. Use `graphify query`, `graphify path`, or `graphify explain` from the parent project root before answering architecture questions.
6. If Graphify reveals drift, update the source-of-truth docs, tests, or code and refresh again.

The loop must fail closed on governance drift. `npm run memory:refresh` runs `npm run config:audit` first. The audit checks that agent instruction files point at this document, do not reference retired project briefs, and that the current graph is not carrying nodes sourced from backup or scratch folders. If those checks fail, fix the source boundary or documentation pointer first, then rebuild or refresh Graphify.

The website repo also has a local post-commit hook installer: `npm run memory:hook`. The hook calls `tools/refresh-project-memory.mjs` after commits, so committed code changes refresh the parent `graphify-out` automatically. Hook failures are non-blocking for Git commits, but they are recorded in `graphify-out\refresh-log.jsonl` and `graphify-out\refresh-errors.log` so later sessions can audit them. It is a safety net, not a replacement for an explicit `memory:refresh` during active uncommitted work.

The refresh script uses `graphify-out\refresh.lock` to prevent overlapping manual and post-commit refreshes. If Graphify reports community label drift, run `graphify label` from the parent project root. On this machine, `graphify label` can recluster and rewrite graph outputs without semantic names unless an LLM backend/API key is configured.

## Canonical Folder Map

For this Next.js/TSX app, `website` will not look like a classic static HTML folder, but it has the same basic roles:

- `src/app`: route pages and layouts. This is the TSX equivalent of the site's HTML pages.
- `src/components`: reusable page sections and UI pieces.
- `src/lib`: shared data access, routing, SEO, and server helpers.
- `public`: files served directly by the site, including `site.css`, admin/portal CSS, fonts, and `public/images`.
- `migrations`: versioned Cloudflare D1 schema/data changes.
- `tools`: repeatable scripts for deploy, cache purge, data import/export, smoke preparation, SEO/image audits, and maintenance.
- `tests`: focused regression and smoke tests.
- `docs`: source-of-truth notes, runbooks, and project decisions.
- Root config files: Next.js, Wrangler, TypeScript, Playwright, ESLint, package lock, and agent instructions.

Files that do not belong in the canonical source tree include release clones, copied live folders, one-off backup folders, local database snapshots, generated build output, browser screenshots, scrape dumps, and old HTML/PDF/SWF assets stored inside `public/images`. Preserve anything uncertain under `D:\Projects\Clients\Dad\Events4singles-archive` instead of leaving it in the active repo.

This document is the working project bible for the rebuilt Events4Singles website, staging database, legacy migration, and planned backend/admin console. It captures decisions made during the rebuild so they are not trapped in chat history.

## Source Coverage

This document was seeded from historical notes and prior audit outputs. Some original seed paths have since been archived or removed from the active project tree; do not treat a listed seed path as live source unless it still exists.

- The current Codex task conversation through 2026-08-13.
- Cortex memories for Events4Singles decisions and session checkpoints.
- Claude Code local memory files in `C:\Users\Matt\.claude\projects\D--Projects-Clients-Dad-Events4singles\memory`.
- Claude Code transcript files:
  - `C:\Users\Matt\.claude\projects\D--Projects-Clients-Dad-Events4singles\a4d3da05-e78b-4bb7-af8c-ca0d6995e62f.jsonl`
  - `C:\Users\Matt\.claude\projects\D--Projects-Clients-Dad-Events4singles\8446afb3-daa6-49ca-93b8-96ebc47d7441.jsonl`
- Historical project-root audit/render docs that may now be archived:
  - `D:\Projects\Clients\Dad\Events4singles\docs\data-model-and-render-contract.md`
  - `D:\Projects\Clients\Dad\Events4singles\docs\render-cross-reference.md`
  - `D:\Projects\Clients\Dad\Events4singles\docs\render-field-map.csv`
- Historical rich scrape audit outputs that may now be archived from `D:\Projects\Clients\Dad\Events4singles\scrape-audit`.

Treat this file as the human-readable decision source. Treat the render/data docs and CSV as technical appendices.

## Current Build

- Active app lives in `D:\Projects\Clients\Dad\Events4singles\website`.
- Current public target is `events4singles.com`, deployed through Cloudflare Worker `events4singles-v2` on the Dad account.
- The app is a Next.js 16 App Router build deployed with `@opennextjs/cloudflare`, backed by Cloudflare D1.
- Public listing/category/city pages are template-driven from database queries in `src/lib/data.ts`.
- Current stylesheet source is one canonical file: `public/site.css`. Do not create extra versioned CSS files for routine edits.
- `next.config.ts` sets `/site.css` to `Cache-Control: no-cache, max-age=0, must-revalidate` so CSS revalidates while the site is actively being worked on.
- Local development port convention is `10400`.
- Earlier Claude memory named the stack as static Next/SQLite/Cloudflare Pages. That is outdated for the active `website` app.

## Deploy And Cache Access

Cloudflare access is through API-token environment variables, not browser login:

- `CLOUDFLARE_API_TOKEN_DAD`
- `CLOUDFLARE_ACCOUNT_ID_DAD`
- Zone ID for `events4singles.com`: `c5fe90c1608ef88a0dca1e1cb96bcf2c`

Do not treat `wrangler whoami` failure as proof deploy/cache access is unavailable. This machine may not be browser-authenticated, but token-backed Cloudflare API access exists.

Preferred commands:

```powershell
npm run deploy:dad
npm run cache:purge
```

`npm run deploy:dad` maps the Dad env vars to Wrangler's expected `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, runs `npm run build:cf`, and deploys. It also sets `NODE_TLS_REJECT_UNAUTHORIZED=0` for this local Windows environment because Wrangler's Node fetch can fail here with a local certificate-chain/proxy mismatch.

`npm run cache:purge` purges Cloudflare cache directly through the Cloudflare API. Use it after deploys or when live pages appear stale. Do not solve cache visibility by multiplying stylesheet filenames.

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
- Cloudflare Worker `events4singles-v2` is the deploy target for the current rebuilt site. Cloudflare Pages is only retained for the legacy/reference deployments listed above.

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
- Banner rows must always render as complete rows: 6 slots for one row or 12 slots for two rows.
- If there are not enough real banners to complete the selected row count, fill the remaining slots with placeholder advertise tiles linking to `/advertise`.
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
- 404s are tracked in `not_found_hits`; the public 404 page logs the missed URL, suggests likely current city/category/event pages, and keeps the response `noindex`.
- Detailed URL, metadata, redirect, and 404 rules live in `docs/seo-redirects-404.md`.

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

Current portal moderation rule:

- Advertiser-created, edited, or imported events must land in `pending` and require admin approval before they appear on the public calendar.
- The advertiser portal can hide owned events, delete non-approved events, and submit/re-submit events for admin review. It must not mark an event `approved` directly.
- Integration `auto_approve` is an admin-side control. The advertiser portal should describe imported events as review submissions and should not expose a self-service auto-approve toggle.
- Eventbrite push behavior for both admin and advertiser portal routes is owned by `src/lib/eventbrite-push-service.ts`. Route files should only handle auth, account scoping, request parsing, redirect/JSON response shaping, and then call `pushEventToEventbrite`.

## Open Work

- Build a polished homepage based on legacy strengths and current business goals.
- Create a proper advertising/pricing page with examples of listing card, featured listing, tile banner, sidebar ad, and homepage placement.
- Wire public promotion analytics end to end. Page-top banner tiles should normally link to the Events4Singles business/profile page first, with direct external click-through reserved for explicit paid campaign URLs. Track banner impressions, banner clicks, listing-card clicks, profile clicks, website clicks, booking clicks, and city/category source context before navigation.
- Replace publicly exposed phone/email links with reveal controls backed by `/api/portal/reveal`. Split reveal intent from final contact action where possible, for example `reveal_phone` then `click_phone`, so portal stats can distinguish "shown contact details" from "tapped to call/email".
- Add aggregation or scheduled processing from `analytics_events` into `analytics_daily`, or update portal dashboards to read recent event rows directly until aggregation exists. The current portal analytics page expects `analytics_daily`.
- Run a missing-image sweep and match likely local image files.
- Produce manual review reports for ambiguous business/contact merge groups.
- Document full DB schema in a machine-readable map.
- Decide whether to add `parent_business_id` now or wait until admin/franchise workflows require it.
- Eventually split CSS into cleaner files/modules once legacy compatibility is isolated.
