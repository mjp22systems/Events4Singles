import { getBannersForCity, getBannersForPage, getFeaturedDirectoryBanners } from "@/lib/data";
import type { Banner } from "@/lib/types";
import Link from "next/link";

const SLOTS_PER_ROW = 6;
const MAX_SLOTS = SLOTS_PER_ROW * 2;

type Props =
  | { mode: "category"; categoryDbSlug: string; cityDbSlug?: string | null }
  | { mode: "city"; cityDbSlug: string }
  | { mode: "featured" };

export default async function PromoBanners(props: Props) {
  let banners: Banner[];

  if (props.mode === "featured") {
    banners = await getFeaturedDirectoryBanners();
  } else if (props.mode === "city") {
    banners = await getBannersForCity(props.cityDbSlug);
  } else {
    banners = await getBannersForPage(props.categoryDbSlug, props.cityDbSlug);
  }

  const slotCount = banners.length >= MAX_SLOTS ? MAX_SLOTS : SLOTS_PER_ROW;
  const visibleBanners = banners.slice(0, slotCount);
  const placeholderCount = Math.max(0, slotCount - visibleBanners.length);
  const rowClass = slotCount > SLOTS_PER_ROW
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
        <Link key={`ph-${i}`} className="e4s-promo-banners__placeholder" href="/advertise" title="Advertise on Events4Singles">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Advertise on Events4Singles" loading="lazy" src="/images/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
        </Link>
      ))}
    </section>
  );
}
