-- Launch duplicate identity cleanup.
-- Collapses remaining high-confidence duplicate listing/business records while preserving placements and ownership links.

UPDATE listings
SET tagline = 'Social and scenic walks around Brisbane, Gold Coast and Sunshine Coast',
    updated_at = datetime('now')
WHERE id = 66;

UPDATE listings
SET description = REPLACE(REPLACE(description, 'Belly Danc e', 'Belly Dance'), 'J oin', 'Join'),
    updated_at = datetime('now')
WHERE id IN (41, 42, 43);

UPDATE listings
SET tagline = 'Exclusive matchmaking for professional singles',
    updated_at = datetime('now')
WHERE id = 52
  AND COALESCE(NULLIF(TRIM(tagline), ''), '') = '';

UPDATE listings
SET title = 'Socializing Newcastle',
    web = 'socializingnewcastle.com.au',
    updated_at = datetime('now')
WHERE id = 532;

UPDATE businesses
SET name = 'Socializing Newcastle',
    website = 'socializingnewcastle.com.au',
    updated_at = datetime('now')
WHERE id = 532;

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 37, 37, 37),
    (41, 42, 42, 42),
    (43, 42, 42, 42),
    (53, 52, 52, 52),
    (85, 85, 722, 722),
    (227, 227, 226, 226),
    (235, 235, 226, 226),
    (396, 396, 118, 118),
    (397, 397, 118, 118),
    (453, 453, 452, 452),
    (454, 454, 452, 452),
    (498, 498, 673, 673),
    (520, 520, 566, 566),
    (550, 550, 8, 8),
    (593, 593, 66, 66),
    (597, 597, 180, 180),
    (626, 626, 625, 625),
    (629, 629, 372, 372),
    (635, 635, 393, 393),
    (647, 647, 424, 424),
    (649, 649, 688, 688),
    (650, 650, 688, 688),
    (651, 651, 688, 688),
    (652, 652, 688, 688),
    (656, 656, 66, 66),
    (662, 662, 534, 534),
    (667, 667, 478, 478)
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
    (36, 37, 37, 37),
    (41, 42, 42, 42),
    (43, 42, 42, 42),
    (53, 52, 52, 52),
    (85, 85, 722, 722),
    (227, 227, 226, 226),
    (235, 235, 226, 226),
    (396, 396, 118, 118),
    (397, 397, 118, 118),
    (453, 453, 452, 452),
    (454, 454, 452, 452),
    (498, 498, 673, 673),
    (520, 520, 566, 566),
    (550, 550, 8, 8),
    (593, 593, 66, 66),
    (597, 597, 180, 180),
    (626, 626, 625, 625),
    (629, 629, 372, 372),
    (635, 635, 393, 393),
    (647, 647, 424, 424),
    (649, 649, 688, 688),
    (650, 650, 688, 688),
    (651, 651, 688, 688),
    (652, 652, 688, 688),
    (656, 656, 66, 66),
    (662, 662, 534, 534),
    (667, 667, 478, 478)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(deleted_reason, 'Launch cleanup merged duplicate listing identity.'),
    merged_into_listing_id = (SELECT keep_listing_id FROM m WHERE m.merge_listing_id = listings.id),
    business_id = (SELECT keep_business_id FROM m WHERE m.merge_listing_id = listings.id),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_listing_id FROM m)
  AND COALESCE(status, 'active') = 'active';

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 37, 37, 37),
    (41, 42, 42, 42),
    (43, 42, 42, 42),
    (53, 52, 52, 52),
    (85, 85, 722, 722),
    (227, 227, 226, 226),
    (235, 235, 226, 226),
    (396, 396, 118, 118),
    (397, 397, 118, 118),
    (453, 453, 452, 452),
    (454, 454, 452, 452),
    (498, 498, 673, 673),
    (520, 520, 566, 566),
    (550, 550, 8, 8),
    (593, 593, 66, 66),
    (597, 597, 180, 180),
    (626, 626, 625, 625),
    (629, 629, 372, 372),
    (635, 635, 393, 393),
    (647, 647, 424, 424),
    (649, 649, 688, 688),
    (650, 650, 688, 688),
    (651, 651, 688, 688),
    (652, 652, 688, 688),
    (656, 656, 66, 66),
    (662, 662, 534, 534),
    (667, 667, 478, 478)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE m.merge_business_id = businesses.id),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (
  SELECT merge_business_id
  FROM m
  WHERE merge_business_id != keep_business_id
)
  AND COALESCE(status, 'active') = 'active';

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 37, 37, 37),
    (41, 42, 42, 42),
    (43, 42, 42, 42),
    (53, 52, 52, 52),
    (85, 85, 722, 722),
    (227, 227, 226, 226),
    (235, 235, 226, 226),
    (396, 396, 118, 118),
    (397, 397, 118, 118),
    (453, 453, 452, 452),
    (454, 454, 452, 452),
    (498, 498, 673, 673),
    (520, 520, 566, 566),
    (550, 550, 8, 8),
    (593, 593, 66, 66),
    (597, 597, 180, 180),
    (626, 626, 625, 625),
    (629, 629, 372, 372),
    (635, 635, 393, 393),
    (647, 647, 424, 424),
    (649, 649, 688, 688),
    (650, 650, 688, 688),
    (651, 651, 688, 688),
    (652, 652, 688, 688),
    (656, 656, 66, 66),
    (662, 662, 534, 534),
    (667, 667, 478, 478)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id
