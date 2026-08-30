import { getBannersForCity, getBannersForPage, getFeaturedDirectoryBanners } from "@/lib/data";
import type { Banner } from "@/lib/types";
import AdPlaceholderTile from "@/components/ad-placeholder-tile";

const SLOTS_PER_ROW = 6;
const MAX_SLOTS = SLOTS_PER_ROW * 2;

type Props =
  | { mode: "category"; categoryDbSlug: string; cityDbSlug?: string | null; categoryLabel?: string; cityLabel?: string | null; rows?: 1 | 2 }
  | { mode: "city"; cityDbSlug: string; cityLabel?: string; rows?: 1 | 2 }
  | { mode: "featured"; rows?: 1 | 2 };

function placeholderLabel(props: Props) {
  if (props.mode === "featured") return "Featured Directory Slot";
  if (props.mode === "city") return props.cityLabel ? `${props.cityLabel} Promotion Slot` : "City Promotion Slot";
  if (props.categoryLabel && props.cityLabel) return `${props.categoryLabel} in ${props.cityLabel}`;
  if (props.categoryLabel) return `${props.categoryLabel} Promotion Slot`;
  return "Promote Your Business";
}

export default async function PromoBanners(props: Props) {
  let banners: Banner[];

  if (props.mode === "featured") {
    banners = await getFeaturedDirectoryBanners();
  } else if (props.mode === "city") {
    banners = await getBannersForCity(props.cityDbSlug);
  } else {
    banners = await getBannersForPage(props.categoryDbSlug, props.cityDbSlug);
  }

  const visibleBanners = banners.slice(0, MAX_SLOTS);
  const requestedSlots = props.rows === 2 ? MAX_SLOTS : SLOTS_PER_ROW;
  const rowTarget = props.rows ? requestedSlots : visibleBanners.length > SLOTS_PER_ROW ? MAX_SLOTS : SLOTS_PER_ROW;
  const placeholderCount = visibleBanners.length === MAX_SLOTS
    ? 0
    : rowTarget - visibleBanners.length;
  const renderedSlotCount = visibleBanners.length + placeholderCount;
  const rowClass = renderedSlotCount > SLOTS_PER_ROW
    ? "e4s-promo-banners--two-row"
    : "e4s-promo-banners--one-row";

  if (visibleBanners.length === 0 && placeholderCount === 0) return null;

  return (
    <section aria-label="Featured advertisers" className={`e4s-promo-banners ${rowClass}`}>
      {visibleBanners.map((b) => {
        const isExternal = /^https?:\/\//i.test(b.click_url);
        return (
          <a key={b.id} href={b.click_url} rel={isExternal ? "noopener" : undefined} target={isExternal ? "_blank" : undefined} title={b.alt_text}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={`${b.alt_text} advertiser tile`} loading="lazy" src={b.image_url} title={b.alt_text} />
          </a>
        );
      })}
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <AdPlaceholderTile
          key={`ph-${i}`}
          className="e4s-promo-banners__placeholder"
          label={placeholderLabel(props)}
        />
      ))}
    </section>
  );
}
