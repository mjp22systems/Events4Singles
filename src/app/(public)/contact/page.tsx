import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Events4Singles",
  description: "Get in touch with Events4Singles for advertising enquiries, listing corrections, event submissions, or general questions.",
};

export default function ContactPage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <div className="e4s-contact-header">
        <h1>Contact Us</h1>
        <p className="e4s-lead">
          Questions, listing corrections, advertising enquiries, or anything else —
          fill in the form and we&rsquo;ll be back in touch within 1 business day.
        </p>
      </div>

      <div className="e4s-contact-layout">
        <div className="e4s-contact-layout__form">
          <ContactForm />
        </div>

        <aside className="e4s-contact-layout__sidebar">
          <div className="e4s-contact-card">
            <h3>Enquiry types</h3>
            <ul>
              <li>
                <strong>Advertising / New Listing</strong>
                <span>List your event, service, or singles business.</span>
              </li>
              <li>
                <strong>Listing Correction</strong>
                <span>Wrong phone, closed business, outdated info.</span>
              </li>
              <li>
                <strong>Event Submission</strong>
                <span>Submit a one-off event for the calendar.</span>
              </li>
              <li>
                <strong>Partnership or Media</strong>
                <span>Press, affiliates, or commercial partnerships.</span>
              </li>
              <li>
                <strong>General Enquiry</strong>
                <span>Anything else — we&rsquo;re happy to help.</span>
              </li>
            </ul>
          </div>

          <div className="e4s-contact-card e4s-contact-card--muted">
            <h3>About listed businesses</h3>
            <p>
              Events4Singles is a directory only. For questions about a specific
              event or business, please contact them directly via their
              listing page.
            </p>
            <p>
              To advertise with us, see our{" "}
              <Link href="/advertise">advertising packages</Link>.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
