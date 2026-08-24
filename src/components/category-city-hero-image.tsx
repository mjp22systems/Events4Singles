import type { CSSProperties } from "react";

type Props = {
  alt: string;
  categoryImage: string;
  cityImage: string;
};

function imageVar(url: string) {
  return `url("${url.replace(/"/g, "%22")}")`;
}

export default function CategoryCityHeroImage({ alt, categoryImage, cityImage }: Props) {
  return (
    <div
      aria-label={alt}
      className="e4s-page-hero__image e4s-page-hero__image--blend"
      role="img"
      style={{
        "--e4s-category-hero-image": imageVar(categoryImage),
        "--e4s-city-hero-image": imageVar(cityImage),
      } as CSSProperties}
    >
      <span className="e4s-page-hero__blend-image e4s-page-hero__blend-image--category" aria-hidden="true" />
      <span className="e4s-page-hero__blend-image e4s-page-hero__blend-image--city" aria-hidden="true" />
      <span className="e4s-page-hero__blend-softener" aria-hidden="true" />
    </div>
  );
}
