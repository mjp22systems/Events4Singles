// Slug helpers
export const toUrlSlug = (dbSlug: string) => dbSlug.replace(/_/g, "-");
export const toDbSlug = (urlSlug: string) => urlSlug.replace(/-/g, "_");
export const slugToLabel = (slug: string) =>
  slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Listing URL slug: {name-slug}-{id}
// ID is always the last segment — lookup extracts it regardless of name quality
export function toListingSlug(id: number, name: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${nameSlug}-${id}`;
}

export function idFromListingSlug(slug: string): number | null {
  const last = slug.split("-").pop();
  const id = parseInt(last ?? "", 10);
  return isNaN(id) ? null : id;
}

// Profile URL slug: {name-slug}-{id}  (same pattern as listing slug)
// Paid upgrade sets businesses.profile_slug for a clean slug without the ID suffix.
export function toProfileSlug(id: number, name: string): string {
  const nameSlug = (name || "profile")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${nameSlug}-${id}`;
}

export function idFromProfileSlug(slug: string): number | null {
  const last = slug.split("-").pop();
  const id = parseInt(last ?? "", 10);
  return isNaN(id) ? null : id;
}

// Static tier config (Phase 2: move to DB)
export const TIERS = {
  starter:      { name: "Starter",      price: 39 },
  professional: { name: "Professional", price: 99 },
  premium:      { name: "Premium",      price: 249 },
} as const;

export type Tier = keyof typeof TIERS;
