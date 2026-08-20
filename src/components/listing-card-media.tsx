"use client";
import { useState } from "react";

export default function ListingCardMedia({
  src,
  alt,
  title,
  extraClass,
}: {
  src: string;
  alt: string;
  title?: string;
  extraClass?: string;
}) {
  const [broken, setBroken] = useState(false);
  const cls = [
    "e4s-listing-card__media",
    broken ? "e4s-listing-card__media--broken" : "",
    extraClass ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      <img
        alt={alt}
        loading="lazy"
        src={src}
        title={title || alt}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
