export interface PathwayCategory {
  slug: string;
  label: string;
  note: string;
}

export interface PathwayContent {
  id: "partner" | "social" | "growth";
  number: string;
  slug: string;
  title: string;
  eyebrow: string;
  shortIntro: string;
  description: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  heroLead: string;
  intro: string[];
  benefits: { title: string; copy: string }[];
  categories: PathwayCategory[];
  sections: { title: string; copy: string }[];
  faqs: { question: string; answer: string }[];
  primaryCta: string;
  secondaryCta: string;
}

export const PATHWAYS: PathwayContent[] = [
  {
    id: "partner",
    number: "01",
    slug: "find-a-partner",
    title: "Find a Partner",
    eyebrow: "Ready to meet someone",
    shortIntro:
      "Matching services built for singles who are actively looking - introductions, curated tables and events designed to end in a conversation.",
    description:
      "For people who are ready to be intentional about dating and want formats where the purpose is clear from the start.",
    image: "/images/site/home/intent-cards/intent-partner.jpg",
    seoTitle: "Find a Partner - Singles Dating Events and Introduction Services",
    seoDescription:
      "Explore speed dating, dinner parties, introduction agencies, mature dating events and online dating options for Australian singles ready to meet someone.",
    heroLead:
      "When you are ready to meet someone, clarity helps. This path gathers the services and events where dating is the point, not an awkward afterthought.",
    intro: [
      "Finding a partner is not only about being seen by more people. It is about stepping into settings where everyone understands why they are there, where conversation has permission to begin, and where the pressure of guessing someone else's intent is softened.",
      "Events4Singles brings together structured, social and professional pathways for singles who want to meet with purpose. Some people like the spark and pace of speed dating. Others prefer the warmth of a dinner table, the discretion of an introduction agency, or the flexibility of online dating alongside real-world events.",
      "This hub is for singles who want to be proactive without feeling like they have to become someone else to do it."
    ],
    benefits: [
      {
        title: "A clearer setting",
        copy: "You are not trying to decode whether someone is available or interested. These experiences are built around meeting, talking and seeing whether there is a genuine connection."
      },
      {
        title: "More human than scrolling",
        copy: "Real conversation gives you tone, humour, warmth and presence - the things a profile can only hint at."
      },
      {
        title: "Formats for different comfort levels",
        copy: "Choose quick introductions, hosted dinners, mature dating nights, online services or personalised introductions depending on how you like to meet."
      }
    ],
    categories: [
      { slug: "speed_dating", label: "Speed Dating", note: "Short, hosted introductions with a clear dating purpose." },
      { slug: "singles_mixers", label: "Singles Mixers", note: "Relaxed hosted socials where meeting new people is the point." },
      { slug: "dinner_parties", label: "Dinner Parties", note: "Longer conversations over a shared meal." },
      { slug: "intro_agencies", label: "Introduction Agencies", note: "Personalised matching and more guided support." },
      { slug: "online_dating", label: "Online Dating", note: "Digital dating options to support your wider search." },
      { slug: "christian_singles", label: "Christian Singles", note: "Faith-aligned events, groups and services for Christian singles." },
      { slug: "lgbtqia_singles_events", label: "LGBTQIA+ Singles Events", note: "Inclusive singles events and social spaces for LGBTQIA+ communities." },
      { slug: "mature_dating_events", label: "Mature Dating Events", note: "Dating experiences for singles later in life." }
    ],
    sections: [
      {
        title: "Who this path suits",
        copy: "Choose this direction if you are open to meeting a partner and want your time to be spent in places where that intention is shared. It suits people who appreciate structure, hosted formats, clear expectations and the chance to meet several compatible singles without the uncertainty of a normal night out."
      },
      {
        title: "How to approach it",
        copy: "Start with the format that feels least forced to you. If you are quick with conversation, try speed dating. If you prefer warmth and time, look at dinners. If you want privacy or support, an introduction agency may be a better fit. The best option is the one you will actually attend with a relaxed, open mind."
      }
    ],
    faqs: [
      {
        question: "Is this only for people who want a serious relationship?",
        answer: "No. It is for singles who want dating intention to be clear. Some people are seeking a long-term partner, while others are simply ready to meet quality people in a more purposeful setting."
      },
      {
        question: "What if I feel nervous about dating events?",
        answer: "That is very normal. Hosted events and structured formats can help because the setting gives you a reason to talk and a rhythm to follow."
      },
      {
        question: "Should I use online dating as well?",
        answer: "Many singles use both. Online dating can widen the pool, while events help you experience chemistry and conversation in person."
      }
    ],
    primaryCta: "Browse Find a Partner",
    secondaryCta: "See all dating categories"
  },
  {
    id: "social",
    number: "02",
    slug: "get-out-there",
    title: "Get Out There",
    eyebrow: "Meet people naturally",
    shortIntro:
      "Nights out, classes and clubs where connection happens sideways - through the dance floor, the trail or the table, not an introduction.",
    description:
      "For singles who want a richer social life, more shared experiences, and easier ways to meet people without making dating the whole story.",
    image: "/images/site/home/intent-cards/intent-social.jpg",
    seoTitle: "Get Out There - Social Events, Activities and Clubs for Singles",
    seoDescription:
      "Find social clubs, dance classes, adventure activities, nightclubs and group experiences for Australian singles who want to meet people naturally.",
    heroLead:
      "Sometimes the best way to meet someone is to stop making the whole night about meeting someone. Get out, do something, let conversation arrive naturally.",
    intro: [
      "This path is for singles who want life to feel wider again. The aim is not only romance; it is momentum, friendship, confidence and the simple pleasure of having something good in the calendar.",
      "Shared activities make connection easier because there is already something to talk about. A dance class, social club, walk, cruise, dinner, comedy night or weekend outing gives people a reason to be present together before anyone has to ask the big questions.",
      "For many people, getting out there is the bridge between wanting change and feeling ready for it."
    ],
    benefits: [
      {
        title: "Less pressure",
        copy: "The activity carries the evening, so connection can happen naturally instead of feeling like an interview."
      },
      {
        title: "A better social rhythm",
        copy: "Regular outings build confidence, widen your circle and make it easier to say yes to new people and places."
      },
      {
        title: "More ways to belong",
        copy: "You can meet potential partners, new friends and local communities while doing things you genuinely enjoy."
      }
    ],
    categories: [
      { slug: "social_clubs", label: "Social Clubs", note: "Regular groups and hosted gatherings for singles." },
      { slug: "dance_classes", label: "Dance Classes", note: "Learn, move and meet people in a relaxed class setting." },
      { slug: "dance_party_clubs", label: "Dance Party Clubs", note: "Music, movement and social nights with energy." },
      { slug: "nightclubs", label: "Nightclubs", note: "Late-night venues and social dance floors." },
      { slug: "adventure_for_singles", label: "Adventure for Singles", note: "Active days out and shared outdoor experiences." },
      { slug: "cruises4singles", label: "Cruises for Singles", note: "Social outings on the water with room to mingle." },
      { slug: "social_walks", label: "Social Walks", note: "Low-pressure walks and outdoor catch-ups with easy conversation." },
      { slug: "solo_travel", label: "Solo Travel", note: "Travel experiences built for independent singles and solo guests." }
    ],
    sections: [
      {
        title: "Who this path suits",
        copy: "Choose this direction if dating apps feel flat, if you are rebuilding your social life, or if you simply want to meet people while doing things that make your week feel more alive."
      },
      {
        title: "How to approach it",
        copy: "Pick one recurring activity and one occasional special event. That mix gives you both familiarity and novelty, which is often where confidence grows fastest."
      }
    ],
    faqs: [
      {
        question: "Do I need to go with a friend?",
        answer: "No. Many singles attend on their own, and hosted or activity-based events are often designed with solo guests in mind."
      },
      {
        question: "Is this still useful if I am hoping to date?",
        answer: "Yes. A fuller social life often creates better dating opportunities because you are meeting people in a more relaxed, natural way."
      },
      {
        question: "What type of event should I start with?",
        answer: "Start with something you would enjoy even if you did not meet anyone romantic that day. That takes pressure off and makes the experience more rewarding."
      }
    ],
    primaryCta: "Browse Get Out There",
    secondaryCta: "See social categories"
  },
  {
    id: "growth",
    number: "03",
    slug: "invest-in-yourself",
    title: "Invest in Yourself",
    eyebrow: "Build confidence and wellbeing",
    shortIntro:
      "Services and programs that help you grow, heal, feel your best and bring a fuller, steadier version of yourself into dating, connection and everyday life.",
    description:
      "For singles who want to strengthen confidence, wellbeing, self-knowledge and the foundations that make connection easier.",
    image: "/images/site/home/intent-cards/intent-growth.jpg",
    seoTitle: "Invest in Yourself - Confidence, Wellbeing and Personal Growth for Singles",
    seoDescription:
      "Explore life coaches, psychology, wellbeing, fitness, image, workshops and personal development services for Australian singles.",
    heroLead:
      "Being single can be a season of expansion, not just waiting. This path is about becoming steadier, brighter and more at home in your own life.",
    intro: [
      "Investing in yourself is not a consolation prize before meeting someone. It is one of the most generous things you can do for your future relationships and for the life you are already living.",
      "Confidence, wellbeing, healing, fitness, style, communication and emotional clarity all change the way you move through the world. They can make dating feel less like performance and more like presence.",
      "This hub gathers services and experiences for singles who want to grow from the inside out."
    ],
    benefits: [
      {
        title: "Confidence that travels with you",
        copy: "When you feel more grounded in yourself, it shows up in conversations, choices and the way you let people know you."
      },
      {
        title: "Better relationship readiness",
        copy: "Personal development can help you understand your patterns, boundaries, hopes and non-negotiables before you step into something new."
      },
      {
        title: "A fuller life now",
        copy: "Health, creativity, support and learning matter whether you are dating or not. They make the present richer."
      }
    ],
    categories: [
      { slug: "life_coaches", label: "Life Coaches", note: "Guidance for goals, confidence and personal direction." },
      { slug: "dating_coaches", label: "Dating Coaches", note: "Dating-specific support for confidence, profiles and relationship readiness." },
      { slug: "psychology", label: "Psychology", note: "Professional support for emotional wellbeing and patterns." },
      { slug: "healing_and_happiness", label: "Healing & Happiness", note: "Wellbeing services for renewal and balance." },
      { slug: "retreats_for_singles", label: "Retreats for Singles", note: "Retreats, reset weekends and reflective escapes for singles." },
      { slug: "seminars", label: "Seminars & Workshops", note: "Learning experiences for personal and social growth." },
      { slug: "fitness4singles", label: "Fitness for Singles", note: "Movement, health and energy with social possibility." },
      { slug: "yoga_classes", label: "Yoga Classes", note: "Calm, strength and self-connection through practice." },
      { slug: "image_and_photography", label: "Image & Photography", note: "Presentation, confidence and profile-ready imagery." },
      { slug: "dating_profile_photography", label: "Dating Profile Photography", note: "Profile-focused portraits that help singles show up naturally." },
      { slug: "singles_health", label: "Singles Health", note: "Health-focused support for a stronger everyday life." }
    ],
    sections: [
      {
        title: "Who this path suits",
        copy: "Choose this direction if you want to feel more confident, recover after a breakup, refresh your identity, improve your wellbeing, or prepare for dating with more self-trust."
      },
      {
        title: "How to approach it",
        copy: "Look for one area that would make daily life feel easier or more energising. A small step in health, mindset, presentation or support can shift how you show up everywhere else."
      }
    ],
    faqs: [
      {
        question: "Is this path about fixing myself before dating?",
        answer: "No. It is about support, growth and confidence. You do not need to be perfect to meet someone, but feeling more resourced can make dating healthier and more enjoyable."
      },
      {
        question: "Can personal growth services help with dating confidence?",
        answer: "Yes. Coaching, workshops, health services and emotional support can all help you feel clearer, calmer and more prepared to connect."
      },
      {
        question: "Where should I begin?",
        answer: "Begin with the area that feels most immediate: confidence, wellbeing, fitness, emotional support, style, or social skills. One useful change often opens the next one."
      }
    ],
    primaryCta: "Browse Invest in Yourself",
    secondaryCta: "See growth categories"
  }
];

export function getPathway(slug: string): PathwayContent | undefined {
  return PATHWAYS.find((pathway) => pathway.slug === slug);
}
