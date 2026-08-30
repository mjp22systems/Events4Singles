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

function useLayerSrc(primary: string | undefined, fallbacks: string[]) {
  const srcs = primary ? [primary, ...fallbacks] : fallbacks;
  const [idx, setIdx] = useState(0);
  return {
    src: srcs[idx],
    onError: () => setIdx((i) => i + 1),
  };
}

export default function CategoryCityHeroImage({
  alt,
  parentCategoryImage,
  parentCategoryFallbacks = [],
  categoryImage,
  categoryFallbacks = [],
  cityImage,
  cityFallbacks = [],
}: Props) {
  const parent = useLayerSrc(parentCategoryImage, parentCategoryFallbacks);
  const category = useLayerSrc(categoryImage, categoryFallbacks);
  const city = useLayerSrc(cityImage, cityFallbacks);
  const isTrio = Boolean(parent.src);

  if (!category.src && !city.src && !parent.src) return null;

  return (
    <div
      aria-label={alt}
      className={`e4s-page-hero__image e4s-page-hero__image--blend${isTrio ? " e4s-page-hero__image--blend-trio" : ""}`}
      role="img"
    >
      {parent.src ? (
        <span className="e4s-page-hero__blend-layer e4s-page-hero__blend-image--parent-category">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="e4s-page-hero__blend-image"
            decoding="async"
            fetchPriority="high"
            loading="eager"
            src={parent.src}
            onError={parent.onError}
          />
        </span>
      ) : null}
      {category.src ? (
        <span className="e4s-page-hero__blend-layer e4s-page-hero__blend-image--category">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="e4s-page-hero__blend-image"
            decoding="async"
            fetchPriority="high"
            loading="eager"
            src={category.src}
            onError={category.onError}
          />
        </span>
      ) : null}
      {city.src ? (
        <span className="e4s-page-hero__blend-layer e4s-page-hero__blend-image--city">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="e4s-page-hero__blend-image"
            decoding="async"
            fetchPriority="high"
            loading="eager"
            src={city.src}
            onError={city.onError}
          />
        </span>
      ) : null}
      <span className="e4s-page-hero__blend-softener" />
    </div>
  );
}
