import Link from "next/link";
import type { Listing } from "@/lib/types";
import { slugToLabel, toListingSlug, toProfileSlug } from "@/lib/constants";
import ListingCardMedia from "./listing-card-media";

interface Props {
  listing: Listing;
  context?: "directory" | "profile";
  isAdmin?: boolean;
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

export default function ListingCard({ listing, context = "directory", isAdmin = false }: Props) {
  const phone = listing.phone || listing.mobile;
  const web = listing.web || listing.business_website;
  const title = listing.business_name || listing.title;
  const webHref = web ? (web.startsWith("http") ? web : `https://${web}`) : null;
  const imageUrl = listing.image_url
    ? listing.image_url.startsWith("http") || listing.image_url.startsWith("/")
      ? listing.image_url
      : `/${listing.image_url}`
    : null;

  const ltype = listing.listing_type;
  const showAddress = ltype !== "service" && ltype !== "practitioner";
  const addressActive = ltype === "venue";
  const isCircle = ltype === "practitioner";
  const locations = locationBadges(listing);
  const hiddenLocationCount = Math.max(0, splitList(listing.city_slugs).length - locations.length);
  const listingHref = `/listing/${toListingSlug(listing.id, listing.business_name || listing.title)}`;
  const profileHref = listing.business_id
    ? `/profile/${toProfileSlug(listing.business_id, listing.business_name || listing.title)}`
    : listingHref;
  const cardHref = context === "profile" ? listingHref : profileHref;
  const detailsLabel = context === "profile"
    ? isAdmin ? "Edit listing ›" : "View listing ›"
    : "View profile ›";

  return (
    <article
      className="e4s-listing-card"
      data-e4s-listing-card
      id={`listing-card-${listing.id}`}
    >
      <Link
        href={cardHref}
        className="e4s-listing-card__overlay"
        aria-hidden="true"
        tabIndex={-1}
      />
      <header className="e4s-listing-card__header">
        <div className="e4s-listing-card__identity">
          <div className="e4s-listing-card__title-row">
            <h2 className="e4s-listing-card__title">
              <Link href={cardHref}>{title}</Link>
            </h2>
            {listing.business_advertiser_id ? (
              <span
                className="e4s-listing-card__verified"
                title="This listing is claimed and managed by the business owner"
              >
                ✓ Verified
              </span>
            ) : (
              <span className="e4s-listing-card__unclaimed">Unclaimed</span>
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
          {phone && (
            <a
              aria-label={`Call ${title}`}
              className="e4s-listing-card__action e4s-listing-card__action--phone"
              href={`tel:${phone}`}
              title="Phone"
            />
          )}
          {listing.email && (
            <a
              aria-label={`Email ${title}`}
              className="e4s-listing-card__action e4s-listing-card__action--email"
              href={`mailto:${listing.email}`}
              title="Email"
            />
          )}
          {webHref && (
            <a
              aria-label={`Visit ${title} website`}
              className="e4s-listing-card__action e4s-listing-card__action--web"
              href={webHref}
              rel="noopener"
              target="_blank"
              title="Website"
            />
          )}
          {showAddress && addressActive && (
            <a
              aria-label={`Map for ${title}`}
              className="e4s-listing-card__action e4s-listing-card__action--address e4s-listing-card__action--address-active"
              href={`https://maps.google.com/?q=${encodeURIComponent(
                listing.location || listing.location_city || title
              )}`}
              rel="noopener"
              target="_blank"
              title="View on map"
            />
          )}
        </div>
      </header>
      <div className="e4s-listing-card__body">
        {imageUrl ? (
          <ListingCardMedia
            alt={`${title} listing image`}
            src={imageUrl}
            title={title}
            extraClass={isCircle ? "e4s-listing-card__media--circle" : undefined}
          />
        ) : (
          <div
            className={`e4s-listing-card__media e4s-listing-card__media--empty${
              isCircle ? " e4s-listing-card__media--circle" : ""
            }`}
          />
        )}
        <div className="e4s-listing-card__content">
          {listing.description && <p>{listing.description}</p>}
          <div className="e4s-listing-card__foot">
            {listing.promo && (
              <span className="e4s-listing-card__promo">{listing.promo}</span>
            )}
            <Link href={cardHref} className="e4s-listing-card__more">
              {detailsLabel}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
