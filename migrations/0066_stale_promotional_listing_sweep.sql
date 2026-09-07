-- Stale promotional listing sweep.
--
-- This pass removes old festival/event adverts, generic product ads, and
-- affiliate/resource pages from the public launch set. It also restores current
-- URLs for a small number of phone-only listings where external evidence was
-- strong enough to identify the continuing business.

UPDATE listings
SET title = 'Canberra Modern Jive',
    tagline = COALESCE(NULLIF(tagline, ''), 'Formerly Ceroc Canberra'),
    description = 'Canberra Modern Jive is an inclusive, social dance community teaching and promoting the modern jive style formerly listed as Ceroc Canberra.',
    email = COALESCE(NULLIF(email, ''), 'info@canberradance.com.au'),
    web = 'https://canberradance.com.au/',
    updated_at = datetime('now')
WHERE id = 78
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET name = 'Canberra Modern Jive',
    email = COALESCE(NULLIF(email, ''), 'info@canberradance.com.au'),
    website = 'https://canberradance.com.au/',
    updated_at = datetime('now')
WHERE id = 78
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET web = 'https://www.ashtangamelbourne.com.au/',
    email = COALESCE(NULLIF(email, ''), 'info@ashtangamelbourne.com.au'),
    updated_at = datetime('now')
WHERE id = 557
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET website = 'https://www.ashtangamelbourne.com.au/',
    email = COALESCE(NULLIF(email, ''), 'info@ashtangamelbourne.com.au'),
    updated_at = datetime('now')
WHERE id = 557
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET web = 'https://www.funff.com.au/',
    updated_at = datetime('now')
WHERE id = 592
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET website = 'https://www.funff.com.au/',
    updated_at = datetime('now')
WHERE id = 592
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET email = COALESCE(NULLIF(email, ''), 'admin@networksocialclub.org.au'),
    web = 'https://networksocialclub.org.au/',
    updated_at = datetime('now')
WHERE id = 616
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET email = COALESCE(NULLIF(email, ''), 'admin@networksocialclub.org.au'),
    website = 'https://networksocialclub.org.au/',
    updated_at = datetime('now')
WHERE id = 616
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET title = 'Cityroc Dance',
    location_city = COALESCE(NULLIF(location_city, ''), 'Newcastle'),
    location_state = COALESCE(NULLIF(location_state, ''), 'NSW'),
    email = COALESCE(NULLIF(email, ''), 'les@dataglobal.com.au'),
    updated_at = datetime('now')
WHERE id = 571
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET name = 'Cityroc Dance',
    email = COALESCE(NULLIF(email, ''), 'les@dataglobal.com.au'),
    updated_at = datetime('now')
WHERE id = 572
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET web = 'https://www.spark-dating.com.au/',
    updated_at = datetime('now')
WHERE id = 648
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET website = 'https://www.spark-dating.com.au/',
    updated_at = datetime('now')
WHERE id = 648
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET title = 'Tropical Soul Dance Studio',
    web = 'https://tsdance.com.au/',
    updated_at = datetime('now')
WHERE id = 661
  AND COALESCE(status, 'active') = 'active';

UPDATE businesses
SET name = 'Tropical Soul Dance Studio',
    website = 'https://tsdance.com.au/',
    updated_at = datetime('now')
WHERE id = 661
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET status = 'archived',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(deleted_reason, 'Archived from launch: stale legacy festival, old dated event advert, or phone-only event promotion rather than a current business listing.'),
    ai_moderation_status = 'launch_stale_promo',
    ai_moderation_reason = COALESCE(ai_moderation_reason, 'Removed from public launch sweep because the listing reads as a dated event/festival/promotion rather than a durable business profile.'),
    updated_at = datetime('now')
WHERE id IN (
  134, 142, 197, 282, 304, 306, 395, 469, 495, 665,
  668, 766, 772, 551, 606, 614, 625, 646, 666, 669,
  673, 774, 778
)
  AND COALESCE(status, 'active') = 'active';

UPDATE listings
SET status = 'deleted',
    deleted_at = COALESCE(deleted_at, strftime('%s', 'now')),
    deleted_reason = COALESCE(deleted_reason, 'Deleted from launch: generic product, affiliate directory, or resource page outside the current Events4Singles business listing structure.'),
    ai_moderation_status = 'launch_irrelevant',
    ai_moderation_reason = COALESCE(ai_moderation_reason, 'Removed from public launch set because it does not represent a relevant singles event, dating, social, travel, dance, or support business listing.'),
    updated_at = datetime('now')
WHERE id IN (47, 128, 253, 254, 262, 275, 277, 390, 408, 424, 560)
  AND COALESCE(status, 'active') = 'active';

UPDATE listing_placements
SET is_active = 0,
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE listing_id IN (
  47, 48, 56, 127, 128, 134, 142, 197, 253, 254,
  262, 275, 277, 282, 304, 306, 307, 390, 395, 408, 424, 469,
  495, 559, 560, 665, 668, 675, 766, 772, 551, 606,
  614, 625, 646, 666, 669, 673, 774, 778
);

UPDATE businesses
SET status = 'archived',
    updated_at = datetime('now')
WHERE id IN (
  134, 142, 197, 282, 304, 306, 395, 469, 495, 665,
  668, 767, 773, 551, 606, 614, 625, 646, 666, 669,
  673, 774, 778
)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.id NOT IN (
        134, 142, 197, 282, 304, 306, 395, 469, 495, 665,
        668, 766, 772, 551, 606, 614, 625, 646, 666, 669,
        673, 774, 778
      )
  );

UPDATE businesses
SET status = 'deleted',
    updated_at = datetime('now')
WHERE id IN (47, 128, 253, 254, 262, 275, 277, 390, 408, 424, 560)
  AND COALESCE(status, 'active') = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM listings l
    WHERE l.business_id = businesses.id
      AND l.status = 'active'
      AND l.id NOT IN (47, 128, 253, 254, 262, 275, 277, 390, 408, 424, 560)
  );

UPDATE banners
SET is_active = 0,
    status = CASE
      WHEN business_id IN (47, 128, 253, 254, 262, 275, 277, 390, 408, 424, 560) THEN 'deleted'
      ELSE 'archived'
    END,
    expires_at = COALESCE(expires_at, datetime('now'))
WHERE business_id IN (
  47, 48, 56, 127, 128, 134, 142, 197, 253, 254,
  262, 275, 277, 282, 304, 306, 307, 390, 395, 408, 424, 469,
  495, 559, 560, 665, 668, 675, 767, 773, 551, 606,
  614, 625, 646, 666, 669, 673, 774, 778
)
  AND COALESCE(is_active, 1) = 1;
