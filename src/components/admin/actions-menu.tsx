export default function AdminActionsMenu({ children, label = "Actions" }: { children: React.ReactNode; label?: string }) {
  return (
    <details className="admin-actions-menu">
      <summary className="admin-actions-menu__trigger" aria-label={label}>
        ...
      </summary>
      <div className="admin-actions-menu__panel">
        {children}
      </div>
    </details>
  );
}
