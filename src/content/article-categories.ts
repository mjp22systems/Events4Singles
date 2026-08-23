import type { Article } from "@/content/articles";

export const CATEGORY_ORDER = [
  "Start Here",
  "Singles Events & Offline Dating",
  "Online Dating & Safety",
  "Conversation & Chemistry",
  "Healthy Relationships",
  "Life Stages",
  "Confidence & Wellbeing",
  "Trusted Resources",
] as const;

export const CATEGORY_COPY: Record<string, string> = {
  "Start Here": "Orientation guides for choosing a dating path, building a plan and using the library well.",
  "Singles Events & Offline Dating": "How to meet people through real-world events, dinners, activities, agencies and local social life.",
  "Online Dating & Safety": "Dating apps, profiles, scam awareness, privacy and practical first-meeting safety.",
  "Conversation & Chemistry": "First dates, flirting, body language, follow-up messages and asking someone out clearly.",
  "Healthy Relationships": "Green flags, boundaries, communication, conflict and deciding whether a connection has real potential.",
  "Life Stages": "Dating after divorce, dating over 40 or 50, single parents and other real-life relationship contexts.",
  "Confidence & Wellbeing": "Social confidence, rejection, burnout, loneliness and the inner work that makes dating healthier.",
  "Trusted Resources": "Curated websites, books, professional support and further reading for singles.",
};

export function topicId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function articleCategory(article: Pick<Article, "category">) {
  return article.category || "Start Here";
}

export function groupArticles(articleList: Article[]) {
  const groups = articleList.reduce<Record<string, Article[]>>((acc, article) => {
    const category = articleCategory(article);
    acc[category] ??= [];
    acc[category].push(article);
    return acc;
  }, {});

  return CATEGORY_ORDER
    .filter((category) => groups[category]?.length)
    .map((category) => ({ category, articles: groups[category] }));
}
