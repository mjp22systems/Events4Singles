/**
 * Static placeholder data for Phase 1. These functions will be replaced by
 * Supabase queries in Phase 2 once the DB is provisioned.
 * Schema: supabase/schema.sql
 */
import type { Listing, Event } from "./types";
import type { CityId, CategoryId } from "./constants";

const PLACEHOLDER_LISTINGS: Listing[] = [
  {
    id: "1",
    slug: "sydney-speed-dating-co",
    businessName: "Sydney Speed Dating Co",
    tagline: "Australia's largest speed dating organiser",
    description: "We run premium speed dating events across Sydney every week. Events for all age groups.",
    websiteUrl: "https://example.com",
    phone: "02 9000 0000",
    cityId: "sydney",
    categoryId: "speed-dating",
    tier: "premium",
    isApproved: true,
    isActive: true,
    priorityScore: 100,
    images: [],
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    slug: "dinner-for-singles-sydney",
    businessName: "Dinner for Singles Sydney",
    tagline: "Elegant dining events for single professionals",
    description: "Hosted dinner parties in beautiful Sydney restaurants. Meet 8–12 singles over a 3-course meal.",
    websiteUrl: "https://example.com",
    phone: "02 9111 1111",
    cityId: "sydney",
    categoryId: "dinner-parties",
    tier: "professional",
    isApproved: true,
    isActive: true,
    priorityScore: 80,
    images: [],
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    slug: "melbourne-singles-social",
    businessName: "Melbourne Singles Social",
    tagline: "Melbourne's friendliest singles club",
    description: "Regular social events for Melbourne singles — drinks, trivia, cooking classes and more.",
    websiteUrl: "https://example.com",
    cityId: "melbourne",
    categoryId: "social-clubs",
    tier: "starter",
    isApproved: true,
    isActive: true,
    priorityScore: 60,
    images: [],
    createdAt: "2024-01-03",
  },
  {
    id: "4",
    slug: "brisbane-speed-dating",
    businessName: "Brisbane Speed Dating",
    tagline: "Fun and fast events every fortnight",
    cityId: "brisbane",
    categoryId: "speed-dating",
    tier: "starter",
    isApproved: true,
    isActive: true,
    priorityScore: 60,
    images: [],
    createdAt: "2024-01-04",
  },
  {
    id: "5",
    slug: "perth-singles-dance",
    businessName: "Perth Singles Dance Nights",
    tagline: "Salsa, swing and social dancing for singles",
    cityId: "perth",
    categoryId: "dance-classes",
    tier: "free",
    isApproved: true,
    isActive: true,
    priorityScore: 0,
    images: [],
    createdAt: "2024-01-05",
  },
];

const PLACEHOLDER_EVENTS: Event[] = [
  {
    id: "e1",
    listingId: "1",
    listingName: "Sydney Speed Dating Co",
    title: "Speed Dating — Sydney CBD (25–35)",
    description: "Meet up to 15 compatible singles in one fun evening.",
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    location: "The Ivy, Sydney CBD",
    cityId: "sydney",
    categoryId: "speed-dating",
    price: 45,
    priceNotes: "Includes welcome drink",
    bookingUrl: "https://example.com/book",
    isApproved: true,
  },
  {
    id: "e2",
    listingId: "2",
    listingName: "Dinner for Singles Sydney",
    title: "Singles Dinner — Surry Hills",
    eventDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    location: "Messina's Restaurant, Surry Hills",
    cityId: "sydney",
    categoryId: "dinner-parties",
    price: 85,
    priceNotes: "3-course dinner included",
    isApproved: true,
  },
];

export function getListings(filters?: { cityId?: CityId; categoryId?: CategoryId }): Listing[] {
  let results = PLACEHOLDER_LISTINGS.filter((l) => l.isApproved && l.isActive);
  if (filters?.cityId) results = results.filter((l) => l.cityId === filters.cityId);
  if (filters?.categoryId) results = results.filter((l) => l.categoryId === filters.categoryId);

  // Sort: premium first, then professional, starter, free — then by priorityScore desc
  const tierOrder: Record<string, number> = { premium: 0, professional: 1, starter: 2, free: 3 };
  return results.sort((a, b) => {
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
    return tierDiff !== 0 ? tierDiff : b.priorityScore - a.priorityScore;
  });
}

export function getListingBySlug(slug: string): Listing | undefined {
  return PLACEHOLDER_LISTINGS.find((l) => l.slug === slug && l.isApproved && l.isActive);
}

export function getEvents(filters?: { cityId?: CityId; categoryId?: CategoryId }): Event[] {
  let results = PLACEHOLDER_EVENTS.filter((e) => e.isApproved && new Date(e.eventDate) > new Date());
  if (filters?.cityId) results = results.filter((e) => e.cityId === filters.cityId);
  if (filters?.categoryId) results = results.filter((e) => e.categoryId === filters.categoryId);
  return results.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
}
