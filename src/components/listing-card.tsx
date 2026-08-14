import Link from "next/link";
import type { Listing } from "@/lib/types";
import { slugToLabel, toListingSlug } from "@/lib/constants";
import ListingCardMedia from "./listing-card-media";

interface Props {
  listing: Listing;
}

function splitList(value?: string | null) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function locationBadges(listing: Listing) {
  const labels = splitList(listing.city_labels);
  if (labels.length > 0) return labels.slice(0, 3);

  const slugs = splitList(listing.city_slugs || listing.city_slug);
  if (slugs.length > 0) return slugs.slice(0, 3).map(slugToLabel);

  return [];
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
  const locations = locationBadges(listing);
  const hiddenLocationCount = Math.max(0, splitList(listing.city_slugs).length - locations.length);

  return (
    <article
      className={`e4s-listing-card${tier ? ` e4s-listing-card--${tier}` : ""}`}
      data-e4s-listing-card
      id={`listing-card-${listing.id}`}
    >
      <Link
        href={`/listing/${toListingSlug(listing.id, listing.business_name || listing.title)}`}
        className="e4s-listing-card__overlay"
        aria-hidden="true"
        tabIndex={-1}
      />
      <header className="e4s-listing-card__header">
        <div className="e4s-listing-card__identity">
          <div className="e4s-listing-card__title-row">
            <h2 className="e4s-listing-card__title">
              <Link href={`/listing/${toListingSlug(listing.id, listing.business_name || listing.title)}`}>{title}</Link>
            </h2>
            {tier && (
              <span className="e4s-listing-card__badge">{tier}</span>
            )}
            {locations.map((location) => (
              <span key={location} className="e4s-listing-card__location-badge">
                {location}
              </span>
            ))}
            {hiddenLocationCount > 0 && (
              <span className="e4s-listing-card__location-badge">
                +{hiddenLocationCount}
              </span>
            )}
          </div>
          {listing.tagline && (
            <p className="e4s-listing-card__tagline">{listing.tagline}</p>
          )}
        </div>
        <div className="e4s-listing-card__actions">
          <span
            aria-hidden="true"
            className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--person"
            title="Contact not listed"
          />
          {phone ? (
            <a
              aria-label={`Call ${title}`}
              className="e4s-listing-card__action e4s-listing-card__action--phone"
              href={`tel:${phone}`}
              title="Phone"
            />
          ) : (
            <span
              aria-hidden="true"
              className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--phone"
              title="Phone not listed"
            />
          )}
          {listing.email ? (
            <a
              aria-label={`Email ${title}`}
              className="e4s-listing-card__action e4s-listing-card__action--email"
              href={`mailto:${listing.email}`}
              title="Email"
            />
          ) : (
            <span
              aria-hidden="true"
              className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--email"
              title="Email not listed"
            />
          )}
          {webHref ? (
            <a
              aria-label={`Visit ${title} website`}
              className="e4s-listing-card__action e4s-listing-card__action--web"
              href={webHref}
              rel="noopener"
              target="_blank"
              title="Website"
            />
          ) : (
            <span
              aria-hidden="true"
              className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--web"
              title="Website not listed"
            />
          )}
          <span
            aria-hidden="true"
            className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--address"
            title="Address not listed"
          />
        </div>
      </header>
      <div className="e4s-listing-card__body">
        {imageUrl ? (
          <ListingCardMedia alt={`${title} listing image`} src={imageUrl} title={title} />
        ) : (
          <div className="e4s-listing-card__media e4s-listing-card__media--empty" />
        )}
        <div className="e4s-listing-card__content">
          {listing.description && <p>{listing.description}</p>}
          {listing.promo && (
            <p className="e4s-listing-card__promo">{listing.promo}</p>
          )}
        </div>
      </div>
    </article>
  );
}
