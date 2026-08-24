export function getCityHeroImage(slug: string): string {
  return `/images/optimized/location-photo-${slug}-photo.webp`;
}

export function getCityHeroFallbacks(slug: string): string[] {
  return [
    `/images/location-photo-${slug}-photo.jpg`,
    `/images/location-photo-${slug}-v2.png`,
    `/images/location-hero-${slug}.svg`,
  ];
}
