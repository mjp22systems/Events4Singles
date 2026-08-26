import BodyClass from "@/components/body-class";

type PageHeroProps = {
  ariaLabel: string;
  media: React.ReactNode;
  title: React.ReactNode;
  subtext?: React.ReactNode;
  children?: React.ReactNode;
};

type EditorialIntroProps = {
  lead: React.ReactNode;
  detail?: React.ReactNode;
  support?: React.ReactNode;
  children?: React.ReactNode;
};

type ListingDirectoryPageProps = {
  jsonLd?: unknown;
  bodyClasses?: string[];
  beforeHero?: React.ReactNode;
  hero: React.ReactNode;
  promo?: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  sidebar: React.ReactNode;
  after?: React.ReactNode;
};

export function PageHero({ ariaLabel, media, title, subtext, children }: PageHeroProps) {
  return (
    <section aria-label={ariaLabel} className="e4s-page-hero">
      {media}
      <div className="e4s-page-hero__caption">
        <h1>{title}</h1>
        {subtext ? <p>{subtext}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function EditorialIntro({ lead, detail, support, children }: EditorialIntroProps) {
  return (
    <section className="e4s-page-intro e4s-page-intro--editorial">
      <p className="e4s-page-intro__lead">{lead}</p>
      {detail ? <p>{detail}</p> : null}
      {support ? <p>{support}</p> : null}
      {children}
    </section>
  );
}

export function ListingDirectoryPage({
  jsonLd,
  bodyClasses = [],
  beforeHero,
  hero,
  promo,
  intro,
  children,
  sidebar,
  after,
}: ListingDirectoryPageProps) {
  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {bodyClasses.map((bodyClass) => (
        <BodyClass add={bodyClass} key={bodyClass} />
      ))}
      {beforeHero}
      {hero}
      {promo}
      {intro}
      <div className="e4s-page-with-sidebar">
        <main className="e4s-category-template" id="site-content">
          {children}
        </main>
        {sidebar}
      </div>
      {after}
    </>
  );
}
