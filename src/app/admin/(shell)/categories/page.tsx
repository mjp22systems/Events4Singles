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
      <div className="a-inline-32e1f70f" >
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Categories
          <span className="a-inline-a0bf08bc" >
            {categories.length.toLocaleString()}
          </span>
        </h1>
        <Link href="/admin/categories?add=1" className="a-btn a-btn-primary a-inline-65d1aa8a" >
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

      <form method="GET" action="/admin/categories" className="a-inline-8ff7e847" >
        <input name="q" type="search" defaultValue={q} placeholder="Search label or slug..." className="a-input a-inline-ab674353"  />
        <select name="sort" defaultValue={sort} className="a-input a-inline-37a89abe" >
          {SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button type="submit" className="a-btn a-btn-ghost a-inline-47390085" >Filter</button>
        {hasActiveFilters && <Link href="/admin/categories" className="a-btn a-btn-ghost a-inline-47390085" >Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/categories/bulk">
        <input type="hidden" name="redirect" value="/admin/categories" />
        <div className="a-card">
          <div className="a-inline-2b655313" >
            <label className="a-inline-3ae3b235" >
              <AdminBulkSelectAll />
              All
            </label>
            <select name="action" className="a-input a-inline-dc2a05f8" >
              <option value="">Bulk action...</option>
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
          </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line">
            <thead>
              <tr>
                <th className="a-inline-b9c114f7" ></th>
                <th className="a-inline-672380eb" >#</th>
                <th>Label</th>
                <th>Slug</th>
                <th>Listings</th>
                <th>Banner rows</th>
                <th>SEO title</th>
                <th className="a-inline-29fbde53" >Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, index) => (
                <tr key={c.slug}>
                  <td><input type="checkbox" name="ids" value={c.slug} className="bulk-check" /></td>
                  <td className="a-inline-5d69a8cc" >{index + 1}</td>
                  <td className="a-inline-b4472ba8" >{c.label}</td>
                  <td className="a-inline-8a1c5026" >
                    {c.slug}
                  </td>
                  <td className="a-inline-92865007" >{c.listing_count}</td>
                  <td className="a-inline-7c53fa98" >
                    <span className="a-badge a-inline-09ec73bf" >
                      {c.banner_row_count} row{c.banner_row_count !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="a-inline-4493214f" >
                    <span className="a-inline-14ec14f6"  title={c.seo_title ?? undefined}>
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
    </>
  );
}
