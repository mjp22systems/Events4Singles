# Events Integration Handoff

Updated: 2026-08-21 (Claude Code — push feature backend + UI brief)

## Codex work completed

- Public What's On:
  - Filter values now convert URL hyphen slugs back to DB underscore slugs before querying.
  - Filter bar toggle is right-aligned and filter/header overflow is visible.
  - Event cards with no ticket URL link to `/events/[id]`.
  - Added `/events/[id]` detail page with metadata and Event JSON-LD.
  - Calendar "+N more" expands inline to show all events for a day.
- Portal events:
  - City/category selects are loaded from D1 through `getAllCities()` and `getAllCategories()`.
  - Add/edit share one form.
  - Update/delete actions are guarded by `account_id`.
  - Portal delete blocks approved live events.
- Admin events:
  - Source filter added.
  - Pending rows have a quick approve action.
- Integrations:
  - Added `migrations/0008_integrations.sql`.
  - Added `src/lib/sync-engine.ts`.
  - Added Eventbrite pull adapter.
  - Added Meetup pull adapter.
  - Added portal integrations page and APIs.
  - Added admin integrations health page and APIs.
  - Added portal/admin side-nav links.
- Safety cleanup:
  - Fixed existing untracked `migrations/0006_fix_advertiser_accounts.sql` so it preserves `PRIMARY KEY`, `UNIQUE(clerk_user_id)`, and the Clerk index when recreating `advertiser_accounts`.

## Verification run

- Targeted ESLint on changed integration/event files: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.

Full `npm run lint` still fails on pre-existing/generated output and older unrelated app issues, especially `.open-next` and existing pages/components. The new changed-file target set passes.

## Bugs found and fixed by Claude Code (2026-08-20)

1. **`src/lib/adapters/eventbrite.ts`** — `category: event.category_id ?? null` changed to `category: null`. Eventbrite's numeric category ID is not a valid EFS slug; admin assigns category at approval time.
2. **`src/lib/adapters/shared.ts`** — `cityNameToDbSlug` return type changed to `string | null`. Fallback `"sydney"` removed; unknown cities now return `null` so they surface for admin review. `EventDraft.city` updated to `string | null` in `sync-engine.ts`.
3. **Admin sync routes** — `/admin/api/integrations/[id]/sync` and `/admin/api/integrations/sync-all` now return a redirect to `/admin/integrations` instead of JSON, so the HTML form buttons on the admin page work correctly.

---

## Codex follow-up completed (2026-08-20)

- Applied `migrations/0008_integrations.sql` to the local D1 database only after checking the local `integrations` table and `idx_events_source_id` index state.
- Added Eventbrite OAuth connect and callback routes:
  - `src/app/portal/connect/eventbrite/page.tsx`
  - `src/app/portal/connect/eventbrite/callback/route.ts`
- Extended `upsertPortalIntegration` so OAuth token fields can be stored alongside integration config.
- Added a Workers-compatible iCal adapter at `src/lib/adapters/ical.ts` and registered it in `src/lib/sync-engine.ts`.
- Fixed sync inserts to provide required `events.slug` and non-null `events.city` values. Unknown/import-unmapped city values are written as `unknown` so imports do not fail on the current D1 schema.
- Added `worker.js` as the Wrangler entrypoint. It delegates `fetch` to the generated OpenNext worker, re-exports OpenNext Durable Object classes, and adds a scheduled cron handler that syncs up to 10 integrations.
- Updated `wrangler.toml`:
  - `main = "worker.js"`
  - `[triggers] crons = ["0 */4 * * *"]`

`ical.js` was not added. `npm install ical.js` failed locally with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, so Codex used the hand-parser path explicitly allowed by this brief.

---

## Completed task details

### Task 1 — Apply D1 migration (local only)

Run against the local D1 first. Do NOT run remote — the user will run the remote apply manually.

```
cd D:\Projects\Clients\Dad\Events4singles\website
npx wrangler d1 execute events4singles --local --file=migrations/0008_integrations.sql
```

Before running, check whether the `integrations` table already exists in the local DB to avoid double-applying:

```
npx wrangler d1 execute events4singles --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name='integrations';"
```

If it returns a row, the migration is already applied — skip.

Also confirm `events` table has the partial unique index. If not, the upsert in `sync-engine.ts` will fail silently:

