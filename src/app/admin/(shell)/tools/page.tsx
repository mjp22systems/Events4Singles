import type { Metadata } from "next";
import Link from "next/link";
import { getNoImageListings, getLowConfidenceListings, getUnplacedListings } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Tools" };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "no-image", label: "No image" },
  { id: "low-confidence", label: "Low confidence" },
  { id: "unplaced", label: "Unplaced" },
];

const BADGE: Record<string, string> = {
  active: "a-badge-active",
  pending: "a-badge-pending",
  unclaimed: "a-badge-unclaimed",
  paused: "a-badge-paused",
  expired: "a-badge-expired",
  archived: "a-badge-paused",
  deleted: "a-badge-deleted",
};

type PageProps = { searchParams: Promise<Record<string, string>> };

export default async function AdminTools({ searchParams }: PageProps) {
  const params = await searchParams;
  const tab = params.tab ?? "no-image";

  const noImage = tab === "no-image" ? await getNoImageListings() : [];
  const lowConf = tab === "low-confidence" ? await getLowConfidenceListings(70) : [];
  const unplaced = tab === "unplaced" ? await getUnplacedListings() : [];

  const rows = tab === "no-image" ? noImage : tab === "low-confidence" ? lowConf : unplaced;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Tools
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {rows.length} issues
          </span>
        </h1>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin/tools?tab=${t.id}`}
            className="a-btn a-btn-ghost"
            style={{
              fontSize: "13px",
              padding: "6px 14px",
              minHeight: "auto",
              ...(tab === t.id
                ? { background: "var(--a-teal-glow)", color: "var(--a-teal)", borderColor: "var(--a-teal)" }
                : {}),
            }}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="a-card">
        {rows.length === 0 ? (
          <div className="a-empty" style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
            <div className="a-empty__text">No issues found</div>
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Business</th>
                  {tab === "low-confidence" && <th>Score</th>}
                  {tab === "no-image" && <th>Image URL</th>}
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id}>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{l.id}</td>
                    <td style={{ fontWeight: 500 }}>{l.title}</td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "13px" }}>{l.business_name ?? "—"}</td>
                    {tab === "low-confidence" && (
                      <td>
                        <span
                          style={{
                            fontSize: "12px", fontWeight: 600,
                            color: (l.confidence_score ?? 0) < 50 ? "var(--a-danger)" : "var(--a-warning)",
                          }}
                        >
                          {l.confidence_score}%
                        </span>
                      </td>
                    )}
                    {tab === "no-image" && (
                      <td style={{ fontSize: "11px", color: "var(--a-ink-muted)", maxWidth: "180px" }}>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {l.image_url || "null"}
                        </span>
                      </td>
                    )}
                    <td>
                      <span className={`a-badge ${BADGE[l.status ?? ""] ?? "a-badge-paused"}`}>
                        {l.status ?? "unknown"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={`/admin/listings/${l.id}`}
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
        )}
      </div>
    </>
  );
}
