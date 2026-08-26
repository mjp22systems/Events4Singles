import type { MetadataRoute } from "next";
import {
  getAllCategories,
  getAllCities,
  getAllListingParams,
  getAllCategoryCityParams,
  getSubcategoriesForCategory,
} from "@/lib/data";
import { articles } from "@/content/articles";
import { toCategoryChildUrlSegment, toUrlSlug } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/about",
  "/advertise",
  "/businesses",
  "/contact",
  "/dating-resources",
  "/events",
  "/cities",
  "/categories",
  "/find-a-partner",
  "/get-out-there",
  "/invest-in-yourself",
  "/locations",
  "/privacy-policy",
  "/terms-and-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = new Set(STATIC_PATHS);

  for (const city of await getAllCities()) {
    paths.add(`/${toUrlSlug(city.slug)}`);
  }

  for (const category of await getAllCategories()) {
    if (!category.parent_slug) {
      const categoryPath = `/${toUrlSlug(category.slug)}`;
      paths.add(categoryPath);
      for (const child of await getSubcategoriesForCategory(category.slug)) {
        paths.add(`${categoryPath}/${toCategoryChildUrlSegment(category.slug, child.slug)}`);
      }
    }
  }

  for (const combo of await getAllCategoryCityParams()) {
    paths.add(`/${combo.category}/${combo.city}`);
  }

  for (const listing of await getAllListingParams()) {
    paths.add(`/listing/${listing.slug}`);
  }

  for (const article of articles) {
    paths.add(`/dating-resources/${article.slug}`);
  }

  return [...paths].sort().map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
