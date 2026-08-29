import { toUrlSlug } from "@/lib/constants";

const CITYLESS_CATEGORY_SLUGS = new Set(["online_dating"]);

export function categorySupportsCityRoutes(categoryDbSlug: string): boolean {
  return !CITYLESS_CATEGORY_SLUGS.has(categoryDbSlug);
}

export function categoryPathWithOptionalCity(categoryDbSlug: string, cityUrlSlug?: string | null): string {
  const categoryPath = `/${toUrlSlug(categoryDbSlug)}`;
  if (!cityUrlSlug || !categorySupportsCityRoutes(categoryDbSlug)) return categoryPath;
  return `${categoryPath}/${cityUrlSlug}`;
}