WHERE m.merge_business_id != m.keep_business_id;

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 37, 37, 37),
    (41, 42, 42, 42),
    (43, 42, 42, 42),
    (53, 52, 52, 52),
    (85, 85, 722, 722),
    (227, 227, 226, 226),
    (235, 235, 226, 226),
    (396, 396, 118, 118),
    (397, 397, 118, 118),
    (453, 453, 452, 452),
    (454, 454, 452, 452),
    (498, 498, 673, 673),
    (520, 520, 566, 566),
    (550, 550, 8, 8),
    (593, 593, 66, 66),
    (597, 597, 180, 180),
    (626, 626, 625, 625),
    (629, 629, 372, 372),
    (635, 635, 393, 393),
    (647, 647, 424, 424),
    (649, 649, 688, 688),
    (650, 650, 688, 688),
    (651, 651, 688, 688),
    (652, 652, 688, 688),
    (656, 656, 66, 66),
    (662, 662, 534, 534),
    (667, 667, 478, 478)
)
UPDATE business_claim_requests
SET resolved_business_id = (SELECT keep_business_id FROM m WHERE m.merge_business_id = business_claim_requests.resolved_business_id),
    updated_at = datetime('now')
WHERE resolved_business_id IN (
  SELECT merge_business_id
  FROM m
  WHERE merge_business_id != keep_business_id
);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 37, 37, 37),
    (41, 42, 42, 42),
    (43, 42, 42, 42),
    (53, 52, 52, 52),
    (85, 85, 722, 722),
    (227, 227, 226, 226),
    (235, 235, 226, 226),
    (396, 396, 118, 118),
    (397, 397, 118, 118),
    (453, 453, 452, 452),
    (454, 454, 452, 452),
    (498, 498, 673, 673),
    (520, 520, 566, 566),
    (550, 550, 8, 8),
    (593, 593, 66, 66),
    (597, 597, 180, 180),
    (626, 626, 625, 625),
    (629, 629, 372, 372),
    (635, 635, 393, 393),
    (647, 647, 424, 424),
    (649, 649, 688, 688),
    (650, 650, 688, 688),
    (651, 651, 688, 688),
    (652, 652, 688, 688),
    (656, 656, 66, 66),
    (662, 662, 534, 534),
    (667, 667, 478, 478)
)
UPDATE banners
SET business_id = (SELECT keep_business_id FROM m WHERE m.merge_business_id = banners.business_id)
WHERE business_id IN (
    SELECT merge_business_id
    FROM m
    WHERE merge_business_id != keep_business_id
  );

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (36, 37, 37, 37),
    (41, 42, 42, 42),
    (43, 42, 42, 42),
    (53, 52, 52, 52),
    (85, 85, 722, 722),
    (227, 227, 226, 226),
    (235, 235, 226, 226),
    (396, 396, 118, 118),
    (397, 397, 118, 118),
    (453, 453, 452, 452),
    (454, 454, 452, 452),
    (498, 498, 673, 673),
    (520, 520, 566, 566),
    (550, 550, 8, 8),
    (593, 593, 66, 66),
    (597, 597, 180, 180),
    (626, 626, 625, 625),
    (629, 629, 372, 372),
    (635, 635, 393, 393),
    (647, 647, 424, 424),
    (649, 649, 688, 688),
    (650, 650, 688, 688),
    (651, 651, 688, 688),
    (652, 652, 688, 688),
    (656, 656, 66, 66),
    (662, 662, 534, 534),
    (667, 667, 478, 478)
)
DELETE FROM advertiser_account_businesses
WHERE business_id IN (
  SELECT merge_business_id
  FROM m
  WHERE merge_business_id != keep_business_id
);
