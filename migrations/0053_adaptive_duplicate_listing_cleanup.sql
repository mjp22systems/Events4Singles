-- Adaptive duplicate listing cleanup.
-- Preserves placements on the kept listing, marks duplicate rows as merged, and
-- keeps advertiser/business ownership pointing at the canonical business.

UPDATE listings
SET title = 'Cheap-Eats-Group',
    tagline = COALESCE(NULLIF(tagline, ''), 'Dine and Dance every Wednesday and Friday'),
    updated_at = datetime('now')
WHERE id = 546;

UPDATE businesses
SET name = 'Cheap-Eats-Group',
    updated_at = datetime('now')
WHERE id = 546;

UPDATE listings
SET email = COALESCE(NULLIF(email, ''), 'christine@caring4couples.com.au'),
    description = CASE
      WHEN TRIM(COALESCE(description, '')) = 'C: christine@caring4couples' THEN ''
      ELSE description
    END,
    updated_at = datetime('now')
WHERE id = 90;

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 36, 37, 37),
    (41, 41, 42, 42),
    (43, 43, 42, 42),
    (56, 56, 559, 559),
    (562, 562, 50, 50),
    (53, 53, 52, 52),
    (570, 570, 546, 546),
    (97, 97, 96, 96),
    (437, 437, 436, 436),
    (325, 325, 324, 324),
    (326, 326, 324, 324),
    (327, 327, 324, 324),
    (618, 618, 324, 324),
    (619, 619, 324, 324),
    (620, 620, 324, 324),
    (445, 445, 446, 446),
    (447, 447, 446, 446),
    (659, 659, 446, 446),
    (507, 507, 509, 509),
    (508, 508, 509, 509),
    (238, 238, 239, 239),
    (222, 222, 223, 223),
    (225, 225, 224, 224),
    (234, 234, 233, 233),
    (268, 268, 269, 269),
    (202, 202, 201, 201),
    (382, 382, 381, 381),
    (440, 440, 441, 441)
)
INSERT INTO listing_placements (listing_id, category_slug, city_slug, sort_order, position_type, is_active, starts_at, expires_at)
SELECT
  m.keep_listing_id,
  p.category_slug,
  p.city_slug,
  p.sort_order,
  p.position_type,
  p.is_active,
  p.starts_at,
  p.expires_at
FROM listing_placements AS p
JOIN m ON m.merge_listing_id = p.listing_id
WHERE NOT EXISTS (
  SELECT 1
  FROM listing_placements AS existing
  WHERE existing.listing_id = m.keep_listing_id
    AND COALESCE(existing.category_slug, '') = COALESCE(p.category_slug, '')
    AND COALESCE(existing.city_slug, '') = COALESCE(p.city_slug, '')
);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 36, 37, 37),
    (41, 41, 42, 42),
    (43, 43, 42, 42),
    (56, 56, 559, 559),
    (562, 562, 50, 50),
    (53, 53, 52, 52),
    (570, 570, 546, 546),
    (97, 97, 96, 96),
    (437, 437, 436, 436),
    (325, 325, 324, 324),
    (326, 326, 324, 324),
    (327, 327, 324, 324),
    (618, 618, 324, 324),
    (619, 619, 324, 324),
    (620, 620, 324, 324),
    (445, 445, 446, 446),
    (447, 447, 446, 446),
    (659, 659, 446, 446),
    (507, 507, 509, 509),
    (508, 508, 509, 509),
    (238, 238, 239, 239),
    (222, 222, 223, 223),
    (225, 225, 224, 224),
    (234, 234, 233, 233),
    (268, 268, 269, 269),
    (202, 202, 201, 201),
    (382, 382, 381, 381),
    (440, 440, 441, 441)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'Adaptive duplicate of listing #' || (
        SELECT keep_listing_id FROM m WHERE merge_listing_id = listings.id
      )
    ),
    merged_into_listing_id = (SELECT keep_listing_id FROM m WHERE merge_listing_id = listings.id),
    business_id = (SELECT keep_business_id FROM m WHERE merge_listing_id = listings.id),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_listing_id FROM m)
  AND COALESCE(status, 'active') = 'active';

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 36, 37, 37),
    (41, 41, 42, 42),
    (43, 43, 42, 42),
    (56, 56, 559, 559),
    (562, 562, 50, 50),
    (53, 53, 52, 52),
    (570, 570, 546, 546),
    (97, 97, 96, 96),
    (437, 437, 436, 436),
    (325, 325, 324, 324),
    (326, 326, 324, 324),
    (327, 327, 324, 324),
    (618, 618, 324, 324),
    (619, 619, 324, 324),
    (620, 620, 324, 324),
    (445, 445, 446, 446),
    (447, 447, 446, 446),
    (659, 659, 446, 446),
    (507, 507, 509, 509),
    (508, 508, 509, 509),
    (238, 238, 239, 239),
    (222, 222, 223, 223),
    (225, 225, 224, 224),
    (234, 234, 233, 233),
    (268, 268, 269, 269),
    (202, 202, 201, 201),
    (382, 382, 381, 381),
    (440, 440, 441, 441)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = businesses.id LIMIT 1),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 36, 37, 37),
    (41, 41, 42, 42),
    (43, 43, 42, 42),
    (56, 56, 559, 559),
    (562, 562, 50, 50),
    (53, 53, 52, 52),
    (570, 570, 546, 546),
    (97, 97, 96, 96),
    (437, 437, 436, 436),
    (325, 325, 324, 324),
    (326, 326, 324, 324),
    (327, 327, 324, 324),
    (618, 618, 324, 324),
    (619, 619, 324, 324),
    (620, 620, 324, 324),
    (445, 445, 446, 446),
    (447, 447, 446, 446),
    (659, 659, 446, 446),
    (507, 507, 509, 509),
    (508, 508, 509, 509),
    (238, 238, 239, 239),
    (222, 222, 223, 223),
    (225, 225, 224, 224),
    (234, 234, 233, 233),
    (268, 268, 269, 269),
    (202, 202, 201, 201),
    (382, 382, 381, 381),
    (440, 440, 441, 441)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id;

