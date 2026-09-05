-- High-confidence banner ownership cleanup.
-- Banners that clearly match an existing business by legacy image/URL/title are linked
-- to that business so claim/portal ownership can see the advertising surface.
-- Affiliate and house-promo banners remain unowned for separate campaign classification.

UPDATE banners SET business_id = 52 WHERE id IN (442, 449, 561, 622) AND business_id IS NULL;
UPDATE banners SET business_id = 772 WHERE id = 445 AND business_id IS NULL;
UPDATE banners SET business_id = 28 WHERE id IN (476, 492) AND business_id IS NULL;
UPDATE banners SET business_id = 330 WHERE id = 478 AND business_id IS NULL;
UPDATE banners SET business_id = 505 WHERE id = 488 AND business_id IS NULL;
UPDATE banners SET business_id = 473 WHERE id = 539 AND business_id IS NULL;
UPDATE banners SET business_id = 528 WHERE id = 555 AND business_id IS NULL;
UPDATE banners SET business_id = 532 WHERE id IN (566, 582) AND business_id IS NULL;
UPDATE banners SET business_id = 801 WHERE id = 610 AND business_id IS NULL;
UPDATE banners SET business_id = 310 WHERE id = 629 AND business_id IS NULL;
UPDATE banners SET business_id = 309 WHERE id = 644 AND business_id IS NULL;
