# Launch Cleanup Report - 2026-09-07

Source dump reviewed: `tmp/db-audits/events4singles-prod-post-0066-20260907-212120.sql`

Audit reports used:

- `tmp/db-audits/listing-database-audit-2026-09-07T09-14-13-019Z.json`
- `tmp/db-audits/listing-field-integrity-audit-2026-09-07T09-12-22-019Z.json`
- `tmp/db-audits/near-duplicate-listing-audit-2026-09-07T09-12-22-573Z.json`
- `tmp/db-audits/launch-listing-quality-audit-2026-09-07T11-20-51-917Z.json`

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
- Active listings with neither listing email nor listing URL: 38. Full flat review list:

#30 Arthur Murray Dance Studio - dance_classes - Melbourne - phone 1300326231
#78 Ceroc Canberra - dance_classes, dance_ceroc - Canberra - mobile 412557751
#95 Clinton Smith - life_coaches - Sydney, Central Coast - phone 243248897
#200 Jennifer Twohig - life_coaches - Sydney - mobile 438681753
#204 Joanne Mansell - life_coaches - Sydney - mobile 416181654
#313 O'Malleys - nightclubs - Brisbane - phone 732119881
#339 Perfect Match - online_dating, intro_agencies - Gold Coast - phone 733970123
#551 A friendly way to connect - seminars - no city - phone 0422 859 954
#552 Above All Healing - yoga_classes - no city - phone 07-5576-0555
#557 Ashtanga Yoga Melbourne - yoga_classes - Melbourne - phone 03-9419-1598
#560 Beauty Health and Wellness - healing_and_happiness - Sydney - phone 02-9907-8408
#571 City Roc - dance_party_clubs - no city - phone 0414-888-710
#579 Dinner For Six - speed_dating - no city - phone 0412-229-884
#580 Divorce, Success and You - life_coaches - no city - phone 1300-655-095
#581 Drinks After Work - dinner_parties, intro_agencies - Sydney - phone 435801602
#592 Fun Food and Friendship - social_clubs - Melbourne - phone 03-9111-0121
#601 Judith Ayre - psychology - no city - phone 417105444
#606 La Vegas Nightclub - nightclubs - no city - phone 430518851
#612 Lucy Baker - psychics4singles - no city - phone 410930726
#614 Matchmates House Party - houseparties - no city - phone 395636999
#616 Network Social Club - social_clubs - Melbourne - phone 0432 887 472
#621 Partners & Friends North Metro - social_clubs - Perth - phone 08)9445-594
#622 Perth Dating Services - intro_agencies - Perth - phone 08-9344-2355
#624 Psyche-Care - singles_health - no city - phone 0431 683 662
#625 RETRO NITES - dance_party_clubs - Wollongong - phone 0412 321 619
#638 Singles Holiday Travel - solo_travel - no city - phone 0435 801 602
#640 Singles World Travel - solo_travel - no city - phone 0435 801 602
#642 Social Elements - speed_dating - Perth - phone 0451-116-327
#643 Socializing Newcastle - beauty_for_singles - Newcastle - phone 02-4953-8222
#646 Soulmate Success - seminars - Melbourne - phone 354207366
#648 Spark Dating - speed_dating - Melbourne - phone 0405 629 020
#661 TROPICAL SOUL DANCE STUDIO - dance_classes, dance_salsa, dance_bachata, dance_latin_style - Sydney - phone 0421 448 780
#666 Thailand Golf Tours - adventure_for_singles - no city - phone 0419 264 800
#669 The Love Doctor - healing_and_happiness - no city - phone 0418 807 487
#673 Tuesday Danceroc Night at Rigby's - dance_classes, dance_ceroc, dance_party_clubs - Perth, Adelaide, Melbourne, Sydney - phone 08-9368-6410
#769 Forever Dance - dance_classes, dance_salsa, dance_ballroom_style, dance_latin_style - Melbourne - phone 411401634
#774 Just Good Friends - events - Adelaide - phone 883734141
#778 Venus & Mars Speed Dating - events - Melbourne - phone 422759972
- Potential title/content cleanup remains for Tuesday Danceroc Night at Rigby's (#673), Sunday Singles (#689), and Hey Saturday (#763). The first two look more suspicious than Hey Saturday because "Saturday" can be part of the brand.
- Contact-only descriptions remain for Imperial Dating (#694), Ideal Introductions (#705), and Jus Dance (#751).
- Missing image work should use the existing image-audit tooling and contact sheets before changing live rows, because `public/images` contains many legacy assets whose filenames do not reliably match listing names.

## Repo Source-Of-Truth Cleanup

- Removed scratch worktrees under `D:\Projects\Clients\Dad\Events4singles-archive\scratch`; the active `website` checkout is now the only Git worktree.
- Deleted branch `e4s-prod-data-cleanup-20260905` because it had already been merged to `origin/main`.
- Reconciled local `main` with `origin/main`; the active branch is clean and aligned after push.

## Cleanup Applied - Second Sweep

Migration `0066_stale_promotional_listing_sweep.sql` was applied to production on 2026-09-07.

Recovered or standardised legitimate listings with internet-supported contact data:

- #78 Ceroc Canberra renamed to Canberra Modern Jive; URL set to `https://canberradance.com.au/`; email set to `info@canberradance.com.au`.
- #557 Ashtanga Yoga Melbourne; URL set to `https://www.ashtangamelbourne.com.au/`; email set to `info@ashtangamelbourne.com.au`.
- #571 City Roc renamed to Cityroc Dance; email set to `les@dataglobal.com.au`; city/state normalised to Newcastle, NSW.
- #592 Fun Food and Friendship; URL set to `https://www.funff.com.au/`.
- #616 Network Social Club; URL set to `https://networksocialclub.org.au/`; email set to `admin@networksocialclub.org.au`.
- #648 Spark Dating; URL set to `https://www.spark-dating.com.au/`.
- #661 TROPICAL SOUL DANCE STUDIO renamed to Tropical Soul Dance Studio; URL set to `https://tsdance.com.au/`.

Archived from public launch as stale festival/event adverts or phone-only promotions:

- #134 Echuca-Moama Riverboats Jazz
- #142 Eve Harbour Cruises
- #197 Jazz in the Tops
- #282 Melbourne Jazz
- #304 Newcastle Jazz Festival
- #306 Noosa Jazz
- #395 Shoalhaven Jazz
- #469 Tasmanian Jazz Promotions
- #495 Thredbo Blues festival
- #551 A friendly way to connect
- #606 La Vegas Nightclub
- #614 Matchmates House Party
- #625 RETRO NITES
- #646 Soulmate Success
- #665 Tasmania Jazz in Tasmanian towns
- #666 Thailand Golf Tours
- #668 The Coopers East End Jazz Festival
- #669 The Love Doctor
- #673 Tuesday Danceroc Night at Rigby's
- #766 Singles Social Dance
- #772 Two Minute Tango
- #774 Just Good Friends
- #778 Venus & Mars Speed Dating

Deleted from public launch as generic products, affiliate/resource pages, or non-fitting legacy content:

- #47 Beauty Health and Wellness Nutritionals, Herbals, Skincare
- #128 Dr Dating
- #253 Love Directory
- #254 Love Index
- #262 LuvSource
- #275 Mat-tastic
- #277 Match Makers Quest
- #390 Selfchanges
- #408 Singles-online-dating
- #424 Sounds of Sirius
- #560 Beauty Health and Wellness

## Current Flat Decision List

These are the active rows still flagged after the second sweep. They are left live for now because they may be real businesses, but they need your decision.

#137 Elle Bache - Beauty for Singles / Adventure for Singles, Brisbane - has URL/email - decision: keep as beauty/wellbeing listing or delete as too generic.
#305 Newtown Gym - Fitness for Singles / Singles Health, Sydney - has URL/email - decision: keep as fitness/wellbeing listing or delete as too generic.
#483 The Illawara Jazz Club - Jazz, Sydney - has URL/email - decision: keep as a club or archive because body copy leans on festival/event promotion.
#552 Above All Healing - Yoga Classes, no city - phone only - decision: find URL/email, rewrite as service, or archive.
#30 Arthur Murray Dance Studio - Dance Classes, Melbourne - phone only - decision: needs exact branch URL/email or archive.
#95 Clinton Smith - Life Coaches, Sydney/Central Coast - phone only - decision: needs exact URL/email or archive.
#579 Dinner For Six - Speed Dating, no city - phone only - decision: needs exact URL/email or archive.
#580 Divorce, Success and You - Life Coaches, no city - phone only - decision: needs exact URL/email or archive.
#581 Drinks After Work - Dinner Parties / Introduction Agencies, Sydney - phone only - decision: likely old Events4Singles-linked row; confirm or archive.
#769 Forever Dance - Dance Classes / Salsa / Ballroom & Latin, Melbourne - phone only - decision: needs exact URL/email or archive.
#200 Jennifer Twohig - Life Coaches, Sydney - phone only - decision: needs exact URL/email or archive.
#204 Joanne Mansell - Life Coaches, Sydney - phone only - decision: needs exact URL/email or archive.
#601 Judith Ayre - Psychology, no city - phone only - decision: needs exact URL/email or archive.
#612 Lucy Baker - Psychics for Singles, no city - phone only - decision: needs exact URL/email or archive.
#313 O'Malleys - Nightclubs, Brisbane - phone only - decision: likely legacy venue; confirm current venue/URL or archive.
#621 Partners & Friends North Metro - Social Clubs, Perth - phone only - decision: needs exact URL/email or archive.
#339 Perfect Match - Online Dating / Introduction Agencies, Gold Coast - phone only - decision: needs exact URL/email or archive.
#622 Perth Dating Services - Introduction Agencies, Perth - phone only - decision: possible Louanne Ward/People's Introduction Bureau successor; confirm before renaming.
#624 Psyche-Care - Singles Health, no city - phone only - decision: needs exact URL/email or archive.
#638 Singles Holiday Travel - Solo Travel, no city - phone only - decision: likely old Events4Singles-linked row; confirm or archive.
#640 Singles World Travel - Solo Travel, no city - phone only - decision: likely old Events4Singles-linked row; confirm or archive.
#642 Social Elements - Speed Dating, Perth - phone only - decision: needs exact URL/email or archive.
#643 Socializing Newcastle - Beauty for Singles, Newcastle - phone only - decision: category/name look suspicious; confirm or archive.
