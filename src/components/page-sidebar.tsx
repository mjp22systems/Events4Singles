import Link from "next/link";
import type { Category, City } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";
import SidebarNav from "@/components/sidebar-nav";

type Props =
  | {
      mode: "category";
      cities: City[];
      categoryUrlSlug: string;
      currentCityDbSlug?: string;
      backLabel?: string;
    }
  | {
      mode: "city";
      categories: Category[];
      cityUrlSlug: string;
    };

export default function PageSidebar(props: Props) {
  if (props.mode === "city") {
    const items = props.categories.map((cat) => ({
      key: cat.slug,
      label: cat.label,
      href: `/${toUrlSlug(cat.slug)}/${props.cityUrlSlug}`,
      count: cat.listing_count,
    }));

    return (
      <aside className="e4s-sidebar">
        <SidebarNav heading="Browse by category" items={items} />
        <a className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
          <img alt="Advertise on Events4Singles" loading="lazy" src="/images/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
        </a>
      </aside>
    );
  }

  const items = props.cities.map((city) => ({
    key: city.slug,
    label: city.label,
    href: `/${props.categoryUrlSlug}/${toUrlSlug(city.slug)}`,
    count: city.listing_count,
    isActive: city.slug === props.currentCityDbSlug,
  }));

  const topItem = !props.currentCityDbSlug
    ? { label: "All cities", href: `/${props.categoryUrlSlug}` }
    : undefined;

  return (
    <aside className="e4s-sidebar">
      {props.backLabel && (
        <Link className="e4s-sidebar-back" href={`/${props.categoryUrlSlug}`}>
          &lt;- {props.backLabel}
        </Link>
      )}
      <SidebarNav
        heading={props.currentCityDbSlug ? "Other cities" : "Browse by city"}
        items={items}
        topItem={topItem}
      />
      <a className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
        <img alt="Advertise on Events4Singles" loading="lazy" src="/images/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
      </a>
    </aside>
  );
}
