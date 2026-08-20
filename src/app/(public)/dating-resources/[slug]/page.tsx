import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Article } from "@/content/articles";
import { articles, getArticle } from "@/content/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

function articleCategory(article: Article) {
  return article.category || "Featured Guides";
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function DatingResourceArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articleIndex = articles.findIndex((item) => item.slug === article.slug);
  const previousArticle = articleIndex > 0 ? articles[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < articles.length - 1 ? articles[articleIndex + 1] : null;
  const category = articleCategory(article);
  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug && articleCategory(item) === category)
    .slice(0, 3);
  const fallbackArticles = relatedArticles.length
    ? relatedArticles
    : articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <main className="e4s-info-page e4s-shell e4s-blog-article" id="site-content">
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

      <nav className="e4s-blog-breadcrumb" aria-label="Breadcrumb">
        <Link href="/dating-resources">Dating Resources</Link>
        <span>/</span>
        <span>{category}</span>
        <span>/</span>
        <span>{article.title}</span>
      </nav>

      <div className="e4s-blog-article-layout">
        <article>
          <header className="e4s-blog-article-hero">
            <p className="e4s-blog-eyebrow">{category}</p>
            <h1>{article.title}</h1>
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

          <section>
            <h2>Related reads</h2>
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
          <Link href={`/dating-resources/${previousArticle.slug}`}>
            <span>Previous article</span>
            <strong>{previousArticle.title}</strong>
          </Link>
        ) : <span />}
        {nextArticle ? (
          <Link href={`/dating-resources/${nextArticle.slug}`}>
            <span>Next article</span>
            <strong>{nextArticle.title}</strong>
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
