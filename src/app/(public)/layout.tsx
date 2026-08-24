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
      <link rel="stylesheet" href="/site.css" />
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
