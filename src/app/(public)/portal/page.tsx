import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertiser Portal",
  description: "Events4Singles advertiser portal — manage your listings, update your profile, and track performance.",
};

export default function PortalPage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Advertiser Portal</h1>
      <p className="e4s-lead">
        The self-service portal is coming soon. In the meantime, contact us directly
        to get your business listed — we&rsquo;ll set it up for you within 1 business day.
      </p>

      <section>
        <h2>Get Listed</h2>
        <p>
          Email us at <a href="mailto:advertising@events4singles.com">advertising@events4singles.com</a> with
          your business name, category, city, and the package you&rsquo;re interested in.
        </p>
        <p>
          <Link href="/advertise">View packages and pricing &rarr;</Link>
        </p>
      </section>

      <section>
        <h2>Existing Advertisers</h2>
        <p>
          Need to update your listing, renew, or make changes? <Link href="/contact">Contact us</Link> and
          we&rsquo;ll take care of it.
        </p>
      </section>
    </main>
  );
}
