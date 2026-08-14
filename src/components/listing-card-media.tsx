"use client";
import { useState } from "react";

export default function ListingCardMedia({ src, alt, title }: { src: string; alt: string; title?: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className={`e4s-listing-card__media${broken ? " e4s-listing-card__media--broken" : ""}`}>
      <img alt={alt} loading="lazy" src={src} title={title || alt} onError={() => setBroken(true)} />
    </div>
  );
}
