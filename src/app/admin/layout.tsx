import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: { default: "E4S Admin", template: "%s — E4S Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const themeScript = `
    (function () {
      try {
        var theme = window.localStorage.getItem("e4s-admin-theme");
        if (theme === "light" || theme === "dark") {
          document.documentElement.dataset.adminTheme = theme;
        }
      } catch (error) {}
    })();
  `;

  return (
    <>
      <Script id="admin-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      <Script src="/admin-bulk-select.js" strategy="beforeInteractive" />
      <link rel="stylesheet" href="/admin.css" />
      {children}
    </>
  );
}
