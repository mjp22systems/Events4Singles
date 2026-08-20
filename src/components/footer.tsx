import { getAllCategories, getAllCities } from "@/lib/data";
import FooterContent from "./footer-content";

const SKIP_CAT_SLUGS = new Set(["events", "dance_salsa", "dance_tango"]);
const SKIP_CITY_SLUGS = new Set(["melbourne2"]);

export default async function Footer() {
  const allCats = (await getAllCategories()).filter(
    (c) => !c.parent_slug && c.label && !SKIP_CAT_SLUGS.has(c.slug)
  );
  const seenLabels = new Set<string>();
  const categories = allCats
    .filter((c) => {
      if (seenLabels.has(c.label)) return false;
      seenLabels.add(c.label);
      return true;
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const cities = (await getAllCities()).filter((c) => c.slug && c.label && !SKIP_CITY_SLUGS.has(c.slug));
  const catMid = Math.ceil(categories.length / 2);

  return (
    <footer className="e4s-footer" role="contentinfo">
      <FooterContent cities={cities} categories={categories} catMid={catMid} />
    </footer>
  );
}
