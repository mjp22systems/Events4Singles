-- Classify legacy Dance Classes listings into the newer Dance Classes child
-- taxonomy. Parent dance_classes placements stay in place so the parent page
-- still works as the broad aggregate.

WITH dance_base AS (
  SELECT
    p.listing_id,
    p.city_slug,
    lower(COALESCE(l.source_file, '')) AS source_text,
    lower(COALESCE(l.title, '') || ' ' || COALESCE(l.tagline, '') || ' ' || COALESCE(l.description, '')) AS listing_text
  FROM listing_placements p
  JOIN listings l ON l.id = p.listing_id
  WHERE p.category_slug = 'dance_classes'
),
style_patterns(category_slug, pattern, search_area) AS (
  VALUES
    ('dance_salsa', '%dance_classes_salsa%', 'source'),
    ('dance_salsa', '%salsa%', 'listing'),
    ('dance_salsa', '%rueda%', 'listing'),
    ('dance_salsa', '%salsacise%', 'listing'),
    ('dance_tango', '%dance_classes_tango%', 'source'),
    ('dance_tango', '%tango%', 'listing'),
    ('dance_swing', '%dance_classes_swing%', 'source'),
    ('dance_swing', '%swing%', 'listing'),
    ('dance_swing', '%lindy%', 'listing'),
    ('dance_swing', '%jitterbug%', 'listing'),
    ('dance_swing', '%rockabilly%', 'listing'),
    ('dance_ceroc', '%dance_classes_ceroc%', 'source'),
    ('dance_ceroc', '%ceroc%', 'listing'),
    ('dance_ceroc', '%modern jive%', 'listing'),
    ('dance_bachata', '%bachata%', 'listing'),
    ('dance_line_dancing', '%line dancing%', 'listing'),
    ('dance_line_dancing', '%line dance%', 'listing'),
    ('dance_ballroom_style', '%dance_classes_ballroom%', 'source'),
    ('dance_ballroom_style', '%ballroom%', 'listing'),
    ('dance_ballroom_style', '%waltz%', 'listing'),
    ('dance_ballroom_style', '%foxtrot%', 'listing'),
    ('dance_ballroom_style', '%quickstep%', 'listing'),
    ('dance_ballroom_style', '%new vogue%', 'listing'),
    ('dance_ballroom_style', '%dancesport%', 'listing'),
    ('dance_latin_style', '%dance_latin_style%', 'source'),
    ('dance_latin_style', '%dance_classes_ballroom_latin%', 'source'),
    ('dance_latin_style', '%latin%', 'listing'),
    ('dance_latin_style', '%cha cha%', 'listing'),
    ('dance_latin_style', '%cha-cha%', 'listing'),
    ('dance_latin_style', '%rumba%', 'listing'),
    ('dance_latin_style', '%samba%', 'listing'),
    ('dance_latin_style', '%merengue%', 'listing'),
    ('dance_latin_style', '%meringue%', 'listing'),
    ('dance_latin_style', '%mambo%', 'listing'),
    ('dance_latin_style', '%zouk%', 'listing'),
    ('dance_latin_style', '%lambada%', 'listing'),
    ('dance_latin_style', '%brazilian%', 'listing'),
    ('dance_modern_style', '%dance_modern_style%', 'source'),
    ('dance_modern_style', '%contemporary%', 'listing'),
    ('dance_modern_style', '%modern dance%', 'listing'),
    ('dance_modern_style', '%hip hop%', 'listing'),
    ('dance_modern_style', '%ballet%', 'listing'),
    ('dance_modern_style', '%tap%', 'listing'),
    ('dance_modern_style', '%funk%', 'listing'),
    ('dance_modern_style', '%breakdance%', 'listing'),
    ('dance_modern_style', '%bellydance%', 'listing'),
    ('dance_modern_style', '%bollywood%', 'listing'),
    ('dance_fitness_and_health', '%dance_fitness_and_health%', 'source'),
    ('dance_fitness_and_health', '%zumba%', 'listing'),
    ('dance_fitness_and_health', '%dance fitness%', 'listing'),
    ('dance_fitness_and_health', '%cardio dance%', 'listing'),
    ('dance_fitness_and_health', '%salsacise%', 'listing'),
    ('dance_teachers', '%dance_teachers%', 'source'),
    ('dance_teachers', '%private lesson%', 'listing'),
    ('dance_teachers', '%private lessons%', 'listing'),
    ('dance_teachers', '%dance teacher%', 'listing'),
    ('dance_teachers', '%dance instructor%', 'listing')
),
distinct_matches AS (
  SELECT DISTINCT
    b.listing_id,
    b.city_slug,
    sp.category_slug
  FROM dance_base b
  JOIN style_patterns sp
    ON (
      (sp.search_area = 'source' AND b.source_text LIKE sp.pattern)
      OR (sp.search_area = 'listing' AND b.listing_text LIKE sp.pattern)
    )
)
INSERT INTO listing_placements (
  listing_id,
  category_slug,
  city_slug,
  sort_order,
  position_type,
  is_active,
  starts_at,
  expires_at
)
SELECT
  m.listing_id,
  m.category_slug,
  m.city_slug,
  0,
  'organic',
  1,
  NULL,
  NULL
FROM distinct_matches m
JOIN categories c ON c.slug = m.category_slug
WHERE COALESCE(c.status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listing_placements existing
    WHERE existing.listing_id = m.listing_id
      AND existing.category_slug = m.category_slug
      AND (
        existing.city_slug = m.city_slug
        OR (existing.city_slug IS NULL AND m.city_slug IS NULL)
      )
  );
