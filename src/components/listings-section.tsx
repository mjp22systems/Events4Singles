"use client";
import { useMemo, useState } from "react";
import type { Category, City, Listing } from "@/lib/types";
import ListingCard from "./listing-card";
import OnlineCard from "./online-card";
import FeatureSlotCard from "./feature-slot-card";

type SortKey = "az" | "za";

type ListingsSectionProps = {
  listings: Listing[];
  title?: string;
  filterCategories?: Category[];
  filterCities?: City[];
  showFeatureSlot?: boolean;
};

function sortName(l: Listing) {
  return (l.business_name || l.title || "").toLowerCase();
}

function listingCategorySlugs(listing: Listing) {
  return (listing.category_slugs || listing.category_slug || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}

function listingCitySlugs(listing: Listing) {
  return (listing.city_slugs || listing.city_slug || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}

export default function ListingsSection({
  listings,
  title,
  filterCategories = [],
  filterCities = [],
  showFeatureSlot = true,
}: ListingsSectionProps) {
  const [sort, setSort] = useState<SortKey>("az");
  const [selectedSlugs, setSelectedSlugs] = useState<string[] | null>(null);

  const filterMode = filterCategories.length > 0 ? "Categories"
    : filterCities.length > 0 ? "Cities"
    : null;
  const filterItems = filterCategories.length > 0 ? filterCategories : filterCities;
  const filterSlugs = useMemo(
    () => filterItems.map((item) => item.slug),
    [filterItems],
  );
  const activeSlugs = selectedSlugs ?? filterSlugs;
  const activeSet = useMemo(() => new Set(activeSlugs), [activeSlugs]);
  const canFilter = filterItems.length > 0;

  const sorted = useMemo(() => {
    const copy = listings.filter((listing) => {
      if (!canFilter) return true;
      const listingSlugs = filterMode === "Cities"
        ? listingCitySlugs(listing)
        : listingCategorySlugs(listing);
      if (listingSlugs.length === 0) return activeSet.size === filterSlugs.length;
      return listingSlugs.some((slug) => activeSet.has(slug));
    });

    if (sort === "az") copy.sort((a, b) => sortName(a).localeCompare(sortName(b)));
    if (sort === "za") copy.sort((a, b) => sortName(b).localeCompare(sortName(a)));
    return copy;
  }, [activeSet, canFilter, filterMode, filterSlugs.length, listings, sort]);

  function toggleFilter(slug: string) {
    setSelectedSlugs((current) => {
      const next = new Set(current ?? filterSlugs);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return filterSlugs.filter((filterSlug) => next.has(filterSlug));
    });
  }

  return (
    <>
      <div className="e4s-toolbar-shield">
        <div className="e4s-listings-toolbar">
          {title && <span className="e4s-listings-toolbar__title">{title}</span>}
          <label className="e4s-listings-sort">
            <span>Sort:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
          </label>
          {canFilter && (
            <div className="e4s-listings-filter-group">
              <details className="e4s-listings-filter">
                <summary>
                  <span>Filter: {filterMode}</span>
                  <em>{activeSlugs.length}/{filterSlugs.length}</em>
                </summary>
                <div className="e4s-listings-filter__panel">
                  <div className="e4s-listings-filter__actions">
                    <button type="button" onClick={() => setSelectedSlugs(filterSlugs)}>
                      Select all
                    </button>
                    <button type="button" onClick={() => setSelectedSlugs([])}>
                      Deselect all
                    </button>
                  </div>
                  <div className="e4s-listings-filter__options">
                    {filterItems.map((item) => (
                      <label key={item.slug}>
                        <input
                          type="checkbox"
                          checked={activeSet.has(item.slug)}
                          onChange={() => toggleFilter(item.slug)}
                        />
                        <span>{item.label}</span>
                        <em>{item.listing_count}</em>
                      </label>
                    ))}
                  </div>
                </div>
              </details>
              <button
                type="button"
                className="e4s-listings-filter-clear"
                onClick={() => setSelectedSlugs(null)}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="e4s-listing-viewport">
        <div className="e4s-listing-stack">
          {showFeatureSlot && <FeatureSlotCard />}
          {sorted.length > 0 ? (
            sorted.map((listing) =>
              listing.listing_type === "online" ? (
                <OnlineCard key={listing.id} listing={listing} />
              ) : (
                <ListingCard key={listing.id} listing={listing} />
              )
            )
          ) : (
            <div className="e4s-listings-empty">
              No listings match the selected filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
