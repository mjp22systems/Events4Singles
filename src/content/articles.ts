export interface Article {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  content: string;
}

export const articles: Article[] = [
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
];

export function getArticle(slug: string): Article | null {
  return articles.find((a) => a.slug === slug) ?? null;
}
