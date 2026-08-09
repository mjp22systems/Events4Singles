-- Events4Singles database schema
-- Apply via Supabase dashboard: SQL Editor → run this file

-- Cities (static reference data)
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  display_order INT DEFAULT 0
);

INSERT INTO cities (id, name, state, display_order) VALUES
  ('sydney', 'Sydney', 'NSW', 1),
  ('melbourne', 'Melbourne', 'VIC', 2),
  ('brisbane', 'Brisbane', 'QLD', 3),
  ('perth', 'Perth', 'WA', 4),
  ('adelaide', 'Adelaide', 'SA', 5),
  ('gold-coast', 'Gold Coast', 'QLD', 6),
  ('canberra', 'Canberra', 'ACT', 7);

-- Categories (static reference data)
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

INSERT INTO categories (id, name, description, display_order) VALUES
  ('speed-dating', 'Speed Dating', 'Fast-paced events to meet multiple singles in one evening', 1),
  ('dinner-parties', 'Dinner Parties', 'Relaxed dinner settings for singles to connect over food', 2),
  ('dance-classes', 'Dance Classes', 'Social dance lessons and evenings for singles', 3),
  ('social-clubs', 'Social Clubs', 'Ongoing groups and clubs for singles to meet regularly', 4),
  ('life-coaches', 'Life Coaches', 'Professional coaches specialising in dating and relationships', 5),
  ('adventure', 'Adventure & Outdoors', 'Active outdoor events and adventures for singles', 6);

-- Advertisers (maps to Supabase Auth users)
CREATE TABLE advertisers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'premium')),
  subscription_status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Listings
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES advertisers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  phone TEXT,
  email TEXT,
  city_id TEXT NOT NULL REFERENCES cities(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'premium')),
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  priority_score INT NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for city+category browse queries
CREATE INDEX listings_city_category ON listings (city_id, category_id, tier, priority_score DESC)
  WHERE is_approved = TRUE AND is_active = TRUE;

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  address TEXT,
  city_id TEXT NOT NULL REFERENCES cities(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  price NUMERIC(10, 2),
  price_notes TEXT,
  booking_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX events_upcoming ON events (city_id, event_date)
  WHERE is_approved = TRUE AND event_date > NOW();

-- Listing view analytics (write-only from public, read from advertiser's own rows)
CREATE TABLE listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT
);

-- Row Level Security
ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

-- Advertisers: own row only
CREATE POLICY "advertisers_own" ON advertisers
  FOR ALL USING (auth.uid() = id);

-- Listings: public can read approved active listings; advertisers manage their own
CREATE POLICY "listings_public_read" ON listings
  FOR SELECT USING (is_approved = TRUE AND is_active = TRUE);

CREATE POLICY "listings_advertiser_manage" ON listings
  FOR ALL USING (auth.uid() = advertiser_id);

-- Events: public reads approved future events; advertisers manage their own
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (is_approved = TRUE AND event_date > NOW());

CREATE POLICY "events_advertiser_manage" ON events
  FOR ALL USING (
    auth.uid() = (SELECT advertiser_id FROM listings WHERE id = listing_id)
  );

-- Listing views: anyone can insert; advertiser can read their own listing views
CREATE POLICY "listing_views_insert" ON listing_views
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "listing_views_advertiser_read" ON listing_views
  FOR SELECT USING (
    auth.uid() = (
      SELECT advertiser_id FROM listings WHERE id = listing_id
    )
  );

-- Admin bypass policy (set role = 'admin' in user metadata)
CREATE POLICY "admin_all_advertisers" ON advertisers
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "admin_all_listings" ON listings
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "admin_all_events" ON events
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');