```
npx wrangler d1 execute events4singles --local --command="SELECT sql FROM sqlite_master WHERE type='index' AND name='idx_events_source_id';"
```

---

### Task 2 — Eventbrite OAuth routes

Build two new route files. Read `src/lib/portal-db.ts` and `src/app/api/portal/integrations/route.ts` first to understand the auth pattern.

**`src/app/portal/connect/eventbrite/page.tsx`** (server component)
- Calls `currentUser()` from `@clerk/nextjs/server`; redirects to `/portal/sign-in` if no user
- Calls `getAccount(user.id)` from `@/lib/portal-db`; 404 if no account
- Builds the Eventbrite OAuth authorize URL:
  - Base: `https://www.eventbrite.com/oauth/authorize`
  - Params: `response_type=code`, `client_id` from `process.env.EVENTBRITE_CLIENT_ID`, `redirect_uri` pointing at `/portal/connect/eventbrite/callback`
  - Include a `state` param (base64 of `account.id`) for CSRF protection
- Renders a simple redirect page or calls `redirect(authorizeUrl)` directly

**`src/app/portal/connect/eventbrite/callback/route.ts`** (GET handler)
- Reads `code` and `state` from `req.nextUrl.searchParams`
- Decodes `state` to get `account_id`; verify it matches the current Clerk user's account
- POSTs to `https://www.eventbriteapi.com/v3/system/oauth/token/` with:
  - `code`, `client_id` (`process.env.EVENTBRITE_CLIENT_ID`), `client_secret` (`process.env.EVENTBRITE_CLIENT_SECRET`), `grant_type=authorization_code`, `redirect_uri`
- On success, fetches the org ID: `GET https://www.eventbriteapi.com/v3/users/me/organizations/?token={access_token}` and takes `organizations[0].id`
- Calls `upsertPortalIntegration` from `@/lib/portal-db` with:
  - `platform: "eventbrite"`, `access_token`, `config: JSON.stringify({ org_id })`, `sync_status: "idle"`
- Redirects to `/portal/integrations` on success, `/portal/integrations?error=eventbrite` on failure

**Environment variables needed** (add to `.env.local`, do not commit values):
```
EVENTBRITE_CLIENT_ID=
EVENTBRITE_CLIENT_SECRET=
```

---

### Task 3 — iCal adapter

Check Cloudflare Workers compatibility first. Cloudflare Workers does not support Node.js `http`/`https` modules, so any iCal library must be fetch-based or pure-JS. Recommended: `ical.js` (pure JS, no Node dependencies). Confirm it is in `package.json`; if not, add it.

Build `src/lib/adapters/ical.ts` implementing `SyncAdapter`:

```typescript
import type { Integration } from "@/lib/admin-db";
import type { EventDraft, SyncAdapter } from "@/lib/sync-engine";
import { parseIntegrationConfig } from "@/lib/adapters/shared";
// use ical.js or hand-parse; do not use node:http
```

- Config shape: `{ "feed_url": "https://..." }`
- Fetch the feed URL with `fetch()` (no node http)
- Parse VEVENT blocks: extract `SUMMARY`, `DTSTART`, `DTEND`, `DESCRIPTION`, `LOCATION`, `URL`, `UID`
- Map to `EventDraft` — `source_id: uid`, `city: null` (iCal has no structured city field), `category: null`
- Register in `src/lib/sync-engine.ts` adapters map: `ical: icalAdapter`

---

### Task 4 — Cloudflare scheduled cron

Find the correct Worker entrypoint. With `@opennextjs/cloudflare`, the built Worker is at `.open-next/worker.js` after `npm run build:cf`. The source entrypoint that Wrangler uses is defined in `wrangler.toml` under `main`. Read that file first.

If OpenNext exposes a `scheduled` export hook, add it. If not, check whether `wrangler.toml` supports a secondary `[triggers] crons` entry pointing at a separate worker script.

The cron handler should call `listRunnableIntegrations()` and `runSync()` for up to 10 integrations. Use the same pattern as `src/app/admin/api/integrations/sync-all/route.ts` but as a `scheduled` export:

```typescript
export default {
  async scheduled(_event: ScheduledEvent, env: Env) {
    const integrations = await listRunnableIntegrations(); // needs getD1() with env.DB
    for (const integration of integrations.slice(0, 10)) {
      await runSync(integration, env.DB);
    }
  },
  // ... existing fetch handler from OpenNext
};
```

