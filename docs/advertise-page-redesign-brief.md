# Events4Singles Advertise Page Redesign Brief

Last updated: 2026-08-23

## Goal

Rebuild `/advertise` into a sharp, modern sales page for event organisers, venues, dating services, activity providers, travel operators, coaches, and other singles-related businesses.

The page must clearly show every advertising product available on Events4Singles, explain where each placement appears, and make pricing easy to understand. It must not reuse old legacy screenshot images. All examples should be fresh, either built as live UI mock modules using the current site design or captured from the rebuilt site after the visual style is approved.

## Current Advertising Surfaces In The App

These are the monetisable surfaces the page should explain and visually demonstrate.

1. Standard directory listing
   - Current component: `src/components/listing-card.tsx`.
   - Appears on city pages, category pages, and category plus city pages.
   - Shows business name, tagline, description, image/logo, location badges, verified/unclaimed status, contact actions, promo text, and link to full listing.

2. Featured listing
   - Current ordering logic: `src/lib/data.ts` sorts `premium`, then `featured`, then standard listings.
   - Current placeholder component: `src/components/feature-slot-card.tsx`.
   - Appears at or near the top of listing stacks.
   - Should be sold as a higher visibility listing treatment, not the same thing as a banner ad.

3. Sticky or priority listing positions
   - Related to `listing_placements` and `listing_type`.
   - Used for city/category/category-city ranking.
   - Should be explained as limited priority positions on relevant pages.
   - Best commercial language: "Priority placement in your selected city, category, or city plus category page."

4. Page-top banner tile row
   - Current component: `src/components/promo-banners.tsx`.
   - Appears above listings on city, category, and category plus city pages.
   - Current logic supports one row of 6 tiles or two rows of 12 tiles.
   - Placeholder ad tiles link to `/advertise`.
   - Scope must be exact: city, category, or category plus city. Do not imply banners bleed into unrelated pages.

5. Right-hand column advertising
   - Current component: `src/components/page-sidebar.tsx`.
   - Appears beside city/category browse navigation.
   - Uses `e4s-sidebar-ad` with the advertise placeholder image.
   - Should be positioned as a persistent visibility slot beside the browse/filter area on desktop, with mobile treatment shown as an inline sponsored block.

6. Listing-stack advertiser card
   - Current component: `src/components/advertise-card.tsx`.
   - Appears after listing stacks as "Your Business Here."
   - Should be shown as a lead-generation slot for empty or end-of-list opportunities.

7. Homepage featured listings
   - Current section: `src/app/(public)/page.tsx`, `#featured-organizers`.
   - Current component: `src/components/home-featured.tsx`.
   - Uses featured listing cards plus a sponsored sidebar.
   - Should be sold as "Homepage Featured Business" or bundled into premium plans.

8. Homepage featured tiles / sponsored tiles
   - Current component: `src/components/home-featured.tsx`, `SPONSORED`.
   - These are image-led sponsored placements in the homepage featured area.
   - Should be explained separately from a full listing card because it is a tile-style campaign placement.

9. Homepage advertiser CTA
   - Current section: `src/app/(public)/page.tsx`, `e4s-home-advertise-cta`.
   - This is not a paid display placement by itself, but it is an important advertiser conversion path.

10. What's On events calendar
    - Current route: `src/app/(public)/events/page.tsx`.
    - Current display components: `src/components/event-card-grid.tsx`, `src/components/events-calendar-loader.tsx`, `src/components/events-calendar.tsx`.
    - Supports list and calendar views.
    - Should be sold as a paid event promotion add-on for dated events, distinct from directory listings.

11. Featured paid event positions on event pages
    - Product requirement from owner: paid event positions that show in a second row on every event page.
    - Proposed surface: a "Featured Events" or "Promoted Events" row below the main What&apos;s On page header/filter area and above the organic event list/calendar.
    - Should be shown as a row of paid event cards with clear sponsored labelling.
    - Future rules should support all-events exposure, city-specific exposure, and category-specific exposure.

