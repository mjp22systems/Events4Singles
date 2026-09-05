export const LISTING_TYPE_CONFIG = {
  event_organizer: { label: "Activities & Events", cls: "e4s-type-badge--eo", icon: "⚡" },
  venue: { label: "Venue", cls: "e4s-type-badge--venue", icon: "🏛" },
  service: { label: "Service", cls: "e4s-type-badge--svc", icon: "🛠" },
  practitioner: { label: "Practitioner", cls: "e4s-type-badge--prac", icon: "👤" },
  online: { label: "Online Service", cls: "e4s-type-badge--online", icon: "🌐" },
  featured: { label: "Featured", cls: "e4s-type-badge--featured", icon: "★" },
  premium: { label: "Premium", cls: "e4s-type-badge--premium", icon: "◆" },
  standard: { label: "Standard Listing", cls: "e4s-type-badge--std", icon: "" },
} as const;

export type ListingType = keyof typeof LISTING_TYPE_CONFIG;

export const LISTING_TYPE_OPTIONS: { value: ListingType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "event_organizer", label: "Event Organizer" },
  { value: "venue", label: "Venue" },
  { value: "service", label: "Service" },
  { value: "practitioner", label: "Practitioner" },
  { value: "online", label: "Online" },
  { value: "featured", label: "Featured" },
  { value: "premium", label: "Premium" },
];

export const VALID_LISTING_TYPES = new Set<string>(LISTING_TYPE_OPTIONS.map((type) => type.value));

export function normalizeListingType(value: string | null | undefined): ListingType {
  if (value === "event_org") return "event_organizer";
  return VALID_LISTING_TYPES.has(value ?? "") ? value as ListingType : "standard";
}

function splitSlugs(value: string | null | undefined) {
  return (value || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}

const onlineCategorySlugs = new Set([
  "online_dating",
]);

const venueCategorySlugs = new Set([
  "function_centres",
  "nightclubs",
  "restaurants_cafes",
  "wineries4singles",
]);

const activityCategorySlugs = new Set([
  "events",
  "speed_dating",
  "singles_mixers",
  "dinner_parties",
  "christian_singles",
  "lgbtqia_singles_events",
  "mature_dating_events",
  "social_clubs",
  "dance_bachata",
  "dance_ballroom_style",
  "dance_ceroc",
  "dance_classes",
  "dance_fitness_and_health",
  "dance_latin_style",
  "dance_modern_style",
  "dance_party_clubs",
  "dance_salsa",
  "dance_swing",
  "dance_tango",
  "dance_teachers",
  "adventure_for_singles",
  "cruises4singles",
  "solo_travel",
  "social_walks",
  "retreats_for_singles",
  "seminars",
  "fitness4singles",
  "yoga_classes",
  "jazz",
  "houseparties",
  "comedians",
]);

const serviceCategorySlugs = new Set([
  "beauty_for_singles",
  "finance_mortgage",
  "intro_agencies",
  "life_coaches",
  "dating_coaches",
  "psychology",
  "healing_and_happiness",
  "image_and_photography",
  "dating_profile_photography",
  "psychics4singles",
  "singles_health",
  "singles_products",
]);

export function inferListingDisplayType(input: {
  listing_type?: string | null;
  category_slug?: string | null;
  category_slugs?: string | null;
}): ListingType {
  const storedType = normalizeListingType(input.listing_type);
  if (storedType !== "standard") return storedType;

  const slugs = new Set([
    ...splitSlugs(input.category_slug),
    ...splitSlugs(input.category_slugs),
  ]);

  if ([...slugs].some((slug) => onlineCategorySlugs.has(slug))) return "online";
  if ([...slugs].some((slug) => venueCategorySlugs.has(slug))) return "venue";
  if ([...slugs].some((slug) => activityCategorySlugs.has(slug))) return "event_organizer";
  if ([...slugs].some((slug) => serviceCategorySlugs.has(slug))) return "service";
  return "standard";
}

export function listingDisplayTypeConfig(input: {
  listing_type?: string | null;
  category_slug?: string | null;
  category_slugs?: string | null;
}) {
  return LISTING_TYPE_CONFIG[inferListingDisplayType(input)];
}
