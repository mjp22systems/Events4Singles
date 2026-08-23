import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/admin-db";
import AdminEditShell from "@/components/admin/edit-shell";
import CategoryEditForm from "./category-edit-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Category" };

type Props = { params: Promise<{ slug: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <AdminEditShell backHref="/admin/categories" backLabel="← Categories" title={category.label} eyebrow={`Slug ${category.slug}`}>
      <CategoryEditForm category={category} />
    </AdminEditShell>
  );
}
