type SeoSupportSectionProps = {
  heading: string;
  body: string;
  support?: string;
};

export default function SeoSupportSection({ heading, body, support }: SeoSupportSectionProps) {
  return (
    <section className="e4s-shell e4s-seo-support">
      <h2>{heading}</h2>
      <p>{body}</p>
      {support && <p>{support}</p>}
    </section>
  );
}
