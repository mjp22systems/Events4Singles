import Link from "next/link";

export default function FeatureSlotCard() {
  return (
    <article className="e4s-listing-card e4s-listing-card--featured e4s-listing-card--feature-slot">
      <Link
        aria-label="Advertise your business on Events4Singles"
        className="e4s-listing-card__overlay"
        href="/advertise"
      />
      <header className="e4s-listing-card__header">
        <div className="e4s-listing-card__identity">
          <div className="e4s-listing-card__title-row">
            <h2 className="e4s-listing-card__title">
              <Link href="/advertise">Advertise Your Business Here</Link>
            </h2>
            <span className="e4s-listing-card__badge">featured</span>
            <span className="e4s-listing-card__licence">Lic. No. 12345678</span>
          </div>
          <p className="e4s-listing-card__tagline">Your tagline - describe your service, location and what makes you stand out.</p>
        </div>
        <div className="e4s-listing-card__actions">
          <Link aria-label="Contact example" className="e4s-listing-card__action e4s-listing-card__action--person" href="/advertise" title="Contact: Jane Smith" />
          <Link aria-label="Phone example" className="e4s-listing-card__action e4s-listing-card__action--phone" href="/advertise" title="Phone: (02) 9000 0000" />
          <Link aria-label="Email example" className="e4s-listing-card__action e4s-listing-card__action--email" href="/advertise" title="Email: hello@yourbusiness.com.au" />
          <Link aria-label="Website example" className="e4s-listing-card__action e4s-listing-card__action--web" href="/advertise" rel="noopener" title="Website: www.yourbusiness.com.au" />
          <Link aria-label="Address example" className="e4s-listing-card__action e4s-listing-card__action--address" href="/advertise" title="Address: 123 Example St, Sydney NSW 2000" />
        </div>
      </header>
      <div className="e4s-listing-card__body">
        <div className="e4s-listing-card__media e4s-listing-card__media--slot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Advertise here" loading="lazy" src="/images/site/placeholders/advertise-here-180x120.svg" />
        </div>
        <div className="e4s-listing-card__content">
          <p>Your business description fills this space. Tell singles what events and services you offer, which suburbs and regions you cover, and what sets you apart. Include details about your team, years of experience, qualifications, accessibility options, and any booking or membership conditions that apply.</p>
          <p className="e4s-listing-card__promo">Quote Events4Singles when you call or email to claim your complimentary first session today.</p>
        </div>
      </div>
    </article>
  );
}
