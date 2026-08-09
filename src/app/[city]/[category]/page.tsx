import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CITIES, CATEGORIES, CITY_IDS, CATEGORY_IDS } from "@/lib/constants";
import { getListings } from "@/lib/data";
import ListingCard from "@/components/listing-card";
import type { CityId, CategoryId } from "@/lib/constants";

interface Props {
  params: Promise<{ city: string; category: string }>;
}

export async function generateStaticParams() {
  return CITY_IDS.flatMap((city) =>
    CATEGORY_IDS.map((category) => ({ city, category }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, category: catSlug } = await params;
  const city = CITIES.find((c) => c.id === citySlug);
  const category = CATEGORIES.find((c) => c.id === catSlug);
  if (!city || !category) return {};
  return {
    title: `${category.name} in ${city.name}`,
    description: `${category.description} Find the best ${category.name.toLowerCase()} events for singles in ${city.name}.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { city: citySlug, category: catSlug } = await params;
  const city = CITIES.find((c) => c.id === citySlug);
  const category = CATEGORIES.find((c) => c.id === catSlug);
  if (!city || !category) notFound();

  const listings = getListings({
    cityId: citySlug as CityId,
    categoryId: catSlug as CategoryId,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${city.id}`} className="hover:text-teal-600 transition-colors">{city.name}</Link>
        <span>/</span>
        <span className="text-slate-800">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {category.name} in {city.name}
        </h1>
        <p className="text-slate-600 max-w-2xl">{category.description}</p>
      </div>

      {/* Other cities */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CITIES.filter((c) => c.id !== city.id).map((c) => (
          <Link
            key={c.id}
            href={`/${c.id}/${category.id}`}
            className="text-xs border border-slate-200 text-slate-600 px-3 py-1 rounded-full hover:border-teal-400 hover:text-teal-700 transition-colors"
          >
            {category.name} in {c.name}
          </Link>
        ))}
      </div>

      {/* Tier legend */}
      <div className="flex flex-wrap gap-3 mb-8 text-xs">
        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">Premium — sticky top listing</span>
        <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full font-semibold">Professional — featured</span>
        <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full font-semibold">Starter</span>
      </div>

      {/* Listings */}
      {listings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl text-slate-500">
          <p className="text-lg font-medium mb-2">
            No {category.name.toLowerCase()} listings in {city.name} yet
          </p>
          <p className="text-sm mb-6">Be the first to list your business here.</p>
          <Link
            href="/portal"
            className="inline-block bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
          >
            List your business
          </Link>
        </div>
      )}
    </div>
  );
}
