-- Sweep 3: high-confidence image repairs from the loose legacy image audit.
-- Medium-confidence candidates are intentionally left for manual review.

UPDATE listings SET image_url = '/images/goldilocks.gif', updated_at = datetime('now') WHERE id = 169;
UPDATE businesses SET logo_url = '/images/goldilocks.gif', updated_at = datetime('now') WHERE id = 169;
DELETE FROM listing_images WHERE listing_id = 169 AND is_primary = 1;
INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (169, '/images/goldilocks.gif', 'Goldilocks image', 0, 1);

UPDATE listings SET image_url = '/images/_large.gif', updated_at = datetime('now') WHERE id = 220;
UPDATE businesses SET logo_url = '/images/_large.gif', updated_at = datetime('now') WHERE id = 220;
DELETE FROM listing_images WHERE listing_id = 220 AND is_primary = 1;
INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (220, '/images/_large.gif', 'Large Friends image', 0, 1);

UPDATE listings SET image_url = '/images/LoveSites.gif', updated_at = datetime('now') WHERE id = 260;
UPDATE businesses SET logo_url = '/images/LoveSites.gif', updated_at = datetime('now') WHERE id = 260;
DELETE FROM listing_images WHERE listing_id = 260 AND is_primary = 1;
INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (260, '/images/LoveSites.gif', 'Lovesites-Directory image', 0, 1);

UPDATE listings SET image_url = '/images/over28.gif', updated_at = datetime('now') WHERE id = 319;
UPDATE businesses SET logo_url = '/images/over28.gif', updated_at = datetime('now') WHERE id = 319;
DELETE FROM listing_images WHERE listing_id = 319 AND is_primary = 1;
INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (319, '/images/over28.gif', 'Over28.com image', 0, 1);

UPDATE listings SET image_url = '/images/RSVP.gif', updated_at = datetime('now') WHERE id = 373;
UPDATE businesses SET logo_url = '/images/RSVP.gif', updated_at = datetime('now') WHERE id = 373;
DELETE FROM listing_images WHERE listing_id = 373 AND is_primary = 1;
INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (373, '/images/RSVP.gif', 'RSVP image', 0, 1);

UPDATE listings SET image_url = '/images/elite.jpg', updated_at = datetime('now') WHERE id = 715;
UPDATE businesses SET logo_url = '/images/elite.jpg', updated_at = datetime('now') WHERE id = 715;
DELETE FROM listing_images WHERE listing_id = 715 AND is_primary = 1;
INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (715, '/images/elite.jpg', 'EliteSingles Australia image', 0, 1);

UPDATE listings SET image_url = '/images/deen.jpg', updated_at = datetime('now') WHERE id = 300;
UPDATE businesses SET logo_url = '/images/deen.jpg', updated_at = datetime('now') WHERE id = 300;
DELETE FROM listing_images WHERE listing_id = 300 AND is_primary = 1;
INSERT INTO listing_images (listing_id, url, alt_text, sort_order, is_primary) VALUES (300, '/images/deen.jpg', 'Mt. View - Bimbadeen Estate image', 0, 1);
