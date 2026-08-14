import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/admin-db";
import CategoryEditForm from "./category-edit-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Category" };

type Props = { params: Promise<{ slug: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link
          href="/admin/categories"
          className="a-btn a-btn-ghost"
          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
        >
          ← Categories
        </Link>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Edit Category{" "}
          <span style={{ color: "var(--a-ink-muted)", fontWeight: 400 }}>{category.slug}</span>
        </h1>
      </div>
      <CategoryEditForm category={category} />
    </>
  );
}
