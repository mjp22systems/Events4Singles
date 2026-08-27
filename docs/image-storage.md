# Image Storage

Website-owned static artwork lives under `public/images` in purpose-based folders:

- `categories/cards/` contains optimized category card artwork.
- `categories/heroes/` contains optimized category hero artwork generated from the card artwork.
- `cities/cards/` contains optimized city card artwork.
- `cities/heroes/` contains optimized city hero artwork generated from city source photos.
- `cities/source/` contains optimized wide city source photos used by the hero generator.
- `site/home/category-cards/`, `site/home/city-cards/`, and `site/home/intent-cards/` contain homepage-specific artwork.
- `businesses/` contains curated static business/demo artwork.

The older folders `optimized/`, `categories/optimized/`, `categories/hero/`, `cities/optimized/`, and `cities/hero/` remain deployed as compatibility paths. Do not delete them until database-stored URLs, smoke data, and any third-party cached URLs have been audited.

Admin and portal uploads are separate. They are optimized on upload and stored as media assets served from `/media/<id>`, so uploaded category, event, banner, profile, and listing images should not be copied into the curated static folders unless they become website-owned artwork.
