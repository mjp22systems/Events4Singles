INSERT INTO categories (
  slug,
  label,
  parent_slug,
  sort_order,
  description,
  seo_intro,
  banner_row_count,
  seo_title,
  seo_description,
  hero_image_url
) VALUES
  (
    'dance_salsa',
    'Salsa Dance',
    'dance_classes',
    31,
    'Salsa classes, Latin socials and beginner-friendly partner dance options.',
    'Salsa dance classes give singles a lively, social way to learn rhythm, meet new people and step into Latin dance culture without needing a partner.',
    1,
    'Salsa Dance Classes for Singles Australia | Events4Singles',
    'Find salsa dance classes, Latin socials and beginner-friendly salsa options for singles across Australia.',
    '/images/categories/optimized/dance-salsa.webp'
  ),
  (
    'dance_tango',
    'Tango Dance',
    'dance_classes',
    32,
    'Tango classes, practica nights and social tango communities.',
    'Tango dance classes suit singles who want a more expressive, attentive partner dance built around musicality, confidence and connection.',
    1,
    'Tango Dance Classes for Singles Australia | Events4Singles',
    'Find tango dance classes, social tango nights and tango communities for singles across Australia.',
    '/images/categories/optimized/dance-tango.webp'
  ),
  (
    'dance_swing',
    'Swing Dance',
    'dance_classes',
    34,
    'Swing, jive and vintage social dance classes with upbeat group energy.',
    'Swing dance classes are a playful way for singles to build confidence, learn partner movement and join upbeat social dance communities.',
    1,
    'Swing Dance Classes for Singles Australia | Events4Singles',
    'Find swing dance classes, jive nights and vintage social dance options for singles across Australia.',
    '/images/categories/optimized/dance-swing.webp'
  ),
  (
    'dance_bachata',
    'Bachata Dance',
    'dance_classes',
    33,
    'Bachata classes and social Latin dance nights with an approachable beginner pathway.',
    'Bachata dance classes give singles a modern Latin social option with simple timing, close musicality and a welcoming path into Latin dance nights.',
    1,
    'Bachata Dance Classes for Singles Australia | Events4Singles',
    'Find bachata dance classes, social Latin nights and beginner-friendly bachata options for singles across Australia.',
    '/images/categories/optimized/dance-bachata.webp'
  ),
  (
    'dance_ceroc',
    'Ceroc Dance',
    'dance_classes',
    35,
    'Ceroc and modern jive classes designed for easy social partner dancing.',
    'Ceroc dance classes are built around approachable partner dancing, regular rotation and a no-partner-required format that can suit singles well.',
    1,
    'Ceroc Dance Classes for Singles Australia | Events4Singles',
    'Find Ceroc and modern jive classes for singles across Australia.',
    '/images/categories/optimized/dance-ceroc.webp'
  ),
  (
    'dance_line_dancing',
    'Line Dancing',
    'dance_classes',
    36,
    'Line dancing classes for no-partner group movement, fitness and social confidence.',
    'Line dancing gives singles a low-pressure way to move with a group, learn repeatable steps and enjoy music without needing to arrive with a partner.',
    1,
    'Line Dancing Classes for Singles Australia | Events4Singles',
    'Find line dancing classes, beginner group dance and social movement options for singles across Australia.',
    '/images/categories/optimized/dance-line-dancing.webp'
  ),
  (
    'dance_styles',
    'Dance Styles',
    'dance_classes',
    30,
    'A guide to dance styles, class formats and beginner-friendly ways to choose a dance class.',
    'Explore dance styles by music, mood and class format, then move into the dance categories and locations that suit you.',
    1,
    'Dance Styles for Singles Australia | Events4Singles',
    'Explore dance styles, beginner class options and social dance pathways for singles across Australia.',
    '/images/categories/optimized/dance-styles.webp'
  ),
  (
    'dance_ballroom_style',
    'Ballroom Dance',
    'dance_classes',
    37,
    'Ballroom, smooth and social partner dance classes including waltz, foxtrot and quickstep.',
    'Ballroom dance classes help singles build posture, timing and social confidence through structured partner dancing.',
    1,
    'Ballroom Dance Classes for Singles Australia | Events4Singles',
    'Find ballroom dance classes, smooth dance lessons and social ballroom options for singles across Australia.',
    '/images/categories/optimized/dance-ballroom-style.webp'
  ),
  (
    'dance_latin_style',
    'Latin Dance',
    'dance_classes',
    38,
    'Latin dance classes including salsa, bachata, cha cha, rumba, samba and social Latin styles.',
    'Latin dance classes give singles a lively way to learn rhythm, meet people and move from beginner lessons into social dance nights.',
    1,
    'Latin Dance Classes for Singles Australia | Events4Singles',
    'Find Latin dance classes, social Latin nights and beginner-friendly Latin dance options for singles across Australia.',
    '/images/categories/optimized/dance-latin-style.webp'
  ),
  (
    'dance_modern_style',
    'Contemporary and Modern Dance',
    'dance_classes',
    39,
    'Contemporary, modern and expressive dance classes for movement, creativity and confidence.',
    'Contemporary and modern dance classes can suit singles who want movement, expression and a class community without needing to start with partner dancing.',
    1,
    'Contemporary and Modern Dance Classes for Singles Australia | Events4Singles',
    'Find contemporary and modern dance classes, expressive movement and beginner-friendly group dance options for singles across Australia.',
    '/images/categories/optimized/dance-modern-style.webp'
  ),
  (
    'dance_fitness_and_health',
    'Dance Fitness',
    'dance_classes',
    40,
    'Dance fitness, cardio dance, Zumba-style classes and wellbeing-focused movement.',
    'Dance fitness classes are a low-pressure option for singles who want music, movement, confidence and familiar faces without partner-dance pressure.',
    1,
    'Dance Fitness Classes for Singles Australia | Events4Singles',
    'Find dance fitness, cardio dance and beginner-friendly group movement classes for singles across Australia.',
    '/images/categories/optimized/dance-fitness-and-health.webp'
  ),
  (
    'dance_teachers',
    'Dance Teachers',
    'dance_classes',
    41,
    'Dance teachers, private lessons and instructors who help singles build confidence one step at a time.',
    'Dance teachers and private dance lessons can help singles get comfortable before joining a class, preparing for an event or building confidence with a specific style.',
    1,
    'Dance Teachers for Singles Australia | Events4Singles',
    'Find dance teachers, private dance lessons and beginner-friendly dance instructors for singles across Australia.',
    '/images/categories/optimized/dance-teachers.webp'
  )
