import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertise with Events4Singles",
  description:
    "Reach Australian singles looking for events, activities and services. List your singles event business on Events4Singles.",
};

const PACKAGES = [
  {
    name: "Starter",
    use: "Local visibility",
    body: "A clean business listing connected to relevant city and category pages.",
    items: ["Standard listing", "Contact details", "City/category placement", "Website link"],
  },
  {
    name: "Professional",
    use: "More visibility",
    body: "A stronger listing presence for organisers in busier categories or cities.",
    items: ["Featured treatment", "Priority options", "Multiple placements", "Offer/promo support"],
    highlight: true,
  },
  {
    name: "Premium",
    use: "Campaign placement",
    body: "Add visual ad inventory for homepage, page-top, sidebar or calendar promotion.",
    items: ["Tile banners", "Sidebar ads", "Homepage promotion", "Calendar add-ons"],
  },
];

function ListingPreview({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`e4s-ad-preview-listing${featured ? " e4s-ad-preview-listing--featured" : ""}`}>
      <div>
        <strong>{featured ? "Featured Listing" : "Standard Listing"}</strong>
        {featured && <span>Featured</span>}
      </div>
      <div className="e4s-ad-preview-listing__body">
        <div className="e4s-ad-preview-listing__image" />
        <p>
          Business name, short description, location/category badges and contact
          actions displayed in the directory listing template.
        </p>
      </div>
    </div>
  );
}

export default function AdvertisePage() {
  return (
    <main className="e4s-advertise-page e4s-advertise-pro e4s-shell" id="site-content">
      <section className="e4s-advertise-pro-hero">
        <div>
          <p className="e4s-kicker">Advertise with Events4Singles</p>
          <h1>Show your singles event business where Australian singles are already looking.</h1>
          <p className="e4s-lead">
            Events4Singles is a directory for speed dating, dinner parties, dance
            classes, social clubs, travel, cruises, introduction agencies and related services.
          </p>
          <div className="e4s-advertise-pro-hero__actions">
            <Link href="/portal">Create Listing</Link>
            <Link href="/contact">Ask About Advertising</Link>
          </div>
        </div>
        <div className="e4s-advertise-pro-hero__sample" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sample_homebanner_adv.jpg" alt="" />
          <span>Homepage and page-top promotion examples from legacy advertising inventory.</span>
        </div>
      </section>

      <section className="e4s-advertise-inventory">
        <div className="e4s-advertise-section-heading">
          <p className="e4s-kicker">Advertising Inventory</p>
          <h2>What businesses can buy</h2>
          <p>
            Listings and banner positions are separate products. A business can
            have a normal directory listing, pay for stronger placement, or add visual advertising.
          </p>
        </div>

        <div className="e4s-advertise-inventory__grid">
          <article>
            <ListingPreview />
            <h3>Standard Listing</h3>
            <p>A normal directory card with business details, image, location/category placement and contact actions.</p>
          </article>

          <article>
            <ListingPreview featured />
            <h3>Featured Listing</h3>
            <p>A higher-visibility listing treatment for stronger presence on city and category pages.</p>
          </article>

          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="e4s-advertise-example-img" src="/images/sample_pagetopbanner_adv.jpg" alt="Sample top banner advertising placement" />
            <h3>Tile Banner / Page Top Ad</h3>
            <p>Image advertising above listings, scoped to a city, category or specific category-and-city page.</p>
          </article>

          <article>
            <div className="e4s-ad-preview-sidebar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/sample_vtopbanner_adv.jpg" alt="" />
              <span>Sidebar ad</span>
            </div>
            <h3>Sidebar Advertising</h3>
            <p>A right-hand ad position near browse filters and page navigation on listing pages.</p>
          </article>

          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="e4s-advertise-example-img" src="/images/sample_homebanner_adv.jpg" alt="Sample homepage advertising placement" />
            <h3>Homepage Promotion</h3>
            <p>Promoted business space on the front page for organisers who want broader visibility.</p>
          </article>

          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="e4s-advertise-example-img" src="/images/sample_regeventcalendar_adv.jpg" alt="Sample regular events calendar advertising placement" />
            <h3>Events Calendar Add-on</h3>
            <p>Calendar promotion for dated events once the rebuilt events table and advertiser portal are connected.</p>
          </article>
        </div>
      </section>

      <section className="e4s-advertise-placement-map">
        <div>
          <p className="e4s-kicker">Placement Logic</p>
          <h2>City, category, homepage and calendar are separate levers.</h2>
          <p>
            The rebuilt system keeps listing records separate from banner ads.
            A listing can appear in multiple locations or categories, while banner
            slots are sold against exact page scopes.
          </p>
        </div>
        <div className="e4s-advertise-placement-map__steps">
          <span>Business</span>
          <span>Listing</span>
          <span>City/category placement</span>
          <span>Featured position</span>
          <span>Banner slot</span>
          <span>Calendar add-on</span>
        </div>
      </section>

      <section className="e4s-advertise-pricing" id="pricing">
        <div className="e4s-advertise-section-heading">
          <p className="e4s-kicker">Package Direction</p>
          <h2>Draft structure before final pricing</h2>
          <p>
            Prices should be confirmed before live sales. The front end can still
            explain the commercial logic clearly.
          </p>
        </div>
        <div className="e4s-advertise-tiers">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.name}
              className={`e4s-advertise-tier${pkg.highlight ? " e4s-advertise-tier--highlight" : ""}`}
            >
              <p className="e4s-advertise-tier__name">{pkg.name}</p>
              <p className="e4s-advertise-tier__use">{pkg.use}</p>
              <p className="e4s-advertise-tier__note">{pkg.body}</p>
              <ul className="e4s-advertise-tier__features">
                {pkg.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/portal" className="e4s-advertise-tier__cta">
                Create Listing
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="e4s-advertise-contact">
        <div>
          <p className="e4s-kicker">Custom Campaigns</p>
          <h2>Need banners, homepage promotion or multi-city coverage?</h2>
          <p>
            Contact Events4Singles for custom placement, legacy advertiser review,
            banner inventory and launch package setup.
          </p>
        </div>
        <Link href="/contact">Contact Events4Singles</Link>
      </section>
    </main>
  );
}
