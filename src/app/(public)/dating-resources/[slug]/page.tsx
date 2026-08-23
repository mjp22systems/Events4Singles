import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Article } from "@/content/articles";
import { articles, getArticle } from "@/content/articles";
import { articleCategory, groupArticles, topicId } from "@/content/article-categories";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

function articlePath(article: Article) {
  return `/dating-resources/${article.slug}`;
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function articleKeywords(article: Article) {
  const category = articleCategory(article);
  return [
    "dating resources",
    "dating advice Australia",
    "singles advice",
    "relationship resources",
    category.toLowerCase(),
  ];
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: articlePath(article),
    keywords: articleKeywords(article),
  });
}

export default async function DatingResourceArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = articleCategory(article);
  const topicGroups = groupArticles(articles);
  const categoryArticles = articles.filter((item) => articleCategory(item) === category);
  const categoryIndex = categoryArticles.findIndex((item) => item.slug === article.slug);
  const previousArticle = categoryIndex > 0 ? categoryArticles[categoryIndex - 1] : null;
  const nextArticle = categoryIndex >= 0 && categoryIndex < categoryArticles.length - 1
    ? categoryArticles[categoryIndex + 1]
    : null;
  const relatedArticles = categoryArticles.filter((item) => item.slug !== article.slug).slice(0, 4);
  const fallbackArticles = relatedArticles.length
    ? relatedArticles
    : articles.filter((item) => item.slug !== article.slug).slice(0, 3);
  const articleUrl = `${SITE_URL}${articlePath(article)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      articleSection: category,
      author: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      url: articleUrl,
      wordCount: stripHtml(article.content).split(/\s+/).filter(Boolean).length,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Dating Resources",
          item: `${SITE_URL}/dating-resources`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: article.title,
          item: articleUrl,
        },
      ],
    },
  ];

  return (
    <main className="e4s-info-page e4s-shell e4s-blog-article" id="site-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {previousArticle ? (
        <Link
          aria-label={`Previous article: ${previousArticle.title}`}
          className="e4s-location-pager e4s-location-pager--prev e4s-article-side-pager"
          href={`/dating-resources/${previousArticle.slug}`}
        >
          <span className="e4s-location-pager__icon" />
          <span className="e4s-location-pager__label">{previousArticle.title}</span>
        </Link>
      ) : null}
      {nextArticle ? (
        <Link
          aria-label={`Next article: ${nextArticle.title}`}
          className="e4s-location-pager e4s-location-pager--next e4s-article-side-pager"
          href={`/dating-resources/${nextArticle.slug}`}
        >
          <span className="e4s-location-pager__icon" />
          <span className="e4s-location-pager__label">{nextArticle.title}</span>
        </Link>
      ) : null}

      <div className="e4s-blog-article-layout">
        <article>
          <header className="e4s-blog-article-hero">
            <h1>{article.title}</h1>
            <p className="e4s-blog-eyebrow">{category}</p>
            <p className="e4s-lead">{article.description}</p>
          </header>

          <div
            className="e4s-article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <aside className="e4s-blog-article-aside" aria-label="More dating resources">
          <Link className="e4s-blog-return-link" href="/dating-resources">
            Back to Dating Resources
          </Link>

          <section className="e4s-blog-topic-menu">
            <h2>Browse topics</h2>
            <nav aria-label="Dating resources topic menu">
              {topicGroups.map((group) => (
                <Link
                  key={group.category}
                  href={`/dating-resources#${topicId(group.category)}`}
                  aria-current={group.category === category ? "true" : undefined}
                >
                  <span>{group.category}</span>
                  <small>{group.articles.length}</small>
                </Link>
              ))}
            </nav>
          </section>

          <section>
            <h2>More in this topic</h2>
            <div className="e4s-blog-related-list">
              {fallbackArticles.map((item) => (
                <Link key={item.slug} href={`/dating-resources/${item.slug}`}>
                  <span>{articleCategory(item)}</span>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </Link>
              ))}
            </div>
          </section>

          <section className="e4s-blog-aside-cta">
            <h2>Find something social</h2>
            <p>Browse singles events, dance classes, dinner parties and social clubs around Australia.</p>
            <Link href="/events">View events</Link>
          </section>
        </aside>
      </div>

      <nav className="e4s-blog-post-nav" aria-label="Article navigation">
        {previousArticle ? (
          <Link className="e4s-blog-post-nav__link e4s-blog-post-nav__link--prev" href={`/dating-resources/${previousArticle.slug}`}>
            <span className="e4s-blog-post-nav__meta">Previous in topic</span>
            <span className="e4s-blog-post-nav__row">
              <span className="e4s-blog-post-nav__arrow" aria-hidden="true">←</span>
              <strong>{previousArticle.title}</strong>
            </span>
          </Link>
        ) : <span />}
        {nextArticle ? (
          <Link className="e4s-blog-post-nav__link e4s-blog-post-nav__link--next" href={`/dating-resources/${nextArticle.slug}`}>
            <span className="e4s-blog-post-nav__meta">Next in topic</span>
            <span className="e4s-blog-post-nav__row">
              <strong>{nextArticle.title}</strong>
              <span className="e4s-blog-post-nav__arrow" aria-hidden="true">→</span>
            </span>
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
