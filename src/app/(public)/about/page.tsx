import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Events4Singles",
  description: "Australia's longest-running singles events directory — connecting singles with speed dating, dinner parties, dance classes, social clubs and more since 2001.",
};

export default function AboutPage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>About Events4Singles</h1>
      <p className="e4s-lead">
        Australia's longest-running singles events directory, helping singles find
        genuine connection through real-world events since 2001.
      </p>

      <section>
        <h2>What We Do</h2>
        <p>
          Events4Singles is an independent directory of singles events across Australia's
          major cities — Sydney, Melbourne, Brisbane, Perth, Adelaide, Gold Coast and Canberra.
          We list speed dating nights, dinner parties, dance classes, social clubs, life coaching
          services and introduction agencies.
        </p>
        <p>
          Unlike dating apps, every listing on Events4Singles is a real business or organisation
          running face-to-face events. We're not an event organiser ourselves — we're the
          directory that helps you find them.
        </p>
      </section>

      <section>
        <h2>Our History</h2>
        <p>
          Events4Singles launched in 2001 as a simple resource for Sydney singles. Over two
          decades it grew into a national directory covering all major Australian cities, with
          thousands of listings and a loyal audience of singles looking for something more than
          swiping on a screen.
        </p>
        <p>
          The platform you're using now is a complete rebuild — faster, mobile-friendly, and
          designed to serve both singles and event organisers better than ever.
        </p>
      </section>

      <section>
        <h2>For Event Organisers</h2>
        <p>
          Want to list your singles event or service? We offer affordable advertising packages
          starting from $39/month, with options for enhanced placement, banner advertising and
          events calendar listings.
        </p>
        <p>
          <a href="/advertise">View advertising packages →</a>
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions, corrections, or advertising enquiries — see our <a href="/contact">contact page</a>.
        </p>
      </section>
    </main>
  );
}
