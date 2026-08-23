"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";

type ZoneId = "banner" | "priority" | "featured" | "standard" | "sidebar" | "whatson" | "tile";
type PlacementId = "standard" | "featured" | "banners" | "whatson" | "homepage";

const ZONE_COPY: Record<ZoneId, { title: string; body: string; price: string }> = {
  banner: { title: "Page-top banner strip", body: "A sponsored strip above results on city, category or city/category pages.", price: "from $79/mo" },
  priority: { title: "Sticky/priority listing position", body: "Pinned position one above the normal listing order on selected city or category pages.", price: "from $49/mo" },
  featured: { title: "Featured listing", body: "Bigger card, badge, richer content and lift above standard results.", price: "from $39/mo" },
  standard: { title: "Standard listing", body: "The free profile every organiser, venue or singles service can start with.", price: "$0" },
  sidebar: { title: "Right column advert", body: "A labelled ad beside city and category browsing on desktop, inline on mobile.", price: "from $69/mo" },
  whatson: { title: "What's On calendar", body: "Dated event exposure for people browsing by city, date and category.", price: "from $29/event" },
  tile: { title: "Homepage featured listing or tile", body: "Homepage discovery slots for broader awareness, including featured listing cards and sponsored tiles.", price: "from $99/mo" },
};

const PLACEMENTS: Array<{
  id: PlacementId;
  label: string;
  price: string;
  cadence: string;
  scope: string;
  reach: string;
  bestFor: string;
  bullets: string[];
}> = [
  {
    id: "standard",
    label: "Standard listing",
    price: "$0",
    cadence: "launch listing",
    scope: "One city and one category",
    reach: "Appears in normal listing order after approval.",
    bestFor: "New organisers and venues that need a credible profile before spending.",
    bullets: ["Name, description, image", "Website and contact links", "Manual approval"],
  },
  {
    id: "featured",
    label: "Featured listing",
    price: "from $39",
    cadence: "per month",
    scope: "Selected city/category pages",
    reach: "Lifted above standard results with a Featured badge.",
    bestFor: "Regular operators in competitive categories who need more attention.",
    bullets: ["Larger card", "Featured badge", "Sticky position add-on"],
  },
  {
    id: "banners",
    label: "Banner + sidebar ads",
    price: "from $69",
    cadence: "per month",
    scope: "Chosen city and/or category pages",
    reach: "Above-fold page-top banner or right-column display placement.",
    bestFor: "Venues, dating services and seasonal campaigns with recognisable offers.",
    bullets: ["Page-top strip", "Right column unit", "Sponsored label"],
  },
  {
    id: "whatson",
    label: "What's On events",
    price: "from $29",
    cadence: "per event",
    scope: "What's On calendar, list and event pages",
    reach: "High-intent browsers filtering by date, city and event type.",
    bestFor: "Ticketed nights, recurring meetups, walks, dinners and speed dating events.",
    bullets: ["Calendar/list visibility", "Booking link", "Second-row event pages"],
  },
  {
    id: "homepage",
    label: "Homepage features",
    price: "from $99",
    cadence: "per month",
    scope: "Homepage discovery sections",
    reach: "Broader site discovery outside a single city/category page.",
    bestFor: "Multi-city organisers, premium services and brands buying awareness.",
    bullets: ["Featured listing", "Sponsored tile", "Limited rotation"],
  },
];

const PACKAGES = [
  { title: "Launch Listing", price: "$0", cadence: "free", note: "Be findable today.", items: ["One listing", "One city/category", "Contact details", "Approval before live"], cta: "Start free listing", href: "/portal" },
  { title: "Growth Listing", price: "$39", cadence: "from / month", note: "Stand out where it matters.", items: ["Featured card", "Extra placements", "Promo field", "Basic analytics"], cta: "Choose Growth", href: "/contact", featured: true },
  { title: "Event Promoter", price: "$29", cadence: "from / event", note: "Sell a specific night out.", items: ["What's On listing", "Calendar visibility", "Booking link", "Second-row paid option"], cta: "Promote event", href: "/portal/events" },
  { title: "Campaign", price: "$149", cadence: "from / month", note: "Own attention across the network.", items: ["Banner/sidebar option", "Homepage eligibility", "Multi-page scope", "Creative setup"], cta: "Plan campaign", href: "/contact" },
];

