import type { Metadata } from "next";
import Link from "next/link";
import { listCategories } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const categories = await listCategories();

  return (
    <>
      <h1 className="a-page-title">Categories</h1>

      <div className="a-card">
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Label</th>
                <th>Listings</th>
                <th>Banner rows</th>
                <th>SEO title</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.slug}>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--a-ink-muted)" }}>
                    {c.slug}
                  </td>
                  <td style={{ fontWeight: 500 }}>{c.label}</td>
                  <td style={{ color: "var(--a-ink-muted)" }}>{c.listing_count}</td>
                  <td>
                    <span
                      className="a-badge"
                      style={{
                        background: "var(--a-surface-2)",
                        color: "var(--a-ink-muted)",
                      }}
                    >
                      {c.banner_row_count} row{c.banner_row_count !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: "var(--a-ink-muted)", maxWidth: "220px" }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.seo_title ?? "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link
                      href={`/admin/categories/${c.slug}`}
                      className="a-btn a-btn-ghost"
                      style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
