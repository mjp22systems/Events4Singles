UPDATE events
SET slug = '2026-09-06-speed-dating-sydney-30s-and-40s-p1',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p1';

UPDATE events
SET slug = '2026-09-13-singles-dinner-party-melbourne-p2',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p2';

UPDATE events
SET slug = '2026-09-20-salsa-social-singles-night-brisbane-p3',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p3';

UPDATE events
SET slug = '2026-09-27-speed-dating-perth-20s-and-30s-p4',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p4';

UPDATE events
SET slug = '2026-10-04-mixer-night-adelaide-p5',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p5';

UPDATE events
SET slug = '2026-10-11-premium-dinner-party-sydney-p6',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p6';

UPDATE events
SET slug = '2026-10-18-speed-dating-melbourne-cbd-p7',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p7';

UPDATE events
SET slug = '2026-10-25-dance-and-social-night-gold-coast-p8',
    account_id = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    submitted_by = (
      SELECT id FROM advertiser_accounts
      WHERE portal_email = 'e4s@events4singles.com'
         OR billing_email = 'e4s@events4singles.com'
      LIMIT 1
    ),
    updated_at = datetime('now')
WHERE id = 'seed_home_p8';
