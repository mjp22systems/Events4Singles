-- High-confidence business dedupe sweep.
-- Data-only migration. Listings remain intact and are reassigned to canonical businesses.
-- Source businesses are retained and marked merged so public profile redirects can preserve old links.

UPDATE listings SET business_id = 19, updated_at = datetime('now') WHERE business_id = 20;
UPDATE businesses SET status = 'merged', merged_into_business_id = 19, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 20;

UPDATE listings SET business_id = 22, updated_at = datetime('now') WHERE business_id = 554;
UPDATE businesses SET status = 'merged', merged_into_business_id = 22, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 554;

UPDATE listings SET business_id = 37, updated_at = datetime('now') WHERE business_id = 558;
UPDATE businesses SET status = 'merged', merged_into_business_id = 37, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 558;

UPDATE listings SET business_id = 51, updated_at = datetime('now') WHERE business_id = 563;
UPDATE businesses SET status = 'merged', merged_into_business_id = 51, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 563;

UPDATE listings SET business_id = 61, updated_at = datetime('now') WHERE business_id = 62;
UPDATE businesses SET status = 'merged', merged_into_business_id = 61, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 62;

UPDATE listings SET business_id = 566, updated_at = datetime('now') WHERE business_id = 565;
UPDATE businesses SET status = 'merged', merged_into_business_id = 566, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 565;

UPDATE listings SET business_id = 527, updated_at = datetime('now') WHERE business_id IN (567, 681);
UPDATE businesses SET status = 'merged', merged_into_business_id = 527, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id IN (567, 681);

UPDATE listings SET business_id = 569, updated_at = datetime('now') WHERE business_id = 568;
UPDATE businesses SET status = 'merged', merged_into_business_id = 569, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 568;

UPDATE listings SET business_id = 577, updated_at = datetime('now') WHERE business_id IN (533, 578);
UPDATE businesses SET status = 'merged', merged_into_business_id = 577, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id IN (533, 578);

UPDATE listings SET business_id = 581, updated_at = datetime('now') WHERE business_id = 582;
UPDATE businesses SET status = 'merged', merged_into_business_id = 581, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 582;

UPDATE listings SET business_id = 590, updated_at = datetime('now') WHERE business_id = 589;
UPDATE businesses SET status = 'merged', merged_into_business_id = 590, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 589;

UPDATE listings SET business_id = 155, updated_at = datetime('now') WHERE business_id = 591;
UPDATE businesses SET status = 'merged', merged_into_business_id = 155, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 591;

UPDATE listings SET business_id = 216, updated_at = datetime('now') WHERE business_id = 605;
UPDATE businesses SET status = 'merged', merged_into_business_id = 216, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 605;

UPDATE listings SET business_id = 257, updated_at = datetime('now') WHERE business_id = 610;
UPDATE businesses SET status = 'merged', merged_into_business_id = 257, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 610;

UPDATE listings SET business_id = 286, updated_at = datetime('now') WHERE business_id = 615;
UPDATE businesses SET status = 'merged', merged_into_business_id = 286, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 615;

UPDATE listings SET business_id = 366, updated_at = datetime('now') WHERE business_id = 627;
UPDATE businesses SET status = 'merged', merged_into_business_id = 366, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 627;

UPDATE listings SET business_id = 402, updated_at = datetime('now') WHERE business_id IN (403, 404);
UPDATE businesses SET status = 'merged', merged_into_business_id = 402, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id IN (403, 404);

UPDATE listings SET business_id = 415, updated_at = datetime('now') WHERE business_id = 641;
UPDATE businesses SET status = 'merged', merged_into_business_id = 415, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 641;

UPDATE listings SET business_id = 646, updated_at = datetime('now') WHERE business_id = 423;
UPDATE businesses SET status = 'merged', merged_into_business_id = 646, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 423;

UPDATE listings SET business_id = 534, updated_at = datetime('now') WHERE business_id = 663;
UPDATE businesses SET status = 'merged', merged_into_business_id = 534, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 663;

UPDATE listings SET business_id = 522, updated_at = datetime('now') WHERE business_id = 678;
UPDATE businesses SET status = 'merged', merged_into_business_id = 522, merged_at = strftime('%s','now'), updated_at = datetime('now') WHERE id = 678;
