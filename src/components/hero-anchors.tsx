"use client";

export default function HeroAnchors() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="e4s-home-hero__ctas">
      <button
        className="e4s-home-hero__cta e4s-home-hero__cta--primary"
        onClick={() => scrollTo("cities")}
        type="button"
      >
        Browse by City →
      </button>
      <button
        className="e4s-home-hero__cta"
        onClick={() => scrollTo("categories")}
        type="button"
      >
        Categories
      </button>
    </div>
  );
}
