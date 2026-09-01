import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Compass,
  Dumbbell,
  Flame,
  HandHeart,
  Megaphone,
  Music4,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import BodyClass from "@/components/body-class";
import {
  danceStyleFamilies,
  danceStyleLinks,
  type DanceStyleLink,
} from "@/content/dance-styles";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";

type MeterValue = 1 | 2 | 3 | 4 | 5;

type StyleGuideCard = DanceStyleLink & {
  contact: MeterValue;
  energy: MeterValue;
  guideImage: string;
  noPartner?: boolean;
  tag: string;
};

type FeelCard = {
  body: string;
  icon: LucideIcon;
  picks: string[];
  title: string;
};

const styleTraits: Record<string, Pick<StyleGuideCard, "contact" | "energy" | "noPartner" | "tag">> = {
  "/dance-classes/salsa": {
    contact: 3,
    energy: 5,
    tag: "Most social",
  },
  "/dance-classes/bachata": {
    contact: 4,
    energy: 4,
    tag: "Modern Latin",
  },
  "/dance-classes/tango": {
    contact: 5,
    energy: 2,
    tag: "Deep focus",
  },
  "/dance-classes/swing": {
    contact: 3,
    energy: 5,
    tag: "Playful",
  },
  "/dance-classes/ceroc": {
    contact: 3,
    energy: 4,
    noPartner: true,
    tag: "Easiest solo start",
  },
  "/dance-classes/ballroom-style": {
    contact: 4,
    energy: 3,
    tag: "Confidence builder",
  },
  "/dance-classes/latin-style": {
    contact: 3,
    energy: 4,
    tag: "Variety",
  },
  "/dance-classes/line-dancing": {
    contact: 1,
    energy: 3,
    noPartner: true,
    tag: "No partner ever",
  },
  "/dance-classes/fitness-and-health": {
    contact: 1,
    energy: 5,
    noPartner: true,
    tag: "Fitness first",
  },
};

const styleGuideAssetVersion = "20260831b";

const versionedGuideImage = (path: string) => `${path}?v=${styleGuideAssetVersion}`;

const styleGuideImages: Record<string, string> = {
  "/dance-classes/salsa": versionedGuideImage("/images/categories/dance-styles-guide/style-salsa.jpg"),
  "/dance-classes/bachata": versionedGuideImage("/images/categories/dance-styles-guide/style-bachata.jpg"),
  "/dance-classes/tango": versionedGuideImage("/images/categories/dance-styles-guide/style-tango.jpg"),
  "/dance-classes/swing": versionedGuideImage("/images/categories/dance-styles-guide/style-swing.jpg"),
  "/dance-classes/ceroc": versionedGuideImage("/images/categories/dance-styles-guide/style-ceroc.jpg"),
  "/dance-classes/ballroom-style": versionedGuideImage("/images/categories/dance-styles-guide/style-ballroom.jpg"),
  "/dance-classes/latin-style": versionedGuideImage("/images/categories/dance-styles-guide/style-latin.jpg"),
  "/dance-classes/line-dancing": versionedGuideImage("/images/categories/dance-styles-guide/style-linedance.jpg"),
  "/dance-classes/fitness-and-health": versionedGuideImage("/images/categories/dance-styles-guide/style-fitness.jpg"),
};

const styleCards: StyleGuideCard[] = danceStyleLinks.map((style) => ({
  ...style,
  guideImage: styleGuideImages[style.href] ?? style.image,
  ...(styleTraits[style.href] ?? { contact: 3, energy: 3, tag: "Beginner friendly" }),
}));

const feelCards: FeelCard[] = [
  {
    icon: Users,
    title: "Something social and lively",
    body: "Rooms built around rotation, music and meeting the whole class, not arriving with a fixed partner.",
    picks: ["Salsa Dance", "Bachata Dance", "Latin Dance"],
  },
  {
    icon: Sparkles,
    title: "Confidence on a dance floor",
    body: "Structured technique, clear progression and a style you can take into weddings, parties and socials.",
    picks: ["Ballroom Dance", "Tango Dance"],
  },
  {
    icon: HandHeart,
    title: "Nervous about turning up alone",
    body: "Classes where arriving solo is normal, partners rotate, or pairing up is not required at all.",
    picks: ["Ceroc and Modern Jive", "Swing Dance", "Line Dancing"],
  },
  {
    icon: Dumbbell,
    title: "Movement more than dating",
    body: "Group energy and a proper workout, with the social benefit arriving naturally over time.",
    picks: ["Dance Fitness", "Line Dancing"],
  },
];

const styleByTitle = new Map(danceStyleLinks.map((style) => [style.title, style]));

