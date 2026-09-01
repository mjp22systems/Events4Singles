import Nav from "@/components/nav";
import Footer from "@/components/footer";
import NavigationTracker from "@/components/navigation-tracker";
import BackToTop from "@/components/back-to-top";
import HeaderHeight from "@/components/header-height";
import PublicRouteStateReset from "@/components/public-route-state-reset";

export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/site.css" precedence="default" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/dance-classes.css" precedence="e4s-page" />
      <HeaderHeight />
      <PublicRouteStateReset />
      <NavigationTracker />
      <Nav />
      {children}
      <Footer />
      <BackToTop />
    </>
  );
}
