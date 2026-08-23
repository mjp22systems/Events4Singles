"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PLACEMENTS = [
  {
    id: "listing",
    eyebrow: "Directory",
    title: "Standard listing",
    price: "$0 launch listing",
    summary: "Get a real business profile into the city and category pages people browse.",
    outcome: "Best first step for migrated businesses, new event organisers and local services.",
    reach: "City + category pages",
  },
  {
    id: "featured",
    eyebrow: "Priority",
    title: "Featured listing",
    price: "from $39/mo",
    summary: "Move above standard listings and present your offer with stronger visual weight.",
    outcome: "Best when your category is competitive or you want more direct enquiries.",
    reach: "Selected page scopes",
  },
  {
    id: "banners",
    eyebrow: "Display",
    title: "Banner and sidebar ads",
    price: "from $69/mo",
    summary: "Run visual ads above listing rows or beside city/category navigation.",
    outcome: "Best for campaigns, seasonal promotions and recognisable brands.",
    reach: "Exact city/category scopes",
  },
  {
    id: "events",
    eyebrow: "What's On",
    title: "Promoted events",
    price: "from $29/event",
    summary: "Push dated events into list, calendar and promoted event row positions.",
    outcome: "Best for ticketed nights, recurring meetups, dinners, walks and dance events.",
    reach: "Events list + calendar",
  },
  {
    id: "home",
    eyebrow: "Homepage",
    title: "Homepage feature",
    price: "from $99/mo",
    summary: "Use homepage tiles or featured business cards for broader discovery.",
    outcome: "Best for premium organisers and multi-city services.",
    reach: "Homepage discovery sections",
  },
];

const PACKAGES = [
  {
    title: "Launch Listing",
    price: "$0",
    label: "Build supply",
    items: ["Claim or add a listing", "One city and category", "Contact details", "Manual approval"],
  },
  {
    title: "Growth Listing",
    price: "from $39/mo",
    label: "Local visibility",
    items: ["Featured listing option", "Extra placements", "Promo field", "Basic analytics"],
    featured: true,
  },
  {
    title: "Event Promoter",
    price: "from $29/event",
    label: "Dated events",
    items: ["What's On listing", "Calendar visibility", "Booking link", "Promoted row option"],
  },
  {
    title: "Campaign",
    price: "from $149/mo",
    label: "Display reach",
    items: ["Banner/sidebar option", "Homepage eligibility", "Multi-page scope", "Simple creative setup"],
  },
];

const ADDONS = [
  ["Extra city/category", "from $15/mo"],
  ["Priority position", "from $49/mo"],
  ["Page-top banner", "from $79/mo"],
  ["Sidebar advert", "from $69/mo"],
  ["Homepage tile", "from $99/mo"],
  ["Promoted event row", "from $149/mo"],
];

