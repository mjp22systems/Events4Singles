import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug } from "@/lib/admin-db";
import AdminEditShell from "@/components/admin/edit-shell";
import CityEditForm from "./city-edit-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit City" };

type Props = { params: Promise<{ slug: string }> };

export default async function EditCityPage({ params }: Props) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  return (
    <AdminEditShell backHref="/admin/cities" backLabel="← Cities" title={city.label} eyebrow={`Slug ${city.slug}`}>
      <CityEditForm city={city} />
    </AdminEditShell>
  );
}
