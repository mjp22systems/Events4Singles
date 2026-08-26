import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getProfileData } from "@/lib/data";
import ListingCard from "@/components/listing-card";
import OnlineCard from "@/components/online-card";
import ProfileEditDrawer from "@/components/profile-edit-drawer";
import ProfileEventsFilter from "@/components/profile-events-filter";
import BackLink from "@/components/back-link";
import { PublicMain } from "@/components/public-page";
import { pageMetadata } from "@/lib/seo";
import { toUrlSlug, toProfileSlug, slugToLabel } from "@/lib/constants";
import { verifyAdminToken, SESSION_COOKIE } from "@/lib/admin-auth";
import { eventPath } from "@/lib/event-slugs";
import { eventDescriptionExcerpt } from "@/lib/event-text";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ events?: string }>;
}

const SOCIAL_PLATFORMS = [
  { key: "facebook_url" as const, label: "Facebook", icon: "f" },
  { key: "instagram_url" as const, label: "Instagram", icon: "◎" },
  { key: "tiktok_url" as const, label: "TikTok", icon: "♪" },
  { key: "youtube_url" as const, label: "YouTube", icon: "▶" },
  { key: "linkedin_url" as const, label: "LinkedIn", icon: "in" },
];

const TYPE_CONFIG: Record<string, { label: string; cls: string; icon: string }> = {
  event_organizer:    { label: "Activities & Events", cls: "e4s-type-badge--eo",     icon: "⚡" },
  venue:        { label: "Venue",           cls: "e4s-type-badge--venue",  icon: "🏛" },
  service:      { label: "Service",         cls: "e4s-type-badge--svc",    icon: "🛠" },
  practitioner: { label: "Practitioner",    cls: "e4s-type-badge--prac",   icon: "👤" },
  online:       { label: "Online Service",  cls: "e4s-type-badge--online", icon: "🌐" },
  standard:     { label: "Listed",          cls: "e4s-type-badge--std",    icon: "" },
};

function splitList(v: string | null | undefined) {
  return (v || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function collectCityLinks(listings: Listing[], max = 5): { slug: string; label: string }[] {
  const seen = new Set<string>();
  const out: { slug: string; label: string }[] = [];
  for (const listing of listings) {
    const slugs = splitList(listing.city_slugs);
    const labels = splitList(listing.city_labels);
    for (let i = 0; i < slugs.length && out.length < max; i++) {
      const slug = slugs[i];
      if (!seen.has(slug)) {
        seen.add(slug);
        out.push({ slug, label: labels[i] || slugToLabel(slug) });
      }
    }
  }
  return out;
}

function collectCategorySlugs(listings: Listing[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const listing of listings) {
    for (const slug of splitList(listing.category_slugs)) {
      if (!seen.has(slug)) { seen.add(slug); out.push(slug); }
    }
  }
  return out;
}

function formatEventDate(iso: string, timezone: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    });
  } catch {
    return iso;
  }
}

