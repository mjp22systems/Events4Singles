# Image Storage

Website-owned static artwork lives under `public/images` in purpose-based folders:

- `categories/cards/` contains optimized category card artwork.
- `categories/heroes/` contains optimized category hero artwork generated from separate wide category source images.
- `cities/cards/` contains optimized city card artwork.
- `cities/heroes/` contains optimized city hero artwork generated from non-public city source photos.
- `site/home/intent-cards/` contains homepage-specific pathway artwork.
- `businesses/` contains client/business-owned tile artwork, including listing cards, profile surfaces, and paid promotional tiles.

Source artwork used by generators lives outside `public`, under `assets/images`. These files are inputs, not runtime web assets.

Category card artwork is not a hero-image source. Category heroes must use wide source photos from `assets/images/categories/source/` so the portrait card art is never stretched, cropped into a thin banner, or mutated by hero generation.

Homepage city/category tiles reuse the canonical `cities/cards/` and `categories/cards/` assets. Do not add duplicate homepage card folders for the same subject matter; create a new `site/home/...` folder only when the artwork is genuinely homepage-only.

Admin and portal uploads should produce optimized derivatives before they are rendered publicly. Business uploads should resolve to one business-owned tile asset rather than duplicated logo/tile folders; the same tile can be used by listing cards, profile surfaces, and promotional placements.
