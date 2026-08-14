export default function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <h1 className="a-page-title">{title}</h1>
      <div className="a-card">
        <div className="a-empty">
          <div className="a-empty__text" style={{ color: "var(--a-ink-faint)" }}>
            Coming in a future phase
          </div>
        </div>
      </div>
    </>
  );
}
