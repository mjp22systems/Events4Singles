import type { Category } from "./types";

type CanonicalCategory = Omit<Category, "listing_count"> & {
  sort_order: number;
  aliases?: string[];
};

export const CANONICAL_CATEGORY_REPAIRS: CanonicalCategory[] = [
  {
    slug: "singles_mixers",
    label: "Singles Mixers",
    parent_slug: null,
    sort_order: 18,
    description: "Relaxed hosted socials where singles can meet new people without a heavily structured dating format.",
    seo_intro: "Singles mixers are a simple way to meet new people in a hosted social setting where conversation is expected and the pressure stays low.",
    seo_title: "Singles Mixers Australia | Events4Singles",
    seo_description: "Find singles mixers and relaxed social events for Australian singles.",
    hero_image_url: "/images/categories/heroes/singles-mixers.webp",
  },
  {
    slug: "online_dating",
    label: "Online Dating",
    parent_slug: null,
    sort_order: 22,
    description: "Digital dating services and online options for singles who want to widen their search.",
    seo_intro: "Online dating listings give singles a way to compare digital dating services, profile-based platforms and online options that can support a broader search.",
    seo_title: "Online Dating Australia | Events4Singles",
    seo_description: "Compare online dating services and digital dating options for Australian singles.",
    hero_image_url: "/images/categories/heroes/online-dating.webp",
  },
  {
    slug: "christian_singles",
    label: "Christian Singles",
    parent_slug: null,
    sort_order: 24,
    description: "Faith-aligned events, groups and services for Christian singles.",
    seo_intro: "Christian singles listings bring together social events, dating services and community-minded ways to meet people who share similar values.",
    seo_title: "Christian Singles Australia | Events4Singles",
    seo_description: "Explore Christian singles events, groups and dating services in Australia.",
    hero_image_url: "/images/categories/heroes/christian-singles.webp",
  },
  {
    slug: "lgbtqia_singles_events",
    label: "LGBTQIA+ Singles Events",
    parent_slug: null,
    sort_order: 26,
    description: "Inclusive singles events and social spaces for LGBTQIA+ communities.",
    seo_intro: "LGBTQIA+ singles events make it easier to find inclusive social nights, mixers and community spaces where singles can connect comfortably.",
    seo_title: "LGBTQIA+ Singles Events Australia | Events4Singles",
    seo_description: "Find inclusive LGBTQIA+ singles events and social spaces around Australia.",
    hero_image_url: "/images/categories/heroes/lgbtqia-singles-events.webp",
  },
  {
    slug: "solo_travel",
    label: "Solo Travel",
    parent_slug: null,
    sort_order: 44,
    description: "Travel experiences built for independent singles and solo guests.",
    seo_intro: "Solo travel listings help independent singles find trips, tours and getaways designed to be comfortable for people travelling on their own.",
    seo_title: "Solo Travel for Singles Australia | Events4Singles",
    seo_description: "Find solo travel, tours and getaway options for Australian singles.",
    hero_image_url: "/images/categories/heroes/solo-travel.webp",
    aliases: ["travel_for_singles"],
  },
  {
    slug: "social_walks",
    label: "Social Walks",
    parent_slug: null,
    sort_order: 42,
    description: "Low-pressure walks and outdoor catch-ups with easy conversation.",
    seo_intro: "Social walks give singles a relaxed way to meet people while getting outside and doing something simple together.",
    seo_title: "Social Walks for Singles Australia | Events4Singles",
    seo_description: "Find social walks, walking groups and low-pressure outdoor events for singles.",
    hero_image_url: "/images/categories/heroes/social-walks.webp",
    aliases: ["walks4singles"],
  },
  {
    slug: "dating_coaches",
    label: "Dating Coaches",
    parent_slug: null,
    sort_order: 58,
    description: "Dating-specific support for confidence, profiles and relationship readiness.",
    seo_intro: "Dating coaches can help singles improve confidence, communication, profile strategy and the way they approach modern dating.",
    seo_title: "Dating Coaches Australia | Events4Singles",
    seo_description: "Find dating coaches and dating confidence support for Australian singles.",
    hero_image_url: "/images/categories/heroes/dating-coaches.webp",
  },
  {
    slug: "dating_profile_photography",
    label: "Dating Profile Photography",
    parent_slug: null,
    sort_order: 74,
    description: "Profile-focused portraits that help singles show up naturally online.",
    seo_intro: "Dating profile photography is for singles who want current, natural portraits for dating apps, profiles and first impressions.",
    seo_title: "Dating Profile Photography Australia | Events4Singles",
    seo_description: "Find dating profile photography and portrait services for Australian singles.",
    hero_image_url: "/images/categories/heroes/dating-profile-photography.webp",
  },
];

export const CANONICAL_CATEGORY_BY_SLUG = new Map(
  CANONICAL_CATEGORY_REPAIRS.map((category) => [category.slug, category]),
);

export const EVENT_CATEGORY_OPTIONS = [
  "speed_dating",
  "singles_mixers",
  "dinner_parties",
  "dinner_for_six",
  "intro_agencies",
  "online_dating",
  "christian_singles",
  "lgbtqia_singles_events",
  "mature_dating_events",
  "social_clubs",
  "dance_classes",
  "dance_party_clubs",
  "nightclubs",
  "adventure_for_singles",
  "sport_adventure",
  "cruises4singles",
  "social_walks",
  "solo_travel",
  "life_coaches",
  "dating_coaches",
  "psychology",
  "healing_and_happiness",
  "retreats_for_singles",
  "seminars",
  "fitness4singles",
  "yoga_classes",
  "image_and_photography",
  "dating_profile_photography",
  "singles_health",
] as const;

export function canonicalCategoryToCategory(category: CanonicalCategory, listingCount = 0): Category {
  return {
    slug: category.slug,
    label: category.label,
    parent_slug: category.parent_slug,
    description: category.description,
    seo_title: category.seo_title,
    seo_description: category.seo_description,
    seo_intro: category.seo_intro,
    hero_image_url: category.hero_image_url,
    listing_count: listingCount,
  };
}

export function categoryScopeAliases(categorySlug: string): string[] {
  const category = CANONICAL_CATEGORY_BY_SLUG.get(categorySlug);
  return category?.aliases ?? [];
}
