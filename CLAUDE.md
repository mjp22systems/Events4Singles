@C:\Users\Matt\.claude\CLAUDE.md

# CLAUDE.md — Events4Singles

## This file
Single source of truth for this project only.
For D:\ folder map and project registry: C:\Users\Matt\.claude\CLAUDE.md
Config (ports, services, machine facts): D:\Config\ — read before touching any port or service.

## This project
Events4Singles platform rebuild. Australian singles events directory.
- Status: Phase 1 complete — migrating to Cloudflare D1, deploying to CF Pages
- Stack: Next.js 15 App Router, TypeScript, Tailwind CSS, Cloudflare Pages + D1
- Local: D:\Projects\Clients\Dad\Events4singles\dev
- Legacy static site: D:\Projects\Clients\Dad\Events4singles\legacy\site (stays live during build)
- Cloudflare Pages project: events4singles (already exists, connected to GitHub main branch)
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
- dev/ — active platform (this folder). All work goes here.
- legacy/ — static site backups. Do not touch.
- site-clean/ — local reference copy. Do not touch.
- new/ — OLD copy, locked by OS, safe to delete after reboot.

## Phase tracking
- Phase 1: Foundation — COMPLETE (admin console, listings, businesses, categories, cities, tools)
- Phase 1.5 (NOW): D1 migration + CF Pages deployment — single source of truth
- Phase 2: Portal + Payments — auth, advertiser portal, Stripe subscriptions
- Phase 3: Events + Features — calendar, search, analytics, priority placement
- Phase 4: Launch — DNS switch, events4singles.com goes live
