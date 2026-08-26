import type { Metadata } from "next";
import Link from "next/link";
import { PublicMain } from "@/components/public-page";
import { getAllBusinessesForDirectory } from "@/lib/data";
import { toProfileSlug } from "@/lib/constants";
import { collectionPageJsonLd, pageMetadata } from "@/lib/seo";

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

  const grouped: Record<string, { id: number; name: string; profile_slug: string | null }[]> = {};
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
        <input
          className="e4s-businesses__search"
          id="biz-search"
          placeholder="Search businesses…"
          type="search"
        />
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
                  key={biz.id}
                >
                  <Link className="e4s-businesses__link" href={profileHref(biz)}>
                    {biz.name}
                  </Link>
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
  var list = document.getElementById('biz-list');
  var index = document.getElementById('biz-index');
  if (!input || !list) return;
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    var items = list.querySelectorAll('.e4s-businesses__item');
    var groups = list.querySelectorAll('.e4s-businesses__group');
    if (!q) {
      items.forEach(function(el){ el.hidden = false; });
      groups.forEach(function(el){ el.hidden = false; });
      if (index) index.hidden = false;
      return;
    }
    if (index) index.hidden = true;
    groups.forEach(function (group) {
      var visible = 0;
      group.querySelectorAll('.e4s-businesses__item').forEach(function (item) {
        var match = item.dataset.title.indexOf(q) !== -1;
        item.hidden = !match;
        if (match) visible++;
      });
      group.hidden = !visible;
    });
  });
})();
`,
        }}
      />
    </PublicMain>
  );
}
