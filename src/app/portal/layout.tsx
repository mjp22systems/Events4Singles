export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/portal.css?v=20260822-table-cleanup" precedence="default" />
      {children}
    </>
  );
}
