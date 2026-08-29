-- Collapse older junk image buckets into the canonical junk/old-site-assets tree.
-- D1 can reject repeated LIKE path-prefix patterns as too complex, so these
-- updates use instr(value, prefix) = 1 for prefix matching.
UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/junk/e4s-old-site-assets/', '/images/junk/old-site-assets/e4s-brand/')
WHERE instr(hero_image_url, '/images/junk/e4s-old-site-assets/') = 1;

UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/junk/legacy-icons-and-nav/', '/images/junk/old-site-assets/navigation-and-buttons/')
WHERE instr(hero_image_url, '/images/junk/legacy-icons-and-nav/') = 1;

UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/junk/legacy-numbered-logos/', '/images/junk/old-site-assets/numbered-logos/')
WHERE instr(hero_image_url, '/images/junk/legacy-numbered-logos/') = 1;

UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/junk/legacy-page-art/', '/images/junk/old-site-assets/page-art/')
WHERE instr(hero_image_url, '/images/junk/legacy-page-art/') = 1;

UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/junk/low-quality-or-generic-business-candidates/', '/images/junk/old-site-assets/low-quality-or-generic-business-candidates/')
WHERE instr(hero_image_url, '/images/junk/low-quality-or-generic-business-candidates/') = 1;

UPDATE listings
SET image_url = replace(image_url, '/images/junk/e4s-old-site-assets/', '/images/junk/old-site-assets/e4s-brand/')
WHERE instr(image_url, '/images/junk/e4s-old-site-assets/') = 1;

UPDATE listings
SET image_url = replace(image_url, '/images/junk/legacy-icons-and-nav/', '/images/junk/old-site-assets/navigation-and-buttons/')
WHERE instr(image_url, '/images/junk/legacy-icons-and-nav/') = 1;

UPDATE listings
SET image_url = replace(image_url, '/images/junk/legacy-numbered-logos/', '/images/junk/old-site-assets/numbered-logos/')
WHERE instr(image_url, '/images/junk/legacy-numbered-logos/') = 1;

UPDATE listings
SET image_url = replace(image_url, '/images/junk/legacy-page-art/', '/images/junk/old-site-assets/page-art/')
WHERE instr(image_url, '/images/junk/legacy-page-art/') = 1;

UPDATE listings
SET image_url = replace(image_url, '/images/junk/low-quality-or-generic-business-candidates/', '/images/junk/old-site-assets/low-quality-or-generic-business-candidates/')
WHERE instr(image_url, '/images/junk/low-quality-or-generic-business-candidates/') = 1;

UPDATE businesses
SET logo_url = replace(logo_url, '/images/junk/e4s-old-site-assets/', '/images/junk/old-site-assets/e4s-brand/')
WHERE instr(logo_url, '/images/junk/e4s-old-site-assets/') = 1;

UPDATE businesses
SET logo_url = replace(logo_url, '/images/junk/legacy-icons-and-nav/', '/images/junk/old-site-assets/navigation-and-buttons/')
WHERE instr(logo_url, '/images/junk/legacy-icons-and-nav/') = 1;

UPDATE businesses
SET logo_url = replace(logo_url, '/images/junk/legacy-numbered-logos/', '/images/junk/old-site-assets/numbered-logos/')
WHERE instr(logo_url, '/images/junk/legacy-numbered-logos/') = 1;

UPDATE businesses
SET logo_url = replace(logo_url, '/images/junk/legacy-page-art/', '/images/junk/old-site-assets/page-art/')
WHERE instr(logo_url, '/images/junk/legacy-page-art/') = 1;

UPDATE businesses
SET logo_url = replace(logo_url, '/images/junk/low-quality-or-generic-business-candidates/', '/images/junk/old-site-assets/low-quality-or-generic-business-candidates/')
WHERE instr(logo_url, '/images/junk/low-quality-or-generic-business-candidates/') = 1;

UPDATE listing_images
SET url = replace(url, '/images/junk/e4s-old-site-assets/', '/images/junk/old-site-assets/e4s-brand/')
WHERE instr(url, '/images/junk/e4s-old-site-assets/') = 1;

UPDATE listing_images
SET url = replace(url, '/images/junk/legacy-icons-and-nav/', '/images/junk/old-site-assets/navigation-and-buttons/')
WHERE instr(url, '/images/junk/legacy-icons-and-nav/') = 1;

UPDATE listing_images
SET url = replace(url, '/images/junk/legacy-numbered-logos/', '/images/junk/old-site-assets/numbered-logos/')
WHERE instr(url, '/images/junk/legacy-numbered-logos/') = 1;

UPDATE listing_images
SET url = replace(url, '/images/junk/legacy-page-art/', '/images/junk/old-site-assets/page-art/')
WHERE instr(url, '/images/junk/legacy-page-art/') = 1;

UPDATE listing_images
SET url = replace(url, '/images/junk/low-quality-or-generic-business-candidates/', '/images/junk/old-site-assets/low-quality-or-generic-business-candidates/')
WHERE instr(url, '/images/junk/low-quality-or-generic-business-candidates/') = 1;

UPDATE banners
SET image_url = replace(image_url, '/images/junk/e4s-old-site-assets/', '/images/junk/old-site-assets/e4s-brand/')
WHERE instr(image_url, '/images/junk/e4s-old-site-assets/') = 1;

UPDATE banners
SET image_url = replace(image_url, '/images/junk/legacy-icons-and-nav/', '/images/junk/old-site-assets/navigation-and-buttons/')
WHERE instr(image_url, '/images/junk/legacy-icons-and-nav/') = 1;

UPDATE banners
SET image_url = replace(image_url, '/images/junk/legacy-numbered-logos/', '/images/junk/old-site-assets/numbered-logos/')
WHERE instr(image_url, '/images/junk/legacy-numbered-logos/') = 1;

UPDATE banners
SET image_url = replace(image_url, '/images/junk/legacy-page-art/', '/images/junk/old-site-assets/page-art/')
WHERE instr(image_url, '/images/junk/legacy-page-art/') = 1;

UPDATE banners
SET image_url = replace(image_url, '/images/junk/low-quality-or-generic-business-candidates/', '/images/junk/old-site-assets/low-quality-or-generic-business-candidates/')
WHERE instr(image_url, '/images/junk/low-quality-or-generic-business-candidates/') = 1;

UPDATE events
SET image_url = replace(image_url, '/images/junk/e4s-old-site-assets/', '/images/junk/old-site-assets/e4s-brand/')
WHERE instr(image_url, '/images/junk/e4s-old-site-assets/') = 1;

UPDATE events
SET image_url = replace(image_url, '/images/junk/legacy-icons-and-nav/', '/images/junk/old-site-assets/navigation-and-buttons/')
WHERE instr(image_url, '/images/junk/legacy-icons-and-nav/') = 1;

UPDATE events
SET image_url = replace(image_url, '/images/junk/legacy-numbered-logos/', '/images/junk/old-site-assets/numbered-logos/')
WHERE instr(image_url, '/images/junk/legacy-numbered-logos/') = 1;

UPDATE events
SET image_url = replace(image_url, '/images/junk/legacy-page-art/', '/images/junk/old-site-assets/page-art/')
WHERE instr(image_url, '/images/junk/legacy-page-art/') = 1;

UPDATE events
SET image_url = replace(image_url, '/images/junk/low-quality-or-generic-business-candidates/', '/images/junk/old-site-assets/low-quality-or-generic-business-candidates/')
WHERE instr(image_url, '/images/junk/low-quality-or-generic-business-candidates/') = 1;
