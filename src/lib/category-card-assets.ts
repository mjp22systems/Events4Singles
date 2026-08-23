const CATEGORY_CARD_IMAGES: Record<string, string> = {
  "adventure-for-singles": "/images/home-cat-sport.jpg",
  "cruises4singles": "/images/home-cat-cruises.jpg",
  "dinner-for-six": "/images/home-cat-dinner-parties.jpg",
  "dinner-parties": "/images/home-cat-dinner-parties.jpg",
  "fitness4singles": "/images/home-cat-yoga.jpg",
  "nightclubs": "/images/home-cat-mixers.jpg",
  "social-clubs": "/images/home-cat-mixers.jpg",
  "speed-dating": "/images/home-cat-speed-dating.jpg",
  "sport-adventure": "/images/home-cat-sport.jpg",
  "tours4singles": "/images/home-cat-travel.jpg",
  "travel-for-singles": "/images/home-cat-travel.jpg",
  "walks4singles": "/images/home-cat-walks.jpg",
  "yoga-classes": "/images/home-cat-yoga.jpg",
};

const CATEGORY_CARD_SUMMARIES: Record<string, string> = {
  "adventure-for-singles": "Active days out and shared outdoor experiences.",
  "cruises4singles": "Social outings on the water with room to mingle.",
  "dance-classes": "Learn, move and meet people in a relaxed class setting.",
  "dance-party-clubs": "Music, movement and social nights with energy.",
  "dinner-for-six": "Smaller hosted meals with easier conversation.",
  "dinner-parties": "Longer conversations over a shared meal.",
  "fitness4singles": "Movement, health and energy with social possibility.",
  "healing-and-happiness": "Wellbeing services for renewal and balance.",
  "image-and-photography": "Presentation, confidence and profile-ready imagery.",
  "intro-agencies": "Personalised matching and more guided support.",
  "life-coaches": "Guidance for goals, confidence and personal direction.",
  "mature-dating-events": "Dating experiences for singles later in life.",
  "nightclubs": "Late-night venues and social dance floors.",
  "online-dating": "Digital dating options to support your wider search.",
  "psychology": "Professional support for emotional wellbeing and patterns.",
  "seminars": "Learning experiences for personal and social growth.",
  "singles-health": "Health-focused support for a stronger everyday life.",
  "social-clubs": "Regular groups and hosted gatherings for singles.",
  "speed-dating": "Short, hosted introductions with a clear dating purpose.",
  "sport-adventure": "Active events for people who like to do, not just sit.",
  "tours4singles": "Shared trips and discovery with other singles.",
  "travel-for-singles": "Trips and getaways with other singles.",
  "walks4singles": "Easy conversation while exploring local places.",
  "yoga-classes": "Calm, strength and self-connection through practice.",
};

export function getCategoryCardImage(slug: string): string | undefined {
  return CATEGORY_CARD_IMAGES[slug];
}

export function getCategoryCardSummary(slug: string, fallback?: string | null): string {
  return CATEGORY_CARD_SUMMARIES[slug] ?? fallback ?? "";
}
