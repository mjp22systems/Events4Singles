import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CITIES, CATEGORIES, TIERS } from "@/lib/constants";
import { getListingBySlug } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};
  const city = CITIES.find((c) => c.id === listing.cityId);
  const category = CATEGORIES.find((c) => c.id === listing.categoryId);
  return {
    title: listing.businessName,
    description:
      listing.tagline ??
      `${listing.businessName} — ${category?.name} in ${city?.name}`,
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const city = CITIES.find((c) => c.id === listing.cityId);
  const category = CATEGORIES.find((c) => c.id === listing.categoryId);
  const tier = TIERS[listing.tier];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <span>/</span>
        {city && (
          <>
            <Link href={`/${city.id}`} className="hover:text-teal-600 transition-colors">{city.name}</Link>
            <span>/</span>
          </>
        )}
        {category && city && (
          <>
            <Link href={`/${city.id}/${category.id}`} className="hover:text-teal-600 transition-colors">{category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-800">{listing.businessName}</span>
      </nav>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            <span className="text-teal-700 font-bold text-3xl">
              {listing.businessName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{listing.businessName}</h1>
              {listing.tier !== "free" && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {tier.name}
                </span>
              )}
            </div>
            {listing.tagline && (
              <p className="text-slate-600 mb-3">{listing.tagline}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm">
              {city && category && (
                <Link
                  href={`/${city.id}/${category.id}`}
                  className="text-slate-600 hover:text-teal-600 transition-colors"
                >
                  {category.name} in {city.name}
                </Link>
              )}
            </div>
          </div>
        </div>

        {listing.description && (
          <p className="mt-5 text-slate-700 leading-relaxed border-t border-slate-100 pt-5">
            {listing.description}
          </p>
        )}

        {/* Contact */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-3">
          {listing.websiteUrl && (
            <a
              href={listing.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Visit website
            </a>
          )}
          {listing.phone && (
            <a
              href={`tel:${listing.phone}`}
              className="border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:border-slate-300 transition-colors"
            >
              {listing.phone}
            </a>
          )}
          {listing.email && (
            <a
              href={`mailto:${listing.email}`}
              className="border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:border-slate-300 transition-colors"
            >
              Email
            </a>
          )}
        </div>
      </div>

      {/* Back */}
      {city && category && (
        <Link
          href={`/${city.id}/${category.id}`}
          className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
        >
          ← Back to {category.name} in {city.name}
        </Link>
      )}
    </div>
  );
}
