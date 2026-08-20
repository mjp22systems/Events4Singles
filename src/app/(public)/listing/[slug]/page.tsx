import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getListingById, getListingPlacements, getBusinessListings } from "@/lib/data";
import { toUrlSlug, idFromListingSlug, slugToLabel, toProfileSlug } from "@/lib/constants";
import ListingCard from "@/components/listing-card";
import BackLink from "@/components/back-link";
import { cleanDescription, pageMetadata } from "@/lib/seo";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = idFromListingSlug(slug);
  const listing = id !== null ? await getListingById(id) : null;
  if (!listing) return {};
  const title = listing.business_name || listing.title;
  const location = [listing.location_city, listing.location_state].filter(Boolean).join(", ");
  return pageMetadata({
    title,
    description:
      listing.tagline ||
      cleanDescription(listing.description, `${title} is listed in the Events4Singles Australian singles events directory.`),
    path: `/listing/${slug}`,
    keywords: [title, listing.category_label || "", location].filter(Boolean),
    image: listing.image_url || "/icon.png",
  });
}

const SOCIAL_PLATFORMS = [
  { key: "facebook_url" as const, label: "Facebook", icon: "f" },
  { key: "instagram_url" as const, label: "Instagram", icon: "◎" },
  { key: "tiktok_url" as const, label: "TikTok", icon: "♪" },
  { key: "youtube_url" as const, label: "YouTube", icon: "▶" },
  { key: "linkedin_url" as const, label: "LinkedIn", icon: "in" },
];