12. Event detail related promotions
    - Current route exists under `src/app/(public)/events/[id]`.
    - Proposed future surface: "More events from featured organisers" or "Promoted events nearby" on event detail pages.
    - Do not oversell until implemented, but mention as a premium/custom option if approved.

13. Advertiser portal and campaign management
    - Current portal includes listings, banners, events, analytics, profile, integrations, and subscription areas.
    - Page should make the portal feel real: create/update listings, submit banners, manage events, view analytics, and request upgrades.

## Page Strategy

The page should work like a product catalogue, not a vague marketing page.

Primary visitor questions:

- What can I buy?
- Where will it appear?
- How much does it cost?
- What do I need to provide?
- Do I need a listing, an event, a banner, or a campaign?
- How do I start?

Recommended top-level message:

"Put your singles event or service in front of people already browsing by city, category and date."

Primary CTAs:

- Start with a listing
- Ask about a campaign
- View pricing

Secondary CTAs:

- Submit an event
- Book banner placement
- Open advertiser portal

## Recommended Page Structure

1. Hero: "Advertise to Australian singles already looking for things to do"
   - Short value proposition.
   - Three proof points: city pages, category pages, What&apos;s On events.
   - CTA buttons: "Create a listing" and "Plan a campaign".
   - Fresh visual: a composed browser mock showing a current listing card, banner row, and event card. Do not use legacy sample JPGs.

2. "Choose the placement that matches your goal"
   - A decision grid:
     - Get found locally: Standard Listing.
     - Stand above competitors: Featured/Priority Listing.
     - Promote a dated event: What&apos;s On Event Promotion.
     - Run a visual campaign: Banner/Tiles/Sidebar.
     - Reach the front page: Homepage Featured Placement.

3. Inventory showcase
   - Use live-style mockups, not screenshots from the legacy site.
   - Modules to show:
     - Standard listing card.
     - Featured listing card.
     - Sticky/priority top listing position.
     - Page-top tile banner row.
     - Right-hand sidebar ad.
     - Homepage featured listing.
     - Homepage sponsored tile.
     - What&apos;s On event card.
     - Promoted events second row.
     - Calendar view sponsored event.

4. Placement map
   - Explain exact page scopes:
     - City page, for example Sydney.
     - Category page, for example Speed Dating.
     - Category plus city page, for example Speed Dating Sydney.
     - Homepage.
     - What&apos;s On events.
     - Event detail pages, if approved.
   - Include a small matrix of placements by page type.

5. Packages and pricing
   - Keep package names simple.
   - Use AUD monthly pricing unless annual pricing is approved.
   - Show "from" pricing for add-ons where inventory depends on page demand.

6. Add-ons
   - Extra city/category placement.
   - Priority/sticky listing position.
   - Page-top banner tiles.
   - Sidebar ad.
   - Homepage featured listing.
   - Homepage sponsored tile.
   - What&apos;s On promoted event.
   - Multi-city or national campaign.
   - Newsletter/member promotion later, only if backend and permission handling are ready.

7. How it works
   - Create an advertiser account.
   - Add or claim your business.
   - Choose listing/event/banner placements.
   - Submit assets.
   - Events4Singles reviews and publishes.
   - Track views/clicks/leads in portal.

8. Creative specs
   - Listing: business name, tagline, description, logo/image, phone, email, website, cities, categories.
   - Event: title, date/time, venue/city, image, booking URL, ticket price, short description.
   - Banner/tile: square or wide variants generated from one source creative where possible.
   - Sidebar: vertical or square display creative.
   - Avoid old animated GIF/banner farm style.

9. Contact/closing CTA
   - "Not sure what to choose? Tell us your city, category and campaign dates."
   - Link to contact and portal.

## Draft Pricing Framework

These are planning prices only and should be confirmed before launch.

### Listing Plans

- Free Claim: $0
  - Claim an existing migrated listing.
  - Correct core details.
  - No priority placement.
  - Useful for data cleanup and owner verification.

- Starter Listing: $39/month
  - One standard listing.
  - One primary city.
  - One primary category.
  - Contact details and website link.
  - Basic portal access.

