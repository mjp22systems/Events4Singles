"use client";
import { useState } from "react";

export default function ListingCardMedia({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className={`e4s-listing-card__media${broken ? " e4s-listing-card__media--broken" : ""}`}>
      <img alt={alt} loading="lazy" src={src} onError={() => setBroken(true)} />
    </div>
  );
}
