import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");
const categorySourceDir = path.join(imagesDir, "categories", "cards");
const categoryHeroDir = path.join(imagesDir, "categories", "heroes");
const categoryLegacyHeroDir = path.join(imagesDir, "categories", "hero");
const citySourceDir = path.join(imagesDir, "cities", "source");
const cityHeroDir = path.join(imagesDir, "cities", "heroes");
const cityLegacyHeroDir = path.join(imagesDir, "cities", "hero");

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 320;

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function makeHero({ source, targets, type }) {
  const output = await sharp(source)
    .rotate()
    .resize(HERO_WIDTH, HERO_HEIGHT, {
      fit: "cover",
      position: type === "city" ? "attention" : "centre",
    })
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  for (const target of targets) {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, output);
  }
}

async function buildCategories() {
  await fs.mkdir(categoryHeroDir, { recursive: true });
  await fs.mkdir(categoryLegacyHeroDir, { recursive: true });
  const entries = await fs.readdir(categorySourceDir);
  let count = 0;

  for (const name of entries.filter((entry) => entry.endsWith(".webp")).sort()) {
    if (name === "online-dating.webp") continue;
    await makeHero({
      source: path.join(categorySourceDir, name),
      targets: [
        path.join(categoryHeroDir, name),
        path.join(categoryLegacyHeroDir, name),
      ],
      type: "category",
    });
    count += 1;
  }

  return count;
}

async function buildCities() {
  await fs.mkdir(cityHeroDir, { recursive: true });
  await fs.mkdir(cityLegacyHeroDir, { recursive: true });
  const entries = await fs.readdir(citySourceDir);
  let count = 0;

  for (const name of entries.filter((entry) => entry.endsWith(".webp")).sort()) {
    await makeHero({
      source: path.join(citySourceDir, name),
      targets: [
        path.join(cityHeroDir, name),
        path.join(cityLegacyHeroDir, name),
      ],
      type: "city",
    });
    count += 1;
  }

  return count;
}

const onlineDatingHero = path.join(categoryHeroDir, "online-dating.webp");
if (!(await fileExists(onlineDatingHero))) {
  throw new Error("Expected existing Online Dating hero asset before batch generation.");
}

const categoryCount = await buildCategories();
const cityCount = await buildCities();

console.log(`Generated ${categoryCount} category hero assets and ${cityCount} city hero assets.`);
