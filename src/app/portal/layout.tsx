export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/portal.css" precedence="default" />
      {children}
    </>
  );
}