ON CONFLICT(slug) DO UPDATE SET
  label = excluded.label,
  parent_slug = excluded.parent_slug,
  sort_order = excluded.sort_order,
  description = excluded.description,
  seo_intro = excluded.seo_intro,
  banner_row_count = excluded.banner_row_count,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  hero_image_url = COALESCE(excluded.hero_image_url, categories.hero_image_url);

UPDATE categories
SET parent_slug = 'dance_classes',
    sort_order = CASE slug
      WHEN 'dance_styles' THEN 30
      WHEN 'dance_ballroom_style' THEN 37
      WHEN 'dance_latin_style' THEN 38
      WHEN 'dance_modern_style' THEN 39
      WHEN 'dance_fitness_and_health' THEN 40
      WHEN 'dance_teachers' THEN 41
      ELSE sort_order
    END
WHERE slug IN (
  'dance_styles',
  'dance_ballroom_style',
  'dance_latin_style',
  'dance_modern_style',
  'dance_fitness_and_health',
  'dance_teachers'
);

UPDATE categories
SET description = 'Dance classes for singles including social partner dance, beginner lessons, dance fitness and style-specific pathways.',
    seo_intro = 'Dance classes give singles a natural reason to get out of the house, learn something physical, meet regular faces and build confidence in a room where conversation can happen around the activity.',
    seo_title = 'Dance Classes for Singles Australia | Events4Singles',
    seo_description = 'Find dance classes for singles across Australia, including salsa, tango, swing, Ceroc, ballroom, Latin, line dancing and dance fitness.',
    hero_image_url = COALESCE(hero_image_url, '/images/categories/optimized/dance-classes.webp')
WHERE slug = 'dance_classes';

UPDATE categories
SET label = 'Ballroom Dance',
    description = 'Ballroom, smooth and social partner dance classes including waltz, foxtrot and quickstep.',
    seo_intro = 'Ballroom dance classes help singles build posture, timing and social confidence through structured partner dancing.',
    seo_title = 'Ballroom Dance Classes for Singles Australia | Events4Singles',
    seo_description = 'Find ballroom dance classes, smooth dance lessons and social ballroom options for singles across Australia.',
    hero_image_url = COALESCE(hero_image_url, '/images/categories/optimized/dance-ballroom-style.webp')
WHERE slug = 'dance_ballroom_style';

