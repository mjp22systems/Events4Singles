# Dance Section Taxonomy and Content Plan

Generated: 2026-08-26

## Recommendation

Use **Dance Classes** as the commercial parent category and build the dance area as a browseable section with three layers:

1. **Parent category:** `/dance-classes`
2. **Child style/category:** `/dance-classes/salsa`, `/dance-classes/bachata`, `/dance-classes/tango`, `/dance-classes/swing`, `/dance-classes/ceroc`, `/dance-classes/ballroom-style`
3. **Child style plus location:** `/dance-classes/salsa/sydney`

This mirrors the way users browse the rest of the site: category first, then location. Dance adds a middle layer because style is a genuine decision point before location.

## Commercial Taxonomy

These should be real child categories because they map to advertiser inventory and user intent:

- Salsa
- Bachata
- Tango
- Swing
- Ceroc Dance / Modern Jive
- Ballroom
- Latin
- Line Dancing
- Dance Fitness & Health
- Dance Teachers

Keep **Dance Party Clubs** separate from Dance Classes. It is more about venues, nightlife and social dance events than learning/class discovery.

## Guide Taxonomy

The old Dance Styles material should become a guide layer rather than a peer commercial category list. It can explain the broader families:

- Ballroom and Smooth: waltz, foxtrot, quickstep, Viennese waltz, social ballroom
- Latin and Rhythm: salsa, bachata, cha cha, rumba, samba, merengue, mambo
- Swing and Jive: East Coast Swing, West Coast Swing, Lindy Hop, rock and roll, Ceroc/Modern Jive
- Tango: Argentine tango, ballroom tango, practica and milonga culture
- Contemporary and Modern: less singles-specific, but useful as an exploratory/fitness/expressive class path
- Cultural and World Dance: belly dance, Bollywood, flamenco, Brazilian zouk, kizomba, folk/community styles
- Dance Fitness: Zumba-style, cardio dance, line dance, low-pressure group movement

This means **Dance Styles** should not be a normal listing category in the same way Salsa is. It should be an editorial guide page attached to the Dance Classes hub.

## URL Shape

Preferred long-term public URLs:

- `/dance-classes`
- `/dance-classes/styles`
- `/dance-classes/salsa`
- `/dance-classes/bachata`
- `/dance-classes/tango`
- `/dance-classes/swing`
- `/dance-classes/ceroc`
- `/dance-classes/ballroom-style`
- `/dance-classes/latin-style`
- `/dance-classes/line-dancing`
- `/dance-classes/modern-style`
- `/dance-classes/fitness-and-health`
- `/dance-classes/teachers`
- `/dance-classes/salsa/sydney`

Keep redirects from the legacy `.htm` URLs to the closest new child route. The implementation now supports clean nested child segments while preserving internal database slugs like `dance_salsa`.

## Listing Logic

Store listings against their most specific known category and city:

- A Sydney salsa school can be placed in `dance_salsa` + `sydney`.
- The parent `/dance-classes` page should automatically include child category listings.
- The parent `/dance-classes/sydney` page should include all Dance Classes child styles in Sydney.
- The child `/dance-classes/salsa` page should include only Salsa listings.
- The child-location `/dance-classes/salsa/sydney` page should include only Salsa listings in Sydney.

This avoids manually duplicating placements just to make parent pages work.

## Content Strategy

## Legacy Content Decision

The old content is worth keeping as a strategic prompt, not as copy to paste directly.

Keep these ideas:

- Dance works because it gives singles a natural shared activity rather than a dating-first room.
- Beginner and solo-friendly class formats matter, especially partner rotation, drop-in classes and no-partner-required nights.
- Broader style families help people choose when they do not yet know the exact style name.
- Dance fitness and line/group formats belong nearby because they serve the same "get out, move, meet regular faces" intent.

Rewrite these parts:

- The old Dance Styles, Ballroom, Latin, Modern and Fitness pages were useful but dated in tone and too generic.
- The old Salsa, Tango, Ceroc, Swing and Ballroom/Latin pages were mostly listing scrape pages, with only small reusable fragments.
- The old Dance Styles page should not compete with listing categories; it should guide people into them.

### Dance Classes Hub

Purpose: commercial hub plus emotional doorway.

Suggested content:

- Lead with the singles angle: no-pressure movement, meeting people, confidence, doing something more natural than another dating app.
- Explain that dance classes work well for singles because many group formats rotate partners or welcome solo attendees.
- Show child style cards with imagery and short emotional hooks.
- Include city selector.
- Include a guide block: "Not sure which style suits you?"

### Dance Styles Guide

Purpose: editorial resource, not just a listing page.

Position it at `/dance-classes/styles`. It should sit inside Dance Classes but feel more resource-like.

Suggested sections:

- Choose by mood: energetic, romantic, playful, elegant, low-pressure, fitness-focused
- Choose by music: Latin, big band/jazz, pop, tango, contemporary, world music
- Choose by class format: partner rotation, solo/group, private lessons, workshops, socials
- Beginner comfort guide: no partner, what to wear, how class rotation works, what a first night feels like
- Style family guide: Ballroom/Smooth, Latin/Rhythm, Swing/Jive, Tango, Cultural/World, Dance Fitness
- Links into matching listing categories where inventory exists
- Promoter-facing framing that explains why mainstream dance studios still fit the singles audience

### Child Style Pages

Purpose: combine a short emotional explanation with actual listings.

Each child page should have:

- A warm intro paragraph
- "Good for you if..." bullets
- "What to expect in a first class" content
- City selector
- Listings
- Related styles

### Advertiser Hook

For promoters and studios, the dance section should signal:

- Events4Singles understands dance as a social entry point, not just a class timetable.
- Style pages can attract people by intent before they know a studio name.
- City/style pages create highly targeted advertising surfaces, e.g. Tango in Sydney or Salsa in Brisbane.
- Rich editorial content makes the section feel like a guide, giving advertisers a more credible place to appear.

## Research Notes

- Adult beginners often choose by goal, social dynamic and music preference, not only by formal dance taxonomy. Dance With Me frames beginner selection around goals such as socialising, elegance, calorie burn and music preference: https://dancewithmeusa.com/choose-first-adult-dance-style/
- Large dance studio content commonly groups dance styles into formal families such as Rhythm and Smooth, while also describing real-world contexts like nightlife, social events, parties and travel: https://www.fredastaire.com/types-of-dance/
- Ballroom taxonomy is fluid. Ballroom can mean recreational partner dancing broadly, while competition structures divide it into Standard/Smooth and Latin/Rhythm groupings: https://en.wikipedia.org/wiki/Ballroom_dance
- Ceroc/Modern Jive is especially relevant for singles because class formats commonly emphasise beginner access, partner rotation and no-partner-required attendance: https://en.wikipedia.org/wiki/Ceroc and https://ceroc.com.au/
- Australian studios often promote adult beginner classes, no-experience/no-partner attendance, and multiple style families such as Ballroom, Latin American, Street Latin and New Vogue: https://www.riodancestudio.com.au/

## Implementation Follow-Ups

1. Classify legacy dance listings into child styles where source files or copy clearly identify Salsa, Tango, Swing, Ceroc or Ballroom/Latin.
2. Add unique images for Bachata, Swing and Line Dancing when the image task catches up.
3. Add related-style blocks to child category pages.
4. Consider adding `content_kind` or `is_editorial` to categories if more guide pages need to opt out of normal listing behaviour.
5. Reclassify placeholder/sample dance listings into the most specific known style once the listing cleanup pass runs.
