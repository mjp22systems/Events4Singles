import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListingById, getPlacementsForListing, listCategories, listCities, listListingImageOptions } from "@/lib/admin-db";
import AdminEditShell from "@/components/admin/edit-shell";
import ListingEditForm from "./listing-edit-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Listing" };

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const listingId = Number(id);
  const [listing, placements, categories, cities, imageOptions] = await Promise.all([
    getListingById(listingId),
    getPlacementsForListing(listingId),
    listCategories(),
    listCities(),
    listListingImageOptions(),
  ]);
  if (!listing) notFound();

  return (
    <AdminEditShell backHref="/admin/listings" backLabel="← Listings" title={listing.title} eyebrow={`Listing ID ${listing.id}`}>
      <ListingEditForm
        listing={listing}
        placements={placements}
        categories={categories}
        cities={cities}
        imageOptions={imageOptions}
      />
    </AdminEditShell>
  );
}
