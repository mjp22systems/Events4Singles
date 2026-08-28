export interface Listing {
  // Real columns on listings table
  id: number;
  slug?: string | null;
  business_id: number | null;
  advertiser_id: number | null;
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
  source_file: string | null;
  unclaimed_flag: number | null;
  hide_contact: number | null;
  abn: string | null;
  licence_no: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  trading_hours: string | null;
  contact_hours: string | null;
  ai_moderation_status: string | null;
  ai_moderation_reason: string | null;
  // JOIN-derived (read-only — from businesses, categories, cities via query)
  business_name: string | null;
  business_website: string | null;
  business_advertiser_id: number | null;
  category_slug: string | null;
  city_slug: string | null;
  category_label: string | null;
  city_label: string | null;
  category_slugs?: string | null;
  city_slugs?: string | null;
  city_labels?: string | null;
}

export interface Category {
  slug: string;
  label: string;
  parent_slug: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_intro: string | null;
  hero_image_url: string | null;
  listing_count: number;
}

export interface City {
  slug: string;
  label: string;
  state: string | null;
  seo_title: string | null;
  seo_description: string | null;
  listing_count: number;
}

export interface Banner {
  id: number;
  image_url: string;
  click_url: string;
  alt_text: string;
  placement?: string | null;
  business_id?: number | null;
  business_name?: string | null;
  business_profile_slug?: string | null;
}

export interface Business {
  id: number;
  name: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  contact_name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  advertiser_id: number | null;
  profile_slug: string | null;
}

export interface PlacementCombo {
  category_slug: string;
  city_slug: string | null;
}