function splitList(value?: string | null) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listingLocationBadges(listing: Listing) {
  const labels = splitList(listing.city_labels);
  if (labels.length > 0) return labels.slice(0, 3);

  const slugs = splitList(listing.city_slugs || listing.city_slug);
  if (slugs.length > 0) return slugs.slice(0, 3).map(slugToLabel);

  return [];
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const id = idFromListingSlug(slug);
  if (id === null) notFound();

  const listing = await getListingById(id);
  if (!listing) notFound();

  const title = listing.business_name || listing.title;
  const phone = listing.phone;
  const mobile = listing.mobile;
  const web = listing.web || listing.business_website;
  const webHref = web ? (web.startsWith("http") ? web : `https://${web}`) : null;
  const webLabel = web ? web.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;
  const locationBadges = listingLocationBadges(listing);
  const hiddenLocationCount = Math.max(0, splitList(listing.city_slugs).length - locationBadges.length);

  const placements = await getListingPlacements(id);

  // Unique cities this listing appears in — for city hub page pills
  const cityPills = [
    ...new Map(
      placements
        .filter((p) => p.city_slug)
        .map((p) => [p.city_slug, { slug: p.city_slug!, label: p.city_label || p.city_slug! }])
    ).values(),
  ];

  const siblings = await getBusinessListings(listing.business_id ?? -1, id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: title,
    ...(listing.description && { description: cleanDescription(listing.description) }),
    ...(listing.tagline && { slogan: listing.tagline }),
    ...((phone || mobile) && { telephone: phone || mobile }),
    ...(listing.email && { email: listing.email }),
    ...(webHref && { url: webHref }),
    ...(listing.image_url && { image: listing.image_url }),
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
      ...(listing.location_city && { addressLocality: listing.location_city }),
      ...(listing.location_state && { addressRegion: listing.location_state }),
    },
  };

  return (
    <main id="site-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="e4s-shell e4s-listing-detail">

        <div className="e4s-listing-detail__layout">

          <div className="e4s-listing-detail__main">
            <div className="e4s-listing-detail__nav-row">
              <BackLink />
              <nav className="e4s-listing-detail__breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                {" / "}
                <span>{title}</span>
              </nav>
            </div>
            <header className="e4s-listing-detail__header">
              <div className="e4s-listing-detail__title-row">
                <div className="e4s-listing-detail__title-main">
                  <h1>{title}</h1>
                  {locationBadges.length > 0 && (
                    <div className="e4s-listing-detail__title-pills" aria-label="Listing locations">
                      {locationBadges.map((location) => (
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
                  )}
                </div>
                <span className="e4s-listing-detail__id-group" aria-label="Listing identifiers">
                  {listing.business_id && (
                    <Link href={`/profile/${toProfileSlug(listing.business_id!, listing.business_name || listing.title)}`} className="e4s-listing-detail__id-badge e4s-listing-detail__id-badge--link">Profile ID {listing.business_id}</Link>
                  )}
                  <span className="e4s-listing-detail__id-badge">Listing ID {id}</span>
                </span>
              </div>
              {listing.tagline && <p className="e4s-listing-detail__tagline">{listing.tagline}</p>}
            </header>

            {listing.description && (
              <section className="e4s-listing-detail__description">
                <p>{listing.description}</p>
              </section>
            )}

            {listing.promo && (
              <section className="e4s-listing-detail__promo">
                <strong>Special offer:</strong> {listing.promo}
              </section>
            )}

            {(listing.trading_hours || listing.contact_hours) && (
              <section className="e4s-listing-detail__hours">
                {listing.trading_hours && (
                  <div className="e4s-listing-detail__hours-row">
                    <span className="e4s-listing-detail__hours-label">Trading hours</span>
                    <span className="e4s-listing-detail__hours-value">{listing.trading_hours}</span>
                  </div>
                )}
                {listing.contact_hours && (
                  <div className="e4s-listing-detail__hours-row">
                    <span className="e4s-listing-detail__hours-label">Contact hours</span>
                    <span className="e4s-listing-detail__hours-value">{listing.contact_hours}</span>
                  </div>
                )}
              </section>
            )}

            {(placements.length > 0 || cityPills.length > 0) && (
              <section className="e4s-listing-detail__placements">
                <h2>Listed on</h2>
                <ul>
                  {cityPills.map((c) => (
                    <li key={`city-${c.slug}`}>
                      <Link href={`/${toUrlSlug(c.slug)}`} className="e4s-listing-detail__placement-city">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                  {placements.filter((p) => p.category_slug).map((p) => {
                    const catSlug = toUrlSlug(p.category_slug);
                    const href = p.city_slug ? `/${catSlug}/${toUrlSlug(p.city_slug)}` : `/${catSlug}`;
                    const label = p.category_label && p.city_label
                      ? `${p.category_label} — ${p.city_label}`
                      : p.category_label || p.category_slug;
                    return (
                      <li key={`${p.category_slug}-${p.city_slug}`}>
                        <Link href={href}>{label}</Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          <aside className="e4s-listing-detail__sidebar">
            <div className="e4s-listing-detail__contact">
              <div className="e4s-listing-detail__contact-header">
                <h2>Contact</h2>
                <div className="e4s-listing-detail__social-icons" aria-label="Social media">
                  {SOCIAL_PLATFORMS.map((p) => {
                    const href = listing[p.key];
                    const fullHref = href ? (href.startsWith("http") ? href : `https://${href}`) : null;
                    return fullHref ? (
                      <a key={p.key} href={fullHref} rel="noopener" target="_blank"
                        className="e4s-listing-detail__social-icon-btn"
                        aria-label={p.label} title={p.label}>
                        {p.icon}
                      </a>
                    ) : (
                      <span key={p.key} className="e4s-listing-detail__social-icon-btn e4s-listing-detail__social-icon-btn--empty"
                        aria-label={`${p.label} not listed`}>
                        {p.icon}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Contact person */}
              {listing.contact_name ? (
                <div className="e4s-listing-detail__ci">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">👤</span>
                  <span className="e4s-listing-detail__ci-label">{listing.contact_name}</span>
                </div>
              ) : (
                <div className="e4s-listing-detail__ci e4s-listing-detail__ci--empty">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">👤</span>
                  <span className="e4s-listing-detail__ci-label">Not listed</span>
                </div>
              )}

              {/* Phone */}
              {(phone || mobile) ? (
                <a href={`tel:${phone || mobile}`} className="e4s-listing-detail__ci">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">☎</span>
                  <span className="e4s-listing-detail__ci-label">{phone || mobile}</span>
                  <span className="e4s-listing-detail__ci-arrow" aria-hidden="true">›</span>
                </a>
              ) : (
                <div className="e4s-listing-detail__ci e4s-listing-detail__ci--empty">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">☎</span>
                  <span className="e4s-listing-detail__ci-label">Not listed</span>
                </div>
              )}

              {/* Email */}
              {listing.email ? (
                <a href={`mailto:${listing.email}`} className="e4s-listing-detail__ci" aria-label={`Email ${title}`}>
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">✉</span>
                  <span className="e4s-listing-detail__ci-label">Send email</span>
                  <span className="e4s-listing-detail__ci-arrow" aria-hidden="true">›</span>
                </a>
              ) : (
                <div className="e4s-listing-detail__ci e4s-listing-detail__ci--empty">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">✉</span>
                  <span className="e4s-listing-detail__ci-label">Not listed</span>
                </div>
              )}

              {/* Website */}
              {webHref ? (
                <a href={webHref} rel="noopener" target="_blank" className="e4s-listing-detail__ci">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">🌐</span>
                  <span className="e4s-listing-detail__ci-label">Visit website</span>
                  <span className="e4s-listing-detail__ci-arrow" aria-hidden="true">›</span>
                </a>
              ) : (
                <div className="e4s-listing-detail__ci e4s-listing-detail__ci--empty">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">🌐</span>
                  <span className="e4s-listing-detail__ci-label">Not listed</span>
                </div>
              )}

              {/* Location */}
              {(listing.location || listing.location_city) ? (
                <div className="e4s-listing-detail__ci">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">📍</span>
                  <span className="e4s-listing-detail__ci-label">
                    {[listing.location, listing.location_city, listing.location_state].filter(Boolean).join(", ")}
                  </span>
                </div>
              ) : (
                <div className="e4s-listing-detail__ci e4s-listing-detail__ci--empty">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">📍</span>
                  <span className="e4s-listing-detail__ci-label">Not listed</span>
                </div>
              )}

              {/* Licence — only if present */}
              {listing.licence_no && (
                <div className="e4s-listing-detail__ci">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">🪪</span>
                  <span className="e4s-listing-detail__ci-label e4s-listing-detail__ci-label--meta">
                    Lic. {listing.licence_no}
                  </span>
                </div>
              )}

              {/* ABN — only if present */}
              {listing.abn && (
                <div className="e4s-listing-detail__ci">
                  <span className="e4s-listing-detail__ci-icon" aria-hidden="true">🔢</span>
                  <span className="e4s-listing-detail__ci-label e4s-listing-detail__ci-label--meta">
                    ABN {listing.abn}
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="e4s-listing-detail__cards">
          <div className="e4s-listing-detail__cards-layout">
            <div className="e4s-listing-detail__cards-main">
              <div className="e4s-listing-detail__card-shell">
                <div className="e4s-listing-detail__card-ids" aria-label="Listing identifiers">
                  {listing.business_id && (
                    <Link href={`/profile/${toProfileSlug(listing.business_id!, listing.business_name || listing.title)}`} className="e4s-listing-detail__card-id e4s-listing-detail__card-id--business e4s-listing-detail__card-id--link">
                      Profile ID {listing.business_id}
                    </Link>
                  )}
                  <span className="e4s-listing-detail__card-id e4s-listing-detail__card-id--listing">
                    Listing ID {listing.id}
                  </span>
                  <span className="e4s-listing-detail__card-id e4s-listing-detail__card-id--current">
                    Currently viewing
                  </span>
                </div>
                <ListingCard listing={listing} />
              </div>
              {siblings.map((r) => (
                <div className="e4s-listing-detail__card-shell" key={r.id}>
                  <div className="e4s-listing-detail__card-ids" aria-label="Listing identifiers">
                    {r.business_id && (
                      <Link href={`/profile/${toProfileSlug(r.business_id!, r.business_name || r.title)}`} className="e4s-listing-detail__card-id e4s-listing-detail__card-id--business e4s-listing-detail__card-id--link">
                        Profile ID {r.business_id}
                      </Link>
                    )}
                    <span className="e4s-listing-detail__card-id e4s-listing-detail__card-id--listing">
                      Listing ID {r.id}
                    </span>
                  </div>
                  <ListingCard listing={r} />
                </div>
              ))}
            </div>
            <aside className="e4s-listing-detail__cards-side" aria-label="Advertise on Events4Singles">
              <Link className="e4s-listing-detail__promo-tile" href="/advertise">
                <strong>Advertise on Events4Singles</strong>
                <span>Promote events and services to singles browsing this directory.</span>
              </Link>
            </aside>
          </div>
        </section>

      </div>
    </main>
  );
}
