# Admin Health Checks

The future admin console should include automated content health checks before listings or banners are published.

## Image Checks

- Check every listing image, alternate listing image and advertising banner image.
- Flag local image paths that do not exist under `public/`.
- Flag zero-byte local files as broken.
- Flag remote image URLs that fail, redirect unexpectedly, timeout or return non-image content.
- Prefer a verified local replacement when a legacy remote/banner asset has already been archived locally.

## Link Checks

- Check listing website links, banner click URLs, email links and phone links.
- Flag empty, malformed, dead or insecure legacy URLs.
- Keep the check non-destructive: report issues first, then let an admin approve replacements.

## Import Checks

- After each legacy scrape or staging DB rebuild, produce a report for:
  - missing images
  - zero-byte images
  - remote images still in use
  - blank promo/tagline fields where an older source had content
  - banners mapped to broad parent pages rather than exact city/category pages
