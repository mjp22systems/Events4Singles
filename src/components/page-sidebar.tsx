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
    }
  | {
      mode: "featured";
      categories: Category[];
      cities: City[];
      activeCategoryDbSlug?: string | null;
      activeCityDbSlug?: string | null;
    };

export default function PageSidebar(props: Props) {
  if (props.mode === "featured") {
    const queryHref = (next: { category?: string | null; city?: string | null }) => {
      const params = new URLSearchParams();
      if (next.category) params.set("category", toUrlSlug(next.category));
      if (next.city) params.set("city", toUrlSlug(next.city));
      const query = params.toString();
      return query ? `/listings?${query}` : "/listings";
    };

    const categoryItems = props.categories.map((cat) => ({
      key: cat.slug,
      label: cat.label,
      href: queryHref({
        category: cat.slug,
        city: props.activeCityDbSlug,
      }),
      count: cat.listing_count,
      isActive: cat.slug === props.activeCategoryDbSlug,
    }));

    const cityItems = props.cities.map((city) => ({
      key: city.slug,
      label: city.label,
      href: queryHref({
        category: props.activeCategoryDbSlug,
        city: city.slug,
      }),
      count: city.listing_count,
      isActive: city.slug === props.activeCityDbSlug,
    }));

    const hasActiveFilter = Boolean(props.activeCategoryDbSlug || props.activeCityDbSlug);

    return (
      <aside className="e4s-sidebar">
        <SidebarNav
          heading="Refine by category"
          items={categoryItems}
          topItem={hasActiveFilter ? { label: "All featured", href: "/listings" } : undefined}
        />
        <SidebarNav heading="Refine by city" items={cityItems} />
        <Link className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Advertise on Events4Singles" loading="lazy" src="/images/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
        </Link>
      </aside>
    );
  }

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
        <Link className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Advertise on Events4Singles" loading="lazy" src="/images/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
        </Link>
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
    ? { label: "All cities", href: `/${props.categoryUrlSlug}`, isActive: true }
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
      <Link className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Advertise on Events4Singles" loading="lazy" src="/images/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
      </Link>
    </aside>
  );
}
