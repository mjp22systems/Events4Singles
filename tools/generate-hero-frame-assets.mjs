import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");
const sourceImagesDir = path.join(root, "assets", "images");
const categorySourceDir = path.join(sourceImagesDir, "categories", "source");
const categoryHeroDir = path.join(imagesDir, "categories", "heroes");
const citySourceDir = path.join(sourceImagesDir, "cities", "source");
const cityHeroDir = path.join(imagesDir, "cities", "heroes");

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
  if (!(await fileExists(categorySourceDir))) {
    console.log("Skipped category hero assets: assets/images/categories/source does not exist.");
    return 0;
  }

  await fs.mkdir(categoryHeroDir, { recursive: true });
  const entries = await fs.readdir(categorySourceDir);
  let count = 0;

  for (const name of entries.filter((entry) => /\.(avif|jpe?g|png|webp)$/i.test(entry)).sort()) {
    if (name === "online-dating.webp") continue;
    const slug = name.replace(/\.(avif|jpe?g|png|webp)$/i, ".webp");
    await makeHero({
      source: path.join(categorySourceDir, name),
      targets: [path.join(categoryHeroDir, slug)],
      type: "category",
    });
    count += 1;
  }

  return count;
}

async function buildCities() {
  await fs.mkdir(cityHeroDir, { recursive: true });
  const entries = await fs.readdir(citySourceDir);
  let count = 0;

  for (const name of entries.filter((entry) => entry.endsWith(".webp")).sort()) {
    await makeHero({
      source: path.join(citySourceDir, name),
      targets: [path.join(cityHeroDir, name)],
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
