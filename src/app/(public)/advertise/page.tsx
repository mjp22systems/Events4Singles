import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Advertise with Events4Singles",
  description:
    "Advertise singles events, services and venues on Events4Singles. Start with a free listing during launch, then add featured placements, banners and event promotion.",
  path: "/advertise",
  keywords: [
    "advertise singles events",
    "list singles event",
    "promote dating services Australia",
    "singles event advertising",
  ],
});

const GOALS = [
  {
    title: "Get listed",
    text: "Add or claim a basic business listing so people can find you by city and category.",
    tag: "Launch free",
  },
  {
    title: "Stand out locally",
    text: "Upgrade to featured or priority placement on the pages most relevant to your audience.",
    tag: "From $39/mo",
  },
  {
    title: "Promote an event",
    text: "Put dated events into What's On, with optional promoted event positions.",
    tag: "From $29/event",
  },
  {
    title: "Run a campaign",
    text: "Use banners, sidebar ads, homepage tiles and multi-city placements for broader reach.",
    tag: "Quote or bundle",
  },
];

const INVENTORY = [
  {
    title: "Standard listing",
    text: "Business profile, description, image or logo, city/category placement, contact actions and website link.",
    visual: "listing",
  },
  {
    title: "Featured listing",
    text: "A stronger listing treatment that appears above standard listings in selected city or category pages.",
    visual: "featured",
  },
  {
    title: "Priority page position",
    text: "Limited top-of-list placement for a scoped page such as Speed Dating Sydney or Social Clubs Brisbane.",
    visual: "priority",
  },
  {
    title: "Page-top banner tiles",
    text: "Visual ad tiles above the listing stack, sold by exact city, category or category plus city page scope.",
    visual: "banner",
  },
  {
    title: "Right column advert",
    text: "A persistent desktop ad beside browse navigation, with a mobile inline sponsored treatment.",
    visual: "sidebar",
  },
  {
    title: "Homepage featured",
    text: "Featured business cards or sponsored tiles in the homepage discovery flow.",
    visual: "home",
  },
  {
    title: "What's On event",
    text: "Promote dated events in list and calendar views with clear event details and booking links.",
    visual: "event",
  },
  {
    title: "Promoted event row",
    text: "Paid event positions in a second row on event pages, with scoped or broad exposure options.",
    visual: "eventRow",
  },
];

const PLANS = [
  {
    name: "Launch Listing",
    price: "$0",
    note: "Best for filling out the rebuilt directory.",
    items: [
      "Claim or add one standard listing",
      "One primary city and category",
      "Website and contact details",
      "Manual approval before publishing",
    ],
    cta: "Start free",
    href: "/portal",
  },
  {
    name: "Growth Listing",
    price: "from $39/mo",
    note: "Best for organisers who want local visibility.",
    items: [
      "Featured listing option",
      "Extra city/category placements",
      "Promo or offer field",
      "Basic analytics when available",
    ],
    cta: "Create listing",
    href: "/portal",
    featured: true,
  },
  {
    name: "Event Promoter",
    price: "from $29/event",
    note: "Best for dated events and recurring nights.",
    items: [
      "What's On event listing",
      "Calendar visibility",
      "Booking link and event image",
      "Promoted row options",
    ],
    cta: "Submit event",
    href: "/portal/events",
  },
  {
    name: "Campaign",
    price: "from $149/mo",
    note: "Best for banners, homepage and multi-page exposure.",
    items: [
      "Page-top banner or sidebar ad",
      "Homepage featured option",
      "Multi-city or category coverage",
      "Simple creative setup included",
    ],
    cta: "Plan campaign",
    href: "/contact",
  },
];

const ADD_ONS = [
  ["Extra city or category", "from $15/mo"],
  ["Priority listing position", "from $49/mo"],
  ["Page-top banner tile", "from $79/mo"],
  ["Right column advert", "from $69/mo"],
  ["Homepage sponsored tile", "from $99/mo"],
  ["Promoted event row", "from $149/mo"],
];

