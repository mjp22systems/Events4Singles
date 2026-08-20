-- Run against remote D1: npx wrangler d1 execute events4singles --remote --file tools/fix-sms-slug-remote.sql
-- Fixes sms-phone-dating slug to use underscores (matches toDbSlug convention)
-- Remote D1 typically has FK enforcement off by default so order matters less, but update placements first
UPDATE listing_placements SET category_slug='sms_phone_dating' WHERE category_slug='sms-phone-dating';
UPDATE categories SET slug='sms_phone_dating' WHERE slug='sms-phone-dating';
-- Verify
SELECT slug, label FROM categories WHERE label LIKE '%SMS%';
