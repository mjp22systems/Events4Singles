-- Follow-up for production databases that already ran the first 0057 draft.

UPDATE businesses
SET name = 'Sacred Self',
    updated_at = datetime('now')
WHERE id = (SELECT business_id FROM listings WHERE id = 777);
