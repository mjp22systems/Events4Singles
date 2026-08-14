import type { Metadata } from "next";
import Link from "next/link";
import { listCities } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Cities" };
export const dynamic = "force-dynamic";

export default async function AdminCities() {
  const cities = await listCities();

  return (
    <>
      <h1 className="a-page-title">Cities</h1>

      <div className="a-card">
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Label</th>
                <th>State</th>
                <th>Listings</th>
                <th>SEO title</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c) => (
                <tr key={c.slug}>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--a-ink-muted)" }}>
                    {c.slug}
                  </td>
                  <td style={{ fontWeight: 500 }}>{c.label}</td>
                  <td style={{ color: "var(--a-ink-muted)", fontSize: "13px" }}>{c.state ?? "—"}</td>
                  <td style={{ color: "var(--a-ink-muted)" }}>{c.listing_count}</td>
                  <td style={{ fontSize: "12px", color: "var(--a-ink-muted)", maxWidth: "220px" }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.seo_title ?? "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link
                      href={`/admin/cities/${c.slug}`}
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
