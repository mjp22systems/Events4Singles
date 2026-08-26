"use client";
import { useRouter } from "next/navigation";
import { toUrlSlug } from "@/lib/constants";
import type { Category } from "@/lib/types";

interface Props {
  subcategories: Category[];
  parentUrlSlug: string;
  currentSubcategorySlug: string;
  cityUrlSlug?: string;
}

export default function SubcategoryNavSelect({
  subcategories,
  parentUrlSlug,
  currentSubcategorySlug,
  cityUrlSlug,
}: Props) {
  const router = useRouter();

  return (
    <select
      value={currentSubcategorySlug}
      onChange={(e) => {
        const nextSlug = toUrlSlug(e.target.value);
        router.push(cityUrlSlug ? `/${parentUrlSlug}/${nextSlug}/${cityUrlSlug}` : `/${parentUrlSlug}/${nextSlug}`);
      }}
      aria-label="Choose category"
    >
      {subcategories.map((subcategory) => (
        <option key={subcategory.slug} value={subcategory.slug}>
          {subcategory.label} ({subcategory.listing_count})
        </option>
      ))}
    </select>
  );
}
