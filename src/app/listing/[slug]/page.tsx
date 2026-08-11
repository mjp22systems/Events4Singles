import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getListingById, getAllListingIds } from "@/lib/data";

export function generateStaticParams() {
  return getAllListingIds().map((id) => ({ slug: String(id) }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = parseInt(slug, 10);
  if (isNaN(id)) return {};
  const listing = getListingById(id);
  if (!listing) return {};
  const title = listing.business_name || listing.title;
  return {
    title,
    description: listing.tagline || listing.description || `${title} — Australian singles events directory.`,
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const id = parseInt(slug, 10);
  if (isNaN(id)) notFound();

  const listing = getListingById(id);
  if (!listing) notFound();

  const title = listing.business_name || listing.title;
  const phone = listing.phone || listing.mobile;
  const web = listing.web || listing.business_website;
  const webHref = web ? (web.startsWith("http") ? web : `https://${web}`) : null;

  return (
    <>
      <section className="e4s-page-hero">
        <div className="e4s-page-hero__caption">
          <h1>{title}</h1>
          {listing.tagline && <p>{listing.tagline}</p>}
        </div>
      </section>

      <div className="e4s-shell" style={{ padding: "32px 0" }}>
        <nav style={{ marginBottom: "24px", fontSize: "13px" }}>
          <Link href="/" style={{ color: "var(--e4s-teal)" }}>Home</Link>
          {" · "}
          <span>{title}</span>
        </nav>

        <article className="e4s-listing-card" style={{ maxWidth: "760px" }}>
          <header className="e4s-listing-card__header">
            <div className="e4s-listing-card__identity">
              <h2 className="e4s-listing-card__title">{title}</h2>
            </div>
            <div className="e4s-listing-card__actions">
              <span className="e4s-listing-card__contact e4s-listing-card__contact--empty">Contact</span>
              {phone ? (
                <a aria-label={`Call ${title}`} className="e4s-listing-card__action e4s-listing-card__action--phone" href={`tel:${phone}`} />
              ) : (
                <span aria-hidden="true" className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--phone" />
              )}
              {listing.email ? (
                <a aria-label={`Email ${title}`} className="e4s-listing-card__action e4s-listing-card__action--email" href={`mailto:${listing.email}`} />
              ) : (
                <span aria-hidden="true" className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--email" />
              )}
              {webHref ? (
                <a aria-label={`Visit ${title} website`} className="e4s-listing-card__action e4s-listing-card__action--web" href={webHref} rel="noopener" target="_blank" />
              ) : (
                <span aria-hidden="true" className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--web" />
              )}
              <span aria-hidden="true" className="e4s-listing-card__action e4s-listing-card__action--disabled e4s-listing-card__action--address" />
            </div>
          </header>
          <div className="e4s-listing-card__body">
            <div className="e4s-listing-card__media">
              {listing.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={`${title} logo`} loading="lazy" src={listing.image_url} />
              )}
            </div>
            <div className="e4s-listing-card__content">
              {listing.description && <p>{listing.description}</p>}
              {listing.promo && <p className="e4s-listing-card__promo">{listing.promo}</p>}
              {listing.location && (
                <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--e4s-text-muted)" }}>
                  {listing.location}
                  {listing.location_city && `, ${listing.location_city}`}
                  {listing.location_state && ` ${listing.location_state}`}
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
