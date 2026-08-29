export const LISTING_TYPE_CONFIG = {
  event_organizer: { label: "Activities & Events", cls: "e4s-type-badge--eo", icon: "⚡" },
  venue: { label: "Venue", cls: "e4s-type-badge--venue", icon: "🏛" },
  service: { label: "Service", cls: "e4s-type-badge--svc", icon: "🛠" },
  practitioner: { label: "Practitioner", cls: "e4s-type-badge--prac", icon: "👤" },
  online: { label: "Online Service", cls: "e4s-type-badge--online", icon: "🌐" },
  featured: { label: "Featured", cls: "e4s-type-badge--featured", icon: "★" },
  premium: { label: "Premium", cls: "e4s-type-badge--premium", icon: "◆" },
  standard: { label: "Listed", cls: "e4s-type-badge--std", icon: "" },
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
