export function getCityHeroImage(slug: string): string {
  const imageSlug = slug === "tasmania" ? "hobart" : slug;
  return `/images/cities/heroes/location-photo-${imageSlug}-photo.webp`;
}

export function getCityHeroFallbacks(slug: string): string[] {
  const imageSlug = slug === "tasmania" ? "hobart" : slug;
  return [
    `/images/location-photo-${imageSlug}-photo.jpg`,
    `/images/location-photo-${imageSlug}-v2.png`,
    `/images/location-hero-${imageSlug}.svg`,
  ];
}

export function getCitySourceImage(slug: string): string {
  return getCityHeroImage(slug);
}

export function getCitySourceFallbacks(slug: string): string[] {
  return getCityHeroFallbacks(slug);
}
