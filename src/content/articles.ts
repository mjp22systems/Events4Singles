import { legacyAdviceArticles } from "./legacy-advice";

export interface Article {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  content: string;
  category?: string;
  legacyPath?: string;
  migratedAt?: string;
  file?: string;
}

const currentArticles: Article[] = [
  {
    slug: "dating-tips-for-women",
    title: "Dating Tips for Women",
    description: "Practical advice for women navigating the singles scene — from speed dating to dinner parties.",
    publishedAt: "2024-01-01",
    content: `
<p>Meeting new people as a single adult can feel daunting, but Australia's singles events scene makes it easier than ever. Here are some tips to help you get the most out of it.</p>

<h2>Be yourself from the start</h2>
<p>Events like speed dating and singles dinners work best when you're genuine. You have a short window to make a connection — being authentic is far more memorable than trying to impress.</p>

<h2>Try different event types</h2>
<p>Speed dating suits people who want to meet many people quickly. Dinner parties and social clubs suit those who prefer conversation to build naturally. Dance classes add a physical, fun element. Try a few formats before deciding what works for you.</p>

<h2>Go with an open mind</h2>
<p>Not every event will lead to romance — and that's fine. Many people find great friendships through singles events. Remove the pressure and just enjoy the social experience.</p>

<h2>Follow up promptly</h2>
<p>If you connected with someone at an event and exchanged details, follow up within a day or two while the memory is fresh. A simple message is enough to keep the conversation going.</p>

<h2>Be consistent</h2>
<p>The singles who have the most success with events are the ones who attend regularly. Familiar faces build trust, and the social circle grows over time.</p>
`,
  },
  {
    slug: "dating-tips-for-men",
    title: "Dating Tips for Men",
    description: "Straight-talking advice for men looking to meet someone through singles events and social clubs.",
    publishedAt: "2024-01-01",
    content: `
<p>Singles events level the playing field — everyone is there to meet people, which removes the guesswork. Here's how to make the most of them.</p>

<h2>Avoid the "nice guy" trap</h2>
<p>Being pleasant is important. But being so agreeable that you have no opinions or personality is not attractive. Women respond to men who are confident, curious, and genuine — not men who just say what they think she wants to hear.</p>

<h2>Listen more than you talk</h2>
<p>At speed dating and singles dinners, most men dominate the conversation. Stand out by asking good questions and actually listening to the answers. Women notice and remember men who made them feel heard.</p>

<h2>Dress appropriately</h2>
<p>You don't need to overdress. But making an effort shows you take the occasion seriously. Clean, well-fitted clothes and good grooming go a long way.</p>

<h2>Don't fixate on one person</h2>
<p>At events where you meet many people, keeping an open mind leads to better outcomes. The person you least expected to connect with often turns out to be the most interesting.</p>

<h2>Attend events you genuinely enjoy</h2>
<p>If you enjoy dancing, dance classes are a natural choice. If you're a foodie, singles dinners. Shared genuine interests are the strongest foundation for connection.</p>
`,
  },
  {
    slug: "how-to-get-the-most-from-speed-dating",
    title: "How to Get the Most from Speed Dating",
    description: "Speed dating tips for both men and women — preparation, conversation, and what to do after the event.",
    publishedAt: "2024-01-01",
    content: `
<p>Speed dating can feel nerve-wracking the first time, but most people leave having enjoyed it far more than they expected. Here's how to prepare.</p>

<h2>Before the event</h2>
<p>Confirm the time and venue, arrive a few minutes early, and have a few conversation-starter questions ready. Not scripts — just topics. Recent travel, unusual hobbies, favourite local restaurants work well.</p>

<h2>During the event</h2>
<p>Each round is typically 3–5 minutes. That's enough time to get a sense of someone's energy and whether the conversation flows. You don't need their life story — you just need enough to know if you'd like to talk again.</p>
<p>Be present. Put your phone away. Make eye contact. Smile.</p>

<h2>Marking your card</h2>
<p>If you're unsure about someone, mark them as a maybe rather than a no — you might feel differently after a good night's sleep. Regret at missing a match is more common than regret at giving someone a second chance.</p>

<h2>After the event</h2>
<p>Most speed dating organisers send match notifications within 24–48 hours. If you match with someone, message them promptly. A short, specific message referencing something you discussed is far better than a generic "hey".</p>
`,
  },
  {
    slug: "finding-romance-after-40",
    title: "Finding Romance After 40",
    description: "Why singles events are particularly well-suited to mature daters — and how to approach them with confidence.",
    publishedAt: "2024-03-01",
    content: `
<p>Dating after 40 is different — and in many ways better. You know yourself, you know what you want, and you're not interested in wasting time. Singles events suit this stage of life perfectly.</p>

<h2>Why events work better than apps for mature singles</h2>
<p>Dating apps optimise for quantity of matches, not quality of connection. For singles over 40, face-to-face events cut through the noise. You meet real people, in real settings, with real conversation — not a filtered profile and a brief exchange of messages.</p>

<h2>Choose events that suit your lifestyle</h2>
<p>Introduction agencies suit people who want a more curated, personal experience. Singles dinner parties are ideal for those who enjoy conversation over a meal. Dance classes add a social, physical element that removes pressure from direct conversation. There's no one right format — try a few and see what fits.</p>

<h2>Don't underestimate the social side</h2>
<p>Many mature singles find that regular attendance at social clubs and events builds a genuine community — one that often includes friendships as meaningful as any romantic outcome. The social network that grows from events can be one of the most valuable things you take away.</p>

<h2>Take your time</h2>
<p>The singles events scene is not about rushing. The best connections develop naturally over time, through repeated encounters in comfortable social settings. Consistency and patience produce better results than intensity.</p>
`,
  },
  {
    slug: "wellbeing-and-the-single-life",
    title: "Wellbeing and the Single Life",
    description: "How singles events, social clubs and activities like yoga, dance and walks connect wellbeing with finding connection.",
    publishedAt: "2024-03-01",
    content: `
<p>The best singles events are the ones that would be worth attending even if you didn't meet anyone romantic. Events built around shared activities — dance classes, yoga, bush walks, singles health retreats — attract people who are investing in themselves, not just looking for a partner.</p>

<h2>Activity-based events create natural connection</h2>
<p>When you're doing something together — dancing, walking, cooking — conversation flows without the awkwardness of a face-to-face "interview". The shared activity gives you something to talk about, something to laugh about, and a natural reason to talk again.</p>

<h2>Your social life and your wellbeing are connected</h2>
<p>Research consistently shows that social connection is one of the strongest predictors of wellbeing. Attending regular singles events isn't just about finding a partner — it's a genuine investment in your mental and emotional health.</p>

<h2>Types of wellbeing-focused singles events</h2>
<p>Look for: singles yoga classes, walks for singles, floatation and wellness experiences marketed to the singles community, singles health retreats, and seminars and workshops focused on personal growth. Events4Singles lists these under Singles Health, Yoga Classes, Walks for Singles, and Seminars & Workshops.</p>
`,
  },
  {
    slug: "making-the-most-of-introduction-agencies",
    title: "Making the Most of Introduction Agencies",
    description: "What to expect from a professional introduction agency, and how to get the best results from the process.",
    publishedAt: "2024-03-01",
    content: `
<p>Introduction agencies are different from dating apps and singles events — they offer a personal, managed matching service. Understanding how they work helps you get the most from the experience.</p>

<h2>What an introduction agency actually does</h2>
<p>A reputable agency takes the time to understand who you are and what you're looking for, then makes considered introductions based on compatibility rather than just appearance. The best agencies have been running for years and have strong track records of successful matches.</p>

<h2>Be honest in your profile</h2>
<p>Agencies work from the information you provide. The more accurate and honest your profile, the better the introductions they can make. Understating your age or overstating your interests to seem more appealing typically leads to poorly matched introductions.</p>

<h2>Give it time</h2>
<p>Introduction agencies work on a different timescale to apps. Quality introductions take time. Most clients who get lasting results from agencies commit to at least six months and approach each introduction with genuine openness.</p>

<h2>Ask the right questions before signing up</h2>
<p>Before engaging an agency, ask about their database size in your city, their typical client age range, how they make introductions, and what their refund or pause policy is. A reputable agency will answer all of these clearly.</p>
`,
  },
];

export const articles: Article[] = [...currentArticles, ...legacyAdviceArticles];

export function getArticle(slug: string): Article | null {
  return articles.find((a) => a.slug === slug) ?? null;
}
