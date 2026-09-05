-- High-confidence duplicate listing suppression.
-- Completes the business dedupe sweep by preserving source listing placements on the
-- canonical listing, then removing duplicate source listing rows from public reads.

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (20, 20, 19, 19),
    (554, 554, 22, 22),
    (558, 558, 37, 37),
    (563, 563, 51, 51),
    (62, 62, 61, 61),
    (565, 565, 566, 566),
    (567, 567, 527, 527),
    (681, 681, 527, 527),
    (568, 568, 569, 569),
    (533, 533, 577, 577),
    (578, 578, 577, 577),
    (582, 582, 581, 581),
    (589, 589, 590, 590),
    (591, 591, 155, 155),
    (605, 605, 216, 216),
    (610, 610, 257, 257),
    (615, 615, 286, 286),
    (627, 627, 366, 366),
    (403, 403, 402, 402),
    (404, 404, 402, 402),
    (641, 641, 415, 415),
    (423, 423, 646, 646),
    (663, 663, 534, 534),
    (678, 678, 522, 522)
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
    (20, 20, 19, 19),
    (554, 554, 22, 22),
    (558, 558, 37, 37),
    (563, 563, 51, 51),
    (62, 62, 61, 61),
    (565, 565, 566, 566),
    (567, 567, 527, 527),
    (681, 681, 527, 527),
    (568, 568, 569, 569),
    (533, 533, 577, 577),
    (578, 578, 577, 577),
    (582, 582, 581, 581),
    (589, 589, 590, 590),
    (591, 591, 155, 155),
    (605, 605, 216, 216),
    (610, 610, 257, 257),
    (615, 615, 286, 286),
    (627, 627, 366, 366),
    (403, 403, 402, 402),
    (404, 404, 402, 402),
    (641, 641, 415, 415),
    (423, 423, 646, 646),
    (663, 663, 534, 534),
    (678, 678, 522, 522)
)
UPDATE listings
SET status = 'merged',
    deleted_at = COALESCE(deleted_at, strftime('%s','now')),
    deleted_reason = COALESCE(
      deleted_reason,
      'High-confidence duplicate of listing #' || (
        SELECT keep_listing_id FROM m WHERE merge_listing_id = listings.id
      )
    ),
    merged_into_listing_id = (SELECT keep_listing_id FROM m WHERE merge_listing_id = listings.id),
    business_id = (SELECT keep_business_id FROM m WHERE merge_listing_id = listings.id),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_listing_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (20, 20, 19, 19),
    (554, 554, 22, 22),
    (558, 558, 37, 37),
    (563, 563, 51, 51),
    (62, 62, 61, 61),
    (565, 565, 566, 566),
    (567, 567, 527, 527),
    (681, 681, 527, 527),
    (568, 568, 569, 569),
    (533, 533, 577, 577),
    (578, 578, 577, 577),
    (582, 582, 581, 581),
    (589, 589, 590, 590),
    (591, 591, 155, 155),
    (605, 605, 216, 216),
    (610, 610, 257, 257),
    (615, 615, 286, 286),
    (627, 627, 366, 366),
    (403, 403, 402, 402),
    (404, 404, 402, 402),
    (641, 641, 415, 415),
    (423, 423, 646, 646),
    (663, 663, 534, 534),
    (678, 678, 522, 522)
)
UPDATE businesses
SET status = 'merged',
    merged_into_business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = businesses.id LIMIT 1),
    merged_at = COALESCE(merged_at, strftime('%s','now')),
    updated_at = datetime('now')
WHERE id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (20, 20, 19, 19),
    (554, 554, 22, 22),
    (558, 558, 37, 37),
    (563, 563, 51, 51),
    (62, 62, 61, 61),
    (565, 565, 566, 566),
    (567, 567, 527, 527),
    (681, 681, 527, 527),
    (568, 568, 569, 569),
    (533, 533, 577, 577),
    (578, 578, 577, 577),
    (582, 582, 581, 581),
    (589, 589, 590, 590),
    (591, 591, 155, 155),
    (605, 605, 216, 216),
    (610, 610, 257, 257),
    (615, 615, 286, 286),
    (627, 627, 366, 366),
    (403, 403, 402, 402),
    (404, 404, 402, 402),
    (641, 641, 415, 415),
    (423, 423, 646, 646),
    (663, 663, 534, 534),
    (678, 678, 522, 522)
)
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT aab.account_id, m.keep_business_id, aab.role, aab.is_primary, aab.status, aab.created_at, datetime('now')
FROM advertiser_account_businesses AS aab
JOIN m ON m.merge_business_id = aab.business_id;

DELETE FROM advertiser_account_businesses
WHERE business_id IN (
  20, 554, 558, 563, 62, 565, 567, 681, 568, 533, 578, 582,
  589, 591, 605, 610, 615, 627, 403, 404, 641, 423, 663, 678
);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (20, 20, 19, 19),
    (554, 554, 22, 22),
    (558, 558, 37, 37),
    (563, 563, 51, 51),
    (62, 62, 61, 61),
    (565, 565, 566, 566),
    (567, 567, 527, 527),
    (681, 681, 527, 527),
    (568, 568, 569, 569),
    (533, 533, 577, 577),
    (578, 578, 577, 577),
    (582, 582, 581, 581),
    (589, 589, 590, 590),
    (591, 591, 155, 155),
    (605, 605, 216, 216),
    (610, 610, 257, 257),
    (615, 615, 286, 286),
    (627, 627, 366, 366),
    (403, 403, 402, 402),
    (404, 404, 402, 402),
    (641, 641, 415, 415),
    (423, 423, 646, 646),
    (663, 663, 534, 534),
    (678, 678, 522, 522)
)
UPDATE business_claim_requests
SET resolved_business_id = (
      SELECT keep_business_id FROM m WHERE merge_business_id = business_claim_requests.resolved_business_id LIMIT 1
    ),
    updated_at = datetime('now')
WHERE resolved_business_id IN (SELECT merge_business_id FROM m);

WITH m(merge_listing_id, merge_business_id, keep_listing_id, keep_business_id) AS (
  VALUES
    (20, 20, 19, 19),
    (554, 554, 22, 22),
    (558, 558, 37, 37),
    (563, 563, 51, 51),
    (62, 62, 61, 61),
    (565, 565, 566, 566),
    (567, 567, 527, 527),
    (681, 681, 527, 527),
    (568, 568, 569, 569),
    (533, 533, 577, 577),
    (578, 578, 577, 577),
    (582, 582, 581, 581),
    (589, 589, 590, 590),
    (591, 591, 155, 155),
    (605, 605, 216, 216),
    (610, 610, 257, 257),
    (615, 615, 286, 286),
    (627, 627, 366, 366),
    (403, 403, 402, 402),
    (404, 404, 402, 402),
    (641, 641, 415, 415),
    (423, 423, 646, 646),
    (663, 663, 534, 534),
    (678, 678, 522, 522)
)
UPDATE banners
SET business_id = (SELECT keep_business_id FROM m WHERE merge_business_id = banners.business_id LIMIT 1)
WHERE business_id IN (SELECT merge_business_id FROM m);
