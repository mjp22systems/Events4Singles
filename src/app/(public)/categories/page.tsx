import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { CategoryDirectoryGrid } from "@/components/directory-sort";
import { getAllCategories } from "@/lib/data";
import { toUrlSlug } from "@/lib/constants";
import { getCategoryCardImage, getCategoryCardSummary } from "@/lib/category-card-assets";

export const metadata: Metadata = {
  title: "Singles Categories — Australia",
  description:
    "Browse all categories in Australia's singles directory — speed dating, dinner parties, dance classes, social clubs, life coaches, travel and more.",
};

type CategoriesPageProps = {
  searchParams?: Promise<{ sort?: string | string[] }>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  if ((await searchParams)?.sort) permanentRedirect("/categories");

  const categories = await getAllCategories();
  const categoryTiles = categories.map((cat) => {
    const slug = toUrlSlug(cat.slug);
    return {
      href: `/${slug}`,
      imageUrl: getCategoryCardImage(slug) ?? null,
      label: cat.label,
      listingCount: cat.listing_count,
      slug: cat.slug,
      summary: getCategoryCardSummary(slug, cat.description),
    };
  });

  return (
    <main className="e4s-index-page" id="site-content">
      <CategoryDirectoryGrid
        categories={categoryTiles}
        title="Browse Categories"
        lead="Everything from speed dating to dance classes — find the format that suits you."
      />

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
