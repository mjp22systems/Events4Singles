import Link from "next/link";
import type { Category, City } from "@/lib/types";
import { categoryChildLabelForDisplay, toCategoryChildUrlSegment, toDbSlug, toUrlSlug } from "@/lib/constants";
import { categoryPathWithOptionalCity } from "@/lib/category-routing";
import SidebarNav from "@/components/sidebar-nav";

type Props =
  | {
      mode: "category";
      cities: City[];
      categoryUrlSlug: string;
      currentCityDbSlug?: string;
      backLabel?: string;
      backHref?: string;
      subcategories?: Category[];
      currentSubcategoryDbSlug?: string;
      subcategoryBaseUrlSlug?: string;
      subcategoryCityUrlSlug?: string;
      subcategoryHeading?: string;
      guideHref?: string;
      guideLabel?: string;
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
      return query ? `/featured-listings?${query}` : "/featured-listings";
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
          topItem={hasActiveFilter ? { label: "All featured", href: "/featured-listings" } : undefined}
        />
        <SidebarNav heading="Refine by city" items={cityItems} />
        <Link className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Advertise on Events4Singles" loading="lazy" src="/images/site/placeholders/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
        </Link>
      </aside>
    );
  }

  if (props.mode === "city") {
    const items = props.categories.map((cat) => ({
      key: cat.slug,
      label: cat.label,
      href: categoryPathWithOptionalCity(cat.slug, props.cityUrlSlug),
      count: cat.listing_count,
    }));

    return (
      <aside className="e4s-sidebar">
        <SidebarNav heading="Other Categories" items={items} />
        <Link className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Advertise on Events4Singles" loading="lazy" src="/images/site/placeholders/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
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

  const topItem = !props.currentCityDbSlug && items.length > 0
    ? { label: "All cities", href: `/${props.categoryUrlSlug}`, isActive: true }
    : undefined;
  const subcategoryBaseUrlSlug = props.subcategoryBaseUrlSlug ?? props.categoryUrlSlug;
  const subcategoryParentDbSlug = toDbSlug(subcategoryBaseUrlSlug);
  const subcategoryItems = props.subcategories?.map((cat) => {
    const childSegment = toCategoryChildUrlSegment(subcategoryParentDbSlug, cat.slug);
    const childPath = `/${subcategoryBaseUrlSlug}/${childSegment}`;
    return {
      key: cat.slug,
      label: categoryChildLabelForDisplay(subcategoryParentDbSlug, cat.label),
      href: props.subcategoryCityUrlSlug
        ? `${childPath}/${props.subcategoryCityUrlSlug}`
        : childPath,
      count: cat.listing_count,
      isActive: cat.slug === props.currentSubcategoryDbSlug,
    };
  }) ?? [];
  const subcategoryTopItem = props.guideHref && props.guideLabel
    ? {
        label: props.guideLabel,
        href: props.guideHref,
        isActive: props.currentSubcategoryDbSlug === "dance_styles",
      }
    : undefined;
  const emptySidebarHeading = props.categoryUrlSlug === "online-dating" ? "Online Dating" : null;

  return (
    <aside className="e4s-sidebar">
      {props.backLabel && (
        <Link className="e4s-sidebar-back" href={props.backHref ?? `/${props.categoryUrlSlug}`}>
          &lt;- {props.backLabel}
        </Link>
      )}
      {subcategoryItems.length > 0 && (
        <SidebarNav
          heading={props.subcategoryHeading ?? "Other Styles"}
          items={subcategoryItems}
          topItem={subcategoryTopItem}
        />
      )}
      {(items.length > 0 || topItem) && (
        <SidebarNav
          heading="Other Cities"
          items={items}
          topItem={topItem}
        />
      )}
      {subcategoryItems.length === 0 && items.length === 0 && emptySidebarHeading && (
        <div className="e4s-sidebar-block e4s-sidebar-block--empty">
          <p className="e4s-sidebar-block__heading">{emptySidebarHeading}</p>
        </div>
      )}
      <Link className="e4s-sidebar-ad" href="/advertise" title="Advertise on Events4Singles">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Advertise on Events4Singles" loading="lazy" src="/images/site/placeholders/advertise-here-180x120.svg" title="Advertise on Events4Singles" />
      </Link>
    </aside>
  );
}
