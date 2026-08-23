import Link from "next/link";
import { articles } from "@/content/articles";
import { CATEGORY_COPY, articleCategory, groupArticles, topicId } from "@/content/article-categories";
import FeaturedArticlesCarousel, { type FeaturedArticleCard } from "@/components/featured-articles-carousel";

function featuredArticles(groups: ReturnType<typeof groupArticles>): FeaturedArticleCard[] {
  const dayOffset = Math.floor(Date.now() / 86_400_000);
  const picked: typeof articles = [];
  const seen = new Set<string>();

  groups.forEach((group, groupIndex) => {
    const index = (dayOffset + groupIndex) % group.articles.length;
    const article = group.articles[index];
    if (article && !seen.has(article.slug)) {
      picked.push(article);
      seen.add(article.slug);
    }
  });

  articles.forEach((article, index) => {
    if (picked.length >= 8) return;
    const rotated = articles[(index + dayOffset) % articles.length];
    if (rotated && !seen.has(rotated.slug)) {
      picked.push(rotated);
      seen.add(rotated.slug);
    }
  });

  return picked.slice(0, 8).map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: articleCategory(article),
  }));
}

export default function DatingResourcesHub() {
  const groups = groupArticles(articles);
  const featured = featuredArticles(groups);

  return (
    <main className="e4s-info-page e4s-shell e4s-blog" id="site-content">
      <header className="e4s-blog-hero">
        <h1>Dating Resources</h1>
        <p className="e4s-lead">
          Practical dating advice, singles guides and relationship resources for meeting people,
          preparing for dates, flirting, online dating and making the most of singles events.
        </p>
      </header>

      <nav className="e4s-blog-topic-nav" aria-label="Dating resource topics">
        {groups.map((group) => (
          <a key={group.category} href={`#${topicId(group.category)}`}>
            <span>{group.category}</span>
          </a>
        ))}
      </nav>

      {featured.length ? (
        <section className="e4s-blog-featured" aria-labelledby="featured-resources">
          <div className="e4s-blog-section-heading">
            <div>
              <h2 id="featured-resources">Featured Articles</h2>
            </div>
            <p>Good starting points for practical, readable guidance.</p>
          </div>
          <FeaturedArticlesCarousel articles={featured} />
        </section>
      ) : null}

      <section className="e4s-blog-directory" aria-labelledby="browse-topics">
        <aside className="e4s-blog-sidebar">
          <h2 id="browse-topics">Browse Topics</h2>
          <p>Jump to a topic or browse the full resource library below.</p>
          <nav aria-label="Dating resources topic menu">
            {groups.map((group) => (
              <a key={group.category} href={`#${topicId(group.category)}`}>
                <span>{group.category}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="e4s-blog-groups">
          {groups.map((group) => {
            const [leadArticle, ...otherArticles] = group.articles;
            return (
              <section
                key={group.category}
                id={topicId(group.category)}
                className="e4s-blog-group"
              >
                <div className="e4s-blog-section-heading">
                  <div>
                    <h2>{group.category}</h2>
                    <p>{CATEGORY_COPY[group.category]}</p>
                  </div>
                </div>

                <div className="e4s-blog-card-grid">
                  {[leadArticle, ...otherArticles].filter(Boolean).map((article) => (
                    <Link key={article.slug} href={`/dating-resources/${article.slug}`} className="e4s-article-card">
                      <h3 className="e4s-article-card__title">{article.title}</h3>
                      <p className="e4s-article-card__desc">{article.description}</p>
                      <span className="e4s-article-card__cta">Read article -&gt;</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="e4s-blog-idea-band" aria-labelledby="content-coming-next">
        <div>
          <h2 id="content-coming-next">More singles articles coming</h2>
          <p>
            This section can keep growing with suburb guides, event explainers, dating safety,
            over-40s dating, online dating comparisons and dance/social event guides.
          </p>
        </div>
        <Link href="/events">Browse singles events</Link>
      </section>
    </main>
  );
}
