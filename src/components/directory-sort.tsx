"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SortValue = "listings" | "alpha";

type SortControlProps = {
  id: string;
  value: SortValue;
  onChange: (value: SortValue) => void;
};

type CityTile = {
  href: string;
  imageUrl: string | null;
  label: string;
  listingCount: number;
  slug: string;
};

type CategoryTile = CityTile & {
  summary: string;
};

type DirectoryBrowserCopy = {
  lead: string;
  title: string;
};

function normalizeSort(value: string): SortValue {
  return value === "alpha" ? "alpha" : "listings";
}

function sortTiles<T extends { label: string; listingCount: number }>(items: T[], sort: SortValue) {
  return [...items].sort((a, b) => {
    if (sort === "alpha") return a.label.localeCompare(b.label);
    return b.listingCount - a.listingCount || a.label.localeCompare(b.label);
  });
}

function SortControl({ id, value, onChange }: SortControlProps) {
  return (
    <div className="e4s-index-sort">
      <label htmlFor={id}>Sort</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(normalizeSort(event.currentTarget.value))}
      >
        <option value="listings">Most listings</option>
        <option value="alpha">Alphabetical</option>
      </select>
    </div>
  );
}

export function CityDirectoryGrid({ cities, lead, title }: { cities: CityTile[] } & DirectoryBrowserCopy) {
  const [sort, setSort] = useState<SortValue>("listings");
  const sortedCities = useMemo(() => sortTiles(cities, sort), [cities, sort]);

  return (
    <>
      <div className="e4s-shell e4s-page-head e4s-index-page-head">
        <h1>{title}</h1>
        <p className="e4s-lead">{lead}</p>
        <SortControl id="cities-sort" value={sort} onChange={setSort} />
      </div>
      <div className="e4s-shell e4s-home-city-grid">
        {sortedCities.map((city, index) => (
          <Link key={city.slug} className="e4s-home-city-tile" href={city.href}>
            {city.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={city.label} loading={index < 6 ? "eager" : "lazy"} src={city.imageUrl} />
            ) : (
              <div className="e4s-home-city-tile__placeholder" aria-hidden="true" />
            )}
            <span>{city.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export function CategoryDirectoryGrid({ categories, lead, title }: { categories: CategoryTile[] } & DirectoryBrowserCopy) {
  const [sort, setSort] = useState<SortValue>("alpha");
  const sortedCategories = useMemo(() => sortTiles(categories, sort), [categories, sort]);

  return (
    <>
      <div className="e4s-shell e4s-page-head e4s-index-page-head">
        <h1>{title}</h1>
        <p className="e4s-lead">{lead}</p>
        <SortControl id="categories-sort" value={sort} onChange={setSort} />
      </div>
      <div className="e4s-shell e4s-home-cat-grid">
        {sortedCategories.map((cat, index) => (
          <Link key={cat.slug} className="e4s-home-cat-tile" href={cat.href}>
            {cat.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={cat.label} loading={index < 4 ? "eager" : "lazy"} src={cat.imageUrl} />
            ) : (
              <span className="e4s-home-cat-tile__fallback" aria-hidden="true" />
            )}
            <span className="e4s-home-cat-tile__copy">
              <span className="e4s-home-cat-tile__label">{cat.label}</span>
              <span className="e4s-home-cat-tile__sub">{cat.summary}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
