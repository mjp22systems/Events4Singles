-- Businesses with multiple listings
SELECT b.name, COUNT(l.id) as listing_count, GROUP_CONCAT(l.id) as listing_ids
FROM businesses b
JOIN listings l ON l.business_id = b.id
GROUP BY b.id
HAVING COUNT(l.id) > 1
ORDER BY listing_count DESC
LIMIT 30;
