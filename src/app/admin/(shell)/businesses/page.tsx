import type { Metadata } from "next";
import Link from "next/link";
import { listBusinesses } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Businesses" };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string>> };

export default async function AdminBusinesses({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const businesses = await listBusinesses(q || undefined);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Businesses
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {businesses.length.toLocaleString()}
          </span>
        </h1>
      </div>

      <form method="GET" action="/admin/businesses" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search business name…"
          className="a-input"
          style={{ maxWidth: "320px" }}
        />
        <button type="submit" className="a-btn a-btn-ghost">Search</button>
        {q && <Link href="/admin/businesses" className="a-btn a-btn-ghost">Clear</Link>}
      </form>

      <div className="a-card">
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Listings</th>
                <th>Website</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--a-ink-muted)" }}>
                    No businesses found
                  </td>
                </tr>
              ) : (
                businesses.map((b) => (
                  <tr key={b.id}>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{b.id}</td>
                    <td style={{ fontWeight: 500 }}>{b.name}</td>
                    <td>
                      <Link
                        href={`/admin/listings?business_id=${b.id}`}
                        style={{ color: "var(--a-teal)", fontSize: "13px" }}
                      >
                        {b.listing_count}
                      </Link>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                      {b.website ? (
                        <a href={b.website} target="_blank" rel="noopener" style={{ color: "var(--a-teal)" }}>
                          {b.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Link
                        href={`/admin/businesses/${b.id}`}
                        className="a-btn a-btn-ghost"
                        style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
