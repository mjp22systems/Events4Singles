# Events4Singles Front Page Redesign Plan

Last updated: 2026-08-13

## Problem With Current Dev Front Page

- Too many same-looking white blocks stacked vertically.
- Weak hierarchy: the page does not feel like a homepage or editorial/directory front door.
- Legacy hooks are present only as labels, not as useful content.
- Advertising page describes inventory but does not visually show the products being sold.
- Buttons and CTAs are too generic and not arranged as a deliberate conversion path.
- The visual assets are underused even though the legacy site contains homepage, member, calendar and advertising sample images.

## Design Requirements

- Keep the existing header/navigation intact for now.
- Make the homepage visibly distinct from city/category listing pages.
- Use real legacy visual assets where they help:
  - `joincollage.jpg`
  - `e4s_join_760x116.jpg`
  - `doug_irina.jpg`
  - `img_dating_170x50.jpg`
  - `img_dance_170x50.jpg`
  - `img_travel_170x50.jpg`
  - `home_dinnerset.jpg`
- Use existing advertising sample assets on `/advertise`:
  - `sample_homebanner_adv.jpg`
  - `sample_pagetopbanner_adv.jpg`
  - `sample_vtopbanner_adv.jpg`
  - `sample_regeventcalendar_adv.jpg`
  - `sample_dailyeventcalendar_a.jpg`
  - `sample_dailyeventcalendar1_.jpg`
- Build real advertising example modules for:
  - standard listing
  - featured listing
  - tile banner
  - sidebar ad
  - homepage placement
  - events calendar add-on
- Avoid fake event listings. Calendar copy must be honest.
- Use compact directory navigation, not a giant landing-page hero with nothing underneath.
- Verify with desktop and mobile screenshots before deploy.

## Homepage Structure

1. Hero directory front door
   - Left: clear value proposition, primary browse CTAs.
   - Right: visual collage panel using legacy membership/crowd imagery plus quick stats.

2. Finder band
   - City/category quick links in a controlled grid.
   - Large enough to be useful, compact enough not to dominate.

3. Legacy content strip
   - Soulmate/dating guide hook.
   - What’s On / calendar hook.
   - Dating tips and advice hook.
   - Singles news/success hook.

4. Browse by city and event type
   - Two-column desktop layout: major cities and category families.
   - More links as compact pills.

5. Featured category stories
   - Dinner parties, dance classes, travel/cruises.
   - Use legacy images and short editorial copy.

6. Promoted businesses
   - Keep limited to a small number so it feels curated.
   - Label as homepage placement / promoted listings.

7. Advertiser CTA
   - Show tiny visual examples of listing, banner and homepage promotion.
   - Link to `/advertise`.

8. Newsletter/member growth
   - Honest placeholder for updates, giveaways and member offers.
   - No fake signup backend unless wired.

## Advertising Page Structure

1. Hero
   - Explain audience and value.
   - CTA pair: create listing / contact about campaign.

2. Visual inventory grid
   - Six product examples, each with a visual:
     - Standard listing card mock.
     - Featured listing card mock.
     - Tile banner screenshot/sample image.
     - Sidebar ad mock.
     - Homepage placement sample.
     - Calendar add-on sample.

3. How placement works
   - Explain category, city, category+city, homepage and calendar scopes.

4. Package direction
   - Starter, Professional, Premium as structure only.
   - No final prices until confirmed.

5. Contact CTA
   - Custom banners, homepage promotion, multi-city coverage.

## QA Requirements

- `npm run build` must pass.
- Capture screenshots:
  - homepage desktop
  - homepage mobile
  - advertise desktop
  - advertise mobile
- Check no horizontal overflow.
- Check CTA/button spacing.
- Check major imagery loads.
- Deploy to dev only after local visual pass is clearly better than the current dev version.
