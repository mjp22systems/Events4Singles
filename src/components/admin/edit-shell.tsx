import Link from "next/link";

type AdminEditShellProps = {
  backHref: string;
  backLabel: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export default function AdminEditShell({ backHref, backLabel, title, eyebrow, children }: AdminEditShellProps) {
  return (
    <div className="admin-edit-shell">
      <div className="admin-edit-shell__bar">
        <Link
          href={backHref}
          className="a-btn a-btn-ghost"
          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
        >
          {backLabel}
        </Link>
        {eyebrow && <span className="admin-edit-shell__eyebrow">{eyebrow}</span>}
      </div>
      <div className="admin-edit-shell__panel">
        <h1 className="admin-edit-shell__title">{title}</h1>
        {children}
      </div>
    </div>
  );
}