`wrangler.toml` cron schedule: `"0 */4 * * *"` (every 4 hours).

---

### Task 5 — Build verification

Run after all code is written — do not skip:

```
cd D:\Projects\Clients\Dad\Events4singles\website
npx tsc --noEmit
npm run build
npm run build:cf
```

Fix any type errors before finishing. Do not run `npx wrangler deploy` — the user handles remote deploy.

Codex verification completed:

```
npx tsc --noEmit
npm run build
npm run build:cf
npx wrangler deploy --dry-run
```

All passed. The Wrangler command was `--dry-run`; it did not deploy.

---

## Remaining deploy handoff

Remote D1 migration and Worker deployment were completed by Codex on 2026-08-20:

- Remote `migrations/0008_integrations.sql`: applied successfully.
- Remote `integrations` table: verified present.
- Remote `idx_events_source_id` partial unique index: verified present.
- Worker deployed: `events4singles-v2`
- Version ID: `a23a6484-b704-437d-b35e-abbfeb2a65ed`
- Worker URL smoke check: `https://events4singles-v2.dad-775.workers.dev` returned 200.
- Cron trigger deployed: `0 */4 * * *`
- Eventbrite secrets were set from the Eventbrite API key page screenshot:
  - `EVENTBRITE_CLIENT_ID`
  - `EVENTBRITE_CLIENT_SECRET`
- Live Eventbrite connect route smoke check: `https://events4singles.com/portal/connect/eventbrite` returns `307 /portal/sign-in` for an unauthenticated request.
- Follow-up live fix: `src/middleware.ts` now wraps the existing redirect middleware with Clerk's `clerkMiddleware`, resolving the production `currentUser()` runtime error on portal/API routes.

Cloudflare now has the required secrets:

```
EVENTBRITE_CLIENT_ID
EVENTBRITE_CLIENT_SECRET
```

---

## Constraints and patterns

- Stack: Next.js 16 App Router, TypeScript, Cloudflare Workers + D1
- No `better-sqlite3`. DB access: `getCloudflareContext({ async: true })` for API routes; `getD1()` (from `@/lib/admin-db`) for server-side lib functions
- Auth (portal): `currentUser()` from `@clerk/nextjs/server` + `getAccount(user.id)` from `@/lib/portal-db`
- Auth (admin): `requireAdmin()` from `@/lib/require-admin`
- DB slugs: underscores. URL slugs: hyphens. `toUrlSlug()` / `toDbSlug()` in `@/lib/constants`
- Do not run `npx wrangler deploy` — non-interactive shell has no `CLOUDFLARE_API_TOKEN`
- Do not run sync-all against the live remote DB without the user present

## Pre-existing portal-db note

`getEventsForAccount` in `src/lib/portal-db.ts` line 133 has a bug (`OR source = 'advertiser'` leaks cross-account events). The new portal events page uses `getPortalEvents` instead and is unaffected. Do not touch this function — leave it for a separate cleanup session.

---

## Codex — Push feature UI + admin events bulk actions (2026-08-21)

### What Claude Code already built (do not redo)

- `migrations/0016_event_push.sql` — adds `push_platform`, `push_id`, `push_url`, `push_at`, `is_visible` columns to `events`
- `src/app/api/portal/events/[id]/push/route.ts` — portal push route (POST, account-guarded)
- `src/app/admin/api/events/[id]/push/route.ts` — admin push route (POST, requireAdmin)

Apply the migration locally before starting:
```
npx wrangler d1 execute events4singles --local --file=migrations/0016_event_push.sql
```

---

### Task 1 — Portal events: Push to Eventbrite button

File: `src/app/portal/(shell)/events/events-client.tsx`

Read the file first to understand the existing event card/row structure.

Add a "Push to Eventbrite" button on each event row, shown only when ALL of:
- `hasPushIntegration` prop is true (see below)
- `event.status === "approved"`
- `event.push_id` is null/undefined (not already pushed)

When clicked, `fetch("POST", /api/portal/events/${event.id}/push, { platform: "eventbrite" })` then reload.

After a successful push, the button becomes a "View on Eventbrite ↗" link using `event.push_url`.

