@C:\Users\Matt\.claude\CLAUDE.md

# CLAUDE.md — Events4Singles

## This file
For D:\ folder map and project registry: C:\Users\Matt\.claude\CLAUDE.md
Config (ports, services, machine facts): D:\Config\ — read before touching any port or service.

## ⚠ Read before acting
**Full project brief, all locked decisions, terminology rules, routing structure, DB schema, phase tracking:**
`D:\Projects\Clients\Dad\Events4singles\docs\project-brief.md`

Read that file at session start and before any structural, naming, or routing decision.
Do not rely on memory or assumptions — the brief is the authority.

## This project
Events4Singles platform rebuild. Australian singles directory (not just events).
- Status: Phase A complete — deployed to Cloudflare Workers, terminology renamed, 130+ legacy redirects live
- Stack: Next.js 16 App Router, TypeScript, Cloudflare Workers + D1
- Local: D:\Projects\Clients\Dad\Events4singles\website
- Legacy static site: D:\Projects\Clients\Dad\Events4singles\legacy\site (stays live, do not touch)
- Cloudflare Worker: events4singles-v2 (Dad account: 77513f974459dd7d8a1183712e0f41fd)
- D1 database: events4singles (0359c4e2-60ac-4037-8e56-f661971bd31a, Dad account)
- Port key: events4singles = 10400 (in D:\Config\ports.json)
- Live site: https://events4singles.com (DNS live — Worker is production. workers.dev is an alias only.)

## DB
- Dev: Cloudflare D1 local via wrangler — binding name: DB
- Prod: Cloudflare D1 remote — same binding name, different DB ID
- No better-sqlite3 (removed in D1 migration)
- Admin and public site share the same D1 binding

## Key rules (summary — full rules in project-brief.md)
- URL structure is category-first: /dance-classes/sydney (never /sydney/dance-classes)
- DB slugs use underscores, URL slugs use hyphens — auto-converted by toUrlSlug()/toDbSlug()
- Neutral term for all directory entries: "listings" — never force "events" onto non-event content
- "Categories" not "Event Types" — this rename is complete and locked
- analytics_events.event_type is an analytics field, NOT a listing category — never rename it
- Brand color: teal (#0D9488 / #0f766e)
- Admin password: see .env.local (ADMIN_PASSWORD_HASH)

## Folders
- website/ — active platform. All dev work here.
- legacy/ — static site backups + migration data. Never touch.
- docs/ — project brief, decisions, terminology rules

## Deploy sequence
GitHub `main` is the source of truth. Cloudflare production must only be deployed from a clean local `main` that exactly matches `origin/main`.

Project keyword: **Release** means save the intended work in Git, push it to GitHub, then make it live using the locked deploy process. If Matt says "release this", "make this live", or "ship it", follow the full sequence: review `git status`, commit only the intended changes, push, switch/update to clean `main`, then run `npm run deploy:dad`.

Use the Dad Cloudflare API-token env vars. Do not stop at `wrangler whoami`; this machine is not browser-authenticated, but API deploy access exists through:
- `CLOUDFLARE_API_TOKEN_DAD`
- `CLOUDFLARE_ACCOUNT_ID_DAD`

Preferred commands:
```powershell
npm run deploy:dad
npm run cache:purge
```

`npm run deploy:dad` is intentionally guarded. It refuses to deploy unless the working tree is clean, the branch is `main`, local `main` equals `origin/main`, and build/smoke checks pass. Do not bypass it with raw `wrangler deploy` except for an explicitly approved emergency rollback.

Manual equivalent if needed:
```powershell
npm run build
npm run build:cf
$env:CLOUDFLARE_API_TOKEN = $env:CLOUDFLARE_API_TOKEN_DAD
$env:CLOUDFLARE_ACCOUNT_ID = $env:CLOUDFLARE_ACCOUNT_ID_DAD
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
npx wrangler deploy
node tools/purge-cloudflare-cache.mjs
```

Skipping `build:cf` leaves `.open-next` stale. If CSS changes are not visible, purge Cloudflare via `npm run cache:purge`; do not create extra stylesheet files.

## Phase tracking (summary — detail in project-brief.md)
- Phase 1: Foundation — ✅ COMPLETE
- Phase 1.5: D1 migration + CF Workers — ✅ COMPLETE
- Phase A: DB foundation + terminology rename + legacy redirects — ✅ COMPLETE 2026-08-19
- Phase B: Content migration for empty categories — ✅ COMPLETE 2026-08-19
- Phase C: DB cleanup (listing_type, dance collapse, unplaced listings) — ✅ COMPLETE 2026-08-19
- Phase D: Listing template variants — ✅ COMPLETE 2026-08-20
- Phase E: Homepage intent-group tiles — ✅ COMPLETE 2026-08-20
- Phase 2: Portal + Payments — ⏳ pending
- Phase 3: Events + Features — ⏳ pending
- Phase 4: Launch — ⏳ pending
