"use client";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { categoryPathWithOptionalCity } from "@/lib/category-routing";

interface Props {
  categories: Category[];
  cityUrlSlug: string;
  cityLabel: string;
}

export default function CityCategorySelect({ categories, cityUrlSlug, cityLabel }: Props) {
  const router = useRouter();

  return (
    <nav aria-label={`${cityLabel} singles categories`} className="e4s-category-links">
      <h2>Browse {cityLabel} Singles Categories</h2>
      <select
        aria-label={`Choose a ${cityLabel} singles category`}
        className="e4s-category-select"
        defaultValue=""
        onChange={(e) => {
          const val = e.target.value;
          if (val) router.push(val);
        }}
      >
        <option value="">Choose a Category</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={categoryPathWithOptionalCity(cat.slug, cityUrlSlug)}>
            {cat.label}
          </option>
        ))}
      </select>
      <p>Jump to the available category pages for this location.</p>
    </nav>
  );
}
