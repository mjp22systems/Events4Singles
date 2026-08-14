import Nav from "@/components/nav";
import Footer from "@/components/footer";
import NavigationTracker from "@/components/navigation-tracker";
import BackToTop from "@/components/back-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationTracker />
      <Nav />
      {children}
      <Footer />
      <BackToTop />
    </>
  );
}
