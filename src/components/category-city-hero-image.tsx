"use client";

import { useState } from "react";

type Props = {
  alt: string;
  parentCategoryImage?: string;
  parentCategoryFallbacks?: string[];
  categoryImage: string;
  categoryFallbacks?: string[];
  cityImage: string;
  cityFallbacks?: string[];
};

type LayerProps = {
  className: string;
  src: string;
  fallbacks?: string[];
};

function BlendImageLayer({ className, src, fallbacks = [] }: LayerProps) {
  const srcs = [src, ...fallbacks];
  const [idx, setIdx] = useState(0);

  if (idx >= srcs.length) return null;

  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      decoding="async"
      fetchPriority="high"
      loading="eager"
      src={srcs[idx]}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

export default function CategoryCityHeroImage({
  alt,
  parentCategoryImage,
  parentCategoryFallbacks,
  categoryImage,
  categoryFallbacks,
  cityImage,
  cityFallbacks,
}: Props) {
  const hasParentCategory = Boolean(parentCategoryImage);

  return (
    <div
      aria-label={alt}
      className={`e4s-page-hero__image e4s-page-hero__image--blend${hasParentCategory ? " e4s-page-hero__image--blend-trio" : ""}`}
      role="img"
    >
      {parentCategoryImage && (
        <BlendImageLayer
          className="e4s-page-hero__blend-image e4s-page-hero__blend-image--parent-category"
          src={parentCategoryImage}
          fallbacks={parentCategoryFallbacks}
        />
      )}
      <BlendImageLayer
        className="e4s-page-hero__blend-image e4s-page-hero__blend-image--category"
        src={categoryImage}
        fallbacks={categoryFallbacks}
      />
      <BlendImageLayer
        className="e4s-page-hero__blend-image e4s-page-hero__blend-image--city"
        src={cityImage}
        fallbacks={cityFallbacks}
      />
      <span className="e4s-page-hero__blend-softener" aria-hidden="true" />
    </div>
  );
}
