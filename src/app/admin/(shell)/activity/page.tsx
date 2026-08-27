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
                    <td className="a-inline-754b3590" >
                      {new Date(row.created_at * 1000).toLocaleString("en-AU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="a-muted-small" >
                      {row.actor_type}
                      {row.actor_id ? ` (${row.actor_id})` : ""}
                    </td>
                    <td className="a-inline-da6c85ac" >{row.action}</td>
                    <td className="a-muted-small" >
                      {row.entity_type} {row.entity_id ? `#${row.entity_id}` : ""}
                    </td>
                    <td className="a-inline-9ef1689b" >
                      {row.meta ? (
                        <code className="a-inline-e102a236" >{row.meta}</code>
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
