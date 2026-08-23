import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessById, getListingsForBusiness, listBusinesses } from "@/lib/admin-db";
import AdminEditShell from "@/components/admin/edit-shell";
import BusinessEditForm from "./business-edit-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Business" };

type Props = { params: Promise<{ id: string }> };

export default async function EditBusinessPage({ params }: Props) {
  const { id } = await params;
  const business = await getBusinessById(Number(id));
  if (!business) notFound();

  const listings = await getListingsForBusiness(Number(id));
  const allBusinesses = (await listBusinesses()).map((b) => ({
    id: b.id,
    name: b.name,
    listing_count: b.listing_count,
  }));

  return (
    <AdminEditShell backHref="/admin/businesses" backLabel="← Businesses" title={business.name} eyebrow={`Business ID ${business.id}`}>
      <BusinessEditForm business={business} listings={listings} allBusinesses={allBusinesses} />
    </AdminEditShell>
  );
}
