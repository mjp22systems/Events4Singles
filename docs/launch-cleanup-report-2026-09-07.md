# Launch Cleanup Report - 2026-09-07

Source dump reviewed: `tmp/db-audits/events4singles-prod-post-0064-20260906-224311.sql`

Audit reports used:

- `tmp/db-audits/listing-database-audit-2026-09-07T09-14-13-019Z.json`
- `tmp/db-audits/listing-field-integrity-audit-2026-09-07T09-12-22-019Z.json`
- `tmp/db-audits/near-duplicate-listing-audit-2026-09-07T09-12-22-573Z.json`

## Cleanup Applied

Migration `0065_launch_relevance_and_dead_url_cleanup.sql` applies the launch cleanup without reusing IDs or hard-deleting records.

- Deleted from public launch as out of taxonomy: A1 Mortgages (#10), Aussie Home Loans (#38), Esanda (#141), ING Direct (#189), Mortgage Choice (#297), Wizard Home Loans (#517), and Business Connection Resources (#820).
- Archived the `finance_mortgage` category and disabled its placements/banner inventory.
- Targeted 30 listings whose external URLs returned a hard failure during the URL audit: 400, 404, 410, or 526. Of those, 24 still-active listings are newly paused; 6 were already merged by earlier cleanup migrations and only have their old placements kept inactive.
- Disabled placements and linked banner rows for the paused/deleted launch cleanup listings.
- Retained paused listing/business IDs for future claim, updated URL, or admin recovery workflows.
- Tightened public profile lookup so only active businesses can render a public `/profile/...` page.

## Hard-Dead URL Listings Paused

| Listing | URL status | URL |
| --- | --- | --- |
| #25 Amazing Coaching | 404 | amazingcoaching.com.au |
| #59 Book of Matches | 400 | bookofmatches.com |
| #84 Christian | 410 | christiandatingsearch.com |
| #86 Christian Dating Search | 410 | christiandatingsearch.com |
| #96 Club Salsa | 404 | clubsalsa.com.au/classes/dance_classes.php |
| #97 Club Salsa Sydney | 404 | clubsalsa.com.au/classes/dance_classes.php |
| #109 Dancecorp | 526 | dancecorp.com.au |
| #110 Dancecorp | 526 | dancecorp.com.au |
| #166 Gaby's Dance Studio Club Inc. | 404 | netspeed.com.au/gabysdancestudio |
| #196 Jazz in the Vines | 404 | jazzinthevines.com.au |
| #229 Latin Motion Dance Academy | 404 | latinmotion.com.au |
| #237 Le Bop | 404 | lebop.com.au |
| #247 Lisa Phillips | 404 | amazingcoaching.com.au |
| #358 Quicksilver Connections | 404 | quicksilver-cruises.com/bookings.php |
| #373 RSVP | 404 | rsvp.com.au/index.jsp |
| #374 RSVP Travel | 404 | rsvp.com.au/singles+travel/trips+holidays.jsp |
| #381 Salsa Warriors | 404 | salsawarriors.com |
| #382 Salsa Warriors Sydney | 404 | salsawarriors.com |
| #453 Swingtime NSW | 404 | swingtimeaustralia.com/nsw/nsw.php |
| #454 Swingtime Queensland | 404 | swingtimeaustralia.com/qld |
| #472 Tengo Tango | 404 | akvaryumhobisi.com/tengotango |
| #484 The Australia Image Company | 404 | taic.com.au/05_corp.html |
| #533 Dinner Connections | 404 | yahoo.com |
| #538 Turf Bar | 404 | turfbar.com.au |
| #564 Blue / Roots | 404 | bennettslane.com |
| #598 Host a Murder | 404 | hostamurder.com.au |
| #697 The Little Social | 404 | events.humanitix.com/wine-tasting-singles-edition |
| #761 Sheona Beach Photography | 404 | sheonabeach.com.au/brisbane-online-dating-profile-photos-pics-relaxed-casual-candid |
| #777 Sacred Self | 404 | sacredself.com.au |
| #824 Lasting Health & Richer Lives | 404 | richerlives.com.au/hwsolutions |

## Review Queue

These were not automatically removed because they may still be real businesses, phone-led legacy records, temporarily blocked sites, or listings that need manual category/content judgement.

- URL audit still needs human review for ambiguous failures: 313 timeout/unreachable results, 23 `403`, 4 `429`, 3 `405`, 2 `409`, and one each of `406` and `417`.
- Active listings with neither listing email nor listing URL: 38. Notable examples include Arthur Murray Dance Studio (#30), Ceroc Canberra (#78), several life coach records (#95, #200, #204), phone-only social/speed dating listings (#579, #592, #616, #621, #622, #642, #648), and event/dance rows such as Tuesday Danceroc Night at Rigby's (#673), Forever Dance (#769), Just Good Friends (#774), and Venus & Mars Speed Dating (#778).
- Potential title/content cleanup remains for Tuesday Danceroc Night at Rigby's (#673), Sunday Singles (#689), and Hey Saturday (#763). The first two look more suspicious than Hey Saturday because "Saturday" can be part of the brand.
- Contact-only descriptions remain for Imperial Dating (#694), Ideal Introductions (#705), and Jus Dance (#751).
- Missing image work should use the existing image-audit tooling and contact sheets before changing live rows, because `public/images` contains many legacy assets whose filenames do not reliably match listing names.

## Repo Source-Of-Truth Cleanup

- Removed scratch worktrees under `D:\Projects\Clients\Dad\Events4singles-archive\scratch`; the active `website` checkout is now the only Git worktree.
- Deleted branch `e4s-prod-data-cleanup-20260905` because it had already been merged to `origin/main`.
- Reconciled local `main` with `origin/main`; the active branch is clean and aligned after push.
