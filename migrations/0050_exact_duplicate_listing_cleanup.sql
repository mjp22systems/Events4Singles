-- Exact duplicate listing cleanup.
-- Data-only migration. Duplicate listing rows are retained for auditability but removed
-- from public reads by status/deleted_at, and duplicate business/profile IDs redirect to
-- the chosen canonical business.

-- Men's Link Life Coaching: keep the richer canonical listing/business from the legacy sweep.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #286',
    merged_into_listing_id = 286,
    business_id = 286,
    updated_at = datetime('now')
WHERE id = 615;
UPDATE businesses SET status = 'merged', merged_into_business_id = 286, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 615;

-- Smooth Latin Groove: keep the canonical Brisbane listing/business with existing banner ownership.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #415',
    merged_into_listing_id = 415,
    business_id = 415,
    updated_at = datetime('now')
WHERE id = 641;
UPDATE businesses SET status = 'merged', merged_into_business_id = 415, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 641;

-- Soulmate Success: keep #646 because it carries the real image/contact details.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #646',
    merged_into_listing_id = 646,
    business_id = 646,
    updated_at = datetime('now')
WHERE id = 423;
UPDATE businesses SET status = 'merged', merged_into_business_id = 646, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 423;

-- Step in Time Ballroom Dancing: keep #434 to avoid the broken "Ti me" title.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #434',
    merged_into_listing_id = 434,
    business_id = 434,
    updated_at = datetime('now')
WHERE id = 433;
UPDATE businesses SET status = 'merged', merged_into_business_id = 434, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 433;

-- Tangomate: keep #466 because it has the useful description content.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #466',
    merged_into_listing_id = 466,
    business_id = 466,
    updated_at = datetime('now')
WHERE id = 462;
UPDATE businesses SET status = 'merged', merged_into_business_id = 466, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 462;

-- TasSwing: keep #470 because it has the more complete description.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #470',
    merged_into_listing_id = 470,
    business_id = 470,
    updated_at = datetime('now')
WHERE id = 468;
UPDATE businesses SET status = 'merged', merged_into_business_id = 470, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 468;

-- Tuesday Danceroc Night - Rigbys: keep #498 to avoid the broken "Tues day" title.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #498',
    merged_into_listing_id = 498,
    business_id = 498,
    updated_at = datetime('now')
WHERE id = 497;
UPDATE businesses SET status = 'merged', merged_into_business_id = 498, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 497;

-- Yoga Trinity: keep the richer canonical Brisbane listing/business.
UPDATE listings
SET status = 'merged',
    deleted_at = strftime('%s','now'),
    deleted_reason = 'Exact duplicate of listing #522',
    merged_into_listing_id = 522,
    business_id = 522,
    updated_at = datetime('now')
WHERE id = 678;
UPDATE businesses SET status = 'merged', merged_into_business_id = 522, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 678;

-- Preserve ownership/claim/banner links if any are attached to duplicate businesses.
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 286, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 615;
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 415, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 641;
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 646, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 423;
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 434, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 433;
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 466, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 462;
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 470, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 468;
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 498, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 497;
INSERT OR IGNORE INTO advertiser_account_businesses (account_id, business_id, role, is_primary, status, created_at, updated_at)
SELECT account_id, 522, role, is_primary, status, created_at, datetime('now') FROM advertiser_account_businesses WHERE business_id = 678;
DELETE FROM advertiser_account_businesses WHERE business_id IN (615, 641, 423, 433, 462, 468, 497, 678);

UPDATE business_claim_requests SET resolved_business_id = 286, updated_at = datetime('now') WHERE resolved_business_id = 615;
UPDATE business_claim_requests SET resolved_business_id = 415, updated_at = datetime('now') WHERE resolved_business_id = 641;
UPDATE business_claim_requests SET resolved_business_id = 646, updated_at = datetime('now') WHERE resolved_business_id = 423;
UPDATE business_claim_requests SET resolved_business_id = 434, updated_at = datetime('now') WHERE resolved_business_id = 433;
UPDATE business_claim_requests SET resolved_business_id = 466, updated_at = datetime('now') WHERE resolved_business_id = 462;
UPDATE business_claim_requests SET resolved_business_id = 470, updated_at = datetime('now') WHERE resolved_business_id = 468;
UPDATE business_claim_requests SET resolved_business_id = 498, updated_at = datetime('now') WHERE resolved_business_id = 497;
UPDATE business_claim_requests SET resolved_business_id = 522, updated_at = datetime('now') WHERE resolved_business_id = 678;

UPDATE banners SET business_id = 286 WHERE business_id = 615;
UPDATE banners SET business_id = 415 WHERE business_id = 641;
UPDATE banners SET business_id = 646 WHERE business_id = 423;
UPDATE banners SET business_id = 434 WHERE business_id = 433;
UPDATE banners SET business_id = 466 WHERE business_id = 462;
UPDATE banners SET business_id = 470 WHERE business_id = 468;
UPDATE banners SET business_id = 498 WHERE business_id = 497;
UPDATE banners SET business_id = 522 WHERE business_id = 678;
