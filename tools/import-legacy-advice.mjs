import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const legacyDir = path.join(root, "legacy", "site-clean-backup-before-listing-cards");
const outputPath = path.join(process.cwd(), "src", "content", "legacy-advice.ts");

const pages = [
  {
    file: "Dating.htm",
    slug: "dating-advice",
    title: "Dating Advice",
    category: "Dating Advice",
    description: "Practical ideas for starting conversations, meeting people, and making the most of singles events.",
  },
  {
    file: "dating_tips.htm",
    slug: "dating-tips",
    title: "Dating Tips",
    category: "Dating Advice",
    description: "Dating tips for singles covering confidence, conversation, first impressions, and common mistakes.",
  },
  {
    file: "dating_tips_men.htm",
    slug: "dating-mistakes-men-make",
    title: "Dating Mistakes Men Make",
    category: "Dating Advice",
    description: "A guide for men covering first impressions, conversation, confidence, and common dating mistakes.",
  },
  {
    file: "date_safe.htm",
    slug: "date-safely",
    title: "Date Safely",
    category: "Dating Advice",
    description: "Common-sense safety reminders for meeting new people through dating sites, singles events, and introductions.",
  },
  {
    file: "body_language.htm",
    slug: "body-language-and-dating",
    title: "Body Language and Dating",
    category: "Dating Advice",
    description: "A guide to body language cues, first impressions, and reading social signals on dates.",
  },
  {
    file: "Going_out_on_a_date.htm",
    slug: "going-out-on-a-date",
    title: "Going Out on a Date",
    category: "Dating Advice",
    description: "Ideas and reminders for planning a date, keeping it relaxed, and making conversation easier.",
  },
  {
    file: "What_to_take_on_a_date.htm",
    slug: "what-to-take-on-a-date",
    title: "What to Take on a Date",
    category: "Dating Advice",
    description: "A practical checklist for date preparation, comfort, safety, and confidence.",
  },
  {
    file: "flirting.htm",
    slug: "flirting-guide",
    title: "Flirting Guide",
    category: "Flirting & Romance",
    description: "Flirting advice covering confidence, warmth, eye contact, and starting playful conversation.",
  },
  {
    file: "flirting_2.htm",
    slug: "flirting-tips",
    title: "Flirting Tips",
    category: "Flirting & Romance",
    description: "More flirting ideas for starting conversations, showing interest, and keeping dating playful.",
  },
  {
    file: "romance.htm",
    slug: "romance-guide",
    title: "Romance Guide",
    category: "Flirting & Romance",
    description: "Romance ideas and reflections for singles looking to build more meaningful connection.",
  },
  {
    file: "Commitment.htm",
    slug: "commitment-and-relationships",
    title: "Commitment and Relationships",
    category: "Relationships",
    description: "A short article about commitment, compatibility, and the shift from dating to relationship.",
  },
  {
    file: "soulmate-success.htm",
    slug: "soulmate-success",
    title: "Soulmate Success",
    category: "Relationships",
    description: "Relationship advice about finding a strong match and recognising lasting compatibility.",
  },
  {
    file: "spiritual_path.htm",
    slug: "spiritual-path",
    title: "Spiritual Path",
    category: "Personal Growth",
    description: "Personal growth and spiritual reflections for singles looking for deeper connection.",
  },
  {
    file: "psychology.htm",
    slug: "psychology-and-dating",
    title: "Psychology and Dating",
    category: "Personal Growth",
    description: "Psychology and self-understanding content for singles navigating dating and relationships.",
  },
  {
    file: "healing_and_happiness.htm",
    slug: "healing-and-happiness",
    title: "Healing and Happiness",
    category: "Personal Growth",
    description: "Personal growth content about wellbeing, healing, happiness, and preparing for healthier relationships.",
  },
  {
    file: "dating_resources_books.htm",
    slug: "dating-resource-books",
    title: "Dating Resource Books",
    category: "Resources",
    description: "Book and learning resources for dating, relationships, confidence, and singles life.",
  },
  {
    file: "dating_resources_websites.htm",
    slug: "dating-resource-websites",
    title: "Dating Resource Websites",
    category: "Resources",
    description: "Dating links and website resources for singles exploring online dating and relationship advice.",
  },
  {
    file: "tips_and_links.htm",
    slug: "dating-tips-and-links",
    title: "Dating Tips and Links",
    category: "Resources",
    description: "A hub of dating tips, links, and further reading for singles.",
  },
];

function repairText(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/Â/g, "")
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u02dc/g, "'")
    .replace(/\u00e2\u20ac\u0153/g, '"')
    .replace(/\u00e2\u20ac\u009d/g, '"')
    .replace(/\u00e2\u20ac\u201c/g, "-")
    .replace(/\u00e2\u20ac\u201d/g, "-")
    .replace(/\u00e2\u20ac\u00a6/g, "...")
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ|â€�/g, '"')
    .replace(/â€“|â€”/g, "-")
    .replace(/â€¦/g, "...")
    .replace(/�/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function repairHtml(value) {
  return repairText(value)
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u02dc/g, "'")
    .replace(/\u00e2\u20ac\u0153/g, "&quot;")
    .replace(/\u00e2\u20ac\u009d/g, "&quot;")
    .replace(/\u00e2\u20ac\u201c/g, "-")
    .replace(/\u00e2\u20ac\u201d/g, "-")
    .replace(/\u00e2\u20ac\u00a6/g, "...")
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ|â€�/g, "&quot;")
    .replace(/â€“|â€”/g, "-")
    .replace(/â€¦/g, "...");
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanHref(href) {
  const decoded = decodeEntities(href || "").trim();
  if (!decoded || decoded.startsWith("#") || decoded.toLowerCase().startsWith("javascript:")) return "";
  return decoded;
}

