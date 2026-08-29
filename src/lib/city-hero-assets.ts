export function getCityHeroImage(slug: string): string {
  const imageSlug = slug === "tasmania" ? "hobart" : slug;
  return `/images/cities/heroes/location-photo-${imageSlug}-photo.webp`;
}

export function getCityHeroFallbacks(slug: string): string[] {
  const imageSlug = slug === "tasmania" ? "hobart" : slug;
  return [
    `/images/site/location-photos/location-photo-${imageSlug}-photo.jpg`,
    `/images/site/location-photos/location-photo-${imageSlug}-v2.png`,
    `/images/site/location-heroes/location-hero-${imageSlug}.svg`,
  ];
}

export function getCitySourceImage(slug: string): string {
  return getCityHeroImage(slug);
}

export function getCitySourceFallbacks(slug: string): string[] {
  return getCityHeroFallbacks(slug);
}
