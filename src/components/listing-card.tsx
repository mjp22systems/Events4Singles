import type { Listing } from "@/lib/types";
import ListingCardMedia from "./listing-card-media";

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const phone = listing.phone || listing.mobile;
  const web = listing.web || listing.business_website;
  const title = listing.business_name || listing.title;
  const webHref = web ? (web.startsWith("http") ? web : `https://${web}`) : null;
  const imageUrl = listing.image_url
    ? listing.image_url.startsWith("http") || listing.image_url.startsWith("/")
      ? listing.image_url
      : `/${listing.image_url}`
    : null;

  const tier = listing.listing_type === "premium" ? "premium"
    : listing.listing_type === "featured" ? "featured"
    : null;

  return (
    <article className={`e4s-listing-card${tier ? ` e4s-listing-card--${tier}` : ""}`}>
      <header className="e4s-listing-card__header">
        <div className="e4s-listing-card__identity">
          <h2 className="e4s-listing-card__title">
            {webHref ? (
              <a href={webHref} rel="noopener" target="_blank">{title}</a>
            ) : title}
          </h2>
          {tier && (
            <span className="e4s-listing-card__badge">{tier}</span>
          )}
        </div>
        <div className="e4s-listing-card__actions">
          <span className="e4s-listing-card__contact e4s-listing-card__contact--empty">
            Contact
          </span>
          {phone ? (
            <a
              aria-label={`Call ${title}`}
              className="e4s-listing-card__action e4s-listing-card__action--phone"
              href={`tel:${phone}`}
            />
          ) : (
            <span
              aria-hidden="true"
              className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--phone"
            />
          )}
          {listing.email ? (
            <a
              aria-label={`Email ${title}`}
              className="e4s-listing-card__action e4s-listing-card__action--email"
              href={`mailto:${listing.email}`}
            />
          ) : (
            <span
              aria-hidden="true"
              className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--email"
            />
          )}
          {webHref ? (
            <a
              aria-label={`Visit ${title} website`}
              className="e4s-listing-card__action e4s-listing-card__action--web"
              href={webHref}
              rel="noopener"
              target="_blank"
            />
          ) : (
            <span
              aria-hidden="true"
              className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--web"
            />
          )}
          <span
            aria-hidden="true"
            className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--address"
            title="No address listed"
          />
        </div>
      </header>
      <div className="e4s-listing-card__body">
        {imageUrl ? (
          <ListingCardMedia alt={`${title} logo`} src={imageUrl} />
        ) : (
          <div className="e4s-listing-card__media" />
        )}
        <div className="e4s-listing-card__content">
          {listing.tagline && (
            <p className="e4s-listing-card__promo">{listing.tagline}</p>
          )}
          {listing.description && <p>{listing.description}</p>}
        </div>
      </div>
    </article>
  );
}