DELETE FROM advertiser_account_businesses
WHERE business_id IN (
  36, 41, 43, 56, 562, 53, 570, 97, 437, 325, 326, 327, 618, 619,
  620, 445, 447, 659, 507, 508, 238, 222, 225, 234, 268, 202, 382, 440
);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 36, 37, 37),
    (41, 41, 42, 42),
    (43, 43, 42, 42),
    (56, 56, 559, 559),
    (562, 562, 50, 50),
    (53, 53, 52, 52),
    (570, 570, 546, 546),
    (97, 97, 96, 96),
    (437, 437, 436, 436),
    (325, 325, 324, 324),
    (326, 326, 324, 324),
    (327, 327, 324, 324),
    (618, 618, 324, 324),
    (619, 619, 324, 324),
    (620, 620, 324, 324),
    (445, 445, 446, 446),
    (447, 447, 446, 446),
    (659, 659, 446, 446),
    (507, 507, 509, 509),
    (508, 508, 509, 509),
    (238, 238, 239, 239),
    (222, 222, 223, 223),
    (225, 225, 224, 224),
    (234, 234, 233, 233),
    (268, 268, 269, 269),
    (202, 202, 201, 201),
    (382, 382, 381, 381),
    (440, 440, 441, 441)
)
UPDATE business_claim_requests
SET resolved_business_id = (
      SELECT keep_business_id FROM m WHERE merge_business_id = business_claim_requests.resolved_business_id LIMIT 1
    ),
    updated_at = datetime('now')
WHERE resolved_business_id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 36, 37, 37),
    (41, 41, 42, 42),
    (43, 43, 42, 42),
    (56, 56, 559, 559),
    (562, 562, 50, 50),
    (53, 53, 52, 52),
    (570, 570, 546, 546),
    (97, 97, 96, 96),
    (437, 437, 436, 436),
    (325, 325, 324, 324),
    (326, 326, 324, 324),
    (327, 327, 324, 324),
    (618, 618, 324, 324),
    (619, 619, 324, 324),
    (620, 620, 324, 324),
    (445, 445, 446, 446),
    (447, 447, 446, 446),
    (659, 659, 446, 446),
    (507, 507, 509, 509),
    (508, 508, 509, 509),
    (238, 238, 239, 239),
    (222, 222, 223, 223),
    (225, 225, 224, 224),
    (234, 234, 233, 233),
    (268, 268, 269, 269),
    (202, 202, 201, 201),
    (382, 382, 381, 381),
    (440, 440, 441, 441)
)
UPDATE banners
SET business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = banners.business_id LIMIT 1)
WHERE business_id IN (SELECT merge_business_id FROM m);
