# SEO URLs, Redirects And 404 Handling

This is the working map for Events4Singles public URLs, SEO metadata, legacy redirects and 404 tracking.

## Public URL Rules

- Canonical city URLs use one clean path: `/sydney`, `/melbourne`, `/brisbane`.
- Canonical category URLs use one clean path: `/speed-dating`, `/dinner-parties`.
- Canonical category plus city URLs use `/category/city`, for example `/speed-dating/sydney`.
- Database slugs may use underscores. Public URLs convert underscores to hyphens through `toUrlSlug()` and convert back through `toDbSlug()`.
- Listing URLs use `/listing/name-slug-id`; profile URLs use `/profile/name-slug-id` unless a paid custom business profile slug exists.

## Titles And Meta

- Root metadata defaults live in `src/app/layout.tsx`.
- Reusable title, description, canonical and social metadata helpers live in `src/lib/seo.ts`.
- City and category pages read admin-editable SEO fields from `cities.seo_title`, `cities.seo_description`, `categories.seo_title`, `categories.seo_description` and `categories.seo_intro`.
- If those fields are empty, page components build fallback titles and descriptions from the city/category label.
- Public 404 pages are `noindex, follow` so missed URLs do not become indexable pages.

## Redirect Layers

1. `next.config.ts` contains hardcoded product redirects such as `/locations -> /cities`. These require a redeploy.
2. The D1 `redirects` table contains admin-managed permanent redirects. Middleware checks this table before public route handling and returns a 301 when `from_path` matches exactly.
3. Public page components may also call `redirect()` or `permanentRedirect()` for canonical cleanup inside a known route.

Avoid redirect chains. Prefer sending every old URL directly to the final canonical URL.

## 404 Tracking

- `src/app/not-found.tsx` renders the public 404 page.
- `src/components/not-found-helper.tsx` detects `window.location.pathname`, posts it to `/api/not-found`, and renders suggested destinations.
- `src/app/api/not-found/route.ts` records the missed path in D1 and returns suggestions.
- `not_found_hits` stores aggregate counts by normalised path, with `hit_count`, `first_seen`, `last_seen`, `referrer` and `resolved_at`.
- The admin Redirects page shows unresolved 404 candidates above active redirects. Creating a redirect for a missed URL marks that 404 candidate as resolved.

## Suggestion Logic

The 404 API normalises old-style URLs before matching:

- strips query/hash fragments
- strips legacy file extensions like `.html`, `.htm`, `.php`
- converts underscores and spaces to hyphens
- removes simple trailing numeric variants, so `/Sydney_2.html` can suggest `/sydney`
- scores likely city and category matches from the live `cities` and `categories` tables

Suggestions are guidance only. They do not redirect automatically because a guessed 301 can send search engines and visitors to the wrong intent. Admin should add a redirect once the hit pattern is clear.

## Admin Operating Rule

Review 404 candidates regularly. If a missed URL has repeated hits and a clear modern equivalent, create a redirect from the missed path to the final canonical URL. If the missed URL points to an obsolete listing or category with no equivalent, leave the 404 page in place and let it suggest broad city/category/event pages.
