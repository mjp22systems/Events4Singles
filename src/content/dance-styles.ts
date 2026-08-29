export type DanceStyleLink = {
  title: string;
  href: string;
  summary: string;
  image: string;
};

export type DanceStyleFamily = {
  title: string;
  mood: string;
  copy: string;
  links: DanceStyleLink[];
};

export const danceStyleLinks: DanceStyleLink[] = [
  {
    title: "Salsa Dance",
    href: "/dance-classes/salsa",
    summary: "Lively Latin rhythm, social rotation and a strong beginner class culture.",
    image: "/images/categories/cards/dance-salsa.webp",
  },
  {
    title: "Bachata Dance",
    href: "/dance-classes/bachata",
    summary: "A modern Latin social style with approachable timing and close musical connection.",
    image: "/images/categories/cards/dance-bachata.webp",
  },
  {
    title: "Tango Dance",
    href: "/dance-classes/tango",
    summary: "Expressive partner dancing for people drawn to focus, musicality and atmosphere.",
    image: "/images/categories/cards/dance-tango.webp",
  },
  {
    title: "Swing Dance",
    href: "/dance-classes/swing",
    summary: "Upbeat jive, Lindy Hop and swing classes with a playful social feel.",
    image: "/images/categories/cards/dance-swing.webp",
  },
  {
    title: "Ceroc and Modern Jive",
    href: "/dance-classes/ceroc",
    summary: "Flexible partner dancing that often welcomes solo beginners and rotates partners.",
    image: "/images/categories/cards/dance-ceroc.webp",
  },
  {
    title: "Ballroom Dance",
    href: "/dance-classes/ballroom-style",
    summary: "Waltz, foxtrot, quickstep and social ballroom for elegance, posture and confidence.",
    image: "/images/categories/cards/dance-ballroom-style.webp",
  },
  {
    title: "Latin Dance",
    href: "/dance-classes/latin-style",
    summary: "Salsa, cha cha, rumba, samba, merengue and social Latin class pathways.",
    image: "/images/categories/cards/dance-latin-style.webp",
  },
  {
    title: "Line Dancing",
    href: "/dance-classes/line-dancing",
    summary: "No-partner group movement with clear steps, music and easy social momentum.",
    image: "/images/categories/cards/dance-line-dancing.webp",
  },
  {
    title: "Dance Fitness",
    href: "/dance-classes/fitness-and-health",
    summary: "Zumba-style, cardio dance and low-pressure movement classes with social energy.",
    image: "/images/categories/cards/dance-fitness-and-health.webp",
  },
];

export const danceStyleFamilies: DanceStyleFamily[] = [
  {
    title: "Latin and Rhythm",
    mood: "High energy, warm, social",
    copy: "Latin and rhythm classes are often the easiest doorway for people who want music, movement and conversation in the same night. They work well for singles because many classes are built around group energy rather than arriving with a fixed partner.",
    links: danceStyleLinks.filter((style) => [
      "/dance-classes/salsa",
      "/dance-classes/bachata",
      "/dance-classes/latin-style",
    ].includes(style.href)),
  },
  {
    title: "Ballroom and Smooth",
    mood: "Elegant, structured, confidence-building",
    copy: "Ballroom gives beginners a clear frame, recognisable music and a sense of occasion. It is useful for people who want posture, coordination and enough structure to feel less exposed on a dance floor.",
    links: danceStyleLinks.filter((style) => style.href === "/dance-classes/ballroom-style"),
  },
  {
    title: "Swing and Jive",
    mood: "Playful, upbeat, relaxed",
    copy: "Swing, jive and Ceroc-style classes suit people who want a social class that feels less formal. The music is often familiar, the room tends to be friendly, and the class format can make it easier to turn up solo.",
    links: danceStyleLinks.filter((style) => [
      "/dance-classes/swing",
      "/dance-classes/ceroc",
    ].includes(style.href)),
  },
  {
    title: "Tango",
    mood: "Expressive, focused, atmospheric",
    copy: "Tango sits slightly apart from the big social families. It appeals to people who like detail, musicality and connection, and it can become a strong community path through practica nights and social dances.",
    links: danceStyleLinks.filter((style) => style.href === "/dance-classes/tango"),
  },
  {
    title: "Solo, Fitness and Low-Pressure Group Classes",
    mood: "Easy entry, movement first",
    copy: "Not every useful dance class has to be partner dancing. Line dancing, dance fitness and beginner group classes can be perfect for singles who want to get out, move, meet regular faces and build confidence before stepping into partner work.",
    links: danceStyleLinks.filter((style) => [
      "/dance-classes/line-dancing",
      "/dance-classes/fitness-and-health",
    ].includes(style.href)),
  },
];

export const danceStyleDecisionPaths = [
  {
    title: "I want something social and lively",
    copy: "Start with Salsa, Bachata or Latin Dance. These styles often have beginner groups, social nights and a natural pathway from class into community.",
  },
  {
    title: "I want to feel more confident on a dance floor",
    copy: "Try Ballroom, Swing or Ceroc. They give you repeatable basics and enough structure to make parties, weddings and social events feel less awkward.",
  },
  {
    title: "I am nervous about turning up alone",
    copy: "Look for classes that mention beginners, no partner required, partner rotation or drop-in attendance. Ceroc, salsa beginner nights, line dancing and dance fitness are often strong starting points.",
  },
  {
    title: "I want movement more than dating",
    copy: "Dance Fitness, Line Dancing and Contemporary or Modern classes can be a gentle path back into your body, with the social benefit arriving naturally over time.",
  },
];
