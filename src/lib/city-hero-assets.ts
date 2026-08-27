export function getCityHeroImage(slug: string): string {
  const imageSlug = slug === "tasmania" ? "hobart" : slug;
  return `/images/cities/hero/location-photo-${imageSlug}-photo.webp`;
}

export function getCityHeroFallbacks(slug: string): string[] {
  const imageSlug = slug === "tasmania" ? "hobart" : slug;
  return [
    `/images/cities/optimized/location-photo-${imageSlug}-photo.webp`,
    `/images/location-photo-${imageSlug}-photo.jpg`,
    `/images/location-photo-${imageSlug}-v2.png`,
    `/images/location-hero-${imageSlug}.svg`,
  ];
}