function convertLinks(html) {
  return html.replace(/<a\b[^>]*href=["']?([^"'\s>]+)["']?[^>]*>([\s\S]*?)<\/a>/gi, (_match, href, label) => {
    const text = repairText(decodeEntities(label.replace(/<[^>]+>/g, " ")));
    const url = cleanHref(href);
    if (!text && !url) return " ";
    if (!url) return text;
    return `${text || url} (${url})`;
  });
}

function extractLegacyBody(html) {
  let body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
  body = body.replace(/<div id=["']site-header-inject["'][\s\S]*?<\/header>\s*<\/div>/i, " ");
  body = body.replace(/<script\b[\s\S]*?<\/script>/gi, " ");
  body = body.replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  body = body.replace(/<!--[\s\S]*?-->/g, " ");
  body = body.replace(/<img\b[^>]*>/gi, " ");
  body = convertLinks(body);
  body = body
    .replace(/<\/(p|div|tr|td|h1|h2|h3|li|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  const skipPatterns = [
    /^Events4Singles$/i,
    /^Australian singles events directory$/i,
    /^Sydney Melbourne Brisbane Adelaide Perth/i,
    /^Speed Dating Dinner Parties Dance Classes/i,
    /^NZ CA UK US ZA$/i,
    /^Home$/i,
    /^Advertise$/i,
    /^Contact$/i,
    /^Copyright/i,
    /^Back to top$/i,
  ];

  const seen = new Set();
  const lines = body
    .split(/\n+/)
    .map((line) => repairText(decodeEntities(line)))
    .filter((line) => line.length > 0)
    .filter((line) => line.length < 1500)
    .filter((line) => !skipPatterns.some((pattern) => pattern.test(line)))
    .filter((line) => {
      const key = line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const footerStart = lines.findIndex((line) =>
    /^Australian singles events, dating resources/i.test(line) ||
    /^Cities$/i.test(line) ||
    /^Sections$/i.test(line) ||
    /^Information$/i.test(line)
  );

  return footerStart >= 0 ? lines.slice(0, footerStart) : lines;
}

function linesToHtml(lines, title) {
  const titleKey = title.toLowerCase();
  const contentLines = lines
    .filter((line) => line.toLowerCase() !== titleKey)
    .filter((line) => !/^events4singles, events for$/i.test(line))
    .filter((line) => !/^singles, dating, the art of dating/i.test(line))
    .filter((line) => !/^dating for singles, online$/i.test(line))
    .filter((line) => !/^dating, the art of dating/i.test(line))
    .filter((line) => !/^resources for$/i.test(line))
    .filter((line) => !/^dating, dating resources/i.test(line))
    .filter((line) => !/^how to date, books on/i.test(line));

  const blocks = [];
  let buffer = [];

  function flush() {
    if (!buffer.length) return;
    blocks.push({ type: "p", text: buffer.join(" ") });
    buffer = [];
  }

  for (const rawLine of contentLines) {
    const line = rawLine.replace(/\s+([,.;:!?])/g, "$1");
    if (line.length < 3) continue;
    if (/^(click here|email|website)$/i.test(line)) continue;
    const isHeading =
      line.length < 72 &&
      !/[.!?]$/.test(line) &&
      (/^(MISTAKE\s+\d+|Dating|Flirting|Romance|Commitment|Soulmate|Spiritual|Psychology|Healing|Safety|Tips|Books|Links|Online|Men|Women|Body|Going|What|New South Wales|Victoria|Queensland|Tasmania|Australia-wide)/i.test(line) ||
        (/^[A-Z0-9][A-Za-z0-9\s&'():-]{4,}$/.test(line) && line.split(/\s+/).length <= 8));

    if (isHeading) {
      flush();
      blocks.push({ type: "h2", text: line });
      continue;
    }

    buffer.push(line);
    if (/[.!?)]$/.test(line) || buffer.join(" ").length > 260) {
      flush();
    }
  }

  flush();

  return blocks
    .map((block) => {
      const escaped = escapeHtml(repairHtml(block.text));
      return block.type === "h2" ? `<h2>${escaped}</h2>` : `<p>${escaped}</p>`;
    })
    .join("\n");
}

const articles = pages.map((page) => {
  const html = fs.readFileSync(path.join(legacyDir, page.file), "utf8");
  const lines = extractLegacyBody(html);
  return {
    ...page,
    legacyPath: page.file,
    publishedAt: "2004-01-01",
    migratedAt: "2026-08-14",
    content: linesToHtml(lines, page.title),
  };
});

const file = `import type { Article } from "./articles";

export const legacyAdviceArticles: Article[] = ${JSON.stringify(articles, null, 2)};
`;

fs.writeFileSync(outputPath, file.replace(/"content": "([^"]*)"/g, (match) => match), "utf8");
console.log(`Wrote ${articles.length} legacy advice articles to ${outputPath}`);
