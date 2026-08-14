import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "E4S Admin", template: "%s — E4S Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/admin.css" />
      {children}
    </>
  );
}
