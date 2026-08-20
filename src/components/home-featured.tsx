"use client";
import { useState, useMemo } from "react";
import ListingCard from "./listing-card";
import type { Listing } from "@/lib/types";

const CITIES = [
  { value: "", label: "All Cities" },
  { value: "sydney", label: "Sydney" },
  { value: "melbourne", label: "Melbourne" },
  { value: "brisbane", label: "Brisbane" },
  { value: "perth", label: "Perth" },
  { value: "adelaide", label: "Adelaide" },
  { value: "hobart", label: "Hobart" },
];

const CATS = [
  { value: "", label: "All Categories" },
  { value: "speed-dating", label: "Speed Dating" },
  { value: "dinner-parties", label: "Dinner Parties" },
  { value: "dance-classes", label: "Dance Classes" },
  { value: "social-clubs", label: "Social Clubs" },
  { value: "intro-agencies", label: "Introduction Agencies" },
];

const SPONSORED = [
  { title: "Speed Dating Sydney", sub: "View events", href: "/speed-dating/sydney", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=70" },
  { title: "Dinner for Six", sub: "See dates", href: "/dinner-for-six", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=300&q=70" },
  { title: "Promote Your Venue", sub: "Advertise with us", href: "/advertise", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=300&q=70" },
  { title: "Singles Travel", sub: "Explore trips", href: "/travel-for-singles", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=70" },
  { title: "Your Ad Here", sub: "Book this spot", href: "/advertise", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=70" },
  { title: "Social Clubs", sub: "Meet new people", href: "/social-clubs", img: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=300&q=70" },
  { title: "Speed Dating Events", sub: "Find your match", href: "/speed-dating", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=70" },
];

interface Props {
  listings: Listing[];
}

export default function HomeFeatured({ listings }: Props) {
  const [city, setCity] = useState("");
  const [cat, setCat] = useState("");

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (city) {
        const slugs = `${l.city_slugs || ""},${l.city_slug || ""}`.toLowerCase();
        if (!slugs.includes(city)) return false;
      }
      if (cat) {
        const catSlugs = `${l.category_slugs || ""},${l.category_slug || ""}`.toLowerCase();
        if (!catSlugs.includes(cat)) return false;
      }
      return true;
    });
  }, [listings, city, cat]);

  return (
    <div className="e4s-home-featured-layout">
      <div className="e4s-home-featured__listings">
        {filtered.length === 0 ? (
          <p className="e4s-home-featured__empty">No featured listings match your filters.</p>
        ) : (
          filtered.map((listing) => <ListingCard key={listing.id} listing={listing} />)
        )}
      </div>
      <aside className="e4s-home-featured__sidebar">
        <div className="e4s-home-featured__refine">
          <p className="e4s-home-featured__refine-label">Refine Listings</p>
          <div className="e4s-home-featured__refine-row">
            <label className="e4s-home-featured__refine-field-label">Cities</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="e4s-home-featured__refine-row">
            <label className="e4s-home-featured__refine-field-label">Category</label>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        {SPONSORED.map((sp) => (
          <a key={sp.title} className="e4s-home-featured__sponsored" href={sp.href}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={sp.title} className="e4s-home-featured__sponsored-img" src={sp.img} />
            <div className="e4s-home-featured__sponsored-overlay">
              <span className="e4s-home-featured__sponsored-tag">Sponsored</span>
              <span className="e4s-home-featured__sponsored-title">{sp.title}</span>
              <span className="e4s-home-featured__sponsored-sub">{sp.sub} &rarr;</span>
            </div>
          </a>
        ))}
      </aside>
    </div>
  );
}
