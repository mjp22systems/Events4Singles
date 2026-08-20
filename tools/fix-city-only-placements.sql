-- Add category placements for 49 city-only listings
-- These listings appear on city pages but were missing from all category pages.
-- Uses INSERT OR IGNORE to safely skip any that already exist.

INSERT OR IGNORE INTO listing_placements (listing_id, category_slug, city_slug) VALUES
-- Speed Dating
(93, 'speed_dating', 'adelaide'),
(392, 'speed_dating', 'melbourne'),
(366, 'speed_dating', 'melbourne'),

-- Social Clubs
(92, 'social_clubs', 'melbourne'),
(92, 'social_clubs', 'canberra'),
(92, 'social_clubs', 'perth'),
(103, 'social_clubs', 'melbourne'),
(467, 'social_clubs', 'melbourne'),
(321, 'social_clubs', 'cairns'),
(185, 'social_clubs', 'sunshine_coast'),
(306, 'social_clubs', 'canberra'),
(306, 'social_clubs', 'central_coast'),
(306, 'social_clubs', 'geelong'),
(306, 'social_clubs', 'gold_coast'),
(306, 'social_clubs', 'melbourne'),
(306, 'social_clubs', 'newcastle'),
(306, 'social_clubs', 'perth'),
(306, 'social_clubs', 'sydney'),
(306, 'social_clubs', 'wollongong'),
(316, 'social_clubs', 'melbourne'),
(160, 'social_clubs', 'adelaide'),
(589, 'social_clubs', 'newcastle'),
(570, 'social_clubs', 'brisbane'),
(570, 'social_clubs', 'sunshine_coast'),
(115, 'social_clubs', 'brisbane'),
(412, 'social_clubs', 'perth'),
(243, 'social_clubs', 'melbourne'),
(243, 'social_clubs', 'sydney'),
(217, 'social_clubs', 'brisbane'),
(286, 'social_clubs', 'brisbane'),
(2, 'social_clubs', 'melbourne'),

-- Dinner Parties
(128, 'dinner_parties', 'melbourne'),
(128, 'dinner_parties', 'sydney'),
(505, 'dinner_parties', 'sydney'),
(359, 'dinner_parties', 'melbourne'),
(624, 'dinner_parties', 'adelaide'),
(401, 'dinner_parties', 'adelaide'),

-- Introduction Agencies
(442, 'intro_agencies', 'central_coast'),
(261, 'intro_agencies', 'melbourne'),
(261, 'intro_agencies', 'perth'),
(285, 'intro_agencies', 'perth'),
(249, 'intro_agencies', 'melbourne'),
(489, 'intro_agencies', 'canberra'),
(167, 'intro_agencies', 'adelaide'),
(318, 'intro_agencies', 'hobart'),
(44, 'intro_agencies', 'geelong'),

-- Online Dating (online listings, category-only — no city)
(405, 'online_dating', NULL),
(260, 'online_dating', NULL),
(309, 'online_dating', NULL),

-- Life Coaches
(261, 'life_coaches', 'melbourne'),
(261, 'life_coaches', 'perth'),
(129, 'life_coaches', 'darwin'),
(274, 'life_coaches', 'melbourne'),

-- Dance Classes
(529, 'dance_classes', 'cairns'),
(411, 'dance_classes', 'newcastle'),
(5, 'dance_classes', 'canberra'),

-- Dance Party Clubs
(477, 'dance_party_clubs', 'sydney'),

-- Adventure for Singles
(482, 'adventure_for_singles', 'cairns'),
(63, 'adventure_for_singles', 'adelaide'),
(511, 'adventure_for_singles', 'adelaide'),

-- Sport & Adventure
(313, 'sport_adventure', 'melbourne'),
(313, 'sport_adventure', 'sydney'),

-- Nightclubs
(477, 'nightclubs', 'sydney'),
(194, 'nightclubs', 'adelaide'),
(367, 'nightclubs', 'melbourne'),

-- Restaurants & Cafes
(161, 'restaurants_cafes', 'cairns'),

-- Seminars
(150, 'seminars', 'sydney'),

-- Function Centres
(384, 'function_centres', 'melbourne'),

-- Tours for Singles
(482, 'tours4singles', 'cairns'),

-- My Friends (social + also good for dinner parties)
(570, 'dinner_parties', 'brisbane'),
(570, 'dinner_parties', 'sunshine_coast');
