"use client";

import { useRouter } from "next/navigation";
import { toUrlSlug } from "@/lib/constants";
import type { City, Category } from "@/lib/types";
import type { PublicEventOrganiser } from "@/lib/data";

interface Props {
  cities: City[];
  categories: Category[];
  organisers: PublicEventOrganiser[];
  selectedCity?: string;
  selectedCategory?: string;
  selectedPaid?: string;
  selectedOrganiser?: string;
  view: "list" | "calendar";
  month: string;
}

export default function EventsFilter({
  cities,
  categories,
  organisers,
  selectedCity,
  selectedCategory,
  selectedPaid,
  selectedOrganiser,
  view,
  month,
}: Props) {
  const router = useRouter();

  function go(city: string, cat: string, paid: string, organiser: string, v: string, m: string) {
    const p = new URLSearchParams();
    if (city) p.set("city", city);
    if (cat) p.set("category", cat);
    if (paid) p.set("paid", paid);
    if (organiser) p.set("organiser", organiser);
    if (v !== "list") p.set("view", v);
    if (m) p.set("month", m);
    router.push(`/events${p.size ? `?${p}` : ""}`);
  }

  const c = selectedCity || "";
  const cat = selectedCategory || "";
  const paid = selectedPaid || "";
  const organiser = selectedOrganiser || "";

  return (
    <div className="e4s-events-filter-bar">
      <div className="e4s-events-filter">
        <label>
          <span>City</span>
          <select value={c} onChange={(e) => go(e.target.value, cat, paid, organiser, view, month)}>
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.slug} value={toUrlSlug(city.slug)}>{city.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Category</span>
          <select value={cat} onChange={(e) => go(c, e.target.value, paid, organiser, view, month)}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={toUrlSlug(category.slug)}>{category.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Price</span>
          <select value={paid} onChange={(e) => go(c, cat, e.target.value, organiser, view, month)}>
            <option value="">All</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        <label>
          <span>Organiser</span>
          <select value={organiser} onChange={(e) => go(c, cat, paid, e.target.value, view, month)}>
            <option value="">All Organisers</option>
            {organisers.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="e4s-events-view-toggle">
        <button
          type="button"
          className={`e4s-events-view-toggle__btn${view === "list" ? " e4s-events-view-toggle__btn--active" : ""}`}
          onClick={() => go(c, cat, paid, organiser, "list", month)}
          aria-pressed={view === "list"}
        >
          <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
          List
        </button>
        <button
          type="button"
          className={`e4s-events-view-toggle__btn${view === "calendar" ? " e4s-events-view-toggle__btn--active" : ""}`}
          onClick={() => go(c, cat, paid, organiser, "calendar", month)}
          aria-pressed={view === "calendar"}
        >
          <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <rect height="18" rx="2" ry="2" width="18" x="3" y="4" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          Calendar
        </button>
      </div>
    </div>
  );
}
