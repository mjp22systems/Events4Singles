import Link from "next/link";
import { articles } from "@/content/articles";

const CATEGORY_ORDER = [
  "Featured Guides",
  "Dating Advice",
  "Flirting & Romance",
  "Relationships",
  "Personal Growth",
  "Resources",
];

function groupArticles() {
  const groups = articles.reduce<Record<string, typeof articles>>((acc, article) => {
    const category = article.category || "Featured Guides";
    acc[category] ??= [];
    acc[category].push(article);
    return acc;
  }, {});

  return CATEGORY_ORDER
    .filter((category) => groups[category]?.length)
    .map((category) => ({ category, articles: groups[category] }));
}

export default function DatingResourcesHub() {
  const groups = groupArticles();
  const featured = articles.slice(0, 4);
  const primaryFeature = featured[0];
  const secondaryFeatures = featured.slice(1);

  return (
    <main className="e4s-info-page e4s-shell e4s-blog" id="site-content">
      <header className="e4s-blog-hero">
        <div>
          <p className="e4s-blog-eyebrow">Dating Resources</p>
          <h1>Dating advice, singles guides and relationship resources</h1>
          <p className="e4s-lead">
            Browse practical articles for meeting people, preparing for dates, flirting,
            relationship confidence, online dating, and making the most of singles events.
          </p>
        </div>
        <nav className="e4s-blog-topic-nav" aria-label="Dating resource topics">
          {groups.map((group) => (
            <a key={group.category} href={`#${group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              {group.category}
            </a>
          ))}
        </nav>
      </header>

      {primaryFeature ? (
        <section className="e4s-blog-featured" aria-labelledby="featured-resources">
          <div className="e4s-blog-section-heading">
            <h2 id="featured-resources">Featured resources</h2>
            <p>Good starting points for singles who want practical, readable guidance.</p>
          </div>
          <div className="e4s-blog-featured-grid">
            <Link href={`/dating-resources/${primaryFeature.slug}`} className="e4s-blog-feature-card e4s-blog-feature-card--primary">
              <span>{primaryFeature.category || "Featured Guide"}</span>
              <h3>{primaryFeature.title}</h3>
              <p>{primaryFeature.description}</p>
              <strong>Read article -&gt;</strong>
            </Link>
            <div className="e4s-blog-feature-stack">
              {secondaryFeatures.map((article) => (
                <Link key={article.slug} href={`/dating-resources/${article.slug}`} className="e4s-blog-feature-card">
                  <span>{article.category || "Featured Guide"}</span>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="e4s-blog-groups">
        {groups.map((group) => (
          <section
            key={group.category}
            id={group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            className="e4s-blog-group"
          >
            <div className="e4s-blog-section-heading">
              <h2>{group.category}</h2>
              <p>{group.articles.length} articles</p>
            </div>
            <div className="e4s-blog-list">
              {group.articles.map((article) => (
                <Link key={article.slug} href={`/dating-resources/${article.slug}`} className="e4s-blog-card">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <span>Read article -&gt;</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
