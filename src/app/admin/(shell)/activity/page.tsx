import type { Metadata } from "next";
import { getRecentActivity, type ActivityRow } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

export default async function AdminActivity() {
  const rows: ActivityRow[] = await getRecentActivity(200);

  return (
    <>
      <h1 className="a-page-title">Activity Log</h1>

      <div className="a-card">
        {rows.length === 0 ? (
          <div className="a-empty">
            <div className="a-empty__text">No activity recorded yet</div>
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--a-ink-muted)", fontSize: "12px" }}>
                      {new Date(row.created_at * 1000).toLocaleString("en-AU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>
                      {row.actor_type}
                      {row.actor_id ? ` (${row.actor_id})` : ""}
                    </td>
                    <td style={{ fontWeight: 500 }}>{row.action}</td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>
                      {row.entity_type} {row.entity_id ? `#${row.entity_id}` : ""}
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)", maxWidth: "260px" }}>
                      {row.meta ? (
                        <code style={{ fontSize: "11px", wordBreak: "break-all" }}>{row.meta}</code>
                      ) : (
                        "—"
                      )}
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
