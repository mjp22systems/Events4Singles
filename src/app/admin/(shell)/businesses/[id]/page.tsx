import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBusinessById, getListingsForBusiness, listBusinesses } from "@/lib/admin-db";
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
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link
          href="/admin/businesses"
          className="a-btn a-btn-ghost"
          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
        >
          ← Businesses
        </Link>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Edit Business{" "}
          <span style={{ color: "var(--a-ink-muted)", fontWeight: 400 }}>#{business.id}</span>
        </h1>
      </div>
      <BusinessEditForm business={business} listings={listings} allBusinesses={allBusinesses} />
    </>
  );
}
