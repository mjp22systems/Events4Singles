-- Keep stored image URLs aligned with the canonical public image tree.

UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/categories/optimized/', '/images/categories/heroes/')
WHERE hero_image_url LIKE '/images/categories/optimized/%';

UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/categories/hero/', '/images/categories/heroes/')
WHERE hero_image_url LIKE '/images/categories/hero/%';

UPDATE listings
SET image_url = replace(image_url, '/images/categories/optimized/', '/images/categories/cards/')
WHERE image_url LIKE '/images/categories/optimized/%';

UPDATE businesses
SET logo_url = replace(logo_url, '/images/categories/optimized/', '/images/categories/cards/')
WHERE logo_url LIKE '/images/categories/optimized/%';

UPDATE listing_images
SET url = replace(url, '/images/categories/optimized/', '/images/categories/cards/')
WHERE url LIKE '/images/categories/optimized/%';

UPDATE banners
SET image_url = replace(image_url, '/images/categories/optimized/', '/images/categories/cards/')
WHERE image_url LIKE '/images/categories/optimized/%';

UPDATE categories
SET hero_image_url = replace(hero_image_url, '/images/optimized/home-cat-', '/images/site/home/category-cards/home-cat-')
WHERE hero_image_url LIKE '/images/optimized/home-cat-%';

UPDATE listings
SET image_url = replace(image_url, '/images/optimized/home-cat-', '/images/site/home/category-cards/home-cat-')
WHERE image_url LIKE '/images/optimized/home-cat-%';

UPDATE businesses
SET logo_url = replace(logo_url, '/images/optimized/home-cat-', '/images/site/home/category-cards/home-cat-')
WHERE logo_url LIKE '/images/optimized/home-cat-%';

UPDATE listing_images
SET url = replace(url, '/images/optimized/home-cat-', '/images/site/home/category-cards/home-cat-')
WHERE url LIKE '/images/optimized/home-cat-%';

UPDATE banners
SET image_url = replace(image_url, '/images/optimized/home-cat-', '/images/site/home/category-cards/home-cat-')
WHERE image_url LIKE '/images/optimized/home-cat-%';

UPDATE listings
SET image_url = replace(image_url, '/images/optimized/home-city-', '/images/site/home/city-cards/home-city-')
WHERE image_url LIKE '/images/optimized/home-city-%';

UPDATE businesses
SET logo_url = replace(logo_url, '/images/optimized/home-city-', '/images/site/home/city-cards/home-city-')
WHERE logo_url LIKE '/images/optimized/home-city-%';

UPDATE listing_images
SET url = replace(url, '/images/optimized/home-city-', '/images/site/home/city-cards/home-city-')
WHERE url LIKE '/images/optimized/home-city-%';

UPDATE banners
SET image_url = replace(image_url, '/images/optimized/home-city-', '/images/site/home/city-cards/home-city-')
WHERE image_url LIKE '/images/optimized/home-city-%';
