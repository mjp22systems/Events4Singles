@C:\Users\Matt\.claude\CLAUDE.md

# CLAUDE.md — Events4Singles (New Platform)

## This file
Single source of truth for this project only.
For D:\ folder map and project registry: C:\Users\Matt\.claude\CLAUDE.md
Config (ports, services, machine facts): D:\Config\ — read before touching any port or service.

## This project
Events4Singles platform rebuild. Australian singles events directory.
- Status: Phase 1 active (foundation + content)
- Stack: Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase, Stripe
- Local: D:\Projects\Clients\Dad\Events4singles\new
- Legacy static site: D:\Projects\Clients\Dad\Events4singles\legacy\site (stays live during build)
- Cloudflare Pages project (new): events4singles-v2 (to be created)
- Port key: events4singles = 10400 (in D:\Config\ports.json)

## Key rules
- Cities: sydney, melbourne, brisbane, perth, adelaide, gold-coast, canberra
- Categories: speed-dating, dinner-parties, dance-classes, social-clubs, life-coaches, adventure
- Tier system: Free, Starter ($39), Professional ($99), Premium ($249)
- All content migrated from legacy site — never delete legacy site during build
- Supabase project: not yet created (set up in Phase 2)
- Stripe: not yet configured (set up in Phase 2)
- Brand color: teal (#0D9488 / #0f766e)

## Phase tracking
- Phase 1 (Wk 1–4): Foundation — scaffold, schema, city/category pages, listing cards ACTIVE
- Phase 2 (Wk 5–8): Portal + Payments — auth, advertiser portal, Stripe subscriptions
- Phase 3 (Wk 9–11): Events + Features — calendar, search, analytics, priority placement
- Phase 4 (Wk 12–14): Launch — content migration, DNS switch