**`hasPushIntegration` prop:** In `src/app/portal/(shell)/events/page.tsx`, after fetching integrations with `listPortalIntegrations(account.id)`, pass `hasPushIntegration={integrations.some(i => i.platform === "eventbrite" && i.push_enabled === 1)}` to the client component.

**Error display:** if the push API returns a non-ok response, show the `error` field from the JSON body inline near the button (small red text, not a full-page error).

---

### Task 2 — Admin events page: client component + bulk actions

Convert `src/app/admin/(shell)/events/page.tsx` to a hybrid: keep the server component for data fetching, extract the table into a new client component `src/app/admin/(shell)/events/events-table.tsx`.

**Row checkboxes:**
- Add a checkbox column as the first `<th>`/`<td>`
- "Select all on page" checkbox in `<thead>`
- Track selected IDs in local state

**Bulk action bar** (appears when ≥1 row selected, fixed to bottom or top of table):
- Approve button → `POST /admin/api/events/bulk` `{ ids, action: "approve" }`
- Reject button → `POST /admin/api/events/bulk` `{ ids, action: "reject" }`
- Hide / Show toggle → `POST /admin/api/events/bulk` `{ ids, action: "hide" }` / `"show"` (sets `is_visible`)
- Delete button → confirm dialog → `POST /admin/api/events/bulk` `{ ids, action: "delete" }`
- "Push to ▾" dropdown → currently only option is "Eventbrite" → iterates selected IDs, calls `POST /admin/api/events/${id}/push` for each sequentially, reports results

**Per-row actions dropdown** (replace current inline buttons):
Replace the inline Edit / Approve / Tickets buttons with a single "Actions ▾" dropdown per row containing:
- Edit → link to `/admin/events/${id}`
- Approve (if pending)
- Reject (if not rejected)
- Hide / Show (toggle `is_visible`)
- Push to Eventbrite (if not yet pushed and account has Eventbrite integration)
- View on Eventbrite ↗ (if `push_url` exists)
- Delete → confirm → `DELETE /admin/api/events/${id}`

**Bulk API route** — build `src/app/admin/api/events/bulk/route.ts`:
- POST, `requireAdmin()`
- Body: `{ ids: string[], action: "approve" | "reject" | "hide" | "show" | "delete" }`
- Maps action to SQL: approve/reject → `UPDATE events SET status = ? WHERE id IN (...)`, hide/show → `UPDATE events SET is_visible = ? WHERE id IN (...)`, delete → `DELETE FROM events WHERE id IN (...) AND status != 'approved'`
- Returns `{ ok: true, affected: number }`

**Admin event delete route** — check if `src/app/admin/api/events/[id]/route.ts` exists; if not, create it with a DELETE handler using `requireAdmin()` and `DELETE FROM events WHERE id = ?`.

---

### Task 3 — Admin integrations page: push_enabled + auto_approve toggles

File: `src/app/admin/(shell)/integrations/page.tsx`

The page is currently server-rendered. Convert to a hybrid: keep server fetch, extract the table into `src/app/admin/(shell)/integrations/integrations-table.tsx` as a client component.

Add two toggle columns to the table:
- **Auto-approve** — checkbox, PATCH `/admin/api/integrations/${id}` `{ auto_approve: bool }`
- **Push enabled** — checkbox, PATCH `/admin/api/integrations/${id}` `{ push_enabled: bool }`

**Admin integration PATCH route** — build `src/app/admin/api/integrations/[id]/settings/route.ts`:
- PATCH, `requireAdmin()`
- Body: `{ auto_approve?: boolean; push_enabled?: boolean }`
- `UPDATE integrations SET auto_approve = ?, push_enabled = ?, updated_at = datetime('now') WHERE id = ?`
- Returns `{ ok: true }`

---

### Task 4 — Build verification

```
npx tsc --noEmit
npm run build
npm run build:cf
```

Fix all type errors. Do not run `npm run deploy:dad`.

---

### Key rules reminder

- `events.city TEXT NOT NULL` — never INSERT/UPDATE city to null; use `"unknown"` if unresolvable
- Admin auth: `requireAdmin()` from `@/lib/require-admin`
- Portal auth: `currentUser()` + `getAccount(user.id)` from `@/lib/portal-db`
- `getCloudflareContext({ async: true })` for DB access in API routes
- Do not run wrangler deploy — user handles that
