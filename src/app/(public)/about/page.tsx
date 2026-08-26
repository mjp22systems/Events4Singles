import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/public-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Events4Singles",
  description: "Australia's longest-running singles events directory — connecting singles with speed dating, dinner parties, dance classes, social clubs and more since 2001.",
  path: "/about",
  keywords: ["about Events4Singles", "Australian singles directory", "singles events since 2001"],
});

export default function AboutPage() {
  return (
    <InfoPage>
      <h1>About Events4Singles</h1>
      <p className="e4s-lead">
        Australia&apos;s longest-running singles events directory, helping singles find
        genuine connection through real-world events since 2001.
      </p>

      <section>
        <h2>What We Do</h2>
        <p>
          Events4Singles is an independent directory of singles events across Australia&apos;s
          major cities — Sydney, Melbourne, Brisbane, Perth, Adelaide, Gold Coast and Canberra.
          We list speed dating nights, dinner parties, dance classes, social clubs, life coaching
          services and introduction agencies.
        </p>
        <p>
          Unlike dating apps, every listing on Events4Singles is a real business or organisation
          running face-to-face events. We&apos;re not an event organiser ourselves — we&apos;re the
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
          The platform you&apos;re using now is a complete rebuild — faster, mobile-friendly, and
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
          <Link href="/advertise">View advertising packages →</Link>
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions, corrections, or advertising enquiries — see our <Link href="/contact">contact page</Link>.
        </p>
      </section>
    </InfoPage>
  );
}
