"use client";
import { useRouter } from "next/navigation";
import type { City } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";
import { closeHeaderMenu } from "@/lib/client-nav";

interface Props {
  cities: City[];
  categoryUrlSlug: string;
  currentCitySlug?: string;
}

export default function CategoryCitySelect({ cities, categoryUrlSlug, currentCitySlug }: Props) {
  const router = useRouter();

  return (
    <div className="e4s-page-hero__city-filter">
      <select
        aria-label="Filter by city"
        value={currentCitySlug ?? ""}
        onChange={(e) => {
          closeHeaderMenu();
          const val = e.target.value;
          if (val) router.push(`/${categoryUrlSlug}/${val}`);
          else router.push(`/${categoryUrlSlug}`);
        }}
      >
        <option value="">All Cities</option>
        {cities.map((c) => (
          <option key={c.slug} value={toUrlSlug(c.slug)}>
            {c.label} ({c.listing_count})
          </option>
        ))}
      </select>
    </div>
  );
}
