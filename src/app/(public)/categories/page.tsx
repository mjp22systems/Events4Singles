import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Singles Categories — Australia",
  description:
    "Browse all categories in Australia's singles directory — speed dating, dinner parties, dance classes, social clubs, life coaches, travel and more.",
};

const CAT_IMAGES: Record<string, string> = {
  "speed-dating": "/images/home-cat-speed-dating.jpg",
  "dinner-parties": "/images/home-cat-dinner-parties.jpg",
  "social-clubs": "/images/home-cat-mixers.jpg",
  "dance-classes": "/images/home-cat-activities.jpg",
  "travel-for-singles": "/images/home-cat-travel.jpg",
  "tours4singles": "/images/home-cat-travel.jpg",
  "yoga-classes": "/images/home-cat-yoga.jpg",
  "fitness4singles": "/images/home-cat-yoga.jpg",
  "cruises4singles": "/images/home-cat-cruises.jpg",
  "sport-adventure": "/images/home-cat-sport.jpg",
  "adventure-for-singles": "/images/home-cat-sport.jpg",
  "walks4singles": "/images/home-cat-walks.jpg",
  "dance-party-clubs": "/images/home-cat-activities.jpg",
  "dinner-for-six": "/images/home-cat-dinner-parties.jpg",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <main id="site-content">
      <div className="e4s-shell e4s-home-section__head e4s-page-head">
        <div>
          <h1>Browse Categories</h1>
          <p className="e4s-lead">
            Everything from speed dating to dance classes — find the format that suits you.
          </p>
        </div>
      </div>

      <div className="e4s-shell e4s-home-cat-grid">
        {categories.map((cat) => {
          const slug = toUrlSlug(cat.slug);
          const img = CAT_IMAGES[slug];
          return (
            <Link key={cat.slug} className="e4s-home-cat-tile" href={`/${slug}`}>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={cat.label} loading="lazy" src={img} />
              ) : (
                <div className="e4s-home-city-tile__placeholder" />
              )}
              <span className="e4s-home-cat-tile__label">{cat.label}</span>
              {cat.description && (
                <span className="e4s-home-cat-tile__sub">{cat.description}</span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="e4s-shell e4s-page-foot">
        <h2>Don&rsquo;t see your category?</h2>
        <p>
          If you run a singles event that doesn&rsquo;t fit neatly into a category,{" "}
          <Link href="/contact">get in touch</Link> — we&rsquo;re always expanding the directory.
        </p>
      </div>
    </main>
  );
}