function formatEventPrice(min: number | null) {
  if (min === null) return null;
  if (min === 0) return "Free";
  return `From $${(min / 100).toFixed(0)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params;
  const { business, listings } = await getProfileData(slug);
  if (!business && listings.length === 0) return {};
  const name = business?.name || listings[0]?.business_name || listings[0]?.title || "Profile";
  const canonicalSlug = business?.profile_slug ?? (business ? toProfileSlug(business.id, name) : slug);
  return pageMetadata({
    title: `${name} - Singles Events Profile`,
    description:
      business?.description ||
      listings[0]?.tagline ||
      `${name} profile, listings and contact details on Events4Singles.`,
    path: `/profile/${canonicalSlug}`,
    keywords: [name].filter(Boolean),
    image: business?.logo_url || listings[0]?.image_url || "/icon.png",
  });
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { id: slug } = await params;
  const search = searchParams ? await searchParams : {};
  const eventFilter = search.events === "past" ? "past" : "upcoming";
  const profileData = await getProfileData(slug, eventFilter);
  const { business, listings } = profileData;
  const banners = profileData.banners ?? [];
  const events = profileData.events ?? [];
  const nextEvent = profileData.nextEvent ?? null;
  const totalEvents = profileData.totalEvents ?? events.length;
  if (!business && listings.length === 0) notFound();

  const cookieStore = await cookies();
  const adminToken = cookieStore.get(SESSION_COOKIE)?.value;
  const isAdmin = adminToken ? await verifyAdminToken(adminToken) : false;

  const primary = listings[0] ?? null;
  const name = business?.name || primary?.business_name || primary?.title || "Profile";
  const tagline = primary?.tagline ?? null;
  const description = business?.description || primary?.description || null;
  const promo = primary?.promo ?? null;
  const logoUrl = business?.logo_url || primary?.image_url || null;
  const web = business?.website || primary?.web || primary?.business_website;
  const webHref = web ? (web.startsWith("http") ? web : `https://${web}`) : null;
  const domain = web ? web.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] : null;
  const contactName = business?.contact_name || primary?.contact_name;
  const phone = business?.phone || business?.mobile || primary?.phone || primary?.mobile;
  const email = business?.email || primary?.email;
  const businessId = business?.id ?? null;
  const showAdminEditor = isAdmin && business !== null;

  const isVerified = !!business?.advertiser_id;
  const ltype = primary?.listing_type ?? "standard";
  const typeConf = TYPE_CONFIG[ltype] ?? TYPE_CONFIG.standard;
  const isVenue = ltype === "venue";
  const isPractitioner = ltype === "practitioner";
  const isOnline = ltype === "online";

  const cityLinks = collectCityLinks(listings, 20);
  const categoryLinks = collectCategorySlugs(listings).map((s) => ({
    slug: s,
    label: slugToLabel(s),
    href: `/${toUrlSlug(s)}`,
  }));

  const address = primary
    ? [primary.location, primary.location_city, primary.location_state].filter(Boolean).join(", ")
    : null;
  const mapsUrl = address
    ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
    : null;

  return (
    <PublicMain>
      {showAdminEditor && <link rel="stylesheet" href="/admin.css" precedence="high" />}
      {showAdminEditor && (
        <ProfileEditDrawer business={business} />
      )}
      <div className="e4s-shell">

        {/* Nav */}
        <div className="e4s-profile-nav">
          <BackLink />
          <nav className="e4s-listing-detail__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>{" / "}<span>{name}</span>
          </nav>
        </div>

        {/* Profile card */}
        <div className="e4s-profile-card">

          {/* Head */}
          <div className="e4s-profile-head">
            <div className="e4s-profile-head__left">
              <div className="e4s-profile-head__row">
                {isPractitioner && logoUrl && (
                  <div className="e4s-profile-prac-photo">
                    <img src={logoUrl} alt={name} loading="lazy" />
                  </div>
                )}
                <span className="e4s-profile-head__name">{name}</span>
                {isVerified && <span className="e4s-listing-card__verified">✓ Verified</span>}
              </div>
              {tagline && <p className="e4s-profile-head__tagline">{tagline}</p>}
            </div>
            <div className="e4s-profile-head__right">
              {businessId && (
                <span className="e4s-profile-head__id">Profile ID {businessId}</span>
              )}
              {ltype && ltype !== "standard" && (
                <span className={`e4s-type-badge ${typeConf.cls}`}>
                  {typeConf.icon} {typeConf.label}
                </span>
              )}
            </div>
          </div>

          <div className={`e4s-events-strip${nextEvent ? " e4s-events-strip--active" : " e4s-events-strip--none"}`}>
            {nextEvent ? (
              <Link href={eventPath(nextEvent)}>
                Upcoming event: {nextEvent.title}
              </Link>
            ) : (
              <span>📅 No upcoming events listed for this profile</span>
            )}
          </div>

          {/* Body */}
          <div className="e4s-profile-body">

            {/* Main */}
            <div className="e4s-profile-main">

              {/* About */}
              {description && (
                <div className="e4s-profile-sec">
                  <div className="e4s-profile-sec__label">About</div>
                  <div className="e4s-profile-sec__body">{description}</div>
                  {promo && <div className="e4s-profile-promo">{promo}</div>}
                </div>
              )}
              {description && (categoryLinks.length > 0 || cityLinks.length > 0) && (
                <hr className="e4s-profile-divider" />
              )}

              {/* Map tile — venue only */}
              {isVenue && address && mapsUrl && (
                <div className="e4s-profile-sec">
                  <div className="e4s-profile-sec__label">Location</div>
                  <a href={mapsUrl} className="e4s-profile-map" rel="noopener" target="_blank" aria-label={`View ${name} on map`}>
                    <div className="e4s-profile-map__thumb" aria-hidden="true" />
                    <div>
                      <div className="e4s-profile-map__addr">{address}</div>
                      <div className="e4s-profile-map__cta">View map &amp; directions ›</div>
                    </div>
                  </a>
                </div>
              )}

              {/* Listed under */}
              {(categoryLinks.length > 0 || cityLinks.length > 0) && (
                <div className="e4s-profile-sec">
                  <div className="e4s-profile-sec__label">Listed under</div>
                  <div className="e4s-profile-under-body">
                    <div className="e4s-profile-under-tags">
                      {categoryLinks.length > 0 && (
                        <>
                          <div className="e4s-profile-placed__sub-label">Categories</div>
                          <div className="e4s-profile-placed">
                            {categoryLinks.map((c) => (
                              <Link key={c.slug} href={c.href} className="e4s-profile-placed__tag">
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                      {cityLinks.length > 0 && (
                        <>
                          <div className="e4s-profile-placed__sub-label">Cities</div>
                          <div className="e4s-profile-placed">
                            {cityLinks.map((c) => (
                              <Link key={c.slug} href={`/${toUrlSlug(c.slug)}`} className="e4s-profile-placed__tag e4s-profile-placed__tag--city">
                                📍 {c.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="e4s-profile-under-claim">
                      {isVerified ? (
                        <div className="e4s-profile-verified-seal">
                          <span className="e4s-profile-verified-seal__icon">✓</span>
                          <div>
                            <strong>Verified listing</strong>
                            <span>This business is owned and managed by a verified advertiser.</span>
                          </div>
                        </div>
                      ) : (
                        <Link href="/advertise" className="e4s-profile-claim-tile">
                          <strong>Your listing?</strong>
                          <span>Claim this listing to manage your profile, add photos, and respond to enquiries.</span>
                          <span className="e4s-profile-claim-tile__cta">Claim listing ›</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="e4s-profile-sidebar">
              <div className="e4s-profile-sb-sec">
                <div className="e4s-profile-sb-label">Connect</div>

                {/* Social row */}
                {primary && (
                  <div className="e4s-profile-social-row">
                    {SOCIAL_PLATFORMS.map((p) => {
                      const href = business?.[p.key] || primary[p.key];
                      const fullHref = href ? (href.startsWith("http") ? href : `https://${href}`) : null;
                      return fullHref ? (
                        <a key={p.key} href={fullHref} rel="noopener" target="_blank"
                          className="e4s-profile-social-btn e4s-profile-social-btn--on"
                          aria-label={p.label} title={p.label}>
                          {p.icon}
                        </a>
                      ) : (
                        <span key={p.key} className="e4s-profile-social-btn" aria-label={`${p.label} not listed`}>
                          {p.icon}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Online: big Visit Site CTA */}
                {isOnline && webHref && (
                  <a href={webHref} rel="noopener" target="_blank" className="e4s-profile-visit-cta">
                    Visit website
                    {domain && <span>{domain}</span>}
                  </a>
                )}

                {/* Contact name */}
                {contactName ? (
                  <div className="e4s-profile-contact-row">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">👤</span>
                    <span className="e4s-profile-contact-row__text">{contactName}</span>
                  </div>
                ) : (
                  <div className="e4s-profile-contact-row e4s-profile-contact-row--off">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">👤</span>
                    <span className="e4s-profile-contact-row__text">Not listed</span>
                  </div>
                )}

                {/* Phone */}
                {phone ? (
                  <a href={`tel:${phone}`} className="e4s-profile-contact-row">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">☎</span>
                    <span className="e4s-profile-contact-row__text">{phone}</span>
                    <span className="e4s-profile-contact-row__arr" aria-hidden="true">›</span>
                  </a>
                ) : (
                  <div className="e4s-profile-contact-row e4s-profile-contact-row--off">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">☎</span>
                    <span className="e4s-profile-contact-row__text">Not listed</span>
                  </div>
                )}

                {/* Email */}
                {email ? (
                  <a href={`mailto:${email}`} className="e4s-profile-contact-row" aria-label={`Email ${name}`}>
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">✉</span>
                    <span className="e4s-profile-contact-row__text">Send email</span>
                    <span className="e4s-profile-contact-row__arr" aria-hidden="true">›</span>
                  </a>
                ) : (
                  <div className="e4s-profile-contact-row e4s-profile-contact-row--off">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">✉</span>
                    <span className="e4s-profile-contact-row__text">Not listed</span>
                  </div>
                )}

                {/* Website — hidden only when online type already has the big CTA with a URL */}
                {(isOnline && webHref) ? null : webHref ? (
                  <a href={webHref} rel="noopener" target="_blank" className="e4s-profile-contact-row">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">🌐</span>
                    <span className="e4s-profile-contact-row__text">Visit website</span>
                    <span className="e4s-profile-contact-row__arr" aria-hidden="true">›</span>
                  </a>
                ) : (
                  <div className="e4s-profile-contact-row e4s-profile-contact-row--off">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">🌐</span>
                    <span className="e4s-profile-contact-row__text">Not listed</span>
                  </div>
                )}

                {/* Address — all types show if available; venue/event_organizer show placeholder if not */}
                {address ? (
                  mapsUrl ? (
                    <a href={mapsUrl} rel="noopener" target="_blank" className="e4s-profile-contact-row">
                      <span className="e4s-profile-contact-row__icon" aria-hidden="true">📍</span>
                      <span className="e4s-profile-contact-row__text">{address}</span>
                      <span className="e4s-profile-contact-row__arr" aria-hidden="true">›</span>
                    </a>
                  ) : (
                    <div className="e4s-profile-contact-row">
                      <span className="e4s-profile-contact-row__icon" aria-hidden="true">📍</span>
                      <span className="e4s-profile-contact-row__text">{address}</span>
                    </div>
                  )
                ) : (isVenue || ltype === "event_organizer") ? (
                  <div className="e4s-profile-contact-row e4s-profile-contact-row--off">
                    <span className="e4s-profile-contact-row__icon" aria-hidden="true">📍</span>
                    <span className="e4s-profile-contact-row__text">
                      {ltype === "event_organizer" ? "No fixed address" : "Not listed"}
                    </span>
                  </div>
                ) : null}
              </div>

            </aside>

          </div>
        </div>

        {/* Current Ads — listings + banners */}
        <section className="e4s-profile-activity">
          <p className="e4s-profile-activity__eyebrow">Current Ads</p>
          <div className="e4s-profile-activity__cols">
            <div className="e4s-profile-activity__col">
              <div className="e4s-profile-activity__col-head">
                Listings <span className="e4s-profile-activity__count">({listings.length})</span>
              </div>
              {listings.length > 0 ? (
                <div className="e4s-profile-stack">
                  {listings.map((listing) =>
                    listing.listing_type === "online" ? (
                      <OnlineCard key={listing.id} listing={listing} context="profile" isAdmin={isAdmin} />
                    ) : (
                      <ListingCard key={listing.id} listing={listing} context="profile" isAdmin={isAdmin} />
                    )
                  )}
                </div>
              ) : (
                <div className="e4s-profile-activity__empty">This advertiser doesn&apos;t currently have any active listings.</div>
              )}
            </div>
            <div className="e4s-profile-activity__col">
              <div className="e4s-profile-activity__col-head">
                Banners <span className="e4s-profile-activity__count">({banners.length})</span>
              </div>
              {banners.length > 0 ? (
                <div className="e4s-profile-banners">
                  {banners.map((banner) => (
                    <a
                      key={banner.id}
                      className="e4s-profile-banner"
                      href={banner.click_url}
                      rel="noopener"
                      target={banner.click_url.startsWith("/") ? undefined : "_blank"}
                      title={banner.alt_text}
                    >
                      <img alt={`${banner.alt_text} advertiser banner`} loading="lazy" src={banner.image_url} />
                      {banner.placement && <span>{slugToLabel(banner.placement)}</span>}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="e4s-profile-banner-placeholder">
                  This advertiser doesn&apos;t currently promote any banner ads.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="e4s-profile-events">
          <div className="e4s-profile-activity__col-head">
            Events <span className="e4s-profile-activity__count">({totalEvents})</span>
            <ProfileEventsFilter value={eventFilter} />
          </div>
          <div className="e4s-profile-events__grid">
            {events.map((event) => {
                const price = formatEventPrice(event.price_min);
                const location = [event.venue_name, event.suburb, event.city].filter(Boolean).join(", ");
                const excerpt = eventDescriptionExcerpt(event.description);
                return (
                  <article className="e4s-home-event-card e4s-profile-event-card" key={event.id}>
                    {event.image_url && (
                      <div className="e4s-home-event-card__img">
                        <img alt={event.title} loading="lazy" src={event.image_url} />
                      </div>
                    )}
                    <div className="e4s-home-event-card__body">
                      <p className="e4s-home-event-card__date">{formatEventDate(event.starts_at, event.timezone)}</p>
                      <h3>{event.title}</h3>
                      {location && <p className="e4s-home-event-card__location">{location}</p>}
                      {excerpt && <p className="e4s-home-event-card__desc">{excerpt}</p>}
                      {price && <p className="e4s-home-event-card__meta">{price}</p>}
                      <Link className="e4s-home-event-card__link" href={eventPath(event)}>View Details</Link>
                    </div>
                  </article>
                );
            })}
            {Array.from({ length: Math.max(0, Math.max(4, Math.ceil(events.length / 4) * 4) - events.length) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="e4s-profile-event-placeholder">
                <div className="e4s-profile-event-placeholder__img" aria-hidden="true" />
                <div className="e4s-profile-event-placeholder__body">
                  <span>No {eventFilter === "past" ? "past" : "upcoming"} event in this slot</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PublicMain>
  );
}
