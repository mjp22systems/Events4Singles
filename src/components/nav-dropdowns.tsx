"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Category, City } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";

interface Props {
  cities: City[];
  categories: Category[];
}

export default function NavDropdowns({ cities, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [citySort, setCitySort] = useState<"default" | "alpha">("default");
  const [catSort, setCatSort] = useState<"default" | "alpha">("default");

  const citySet = new Set(cities.map((c) => toUrlSlug(c.slug)));
  const segs = pathname.split("/").filter(Boolean);
  const seg0 = segs[0] ?? "";
  const seg1 = segs[1] ?? "";

  const selectedCity = citySet.has(seg1) ? seg1 : citySet.has(seg0) ? seg0 : "";

  const INFO_ROUTES: Record<string, string> = {
    about: "About",
    contact: "Contact",
    advice: "Dating Resources",
    "dating-resources": "Dating Resources",
    advertise: "Advertise with Us",
    portal: "Advertiser Portal",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
  };

  const infoSlugs = new Set(Object.keys(INFO_ROUTES));
  const selectedCat =
    seg0 && !citySet.has(seg0) && seg0 !== "listing" && !infoSlugs.has(seg0)
      ? seg0
      : "";
  const selectedInfo = INFO_ROUTES[seg0] ?? "";

  const filteredCats = categories.filter((c) => c.slug !== "events");

  const sortedCities =
    citySort === "alpha"
      ? [...cities].sort((a, b) => a.label.localeCompare(b.label))
      : cities;

  const sortedCats =
    catSort === "alpha"
      ? [...filteredCats].sort((a, b) => a.label.localeCompare(b.label))
      : filteredCats;

  return (
    <nav aria-label="Site navigation" className="e4s-shell e4s-nav">
      <label>
        <span className="e4s-nav__label-row">
          Location
          <button
            type="button"
            className={`e4s-nav__sort-btn${citySort === "alpha" ? " e4s-nav__sort-btn--active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCitySort((s) => (s === "alpha" ? "default" : "alpha"));
            }}
            title={citySort === "alpha" ? "Currently A-Z. Click for default order." : "Click to sort A-Z"}
            aria-label={citySort === "alpha" ? "Sort by default" : "Sort alphabetically"}
          >
            A-Z
          </button>
        </span>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) router.push(`/${toUrlSlug(e.target.value)}`);
          }}
        >
          <option value="" disabled>
            {selectedCity
              ? (cities.find((c) => toUrlSlug(c.slug) === selectedCity)?.label ?? "Select Location")
              : "Select Location"}
          </option>
          {sortedCities.map((city) => (
            <option key={city.slug} value={toUrlSlug(city.slug)}>
              {city.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="e4s-nav__label-row">
          Category
          <button
            type="button"
            className={`e4s-nav__sort-btn${catSort === "alpha" ? " e4s-nav__sort-btn--active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCatSort((s) => (s === "alpha" ? "default" : "alpha"));
            }}
            title={catSort === "alpha" ? "Currently A-Z. Click for default order." : "Click to sort A-Z"}
            aria-label={catSort === "alpha" ? "Sort by default" : "Sort alphabetically"}
          >
            A-Z
          </button>
        </span>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) router.push(`/${e.target.value}`);
          }}
        >
          <option value="" disabled>
            {selectedCat
              ? (filteredCats.find((c) => toUrlSlug(c.slug) === selectedCat)?.label ?? "Select Category")
              : "Select Category"}
          </option>
          {sortedCats.map((cat) => (
            <option key={cat.slug} value={toUrlSlug(cat.slug)}>
              {cat.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Information</span>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) router.push(e.target.value);
          }}
        >
          <option value="" disabled>{selectedInfo || "Site Information"}</option>
          <option value="/about">About</option>
          <option value="/contact">Contact</option>
          <option value="/dating-resources">Dating Resources</option>
          <option value="/advertise">Advertise with Us</option>
          <option value="/portal">Advertiser Portal</option>
          <option value="/terms">Terms of Use</option>
          <option value="/privacy">Privacy Policy</option>
        </select>
      </label>

      <div className="e4s-nav__events-cell">
        <Link href="/events" className="e4s-nav__events-btn">Events Calendar</Link>
      </div>
    </nav>
  );
}
