import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Events4Singles collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Privacy Policy</h1>
      <p className="e4s-lead">
        Events4Singles is committed to protecting the privacy of visitors and advertisers.
        This policy explains how we collect and handle personal information.
      </p>

      <section>
        <h2>Our Promise</h2>
        <p>Events4Singles has operated since 2001 on a simple commitment:</p>
        <ul>
          <li>Your personal information will <strong>never</strong> be sold, bartered, traded or given away to anyone.</li>
          <li>We do not supply your details to mailing lists or use them for any purpose other than the one you provided them for.</li>
          <li>We are strongly opposed to spam and unsolicited commercial email. We will never send it, and we will never enable others to do so.</li>
        </ul>
        <p>This is not just a legal requirement — it is a commitment we have upheld for over 20 years.</p>
      </section>

      <section>
        <h2>What Information We Collect</h2>
        <p>
          As a visitor browsing the directory, we do not collect personal information beyond
          standard web server logs (IP address, browser type, pages visited). These logs are
          used solely for site analytics and security and are not associated with individual identities.
        </p>
        <p>
          If you contact us via email or an enquiry form, we collect the information you provide
          (name, email address, message content) in order to respond to your enquiry.
        </p>
        <p>
          Advertisers who create an account provide business and contact information to enable
          their listing and billing. This includes business name, contact name, email address,
          phone number and payment details (processed securely — we do not store card numbers).
        </p>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <p>Personal information is used only for the purpose for which it was collected:</p>
        <ul>
          <li>To respond to your enquiry or support request</li>
          <li>To set up and manage your advertiser listing</li>
          <li>To process payments for advertising packages</li>
          <li>To send account-related communications (invoices, renewal reminders)</li>
          <li>To improve the site based on aggregate, anonymised usage data</li>
        </ul>
        <p>We do not use your personal information for unsolicited marketing without your consent.</p>
      </section>

      <section>
        <h2>Sharing of Information</h2>
        <p>
          Events4Singles does not sell, trade, rent or transfer your personal information to
          third parties, except where required to provide the service (for example, payment
          processors) or where required by law.
        </p>
        <p>
          Advertiser listing details — business name, phone number, website, and listing
          description — are publicly displayed on the site as the advertiser has submitted them.
          Advertisers are responsible for ensuring that any information they submit for publication
          is accurate and does not breach any privacy obligations.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Events4Singles may use cookies to maintain session state and measure site traffic.
          No personally identifying information is stored in cookies. You can configure your
          browser to reject cookies, though this may affect site functionality.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We take reasonable steps to protect personal information from misuse, loss,
          unauthorised access, modification or disclosure. However, no method of internet
          transmission is completely secure and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>Access and Correction</h2>
        <p>
          You have the right to access personal information we hold about you and to request
          corrections. To make a request, contact us at{" "}
          <a href="mailto:info@events4singles.com">info@events4singles.com</a>.
        </p>
      </section>

      <section>
        <h2>Third-Party Links</h2>
        <p>
          This site contains links to advertiser and external websites. We are not responsible
          for the privacy practices of those sites. We recommend reviewing the privacy policy
          of any external site you visit.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. The current version will always be
          published on this page. Continued use of Events4Singles after any update constitutes
          acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Privacy enquiries can be directed to{" "}
          <a href="mailto:info@events4singles.com">info@events4singles.com</a>.
        </p>
      </section>

      <p className="e4s-terms-version">
        Events4Singles has operated in Australia since 2001 and is subject to the
        Australian Privacy Act 1988 (Cth).{" "}
        <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
      </p>
    </main>
  );
}