function PlacementPreview({ active }: { active: string }) {
  if (active === "banners") {
    return (
      <div className="e4s-adx-preview e4s-adx-preview--banners">
        <div className="e4s-adx-banner-strip">
          <span>Speed Dating</span>
          <span>Dinner Nights</span>
          <span>Your Ad Here</span>
          <span>Singles Travel</span>
        </div>
        <div className="e4s-adx-page-demo">
          <div>
            <strong>Speed Dating Sydney</strong>
            <p>Listings and page copy sit below sponsored banner inventory.</p>
          </div>
          <aside>Right column advert</aside>
        </div>
      </div>
    );
  }

  if (active === "events") {
    return (
      <div className="e4s-adx-preview e4s-adx-preview--events">
        <div className="e4s-adx-event-row">
          <span>Promoted</span>
          <article>
            <em>Fri 18 Sep</em>
            <strong>Singles Dinner Night</strong>
            <p>Melbourne CBD - From $79</p>
          </article>
          <article>
            <em>Sat 19 Sep</em>
            <strong>Harbour Walk</strong>
            <p>Sydney - Free RSVP</p>
          </article>
        </div>
        <div className="e4s-adx-calendar-mini">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={i === 4 || i === 9 ? "is-active" : undefined}>{i + 1}</span>
          ))}
        </div>
      </div>
    );
  }

  if (active === "home") {
    return (
      <div className="e4s-adx-preview e4s-adx-preview--home">
        <div className="e4s-adx-home-tile">
          <Image
            src="/images/home-exp-dinner-parties.jpg"
            alt=""
            fill
            sizes="(max-width: 1080px) 100vw, 430px"
            loading="eager"
          />
          <div>
            <span>Homepage feature</span>
            <strong>Table for Six Melbourne</strong>
            <p>Image-led promotion in the homepage discovery flow.</p>
          </div>
        </div>
        <div className="e4s-adx-home-sponsor">
          <Image src="/images/home-city-sydney.jpg" alt="" fill sizes="160px" loading="eager" />
          <strong>Sponsored city/category tile</strong>
        </div>
      </div>
    );
  }

  const featured = active === "featured";
  return (
    <div className={`e4s-adx-preview e4s-adx-preview--listing${featured ? " is-featured" : ""}`}>
      <div className="e4s-adx-list-rank">{featured ? "1" : "Live"}</div>
      <div className="e4s-adx-listing-card">
        <span className="e4s-adx-listing-image">
          <Image
            src={featured ? "/images/home-cat-dinner-parties.jpg" : "/images/home-cat-dance-classes.jpg"}
            alt=""
            fill
            sizes="132px"
            loading="eager"
          />
        </span>
        <div>
          <span>{featured ? "Featured listing" : "Standard listing"}</span>
          <strong>{featured ? "Harbour Social Singles" : "Brisbane Salsa Nights"}</strong>
          <p>{featured ? "Priority placement, richer presence and promo field." : "Clean directory card with contact actions and city/category badges."}</p>
          <div>
            <em>Sydney</em>
            <em>{featured ? "Dinner parties" : "Dance classes"}</em>
            <em>Website</em>
          </div>
        </div>
      </div>
      <div className="e4s-adx-listing-stack">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function AdvertiseExperience() {
  const [activeId, setActiveId] = useState(PLACEMENTS[1].id);
  const active = useMemo(
    () => PLACEMENTS.find((placement) => placement.id === activeId) ?? PLACEMENTS[1],
    [activeId],
  );

  return (
    <main className="e4s-advertise-page e4s-adx" id="site-content">
      <section className="e4s-adx-hero">
        <div className="e4s-adx-hero__copy">
          <p className="e4s-kicker">Advertise with Events4Singles</p>
          <h1>Get listed for free. Buy the positions that actually move attention.</h1>
          <p>
            Events4Singles is being rebuilt as a practical Australian directory:
            city pages, category pages, What&apos;s On events, homepage discovery,
            and paid positions for organisers who want more visibility.
          </p>
          <div className="e4s-adx-actions">
            <Link href="/portal">Start free listing</Link>
            <Link href="#placements">Compare placements</Link>
            <Link href="/contact">Talk campaign</Link>
          </div>
        </div>
        <div className="e4s-adx-hero__showcase">
          <PlacementPreview active={activeId} />
          <div className="e4s-adx-live-card">
            <span>{active.eyebrow}</span>
            <strong>{active.title}</strong>
            <p>{active.summary}</p>
          </div>
        </div>
      </section>

      <section className="e4s-adx-partner">
        <strong>Launch partner approach</strong>
        <span>Free standard listings build the directory. Paid upgrades stay optional and tied to scarce visibility.</span>
      </section>

      <section className="e4s-adx-section" id="placements">
        <div className="e4s-adx-section__head">
          <p className="e4s-kicker">Placement Builder</p>
          <h2>Choose the surface, see the position.</h2>
          <p>Click through the products. The preview changes because these are different advertising surfaces, not one generic plan.</p>
        </div>
        <div className="e4s-adx-placement-stage">
          <div className="e4s-adx-placement-tabs" role="tablist" aria-label="Advertising placements">
            {PLACEMENTS.map((placement) => (
              <button
                key={placement.id}
                type="button"
                className={placement.id === activeId ? "is-active" : undefined}
                onClick={() => setActiveId(placement.id)}
              >
                <span>{placement.eyebrow}</span>
                <strong>{placement.title}</strong>
                <em>{placement.price}</em>
              </button>
            ))}
          </div>
          <div className="e4s-adx-placement-preview">
            <PlacementPreview active={activeId} />
            <div className="e4s-adx-placement-copy">
              <span>{active.reach}</span>
              <h3>{active.title}</h3>
              <p>{active.outcome}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="e4s-adx-surface-map">
        <div>
          <p className="e4s-kicker">Inventory Map</p>
          <h2>Advertisers buy scope as much as format.</h2>
          <p>Local organisers can stay scoped to one city or category. Broader brands can bundle homepage, events and display inventory.</p>
        </div>
        <div className="e4s-adx-surface-grid">
          {["City pages", "Category pages", "City + category", "Homepage", "What's On", "Event pages"].map((surface) => (
            <span key={surface}>{surface}</span>
          ))}
        </div>
      </section>

      <section className="e4s-adx-section" id="pricing">
        <div className="e4s-adx-section__head">
          <p className="e4s-kicker">Launch Pricing</p>
          <h2>Entry should feel easy. Paid visibility should feel specific.</h2>
          <p>The pricing is deliberately softer than a mature media kit. The goal is to grow supply without giving away scarce positions.</p>
        </div>
        <div className="e4s-adx-packages">
          {PACKAGES.map((pkg) => (
            <article key={pkg.title} className={pkg.featured ? "is-featured" : undefined}>
              <span>{pkg.label}</span>
              <h3>{pkg.title}</h3>
              <strong>{pkg.price}</strong>
              <ul>
                {pkg.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="e4s-adx-bundles">
        <div className="e4s-adx-bundle-card">
          <p className="e4s-kicker">Recommended bundles</p>
          <h2>Sell by advertiser type.</h2>
          <div>
            <span>Event organiser: listing + What&apos;s On + promoted row</span>
            <span>Venue: listing + city page banner + sidebar</span>
            <span>National service: category pages + homepage tile</span>
          </div>
        </div>
        <dl>
          {ADDONS.map(([label, price]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{price}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="e4s-adx-creative">
        <div className="e4s-adx-creative-media">
          <Image src="/images/home-cat-speed-dating.jpg" alt="" fill sizes="(max-width: 1080px) 100vw, 520px" loading="eager" />
        </div>
        <div>
          <p className="e4s-kicker">Creative Help</p>
          <h2>Small advertisers need help looking credible.</h2>
          <p>
            Include simple creative setup for paid launch advertisers: clean logo
            placement, image cropping, banner/tile adaptation and copy cleanup.
            Charge only for custom campaigns or repeated design revisions.
          </p>
          <Link href="/contact">Get placement advice</Link>
        </div>
      </section>

      <section className="e4s-adx-final">
        <div>
          <h2>Launch with control.</h2>
          <p>All ads, events and listings stay subject to approval. Sponsored placements should be labelled. Advertisers remain responsible for dates, prices and booking links.</p>
        </div>
        <Link href="/portal">Start free listing</Link>
      </section>
    </main>
  );
}