const ADDONS = [
  ["Extra city/category", "from $15/mo", "Add reach one page at a time."],
  ["Sticky/priority position", "from $49/mo", "Pinned above standard results."],
  ["Page-top banner", "from $79/mo", "Sponsored strip above the listing area."],
  ["Sidebar advert", "from $69/mo", "Right column or mobile inline display unit."],
  ["Homepage tile", "from $99/mo", "National discovery surface."],
  ["Promoted event row", "from $149/mo", "Second row placement across event pages."],
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Tag({ children, tone = "mint" }: { children: ReactNode; tone?: "mint" | "berry" | "teal" | "plain" }) {
  return <span className={`e4s-love-tag e4s-love-tag--${tone}`}>{children}</span>;
}

function Thumb({ large = false }: { large?: boolean }) {
  return <span className={large ? "e4s-love-thumb e4s-love-thumb--large" : "e4s-love-thumb"}><span /></span>;
}

function StandardListing({ compact = false }: { compact?: boolean }) {
  return (
    <article className="e4s-love-listing">
      <Thumb />
      <div>
        <div className="e4s-love-row"><strong>Harbour Social Club</strong><Tag tone="plain">Listing</Tag></div>
        <p>Speed dating & mixers · Sydney CBD</p>
        {!compact && <div className="e4s-love-lines"><span /><span /></div>}
      </div>
    </article>
  );
}

function FeaturedListing() {
  return (
    <article className="e4s-love-listing e4s-love-listing--featured">
      <Thumb large />
      <div>
        <div className="e4s-love-row"><strong>Little Lane Singles Events</strong><Tag tone="berry">Featured</Tag></div>
        <p>Wine tastings · Trivia nights · 30s-40s</p>
        <div className="e4s-love-chip-row"><Tag>Photos</Tag><Tag>Booking link</Tag><Tag>3 cities</Tag></div>
      </div>
    </article>
  );
}

function PriorityListing() {
  return (
    <div className="e4s-love-priority">
      <div className="e4s-love-row"><span>Pinned to top of Sydney results</span><Tag tone="teal">Priority</Tag></div>
      <StandardListing compact />
      <StandardListing compact />
    </div>
  );
}

function BannerStrip({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? "e4s-love-banner e4s-love-banner--small" : "e4s-love-banner"}>
      <span>V</span>
      <div><strong>Vue Rooftop - Singles Summer Series</strong>{!small && <p>Page-top banner · Sydney city page · 970 x 120</p>}</div>
      <em>Sponsored</em>
    </div>
  );
}

function SidebarAd() {
  return (
    <aside className="e4s-love-sidebar-ad">
      <div className="e4s-love-row"><span>Sponsored</span><Tag tone="berry">Sidebar</Tag></div>
      <div className="e4s-love-sidebar-art" />
      <strong>Melbourne Singles Hikes</strong>
      <p>Right-hand column on every Melbourne and Outdoors page.</p>
      <span>View dates</span>
    </aside>
  );
}

function WhatsOnList() {
  const events = [
    ["FRI", "12", "Speed Dating 28-39", "The Rook, Sydney", "$45"],
    ["SAT", "13", "Singles Wine Walk", "Surry Hills", "$60"],
    ["SUN", "14", "Sunday Social Brunch", "Bondi", "$35"],
  ];

  return (
    <div className="e4s-love-whatson">
      <div className="e4s-love-row"><strong>What&apos;s On · Sydney</strong><Tag>This week</Tag></div>
      {events.map(([day, date, title, venue, price]) => (
        <div key={title} className="e4s-love-event-line">
          <span>{day}<strong>{date}</strong></span>
          <div><strong>{title}</strong><p>{venue}</p></div>
          <em>{price}</em>
        </div>
      ))}
    </div>
  );
}

function PromotedEventRow() {
  return (
    <div className="e4s-love-promoted-row">
      <p>Every event page · second row</p>
      <span className="e4s-love-fake-row" />
      <div><span>E4S</span><div><strong>Masquerade Singles Ball - Brisbane</strong><p>Promoted placement · row two</p></div><Tag tone="berry">Ad</Tag></div>
      <span className="e4s-love-fake-row" />
    </div>
  );
}

