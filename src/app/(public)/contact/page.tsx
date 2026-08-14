import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Events4Singles for advertising enquiries, listing corrections, or general questions.",
};

export default function ContactPage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Contact Us</h1>
      <p className="e4s-lead">
        We&rsquo;re here to help with advertising enquiries, listing corrections, and general questions.
        A contact form is coming shortly — in the meantime, reach us by email below.
      </p>

      <section>
        <h2>Advertising &amp; Listings</h2>
        <p>
          To list your singles event, service or business, or to update an existing listing —
          see our <Link href="/advertise">advertising page</Link> for package details, then
          visit the <Link href="/portal">advertiser portal</Link> to enquire.
        </p>
      </section>

      <section>
        <h2>General Enquiries</h2>
        <p>
          For listing corrections, feedback, or anything else — use the button below.
          We aim to respond within 1 business day.
        </p>
        <p>
          <a href="mailto:info@events4singles.com" className="e4s-contact-btn">
            Send us a message
          </a>
        </p>
      </section>

      <section>
        <h2>Note on Listed Businesses</h2>
        <p>
          Events4Singles is a directory only. If you have a specific enquiry about an event,
          speed dating night, or introduction agency, please contact that business directly
          via their listing page.
        </p>
      </section>
    </main>
  );
}
