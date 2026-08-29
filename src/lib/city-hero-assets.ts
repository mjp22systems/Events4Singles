export function getCityHeroImage(slug: string): string {
  const imageSlug = slug === "tasmania" ? "hobart" : slug;
  return `/images/cities/heroes/location-photo-${imageSlug}-photo.webp`;
}

export function getCityHeroFallbacks(slug: string): string[] {
  void slug;
  return [];
}

export function getCitySourceImage(slug: string): string {
  return getCityHeroImage(slug);
}

export function getCitySourceFallbacks(slug: string): string[] {
  return getCityHeroFallbacks(slug);
}
