import { getBannersForCity, getBannersForPage } from "@/lib/data";
import type { Banner } from "@/lib/types";

const SLOTS = 6;

type Props =
  | { mode: "category"; categoryDbSlug: string; cityDbSlug?: string | null }
  | { mode: "city"; cityDbSlug: string };

export default function PromoBanners(props: Props) {
  let banners: Banner[];

  if (props.mode === "city") {
    banners = getBannersForCity(props.cityDbSlug);
  } else {
    banners = getBannersForPage(props.categoryDbSlug, props.cityDbSlug);
  }

  const placeholderCount = Math.max(0, SLOTS - banners.length);

  if (banners.length === 0 && placeholderCount === 0) return null;

  return (
    <section aria-label="Featured advertisers" className="e4s-promo-banners">
      {banners.map((b) => (
        <a key={b.id} href={b.click_url} rel="noopener" target="_blank">
          <img alt={b.alt_text} loading="lazy" src={b.image_url} />
        </a>
      ))}
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <a key={`ph-${i}`} className="e4s-promo-banners__placeholder" href="/advertise">
          <img alt="Advertise here" loading="lazy" src="/images/advertise-here-180x120.svg" />
        </a>
      ))}
    </section>
  );
}
