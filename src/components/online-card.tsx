import Link from "next/link";
import type { Listing } from "@/lib/types";
import { toListingSlug } from "@/lib/constants";

interface Props {
  listing: Listing;
}

export default function OnlineCard({ listing }: Props) {
  const title = listing.business_name || listing.title;
  const web = listing.web || listing.business_website;
  const webHref = web ? (web.startsWith("http") ? web : `https://${web}`) : null;
  const imageUrl = listing.image_url
    ? listing.image_url.startsWith("http") || listing.image_url.startsWith("/")
      ? listing.image_url
      : `/${listing.image_url}`
    : null;
  const domain = web
    ? web.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]
    : null;
  const cardHref = `/listing/${toListingSlug(listing.id, title)}`;

  return (
    <article
      className="e4s-online-card"
      data-e4s-online-card
      id={`listing-card-${listing.id}`}
    >
      <Link
        href={cardHref}
        className="e4s-online-card__overlay"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="e4s-online-card__logo">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <div className="e4s-online-card__logo--empty" />
        )}
      </div>
      <div className="e4s-online-card__body">
        <div className="e4s-online-card__title-row">
          <h2 className="e4s-online-card__title">
            <Link href={cardHref}>{title}</Link>
          </h2>
          {listing.business_advertiser_id ? (
            <span className="e4s-online-card__verified">✓ Verified</span>
          ) : (
            <span className="e4s-online-card__unclaimed">Unclaimed</span>
          )}
          {listing.category_label && (
            <span className="e4s-online-card__type-badge">
              {listing.category_label}
            </span>
          )}
        </div>
        {listing.tagline && (
          <p className="e4s-online-card__tagline">{listing.tagline}</p>
        )}
        {listing.promo && (
          <p className="e4s-online-card__promo">{listing.promo}</p>
        )}
      </div>
      {webHref ? (
        <div className="e4s-online-card__cta">
          <a
            href={webHref}
            className="e4s-online-card__visit-btn"
            rel="noopener"
            target="_blank"
            aria-label={`Visit ${title} website`}
          >
            Visit Site ›
          </a>
          {domain && <span className="e4s-online-card__domain">{domain}</span>}
        </div>
      ) : (
        <div className="e4s-online-card__cta">
          <Link href={cardHref} className="e4s-online-card__more">
            More info ›
          </Link>
        </div>
      )}
    </article>
  );
}
