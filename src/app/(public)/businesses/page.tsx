import type { Metadata } from "next";
import Link from "next/link";
import { PublicMain } from "@/components/public-page";
import { getAllBusinessesForDirectory } from "@/lib/data";
import { toProfileSlug } from "@/lib/constants";
import { collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { LISTING_TYPE_CONFIG, type ListingType } from "@/lib/listing-types";

export const metadata: Metadata = pageMetadata({
  title: "Business Directory — Events4Singles",
  description:
    "Browse all singles businesses, services and event organisers listed on Events4Singles. Find speed dating, social clubs, intro agencies, life coaches and more.",
  path: "/businesses",
  keywords: ["singles business directory", "singles event organisers", "dating services Australia"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BusinessesPage() {
  const businesses = await getAllBusinessesForDirectory();
  const typeOrder: ListingType[] = ["event_organizer", "venue", "service", "practitioner", "online", "featured", "premium", "standard"];
  const typeOptions = typeOrder
    .filter((type) => businesses.some((biz) => biz.type_slugs.split(" ").includes(type)))
    .map((type) => ({ value: type, label: LISTING_TYPE_CONFIG[type].label }));
  const locationOptions = [...new Map(
    businesses.flatMap((biz) => {
      const slugs = biz.location_slugs.split(" ").filter(Boolean);
      const labels = biz.location_labels.split(",").map((label) => label.trim()).filter(Boolean);
      return slugs.map((slug, index) => [slug, labels[index] || slug] as const);
    })
  ).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([value, label]) => ({ value, label }));

  const grouped: Record<string, typeof businesses> = {};
  for (const biz of businesses) {
    const key = biz.name[0]?.toUpperCase() ?? "#";
    const bucket = /[A-Z]/.test(key) ? key : "#";
    grouped[bucket] = grouped[bucket] ?? [];
    grouped[bucket].push(biz);
  }
  const keys = Object.keys(grouped).sort((a, b) =>
    a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)
  );

  function profileHref(biz: { id: number; name: string; profile_slug: string | null }) {
    return `/profile/${biz.profile_slug ?? toProfileSlug(biz.id, biz.name)}`;
  }

  return (
    <PublicMain className="e4s-businesses" shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd({
            name: "Events4Singles Business Directory",
            description: "Singles businesses, services and event organisers listed on Events4Singles.",
            path: "/businesses",
          })),
        }}
      />
      <div className="e4s-businesses__head">
        <h1>Business Directory</h1>
        <p>
          {businesses.length} businesses, services and event organisers listed on Events4Singles.
        </p>
        <div className="e4s-businesses__filters" aria-label="Business directory filters">
          <input
            className="e4s-businesses__search"
            id="biz-search"
            placeholder="Search businesses..."
            type="search"
          />
          <select className="e4s-businesses__select" id="biz-type-filter" aria-label="Filter businesses by type">
            <option value="">All types</option>
            {typeOptions.map((type) => (
              <option value={type.value} key={type.value}>{type.label}</option>
            ))}
          </select>
          <select className="e4s-businesses__select" id="biz-location-filter" aria-label="Filter businesses by location">
            <option value="">All locations</option>
            {locationOptions.map((location) => (
              <option value={location.value} key={location.value}>{location.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="e4s-businesses__index" id="biz-index">
        {keys.map((letter) => (
          <a className="e4s-businesses__index-letter" href={`#letter-${letter}`} key={letter}>
            {letter}
          </a>
        ))}
      </div>

      <div id="biz-list">
        {keys.map((letter) => (
          <section className="e4s-businesses__group" id={`letter-${letter}`} key={letter}>
            <h2 className="e4s-businesses__letter">{letter}</h2>
            <ul className="e4s-businesses__grid">
              {grouped[letter].map((biz) => (
                <li
                  className="e4s-businesses__item"
                  data-title={biz.name.toLowerCase()}
                  data-types={biz.type_slugs}
                  data-locations={biz.location_slugs}
                  key={biz.id}
                >
                  <Link className="e4s-businesses__link" href={profileHref(biz)}>
                    {biz.name}
                  </Link>
                  <span className="e4s-businesses__meta">{biz.type_labels} · {biz.location_labels}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var input = document.getElementById('biz-search');
  var typeFilter = document.getElementById('biz-type-filter');
  var locationFilter = document.getElementById('biz-location-filter');
  var list = document.getElementById('biz-list');
  var index = document.getElementById('biz-index');
  if (!input || !list) return;
  function applyFilters() {
    var q = input.value.trim().toLowerCase();
    var type = typeFilter ? typeFilter.value : '';
    var location = locationFilter ? locationFilter.value : '';
    var items = list.querySelectorAll('.e4s-businesses__item');
    var groups = list.querySelectorAll('.e4s-businesses__group');
    if (!q && !type && !location) {
      items.forEach(function(el){ el.hidden = false; });
      groups.forEach(function(el){ el.hidden = false; });
      if (index) index.hidden = false;
      return;
    }
    if (index) index.hidden = true;
    groups.forEach(function (group) {
      var visible = 0;
      group.querySelectorAll('.e4s-businesses__item').forEach(function (item) {
        var matchesSearch = !q || item.dataset.title.indexOf(q) !== -1;
        var matchesType = !type || (' ' + item.dataset.types + ' ').indexOf(' ' + type + ' ') !== -1;
        var matchesLocation = !location || (' ' + item.dataset.locations + ' ').indexOf(' ' + location + ' ') !== -1;
        var match = matchesSearch && matchesType && matchesLocation;
        item.hidden = !match;
        if (match) visible++;
      });
      group.hidden = !visible;
    });
  }
  input.addEventListener('input', applyFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyFilters);
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);
})();
`,
        }}
      />
    </PublicMain>
  );
}
