import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminAddModal from "@/components/admin/add-modal";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { createCategory, listCategories } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string>> };

const SORTS = [
  { value: "label_asc", label: "Label A-Z" },
  { value: "label_desc", label: "Label Z-A" },
  { value: "listings_desc", label: "Most listings" },
  { value: "sort_order", label: "Sort order" },
];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function addCategory(formData: FormData) {
  "use server";
  const label = String(formData.get("label") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order"));
  const bannerRows = Number(formData.get("banner_row_count"));
  const slug = slugify(rawSlug || label);
  if (!label || !slug) return;
  await createCategory({
    slug,
    label,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    bannerRowCount: Number.isFinite(bannerRows) ? bannerRows : 1,
  });
  redirect(`/admin/categories/${slug}`);
}

export default async function AdminCategories({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const sort = params.sort ?? "label_asc";
  const showAdd = params.add === "1";
  const categories = (await listCategories())
    .filter((category) => {
      if (!q) return true;
      const needle = q.toLowerCase();
      return category.label.toLowerCase().includes(needle) || category.slug.toLowerCase().includes(needle);
    })
    .sort((a, b) => {
      if (sort === "label_desc") return b.label.localeCompare(a.label);
      if (sort === "listings_desc") return b.listing_count - a.listing_count || a.label.localeCompare(b.label);
      if (sort === "sort_order") return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.label.localeCompare(b.label);
      return a.label.localeCompare(b.label);
    });
  const hasActiveFilters = q || sort !== "label_asc";

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Categories
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {categories.length.toLocaleString()}
          </span>
        </h1>
        <Link href="/admin/categories?add=1" className="a-btn a-btn-primary" style={{ fontSize: "13px" }}>
          + Add Category
        </Link>
      </div>

      {showAdd && (
        <AdminAddModal title="Add category" closeHref="/admin/categories">
          <form action={addCategory} className="admin-form-grid admin-form-grid--2">
            <div className="a-field">
              <label className="a-label">Label</label>
              <input className="a-input" name="label" required placeholder="Speed dating" />
            </div>
            <div className="a-field">
              <label className="a-label">Slug</label>
              <input className="a-input" name="slug" placeholder="speed-dating" />
            </div>
            <div className="a-field">
              <label className="a-label">Sort</label>
              <input className="a-input" name="sort_order" type="number" defaultValue="0" />
            </div>
            <div className="a-field">
              <label className="a-label">Banner rows</label>
              <input className="a-input" name="banner_row_count" type="number" min="0" defaultValue="1" />
            </div>
            <div className="admin-form-actions">
              <Link href="/admin/categories" className="a-btn a-btn-ghost">Cancel</Link>
              <button type="submit" className="a-btn a-btn-primary">Add category</button>
            </div>
          </form>
        </AdminAddModal>
      )}

      <form method="GET" action="/admin/categories" style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center", width: "100%" }}>
        <input name="q" type="search" defaultValue={q} placeholder="Search label or slug..." className="a-input" style={{ flex: 1, minWidth: "160px" }} />
        <select name="sort" defaultValue={sort} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          {SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button type="submit" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Filter</button>
        {hasActiveFilters && <Link href="/admin/categories" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/categories/bulk">
        <input type="hidden" name="redirect" value="/admin/categories" />
        <div className="a-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: "1px solid var(--a-border)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--a-ink-muted)", cursor: "pointer" }}>
              <input type="checkbox" id="bulk-select-all" />
              All
            </label>
            <select name="action" className="a-input" style={{ width: "160px" }}>
              <option value="">Bulk action...</option>
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost" style={{ fontSize: "13px" }}>Apply</button>
          </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line">
            <thead>
              <tr>
                <th style={{ width: "36px" }}></th>
                <th style={{ width: "52px" }}>#</th>
                <th>Label</th>
                <th>Slug</th>
                <th>Listings</th>
                <th>Banner rows</th>
                <th>SEO title</th>
                <th style={{ width: "56px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, index) => (
                <tr key={c.slug}>
                  <td><input type="checkbox" name="ids" value={c.slug} className="bulk-check" /></td>
                  <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{index + 1}</td>
                  <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{c.label}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--a-ink-muted)", whiteSpace: "nowrap" }}>
                    {c.slug}
                  </td>
                  <td style={{ color: "var(--a-ink-muted)", whiteSpace: "nowrap" }}>{c.listing_count}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <span className="a-badge" style={{ background: "var(--a-surface-2)", color: "var(--a-ink-muted)" }}>
                      {c.banner_row_count} row{c.banner_row_count !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: "var(--a-ink-muted)", maxWidth: "220px" }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.seo_title ?? undefined}>
                      {c.seo_title ?? "—"}
                    </span>
                  </td>
                  <td className="a-table__actions-cell">
                    <AdminActionsMenu>
                      <Link href={`/admin/categories/${c.slug}`}>Edit</Link>
                    </AdminActionsMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </form>
      <AdminBulkSelectAll />
    </>
  );
}