const styleFaqs = [
  {
    question: "Do I need to bring a partner to dance classes?",
    answer:
      "Usually not. Many social dance classes welcome solo beginners, rotate partners during the lesson, or focus on no-partner formats like line dancing and dance fitness. Check the class listing for beginner, solo-friendly or no partner required wording.",
  },
  {
    question: "Which dance style is easiest for a first class?",
    answer:
      "Ceroc and Modern Jive, Salsa beginner nights, Line Dancing and Dance Fitness are often easier first steps because the room tends to be social, repeated weekly and forgiving while you learn. Ballroom and Tango can also work well when the class is clearly marked beginner.",
  },
  {
    question: "Should I choose by dance style or by city first?",
    answer:
      "If you already know the music or mood you want, start with the style. If you mainly want a regular social routine, start with your city and choose the beginner class you can actually attend consistently.",
  },
];

function SectionHeading({
  action,
  actionHref,
  eyebrow,
  id,
  sub,
  title,
}: {
  action?: string;
  actionHref?: string;
  eyebrow: string;
  id?: string;
  sub?: string;
  title: string;
}) {
  return (
    <div className="e4s-dance-lovable-heading">
      <div>
        <p>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {sub ? <span>{sub}</span> : null}
      </div>
      {action && actionHref ? (
        <Link href={actionHref}>
          {action}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}

function Meter({ label, tone, value }: { label: string; tone: "primary" | "accent"; value: MeterValue }) {
  return (
    <div className="e4s-dance-styles-meter" aria-label={`${label}: ${value} out of 5`}>
      <span>{label}</span>
      <span aria-hidden="true">
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={
              level <= value
                ? `e4s-dance-styles-meter__dot e4s-dance-styles-meter__dot--${tone}`
                : "e4s-dance-styles-meter__dot"
            }
          />
        ))}
      </span>
    </div>
  );
}

