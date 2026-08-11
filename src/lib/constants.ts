// Slug helpers
export const toUrlSlug = (dbSlug: string) => dbSlug.replace(/_/g, "-");
export const toDbSlug = (urlSlug: string) => urlSlug.replace(/-/g, "_");
export const slugToLabel = (slug: string) =>
  slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Static tier config (Phase 2: move to DB)
export const TIERS = {
  starter:      { name: "Starter",      price: 39 },
  professional: { name: "Professional", price: 99 },
  premium:      { name: "Premium",      price: 249 },
} as const;

export type Tier = keyof typeof TIERS;
