"use client";
import ListingCard from "./listing-card";
import type { Listing } from "@/lib/types";

const SPONSORED = [
  { title: "Speed Dating Sydney", sub: "View events", href: "/speed-dating/sydney", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=70" },
  { title: "Dinner for Six", sub: "See dates", href: "/dinner-for-six", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=300&q=70" },
  { title: "Promote Your Venue", sub: "Advertise with us", href: "/advertise", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=300&q=70" },
  { title: "Singles Travel", sub: "Explore trips", href: "/solo-travel", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=70" },
  { title: "Your Ad Here", sub: "Book this spot", href: "/advertise", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=70" },
  { title: "Social Clubs", sub: "Meet new people", href: "/social-clubs", img: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=300&q=70" },
  { title: "Speed Dating Events", sub: "Find your match", href: "/speed-dating", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=70" },
  { title: "Featured Business Spot", sub: "Reserve this tile", href: "/advertise", img: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=300&q=70" },
];

interface Props {
  listings: Listing[];
}

export default function HomeFeatured({ listings }: Props) {
  return (
    <div className="e4s-home-featured-layout">
      <div className="e4s-home-featured__listings">
        {listings.length === 0 ? (
          <p className="e4s-home-featured__empty">No featured listings are available yet.</p>
        ) : (
          listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
        )}
      </div>
      <aside className="e4s-home-featured__sidebar">
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