export default function DanceStylesGuide() {
  const jsonLd = [
    collectionPageJsonLd({
      name: "Dance Styles for Singles",
      description:
        "A guide to choosing social dance classes, dance styles and beginner-friendly ways for singles to get moving.",
      path: "/dance-classes/styles",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Dance Classes", path: "/dance-classes" },
      { name: "Dance Styles", path: "/dance-classes/styles" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-category" />
      <BodyClass add="e4s-page-dance-hub" />
      <BodyClass add="e4s-page-dance-styles" />
      <main className="e4s-dance-lovable e4s-dance-styles-guide" id="site-content">
        <div className="e4s-dance-lovable-shell e4s-dance-lovable-breadcrumb">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/categories">Categories</Link>
            <span>/</span>
            <Link href="/dance-classes">Dance Classes</Link>
            <span>/</span>
            <strong>Dance Styles</strong>
          </nav>
        </div>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-hero" aria-label="Dance styles guide">
          <div className="e4s-dance-lovable-hero__copy">
            <span className="e4s-dance-lovable-chip">
              <Compass aria-hidden="true" size={14} />
              Dance Classes · Style Guide
            </span>
            <h1>
              Choose a dance style <span>by feel, not by name</span>
            </h1>
            <p>
              Picking a class is really picking a room: the music, the pace and how much
              partner contact you are comfortable with. Compare the styles singles actually search
              for, then jump straight to real classes across Australia.
            </p>

            <div className="e4s-dance-lovable-hero__actions">
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="#feel">
                Choose by Feel
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--accent" href="#styles">
                See All Styles
              </Link>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--ghost" href="/dance-classes">
                <ArrowLeft aria-hidden="true" size={16} />
                Dance Classes Hub
              </Link>
            </div>

            <dl className="e4s-dance-lovable-stats" aria-label="Dance styles guide summary">
              <div>
                <dt>9</dt>
                <dd>Styles compared</dd>
              </div>
              <div>
                <dt>3</dt>
                <dd>Need no partner at all</dd>
              </div>
              <div>
                <dt>100%</dt>
                <dd>Solo-arrival friendly</dd>
              </div>
            </dl>
          </div>

          <div className="e4s-dance-lovable-hero__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Singles-friendly dance styles class guide"
              src={versionedGuideImage("/images/categories/dance-styles-guide/hero-styles.jpg")}
            />
            <div>
              <BadgeCheck aria-hidden="true" size={16} />
              Every style below welcomes solo beginners
            </div>
          </div>
        </section>

        <section className="e4s-dance-styles-strip">
          <div className="e4s-dance-lovable-shell">
            <p>
              <Music4 aria-hidden="true" size={16} />
              A dance style is a shortcut to a whole scene: a room, a rhythm and a reason to go out
              each week. You do not need to get it right first go; most people try two or three
              before one sticks.
            </p>
            <span>2 min read</span>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-guidance" id="feel">
          <SectionHeading
            eyebrow="Choose by Feel"
            sub="Four honest reasons singles book a first class. Pick yours, then follow the styles that tend to deliver."
            title="Start from what you want out of it"
          />
          <div className="e4s-dance-lovable-guidance-grid">
            {feelCards.map((feel) => {
              const Icon = feel.icon;
              return (
                <article key={feel.title}>
                  <span>
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <h3>{feel.title}</h3>
                  <p>{feel.body}</p>
                  <div>
                    {feel.picks.map((title) => {
                      const style = styleByTitle.get(title);
                      return style ? (
                        <Link key={title} href={style.href}>
                          {title}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="e4s-dance-lovable-band" id="styles">
          <div className="e4s-dance-lovable-shell">
            <SectionHeading
              action="Browse Classes on the Hub"
              actionHref="/dance-classes"
              eyebrow="All Styles"
              sub="Energy is how hard you will move; contact is how close you are likely to dance. No-partner styles never require pairing up."
              title="The paths people actually search for"
            />
            <div className="e4s-dance-styles-card-grid">
              {styleCards.map((style) => (
                <Link key={style.href} className="e4s-dance-styles-card" href={style.href}>
                  <span className="e4s-dance-styles-card__image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={`${style.title} class in Australia`} loading="lazy" src={style.guideImage} />
                    <span className="e4s-dance-styles-card__tag">{style.tag}</span>
                    {style.noPartner ? (
                      <span className="e4s-dance-styles-card__solo">No partner needed</span>
                    ) : null}
                  </span>
                  <span className="e4s-dance-styles-card__body">
                    <strong>{style.title}</strong>
                    <em>{style.summary}</em>
                    <span className="e4s-dance-styles-card__meters">
                      <Meter label="Energy" tone="primary" value={style.energy} />
                      <Meter label="Contact" tone="accent" value={style.contact} />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-styles-families" aria-labelledby="dance-style-family-title">
          <SectionHeading
            eyebrow="Style Families"
            id="dance-style-family-title"
            sub="If the individual styles blur together, choose a family first. Each one shares a mood, a music scene and usually the same kinds of venues."
            title="Zoom out: five families, one decision"
          />
          <div className="e4s-dance-styles-family-grid">
            {danceStyleFamilies.map((family) => (
              <article key={family.title}>
                <h3>
                  <Flame aria-hidden="true" size={15} />
                  {family.title}
                </h3>
                <p>{family.mood}</p>
                <span>{family.copy}</span>
                <ul>
                  {family.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="e4s-dance-lovable-band e4s-dance-styles-promoters" id="advertise">
          <div className="e4s-dance-lovable-shell">
            <article>
              <Megaphone aria-hidden="true" size={24} />
              <h2>Run classes? This guide sends you warm beginners.</h2>
              <p>
                Dance belongs in a singles directory because it works without being dating-first.
                People come for the class and leave with a social routine. Style pages like this are
                where they decide, which makes them a natural advertising surface.
              </p>
              <ul>
                <li>
                  <BadgeCheck aria-hidden="true" size={16} />
                  Readers arrive mid-decision, before they have chosen a studio.
                </li>
                <li>
                  <BadgeCheck aria-hidden="true" size={16} />
                  Promoted tiles can be targeted by style, city, or both.
                </li>
                <li>
                  <BadgeCheck aria-hidden="true" size={16} />
                  Guide content builds trust around your listing before the booking click.
                </li>
              </ul>
              <div>
                <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--accent" href="/advertise">
                  List Your Class Free
                </Link>
                <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--ghost" href="/advertise">
                  See Advertising Rates
                </Link>
              </div>
            </article>

            <article>
              <ShieldCheck aria-hidden="true" size={24} />
              <h2>Still torn between two styles?</h2>
              <p>
                Honest tiebreaker: pick the one with a beginner class starting soonest near you.
                Consistency beats the perfect choice, and every style here lets you switch later
                without starting from zero.
              </p>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="/dance-classes">
                Browse Dance Classes
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </article>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-styles-faq" aria-labelledby="dance-styles-faq-title">
          <SectionHeading
            eyebrow="First Class Questions"
            id="dance-styles-faq-title"
            sub="A little extra guidance for the people who are almost ready, but still need one or two practical doubts answered."
            title="Choosing your first dance class"
          />
          <div className="e4s-dance-styles-faq-grid">
            {styleFaqs.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-styles-final">
          <div>
            <h2>Found your style?</h2>
            <p>
              Head back to the hub to find classes by city, compare style pages, or start with the
              next beginner-friendly class near you.
            </p>
          </div>
          <div>
            <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="/dance-classes">
              Browse Dance Classes
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--ghost" href="/dance-classes#dance-classes-near-you">
              Find Classes Near Me
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