function HomepageFeaturedListing() {
  return (
    <div className="e4s-love-home-listing">
      <div className="e4s-love-row"><strong>Homepage featured listings</strong><Tag tone="berry">Featured</Tag></div>
      <FeaturedListing />
      <StandardListing compact />
    </div>
  );
}

function HomepageTile() {
  return (
    <div className="e4s-love-home-tile">
      <div className="e4s-love-row"><strong>Featured across Australia</strong><Tag tone="plain">Homepage</Tag></div>
      <div><article><Tag tone="teal">Sponsored tile</Tag><strong>Golden Hour Singles Cruise</strong><p>Sydney Harbour · Every Saturday</p></article><span /><span /></div>
    </div>
  );
}

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="e4s-love-browser">
      <div className="e4s-love-browser__bar"><span /><span /><span /><p>events4singles.com.au/sydney</p></div>
      {children}
    </div>
  );
}

function Zone({ id, active, label, children, onSelect }: { id: ZoneId; active: ZoneId; label: string; children: ReactNode; onSelect: (zone: ZoneId) => void }) {
  return (
    <button type="button" aria-pressed={active === id} aria-label={`Inspect ${label}`} className={cx("e4s-love-zone", active === id && "is-active")} onClick={() => onSelect(id)}>
      {children}
      <span>{label}</span>
    </button>
  );
}