function MiniListing({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`e4s-ad-v2-mini-listing${featured ? " e4s-ad-v2-mini-listing--featured" : ""}`}>
      <div className="e4s-ad-v2-mini-listing__media">
        <span>{featured ? "Featured" : "Logo"}</span>
      </div>
      <div className="e4s-ad-v2-mini-listing__copy">
        <strong>{featured ? "Harbour Social Singles" : "Brisbane Salsa Nights"}</strong>
        <p>{featured ? "Featured dinner events and mixers" : "Weekly beginner-friendly dance nights"}</p>
        <div>
          <span>Sydney</span>
          <span>{featured ? "Dinner parties" : "Dance classes"}</span>
        </div>
      </div>
    </div>
  );
}

function InventoryVisual({ type }: { type: string }) {
  if (type === "listing") return <MiniListing />;
  if (type === "featured") return <MiniListing featured />;

  if (type === "priority") {
    return (
      <div className="e4s-ad-v2-priority">
        <div className="e4s-ad-v2-priority__rank">1</div>
        <MiniListing featured />
        <span>Top position on selected page</span>
      </div>
    );
  }

  if (type === "banner") {
    return (
      <div className="e4s-ad-v2-banner-row">
        {["Speed Dating", "Dinner", "Travel", "Dance", "Your Ad", "Social"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    );
  }

  if (type === "sidebar") {
    return (
      <div className="e4s-ad-v2-sidebar-demo">
        <div>
          <span>Browse by city</span>
          <span>Sydney</span>
          <span>Melbourne</span>
          <span>Brisbane</span>
        </div>
        <aside>Advertise here</aside>
      </div>
    );
  }

  if (type === "home") {
    return (
      <div className="e4s-ad-v2-home-demo">
        <span>Homepage feature</span>
        <strong>Table for Six Melbourne</strong>
        <p>Sponsored tile or featured listing card.</p>
      </div>
    );
  }

  if (type === "event") {
    return (
      <div className="e4s-ad-v2-event-card">
        <span>Fri 18 Sep</span>
        <strong>Singles Dinner Night</strong>
        <p>Melbourne CBD - From $79</p>
        <em>What's On</em>
      </div>
    );
  }

  return (
    <div className="e4s-ad-v2-event-row">
      <span>Promoted</span>
      <span>Speed dating</span>
      <span>Dinner event</span>
      <span>Singles walk</span>
    </div>
  );
}

export default function AdvertisePage() {
  return (
    <main className="e4s-advertise-page e4s-advertise-v2" id="site-content">
      <section className="e4s-ad-v2-hero">
        <div className="e4s-ad-v2-hero__copy">
          <p className="e4s-kicker">Advertise with Events4Singles</p>
          <h1>Free to be listed. Paid to stand out.</h1>
          <p className="e4s-lead">
            Reach Australian singles browsing by city, category and event date.
            Start with a launch listing, then add featured placement, banners,
            homepage promotion or What&apos;s On event exposure when you need more visibility.
          </p>
          <div className="e4s-ad-v2-hero__actions">
            <Link href="/portal">Start free listing</Link>
            <Link href="#pricing">View launch pricing</Link>
            <Link href="/contact">Plan a campaign</Link>
          </div>
        </div>
        <div className="e4s-ad-v2-hero__panel" aria-label="Advertising placement preview">
          <div className="e4s-ad-v2-browser">
            <div className="e4s-ad-v2-browser__bar">
              <span />
              <span />
              <span />
            </div>
            <div className="e4s-ad-v2-browser__banners">
              <span>Featured</span>
              <span>Events</span>
              <span>Your ad</span>
            </div>
            <MiniListing featured />
            <div className="e4s-ad-v2-browser__events">
              <span>What&apos;s On</span>
              <strong>Promoted event row</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="e4s-ad-v2-section">
        <div className="e4s-ad-v2-section__head">
          <p className="e4s-kicker">Choose By Goal</p>
          <h2>Pick the visibility you need now.</h2>
          <p>
            The launch offer keeps basic listings low-friction. Paid products
            are for businesses that want better position, more surfaces or campaign support.
          </p>
        </div>
        <div className="e4s-ad-v2-goals">
          {GOALS.map((goal) => (
            <article key={goal.title}>
              <span>{goal.tag}</span>
              <h3>{goal.title}</h3>
              <p>{goal.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="e4s-ad-v2-section">
        <div className="e4s-ad-v2-section__head">
          <p className="e4s-kicker">Advertising Inventory</p>
          <h2>Every place advertisers can appear.</h2>
          <p>
            Listings, event promotions and display advertising are separate
            products. This keeps free directory growth simple while preserving
            paid value for scarce positions.
          </p>
        </div>
        <div className="e4s-ad-v2-inventory">
          {INVENTORY.map((item) => (
            <article key={item.title}>
              <InventoryVisual type={item.visual} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="e4s-ad-v2-placement">
        <div>
          <p className="e4s-kicker">Placement Logic</p>
          <h2>Sell the page scope, not just the ad format.</h2>
          <p>
            A business can be listed in one or many city/category combinations.
            Display ads are sold against exact page scopes so a local organiser
            can buy relevant exposure without paying for national reach they do not need.
          </p>
        </div>
        <div className="e4s-ad-v2-matrix" aria-label="Advertising placement matrix">
          <span>Surface</span>
          <span>City</span>
          <span>Category</span>
          <span>Home</span>
          <span>Events</span>
          <strong>Listing</strong>
          <em>Yes</em>
          <em>Yes</em>
          <em>Feature</em>
          <em>No</em>
          <strong>Banner</strong>
          <em>Yes</em>
          <em>Yes</em>
          <em>Tile</em>
          <em>No</em>
          <strong>Event promo</strong>
          <em>Scoped</em>
          <em>Scoped</em>
          <em>Optional</em>
          <em>Yes</em>
        </div>
      </section>

      <section className="e4s-ad-v2-section" id="pricing">
        <div className="e4s-ad-v2-section__head">
          <p className="e4s-kicker">Launch Pricing</p>
          <h2>Start free, upgrade when visibility matters.</h2>
          <p>
            These are launch-friendly packages. Final commercial terms can be
            adjusted as traffic, event supply and advertiser demand become clearer.
          </p>
        </div>
        <div className="e4s-ad-v2-plans">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={plan.featured ? "e4s-ad-v2-plan e4s-ad-v2-plan--featured" : "e4s-ad-v2-plan"}
            >
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <p>{plan.note}</p>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={plan.href}>{plan.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="e4s-ad-v2-addons">
        <div>
          <p className="e4s-kicker">Add-ons</p>
          <h2>Bundle only what the advertiser needs.</h2>
          <p>
            Keep the entry point simple, then add scarce placements for organisers
            who want priority, wider coverage or campaign support.
          </p>
        </div>
        <dl>
          {ADD_ONS.map(([name, price]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{price}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="e4s-ad-v2-how">
        <div className="e4s-ad-v2-section__head">
          <p className="e4s-kicker">How It Works</p>
          <h2>Simple enough for small organisers. Controlled enough for launch quality.</h2>
        </div>
        <ol>
          <li>
            <strong>Create or claim</strong>
            <span>Add your business or claim an existing migrated listing.</span>
          </li>
          <li>
            <strong>Choose placements</strong>
            <span>Select city, category, events, banners or homepage options.</span>
          </li>
          <li>
            <strong>Submit assets</strong>
            <span>Send listing copy, event details, logo, images or booking links.</span>
          </li>
          <li>
            <strong>Review and publish</strong>
            <span>Events4Singles checks the details before ads go live.</span>
          </li>
        </ol>
      </section>

      <section className="e4s-ad-v2-policy">
        <div>
          <h2>Launch notes</h2>
          <p>
            All ads, listings and events are subject to approval. Sponsored
            placements are labelled where appropriate. Advertisers are responsible
            for accurate prices, dates and booking links.
          </p>
        </div>
        <Link href="/contact">Ask about advertising</Link>
      </section>
    </main>
  );
}