- Professional Listing: $99/month
  - Featured listing treatment.
  - Up to three city/category placements.
  - Priority above standard listings where relevant.
  - Promo/offer field.
  - Basic analytics.

- Premium Campaign: $249/month
  - Featured or premium listing.
  - Broader city/category coverage.
  - Homepage featured business eligibility.
  - One banner or sponsored tile allocation subject to available inventory.
  - Enhanced analytics and support.

### Add-ons

- Extra city or category placement: from $15/month each.
- Priority/sticky listing position on one scoped page: from $49/month.
- Page-top banner tile: from $79/month per scoped page.
- Right-hand sidebar ad: from $69/month per scoped page.
- Homepage featured listing: from $149/month.
- Homepage sponsored tile: from $99/month.
- What&apos;s On promoted event: from $29 per event or $79/month for recurring organisers.
- Promoted event second-row placement across event pages: from $149/month, limited slots.
- National or multi-city campaign: quote.

Pricing notes:

- Use "from" for scarce inventory.
- Keep limited slot counts visible to support scarcity honestly.
- Offer annual discounts later, for example 2 months free on annual plans, only after final approval.
- Decide whether pricing is GST-inclusive before publishing.

## Placement Matrix

| Surface | City page | Category page | Category + city page | Homepage | What&apos;s On list | Calendar | Event detail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard listing | Yes | Yes | Yes | No | No | No | No |
| Featured listing | Yes | Yes | Yes | Optional | No | No | No |
| Sticky/priority listing | Yes | Yes | Yes | No | No | No | No |
| Page-top banner tiles | Yes | Yes | Yes | No | No | No | No |
| Right-hand sidebar ad | Yes | Yes | Yes | No | No | No | No |
| Listing-stack advertise card | Yes | Yes | Yes | No | No | No | No |
| Homepage featured listing | No | No | No | Yes | No | No | No |
| Homepage sponsored tile | No | No | No | Yes | No | No | No |
| Standard event | No | No | No | Optional | Yes | Yes | Yes |
| Promoted event row | Optional | Optional | Optional | Optional | Yes | Optional | Optional |

## Fresh Visual Direction

Do not use:

- Legacy advertising sample screenshots.
- Old banner farm graphics.
- Old animated GIF examples.
- Fake screenshots from an unrelated design.

Use:

- Current Events4Singles UI components as stylised examples.
- Neutral fictional advertisers with realistic Australian context.
- Fresh generated or locally created placeholder logos/tiles.
- Small browser/device frames only where they clarify placement.
- Sponsored labels on paid examples.

Recommended sample advertiser names:

- Harbour Social Singles
- Table for Six Melbourne
- Brisbane Salsa Nights
- Solo Travellers Australia
- Singles Walks Sydney

## Implementation Notes

Best implementation path:

1. Build the examples as React mock components inside `/advertise`, scoped under `.e4s-advertise-page`.
2. Remove all references to `sample_homebanner_adv.jpg`, `sample_pagetopbanner_adv.jpg`, `sample_vtopbanner_adv.jpg`, `sample_regeventcalendar_adv.jpg`, `sample_dailyeventcalendar_a.jpg`, and `sample_dailyeventcalendar1_.jpg`.
3. Reuse existing listing/event visual language, but simplify the mock cards so the advertise page is easy to scan.
4. Add a pricing data array so package and add-on text is easy to change later.
5. Add responsive mobile treatment for banner rows, sidebar ad examples, and pricing tables.
6. QA desktop and mobile screenshots before deploy.

## Designer Handoff

Ask the design agent for:

- One desktop and one mobile design for the `/advertise` content area.
- Fresh visual examples for every ad product listed above.
- A clean pricing section with listing plans and add-ons.
- A placement matrix or visual map.
- CSS scoped under `.e4s-advertise-page`.
- No redesign of the global header/footer unless separately approved.

The design should feel like a trustworthy Australian directory selling practical visibility, not like a generic SaaS landing page.
