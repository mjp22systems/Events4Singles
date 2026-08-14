import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCityBySlug } from "@/lib/admin-db";
import CityEditForm from "./city-edit-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit City" };

type Props = { params: Promise<{ slug: string }> };

export default async function EditCityPage({ params }: Props) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link
          href="/admin/cities"
          className="a-btn a-btn-ghost"
          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
        >
          ← Cities
        </Link>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Edit City{" "}
          <span style={{ color: "var(--a-ink-muted)", fontWeight: 400 }}>{city.slug}</span>
        </h1>
      </div>
      <CityEditForm city={city} />
    </>
  );
}
