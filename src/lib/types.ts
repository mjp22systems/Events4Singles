import type { CityId, CategoryId, Tier } from "./constants";

export interface Listing {
  id: string;
  slug: string;
  businessName: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  phone?: string;
  email?: string;
  cityId: CityId;
  categoryId: CategoryId;
  tier: Tier;
  isApproved: boolean;
  isActive: boolean;
  priorityScore: number;
  images: string[];
  createdAt: string;
}

export interface Event {
  id: string;
  listingId: string;
  listingName: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  address?: string;
  cityId: CityId;
  categoryId: CategoryId;
  price?: number;
  priceNotes?: string;
  bookingUrl?: string;
  isApproved: boolean;
}

export interface City {
  id: CityId;
  name: string;
  state: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}
