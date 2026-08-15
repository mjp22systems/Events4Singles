@C:\Users\Matt\.claude\CLAUDE.md

# CLAUDE.md — Events4Singles

## This file
Single source of truth for this project only.
For D:\ folder map and project registry: C:\Users\Matt\.claude\CLAUDE.md
Config (ports, services, machine facts): D:\Config\ — read before touching any port or service.

## This project
Events4Singles platform rebuild. Australian singles events directory.
- Status: Phase 1.5 complete — deployed to Cloudflare Workers (Dad account) with D1 database
- Stack: Next.js 16 App Router, TypeScript, Tailwind CSS, Cloudflare Workers + D1
- Local: D:\Projects\Clients\Dad\Events4singles\website
- Legacy static site: D:\Projects\Clients\Dad\Events4singles\legacy\site (stays live during build)
- Cloudflare Worker: events4singles-v2 (Dad account: 77513f974459dd7d8a1183712e0f41fd)
- D1 database: events4singles (0359c4e2-60ac-4037-8e56-f661971bd31a, Dad account)
- Port key: events4singles = 10400 (in D:\Config\ports.json)

## DB
- Dev: Cloudflare D1 (local via wrangler) — database binding name: DB
- Prod: Cloudflare D1 — same binding, different database ID
- NO better-sqlite3 — removed in D1 migration
- Admin console and public site both use the same D1 binding

## Key rules
- Cities: sydney, melbourne, brisbane, perth, adelaide, gold-coast, canberra
- Categories: speed-dating, dinner-parties, dance-classes, social-clubs, life-coaches, adventure
- Tier system: Free, Starter ($39), Professional ($99), Premium ($249)
- All content migrated from legacy site — never delete legacy site during build
- Admin password: see .env.local (ADMIN_PASSWORD_HASH)
- Brand color: teal (#0D9488 / #0f766e)

## Folders (Events4singles root)
- website/ — active platform (this folder). All work goes here.
- legacy/ — static site backups + migration data. Do not touch.
  - legacy/site/ — original live site
  - legacy/site-clean/ — cleaned reference copy
  - legacy/migration-data/ — audit JSONs, scrape scripts, old listings.db

## Deploy sequence
Always run all three steps — skipping build:cf leaves .open-next stale:
1. `npm run build` (Next.js build → .next/)
2. `npm run build:cf` (OpenNext → .open-next/)
3. `npx wrangler deploy`

## Phase tracking
- Phase 1: Foundation — COMPLETE (admin console, listings, businesses, categories, cities, tools)
- Phase 1.5: D1 migration + CF Workers deployment — COMPLETE
- Phase 2: Portal + Payments — auth, advertiser portal, Stripe subscriptions
- Phase 3: Events + Features — calendar, search, analytics, priority placement
- Phase 4: Launch — DNS switch, events4singles.com goes live