UPDATE categories
SET description = 'Latin dance classes including salsa, bachata, cha cha, rumba, samba and social Latin styles.',
    seo_intro = 'Latin dance classes give singles a lively way to learn rhythm, meet people and move from beginner lessons into social dance nights.',
    seo_title = 'Latin Dance Classes for Singles Australia | Events4Singles',
    seo_description = 'Find Latin dance classes, social Latin nights and beginner-friendly Latin dance options for singles across Australia.',
    hero_image_url = COALESCE(hero_image_url, '/images/categories/optimized/dance-latin-style.webp')
WHERE slug = 'dance_latin_style';

UPDATE categories
SET label = 'Contemporary and Modern Dance',
    description = 'Contemporary, modern and expressive dance classes for movement, creativity and confidence.',
    seo_intro = 'Contemporary and modern dance classes can suit singles who want movement, expression and a class community without needing to start with partner dancing.',
    seo_title = 'Contemporary and Modern Dance Classes for Singles Australia | Events4Singles',
    seo_description = 'Find contemporary and modern dance classes, expressive movement and beginner-friendly group dance options for singles across Australia.',
    hero_image_url = COALESCE(hero_image_url, '/images/categories/optimized/dance-modern-style.webp')
WHERE slug = 'dance_modern_style';

UPDATE categories
SET description = 'Dance fitness, cardio dance, Zumba-style classes and wellbeing-focused movement.',
    seo_intro = 'Dance fitness classes are a low-pressure option for singles who want music, movement, confidence and familiar faces without partner-dance pressure.',
    seo_title = 'Dance Fitness Classes for Singles Australia | Events4Singles',
    seo_description = 'Find dance fitness, cardio dance and beginner-friendly group movement classes for singles across Australia.',
    hero_image_url = COALESCE(hero_image_url, '/images/categories/optimized/dance-fitness-and-health.webp')
WHERE slug = 'dance_fitness_and_health';

UPDATE categories
SET description = 'A guide to dance styles, class formats and beginner-friendly ways to choose a dance class.',
    seo_intro = 'Explore dance styles by music, mood and class format, then move into the dance categories and locations that suit you.',
    seo_title = 'Dance Styles for Singles Australia | Events4Singles',
    seo_description = 'Explore dance styles, beginner class options and social dance pathways for singles across Australia.',
    hero_image_url = COALESCE(hero_image_url, '/images/categories/optimized/dance-styles.webp')
WHERE slug = 'dance_styles';

UPDATE categories
SET description = 'Dance teachers, private lessons and instructors who help singles build confidence one step at a time.',
    seo_intro = 'Dance teachers and private dance lessons can help singles get comfortable before joining a class, preparing for an event or building confidence with a specific style.',
    seo_title = 'Dance Teachers for Singles Australia | Events4Singles',
    seo_description = 'Find dance teachers, private dance lessons and beginner-friendly dance instructors for singles across Australia.',
    hero_image_url = COALESCE(hero_image_url, '/images/categories/optimized/dance-teachers.webp')
WHERE slug = 'dance_teachers';

INSERT INTO redirects (from_path, to_path, entity_type, entity_id) VALUES
  ('/dance_classes_salsa.htm', '/dance-classes/salsa', 'category', 'dance_salsa'),
  ('/dance_classes_tango.htm', '/dance-classes/tango', 'category', 'dance_tango'),
  ('/dance_classes_swing.htm', '/dance-classes/swing', 'category', 'dance_swing'),
  ('/dance_classes_ceroc.htm', '/dance-classes/ceroc', 'category', 'dance_ceroc'),
  ('/dance_classes_ballroom_latin.htm', '/dance-classes/ballroom-style', 'category', 'dance_ballroom_style'),
  ('/dance_ballroom_style.htm', '/dance-classes/ballroom-style', 'category', 'dance_ballroom_style'),
  ('/dance_latin_style.htm', '/dance-classes/latin-style', 'category', 'dance_latin_style'),
  ('/dance_modern_style.htm', '/dance-classes/modern-style', 'category', 'dance_modern_style'),
  ('/dance_fitness_and_health.htm', '/dance-classes/fitness-and-health', 'category', 'dance_fitness_and_health'),
  ('/dance_styles.htm', '/dance-classes/styles', 'category', 'dance_styles'),
  ('/dance_teachers.htm', '/dance-classes/teachers', 'category', 'dance_teachers')
ON CONFLICT(from_path) DO UPDATE SET
  to_path = excluded.to_path,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id;
