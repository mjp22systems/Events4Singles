import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";
import { TIERS, CATEGORIES } from "@/lib/constants";

const TIER_STYLES: Record<string, string> = {
  premium: "bg-amber-50 text-amber-700 border border-amber-200",
  professional: "bg-purple-50 text-purple-700 border border-purple-200",
  starter: "bg-teal-50 text-teal-700 border border-teal-200",
  free: "bg-slate-100 text-slate-600 border border-slate-200",
};

interface Props {
  listing: Listing;
  showCity?: boolean;
}

export default function ListingCard({ listing, showCity = false }: Props) {
  const tier = TIERS[listing.tier];
  const category = CATEGORIES.find((c) => c.id === listing.categoryId);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
      {/* Logo */}
      <div className="shrink-0">
        {listing.logoUrl ? (
          <Image
            src={listing.logoUrl}
            alt={listing.businessName}
            width={56}
            height={56}
            className="rounded-lg object-cover w-14 h-14"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
            <span className="text-teal-700 font-bold text-lg">
              {listing.businessName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/listing/${listing.slug}`}
            className="font-semibold text-slate-900 hover:text-teal-700 transition-colors leading-tight"
          >
            {listing.businessName}
          </Link>
          {listing.tier !== "free" && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${TIER_STYLES[listing.tier]}`}>
              {tier.name}
            </span>
          )}
        </div>

        {listing.tagline && (
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{listing.tagline}</p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          {showCity && (
            <span className="capitalize">{listing.cityId.replace("-", " ")}</span>
          )}
          {category && <span>{category.name}</span>}
          {listing.websiteUrl && (
            <a
              href={listing.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 transition-colors"
            >
              Visit website
            </a>
          )}
          {listing.phone && (
            <a href={`tel:${listing.phone}`} className="text-teal-600 hover:text-teal-700 transition-colors">
              {listing.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
