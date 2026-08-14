export default function FeatureSlotCard() {
  return (
    <article className="e4s-listing-card e4s-listing-card--featured e4s-listing-card--feature-slot">
      <a
        aria-label="Advertise your business on Events4Singles"
        className="e4s-listing-card__overlay"
        href="/advertise"
      />
      <header className="e4s-listing-card__header">
        <div className="e4s-listing-card__identity">
          <div className="e4s-listing-card__title-row">
            <h2 className="e4s-listing-card__title">
              <a href="/advertise">Advertise Your Business Here</a>
            </h2>
            <span className="e4s-listing-card__badge">featured</span>
            <span className="e4s-listing-card__licence">Lic. No. 12345678</span>
          </div>
          <p className="e4s-listing-card__tagline">Your tagline - describe your service, location and what makes you stand out.</p>
        </div>
        <div className="e4s-listing-card__actions">
          <a aria-label="Contact example" className="e4s-listing-card__action e4s-listing-card__action--person" href="/advertise" title="Contact: Jane Smith" />
          <a aria-label="Phone example" className="e4s-listing-card__action e4s-listing-card__action--phone" href="/advertise" title="Phone: (02) 9000 0000" />
          <a aria-label="Email example" className="e4s-listing-card__action e4s-listing-card__action--email" href="/advertise" title="Email: hello@yourbusiness.com.au" />
          <a aria-label="Website example" className="e4s-listing-card__action e4s-listing-card__action--web" href="/advertise" rel="noopener" title="Website: www.yourbusiness.com.au" />
          <a aria-label="Address example" className="e4s-listing-card__action e4s-listing-card__action--address" href="/advertise" title="Address: 123 Example St, Sydney NSW 2000" />
        </div>
      </header>
      <div className="e4s-listing-card__body">
        <div className="e4s-listing-card__media e4s-listing-card__media--slot">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="180" height="120" aria-hidden="true">
            <defs>
              <linearGradient id="fsg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#064e4d" />
                <stop offset="1" stopColor="#c4145e" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <rect width="180" height="120" rx="8" fill="url(#fsg)" />
            <text x="90" y="50" textAnchor="middle" fill="#fff" fontFamily="Verdana,Arial,sans-serif" fontSize="13" fontWeight="700">Your</text>
            <text x="90" y="70" textAnchor="middle" fill="#dff3f1" fontFamily="Verdana,Arial,sans-serif" fontSize="13" fontWeight="700">Logo Here</text>
          </svg>
        </div>
        <div className="e4s-listing-card__content">
          <p>Your business description fills this space. Tell singles what events and services you offer, which suburbs and regions you cover, and what sets you apart. Include details about your team, years of experience, qualifications, accessibility options, and any booking or membership conditions that apply.</p>
          <p className="e4s-listing-card__promo">Quote Events4Singles when you call or email to claim your complimentary first session today.</p>
        </div>
      </div>
    </article>
  );
}
