# Image Asset Taxonomy

This project keeps page-owned presentation images separate from reusable directory images.

## Homepage

Homepage-only imagery lives under `public/images/site/home/`.

- `hero/` contains the homepage hero background.
- `intent-cards/` contains the "What are you looking for?" pathway tiles.
- `city-cards/` contains homepage-specific city tile crops.
- `browse-category-tiles/` contains homepage-specific Browse by Category tile crops.
- `experience-cards/` contains Curated Experiences tile imagery.
- `resource-cards/` contains Dating Resources teaser imagery on the homepage.

Do not replace these with generic category or city assets unless the homepage design is being intentionally changed.

## Reusable Directory Images

Reusable category images live under `public/images/categories/`.

- `cards/` contains reusable category card images.
- `heroes/` contains reusable category hero images.

Reusable city images live under `public/images/cities/`.

- `cards/` contains reusable city card images outside the homepage.
- `heroes/` contains optimized city hero photos.

Legacy/rendered fallbacks live under `public/images/site/`.

- `category-heroes/` contains SVG category and category-city fallback hero artwork.
- `location-photos/` contains older city photo fallbacks.
- `location-heroes/` contains SVG city fallback hero artwork.
- `placeholders/` contains site placeholder images such as "Advertise here" tiles.

## Advertiser Images

Advertiser-owned and legacy promotional banner assets are not homepage art. Keep them separate from reusable category/city imagery.

- `public/images/businesses/` contains business/listing image assets.
- `public/images/businesses/legacy-promotional-banners/` contains legacy banner creatives that may still be referenced by database records or audits.

Do not delete tracked image assets as part of a page redesign unless the database references and runtime source have both been audited.
