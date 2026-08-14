import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getListingById } from "@/lib/admin-db";
import ListingEditForm from "./listing-edit-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Listing" };

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(Number(id));
  if (!listing) notFound();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link
          href="/admin/listings"
          className="a-btn a-btn-ghost"
          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
        >
          ← Listings
        </Link>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Edit Listing{" "}
          <span style={{ color: "var(--a-ink-muted)", fontWeight: 400 }}>#{listing.id}</span>
        </h1>
      </div>
      <ListingEditForm listing={listing} />
    </>
  );
}
