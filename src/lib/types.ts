export interface Listing {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  promo: string | null;
  contact_name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  web: string | null;
  image_url: string | null;
  location: string | null;
  location_city: string | null;
  location_state: string | null;
  listing_type: string | null;
  status: string | null;
  confidence_score: number;
  business_id: number | null;
  business_advertiser_id: number | null;
  business_name: string | null;
  business_website: string | null;
  category_slug: string | null;
  city_slug: string | null;
  category_label: string | null;
  city_label: string | null;
  category_slugs?: string | null;
  city_slugs?: string | null;
  city_labels?: string | null;
  licence_no: string | null;
  abn: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  trading_hours: string | null;
  contact_hours: string | null;
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

export interface Business {
  id: number;
  name: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  advertiser_id: number | null;
  profile_slug: string | null;
}

export interface PlacementCombo {
  category_slug: string;
  city_slug: string | null;
}
