import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Events4Singles terms of use — conditions for using this directory and its content.",
};

export default function TermsPage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Terms of Use</h1>
      <p className="e4s-lead">By using Events4Singles you agree to the following terms.</p>

      <section>
        <h2>Directory listings</h2>
        <p>
          Events4Singles is an independent directory. We do not endorse, guarantee, or take
          responsibility for any event, service, or business listed on this site. Always
          verify details directly with the event organiser before attending or booking.
        </p>
      </section>

      <section>
        <h2>Accuracy of information</h2>
        <p>
          Listing details — dates, prices, contact information — are provided by advertisers
          and may change without notice. Events4Singles does not guarantee accuracy and
          accepts no liability for outdated or incorrect information.
        </p>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>
          Events4Singles does not sell, trade, or transfer your email address or personal
          information to third parties. Contact forms and enquiry emails are used solely to
          respond to your request.
        </p>
      </section>

      <section>
        <h2>Advertiser obligations</h2>
        <p>
          Advertisers are responsible for keeping their listing information accurate and
          up to date. Listings must represent genuine, legal businesses or events. Events4Singles
          reserves the right to remove any listing that is misleading, inappropriate, or in
          breach of these terms.
        </p>
      </section>

      <section>
        <h2>Copyright</h2>
        <p>
          All content on Events4Singles — text, design, code — is copyright Events4Singles
          2001–{new Date().getFullYear()}. Advertiser logos and images remain the property
          of their respective owners.
        </p>
      </section>

      <section>
        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site constitutes
          acceptance of any changes.
        </p>
      </section>
    </main>
  );
}
