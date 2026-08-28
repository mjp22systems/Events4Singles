# Image Storage

Website-owned static artwork lives under `public/images` in purpose-based folders:

- `categories/cards/` contains optimized category card artwork.
- `categories/heroes/` contains optimized category hero artwork generated from the card artwork.
- `cities/cards/` contains optimized city card artwork.
- `cities/heroes/` contains optimized city hero artwork generated from non-public city source photos.
- `site/home/category-cards/`, `site/home/city-cards/`, and `site/home/intent-cards/` contain homepage-specific artwork.
- `businesses/` contains client/business-owned tile artwork, including listing cards, profile surfaces, and paid promotional tiles.

Source artwork used by generators lives outside `public`, under `assets/images`. These files are inputs, not runtime web assets.

Admin and portal uploads should produce optimized derivatives before they are rendered publicly. Business uploads should resolve to one business-owned tile asset rather than duplicated logo/tile folders; the same tile can be used by listing cards, profile surfaces, and promotional placements.