function SitePreview({ active, onSelect }: { active: ZoneId; onSelect: (zone: ZoneId) => void }) {
  return (
    <BrowserFrame>
      <div className="e4s-love-site-preview">
        <div className="e4s-love-site-preview__nav"><span>E4S</span><strong>Events4Singles</strong><em>Cities</em><em>What&apos;s On</em><em>Categories</em></div>
        <Zone id="banner" active={active} label="Page-top banner" onSelect={onSelect}><BannerStrip small /></Zone>
        <div className="e4s-love-site-preview__grid">
          <div>
            <Zone id="priority" active={active} label="Sticky listing" onSelect={onSelect}><div className="e4s-love-priority-single"><Thumb /><div><strong>Two Left Feet Dating</strong><p>Sticky position 1 · Sydney</p></div><Tag tone="teal">Priority</Tag></div></Zone>
            <Zone id="featured" active={active} label="Featured listing" onSelect={onSelect}><FeaturedListing /></Zone>
            <Zone id="standard" active={active} label="Standard listing" onSelect={onSelect}><StandardListing compact /></Zone>
            <Zone id="whatson" active={active} label="What's On" onSelect={onSelect}><WhatsOnList /></Zone>
          </div>
          <div>
            <Zone id="sidebar" active={active} label="Sidebar advert" onSelect={onSelect}><SidebarAd /></Zone>
            <Zone id="tile" active={active} label="Homepage tile" onSelect={onSelect}><HomepageTile /></Zone>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function PlacementMockup({ active }: { active: PlacementId }) {
  if (active === "standard") return <div className="e4s-love-stack"><StandardListing /><StandardListing compact /></div>;
  if (active === "featured") return <div className="e4s-love-stack"><FeaturedListing /><PriorityListing /></div>;
  if (active === "banners") return <div className="e4s-love-stack"><BannerStrip /><div className="e4s-love-two-col"><div><StandardListing compact /><StandardListing compact /></div><SidebarAd /></div></div>;
  if (active === "whatson") return <div className="e4s-love-stack"><WhatsOnList /><PromotedEventRow /></div>;
  return <div className="e4s-love-stack"><HomepageFeaturedListing /><HomepageTile /></div>;
}

function Section({ id, eyebrow, title, intro, tone, children }: { id: string; eyebrow: string; title: string; intro?: string; tone?: "mint" | "deep"; children: ReactNode }) {
  return (
    <section id={id} className={cx("e4s-love-section", tone === "mint" && "is-mint", tone === "deep" && "is-deep")}>
      <div className="e4s-love-container">
        <p className="e4s-love-kicker">{eyebrow}</p>
        <h2>{title}</h2>
        {intro && <p className="e4s-love-intro">{intro}</p>}
        <div className="e4s-love-section__body">{children}</div>
      </div>
    </section>
  );
}

export default function AdvertiseExperience() {
  const [zone, setZone] = useState<ZoneId>("featured");
  const [placementId, setPlacementId] = useState<PlacementId>("featured");
  const zoneInfo = ZONE_COPY[zone];
  const placement = useMemo(() => PLACEMENTS.find((item) => item.id === placementId) ?? PLACEMENTS[1], [placementId]);

  return (
    <main className="e4s-love-advertise" id="site-content">
      <section className="e4s-love-hero">
        <div className="e4s-love-container e4s-love-hero__grid">
          <div className="e4s-love-hero__copy">
            <div className="e4s-love-chip-row"><Tag>Australia-wide directory</Tag><Tag tone="berry">Media kit 2026</Tag></div>
            <h1>Get listed for free. <span>Buy the positions that move attention.</span></h1>
            <p>Every singles event, venue and dating service in Australia can hold a free profile. Paid placements are better positions on pages people already browse, clearly labelled and approved before they run.</p>
            <div className="e4s-love-actions"><Link href="/portal">Start free listing</Link><Link href="#explorer">Compare placements</Link><Link href="/contact">Plan a campaign</Link></div>
            <div className="e4s-love-selected"><span>Selected placement</span><div><strong>{zoneInfo.title}</strong><em>{zoneInfo.price}</em></div><p>{zoneInfo.body}</p></div>
          </div>
          <div><SitePreview active={zone} onSelect={setZone} /><p className="e4s-love-preview-note">Tap any highlighted zone to inspect that placement.</p></div>
        </div>
      </section>

      <Section id="explorer" eyebrow="Placement explorer" title="Five ways to appear. Pick one and see exactly what you get." intro="Each tab swaps the preview, the price, the reach and the reason an advertiser would buy it.">
        <div className="e4s-love-tabs" role="tablist" aria-label="Advertising placements">
          {PLACEMENTS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === placementId} className={item.id === placementId ? "is-active" : undefined} onClick={() => setPlacementId(item.id)}>{item.label}</button>)}
        </div>
        <div className="e4s-love-explorer-panel" role="tabpanel">
          <div className="e4s-love-panel-card"><PlacementMockup active={placement.id} /></div>
          <aside className="e4s-love-panel-copy">
            <div><h3>{placement.label}</h3><strong>{placement.price}</strong><span>{placement.cadence}</span></div>
            <dl><div><dt>Reach</dt><dd>{placement.reach}</dd></div><div><dt>Scope</dt><dd>{placement.scope}</dd></div><div><dt>Best used for</dt><dd>{placement.bestFor}</dd></div></dl>
            <ul>{placement.bullets.map((item) => <li key={item}><Tag>{item}</Tag></li>)}</ul>
          </aside>
        </div>
      </Section>

      <Section id="inventory" eyebrow="Inventory" title="Every sellable unit, rendered at real proportions." intro="No old screenshots, no mystery. This is what paid visibility buys on the page." tone="mint">
        <div className="e4s-love-inventory">
          {[
            ["Standard listing card", "Free · city + category", <StandardListing key="standard" />],
            ["Featured listing", "from $39/mo", <FeaturedListing key="featured" />],
            ["Sticky listing position", "from $49/mo", <PriorityListing key="priority" />],
            ["Page-top banner strip", "from $79/mo", <BannerStrip key="banner" />],
            ["City/category sidebar", "from $69/mo", <SidebarAd key="sidebar" />],
            ["What's On calendar", "from $29/event", <WhatsOnList key="whatson" />],
            ["Promoted second row on event pages", "from $149/mo", <PromotedEventRow key="promoted" />],
            ["Homepage featured listing", "from $99/mo", <HomepageFeaturedListing key="home-listing" />],
            ["Homepage featured tile", "from $99/mo", <HomepageTile key="tile" />],
          ].map(([title, price, mockup]) => (
            <figure key={title as string} className="e4s-love-inventory-card"><figcaption><strong>{title}</strong><span>{price}</span></figcaption>{mockup}</figure>
          ))}
        </div>
      </Section>

      <Section id="packages" eyebrow="Packages" title="Start at zero. Step up only when the position is worth it.">
        <div className="e4s-love-packages">
          {PACKAGES.map((pkg) => (
            <article key={pkg.title} className={pkg.featured ? "is-featured" : undefined}>
              <div><h3>{pkg.title}</h3>{pkg.featured && <Tag tone="berry">Popular</Tag>}</div>
              <strong>{pkg.price}</strong><span>{pkg.cadence}</span><p>{pkg.note}</p>
              <ul>{pkg.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <Link href={pkg.href}>{pkg.cta}</Link>
            </article>
          ))}
        </div>
        <div className="e4s-love-addons"><h3>Add-ons</h3><p>Bolt any of these onto a listing or package.</p><div>{ADDONS.map(([label, price, note]) => <article key={label}><div><strong>{label}</strong><p>{note}</p></div><span>{price}</span></article>)}</div></div>
      </Section>

      <Section id="portal-workflow" eyebrow="Portal workflow" title="Free listings stay easy. Paid placements stay controlled." intro="The advertising portal should let organisers start quickly, then upsell paid positions once their listing, event or campaign is ready.">
        <div className="e4s-love-workflow">
          {[
            ["Create or claim", "Start with a free organiser, venue, service or event profile."],
            ["Choose placement", "Select city, category, homepage, banner, sidebar or event-page inventory."],
            ["Upload creative", "Add logo, image, banner artwork, poster, copy and booking links."],
            ["Review and publish", "Approve labels, dates, pricing, destinations and live schedule before it runs."],
          ].map(([title, text], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="bundles" eyebrow="Bundles" title="Three combinations that consistently work." intro="Bundled placements are easier to sell, easier to approve and easier for smaller advertisers to understand." tone="mint">
        <div className="e4s-love-bundles">
          <article><h3>Event organiser</h3><div className="e4s-love-chip-row"><Tag>Listing</Tag><Tag>What&apos;s On</Tag><Tag>Promoted row</Tag></div><p>For operators running a recurring calendar in one or two cities.</p><FeaturedListing /><PromotedEventRow /></article>
          <article><h3>Venue</h3><div className="e4s-love-chip-row"><Tag>Listing</Tag><Tag>City page banner</Tag><Tag>Sidebar</Tag></div><p>For bars, rooftops and function spaces that want the whole city page.</p><BannerStrip small /><SidebarAd /></article>
          <article><h3>National service</h3><div className="e4s-love-chip-row"><Tag>Category pages</Tag><Tag>Homepage listing</Tag><Tag>Homepage tile</Tag></div><p>For matchmakers and dating services operating across Australia.</p><HomepageFeaturedListing /><HomepageTile /></article>
        </div>
      </Section>

      <Section id="creative" eyebrow="Creative support" title="Send what you have. We make it fit the page." intro="Most advertisers arrive with a poster and a logo. That is enough for launch." tone="deep">
        <div className="e4s-love-creative-grid">{[["Cropping", "Posters and photos are adapted to card, banner and tile ratios."], ["Logo placement", "Marks sit in consistent safe areas so they stay legible."], ["Banner and tile adaptation", "One artwork becomes page-top, sidebar and homepage creative."], ["Copy cleanup", "Headlines and blurbs are tightened before approval."]].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </Section>

      <Section id="trust" eyebrow="Trust & control" title="Clearly labelled, reviewed before it runs.">
        <div className="e4s-love-trust">
          <div>{[["Approval required", "Every listing, event and creative is reviewed before it appears."], ["Sponsored labels", "Paid positions carry visible Sponsored, Featured, Promoted or Ad labels."], ["Advertiser responsibility", "Dates, prices, age brackets, venues and booking links must stay accurate."]].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
          <aside><p>How labelling appears</p><BannerStrip small /><PromotedEventRow /><FeaturedListing /></aside>
        </div>
      </Section>

      <section className="e4s-love-final"><h2>Take the free listing today. Buy position when you are ready.</h2><div className="e4s-love-actions"><Link href="/portal">Start free listing</Link><Link href="#explorer">Compare placements</Link><Link href="/contact">Plan a campaign</Link></div></section>
    </main>
  );
}
