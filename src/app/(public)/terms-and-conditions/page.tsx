import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/public-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Events4Singles terms and conditions — conditions for using this directory and its content.",
};

export default function TermsPage() {
  return (
    <InfoPage>
      <h1>Terms &amp; Conditions</h1>
      <p className="e4s-lead">
        By accessing or using Events4Singles you agree to be bound by these terms. Please read
        them carefully before using the site.
      </p>

      <section>
        <h2>Access and Use</h2>
        <p>
          Events4Singles grants you a limited, non-exclusive licence to access and use this site
          for personal, non-commercial purposes. You may not copy, reproduce, republish, upload,
          post, transmit or distribute any content from this site without prior written permission.
        </p>
        <p>
          You agree not to use this site in any way that may damage, disable, overburden or impair
          any server, or interfere with any other party's use of the site. You agree not to attempt
          to gain unauthorised access to any part of the site or its related systems.
        </p>
      </section>

      <section>
        <h2>Directory Listings</h2>
        <p>
          Events4Singles is an independent directory. We do not endorse, guarantee, or take
          responsibility for any event, service, or business listed on this site. Listing
          information — dates, prices, contact details — is provided by advertisers and may
          change without notice.
        </p>
        <p>
          Always verify details directly with the event organiser before attending or making
          a booking. Events4Singles accepts no liability for outdated, incorrect or misleading
          information provided by advertisers.
        </p>
      </section>

      <section>
        <h2>Advertiser Obligations</h2>
        <p>
          Advertisers are responsible for the accuracy and legality of all content they submit.
          Listings must represent genuine, lawfully operating businesses or events. You warrant
          that any content you provide does not infringe the intellectual property, privacy or
          other rights of any third party.
        </p>
        <p>
          Events4Singles reserves the right to edit, refuse, suspend or remove any listing at
          its sole discretion, including listings that are misleading, inappropriate, illegal
          or in breach of these terms. No refund is payable where a listing is removed for
          breach of these terms.
        </p>
      </section>

      <section>
        <h2>Advertising and Placement</h2>
        <p>
          Paid advertising placements are subject to availability and may be repositioned at
          Events4Singles' discretion to maintain site quality. Events4Singles reserves the right
          to reject any advertising submission that it considers inappropriate or contrary to
          the interests of the site or its users.
        </p>
        <p>
          Fees are charged in advance and are non-refundable unless Events4Singles is unable to
          provide the agreed placement. Pricing is subject to change; changes will not affect
          existing paid subscription periods.
        </p>
      </section>

      <section>
        <h2>Third-Party Links and Content</h2>
        <p>
          This site contains links to third-party websites operated by advertisers and other
          organisations. These links are provided for convenience only. Events4Singles does not
          control, endorse or take responsibility for the content, privacy practices, or terms
          of any linked site. Access to third-party sites is at your own risk.
        </p>
      </section>

      <section>
        <h2>Disclaimer and Limitation of Liability</h2>
        <p>
          This site is provided on an "as is" basis. To the extent permitted by law, Events4Singles
          makes no warranties, express or implied, regarding the accuracy, reliability, completeness
          or fitness for purpose of any content on this site.
        </p>
        <p>
          To the maximum extent permitted by applicable law, Events4Singles and its operators
          will not be liable for any direct, indirect, incidental, special, or consequential
          loss or damage arising out of your use of, or inability to use, this site or any
          content on it — including but not limited to loss of revenue, loss of data, or loss
          arising from reliance on any listing.
        </p>
      </section>

      <section>
        <h2>Indemnity</h2>
        <p>
          You indemnify Events4Singles and its operators against all claims, actions, proceedings,
          costs and damages arising from your use of this site, your breach of these terms, or
          your infringement of any third party's rights.
        </p>
      </section>

      <section>
        <h2>Copyright</h2>
        <p>
          All content on Events4Singles — including text, design, structure, code and editorial
          material — is copyright Events4Singles 2001–{new Date().getFullYear()}. Advertiser
          names, logos and images remain the property of their respective owners.
        </p>
        <p>
          Unauthorised reproduction or use of Events4Singles content is prohibited and may give
          rise to legal action.
        </p>
      </section>

      <section>
        <h2>Termination</h2>
        <p>
          Events4Singles may terminate or suspend access to any user or advertiser account at
          any time without notice for conduct that it believes breaches these terms or is harmful
          to other users, advertisers or third parties.
        </p>
      </section>

      <section>
        <h2>Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. The current version will always be
          published on this page. Continued use of the site after any update constitutes
          acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of New South Wales, Australia. You agree to
          submit to the exclusive jurisdiction of the courts of New South Wales for any
          dispute arising under these terms.
        </p>
      </section>

      <p className="e4s-terms-version">
        Last updated {new Date().getFullYear()}. Events4Singles has operated under continuous
        terms since 2001.{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>
      </p>
    </InfoPage>
  );
}
