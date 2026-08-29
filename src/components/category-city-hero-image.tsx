"use client";

import { useState } from "react";

type Props = {
  alt: string;
  compositeImage?: string;
  compositeFallbacks?: string[];
  parentCategoryImage?: string;
  parentCategoryFallbacks?: string[];
  categoryImage: string;
  categoryFallbacks?: string[];
  cityImage: string;
  cityFallbacks?: string[];
};

export default function CategoryCityHeroImage({
  alt,
  compositeImage,
  compositeFallbacks = [],
  parentCategoryImage,
  parentCategoryFallbacks = [],
  categoryImage,
  categoryFallbacks = [],
  cityImage,
  cityFallbacks = [],
}: Props) {
  const srcs = [
    ...(compositeImage ? [compositeImage, ...compositeFallbacks] : []),
    cityImage,
    ...cityFallbacks,
    categoryImage,
    ...categoryFallbacks,
    ...(parentCategoryImage ? [parentCategoryImage, ...parentCategoryFallbacks] : []),
  ];
  const [idx, setIdx] = useState(0);

  if (idx >= srcs.length) return null;

  return (
    <div className="e4s-page-hero__image">
      <img
        alt={alt}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={srcs[idx]}
        title={alt}
        onError={() => setIdx((i) => i + 1)}
      />
    </div>
  );
}
