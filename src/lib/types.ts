export interface Listing {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  promo: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  web: string | null;
  image_url: string | null;
  location: string | null;
  location_city: string | null;
  location_state: string | null;
  listing_type: string | null;
  confidence_score: number;
  business_name: string | null;
  business_website: string | null;
}

export interface Category {
  slug: string;
  label: string;
  parent_slug: string | null;
  description: string | null;
  seo_intro: string | null;
  listing_count: number;
}

export interface City {
  slug: string;
  label: string;
  state: string | null;
  listing_count: number;
}

export interface Banner {
  id: number;
  image_url: string;
  click_url: string;
  alt_text: string;
}

export interface PlacementCombo {
  category_slug: string;
  city_slug: string | null;
}
