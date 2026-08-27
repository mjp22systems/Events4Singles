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

async function softForeground(input, width, height, opacity = 0.96, sourceHeight = height, verticalBias = "center") {
  const resized = await sharp(input)
    .rotate()
    .resize({ height: sourceHeight })
    .png()
    .toBuffer();
  const resizedMeta = await sharp(resized).metadata();
  const cropLeft = Math.max(0, Math.round(((resizedMeta.width ?? width) - width) / 2));
  const extraHeight = Math.max(0, (resizedMeta.height ?? sourceHeight) - height);
  const cropTop = verticalBias === "bottom" ? extraHeight : Math.round(extraHeight / 2);
  const cropped = await sharp(resized)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: Math.min(width, resizedMeta.width ?? width),
      height: Math.min(height, resizedMeta.height ?? height),
    })
    .png()
    .toBuffer();
  const croppedMeta = await sharp(cropped).metadata();
  const image = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: cropped,
        left: Math.round((width - (croppedMeta.width ?? width)) / 2),
        top: Math.round((height - (croppedMeta.height ?? height)) / 2),
      },
    ])
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="x" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="white" stop-opacity="0"/>
          <stop offset="0.08" stop-color="white" stop-opacity="${opacity}"/>
          <stop offset="0.92" stop-color="white" stop-opacity="${opacity}"/>
          <stop offset="1" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="y" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="white" stop-opacity="0"/>
          <stop offset="0.06" stop-color="white" stop-opacity="1"/>
          <stop offset="0.94" stop-color="white" stop-opacity="1"/>
          <stop offset="1" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <mask id="my"><rect width="100%" height="100%" fill="url(#y)"/></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#x)" mask="url(#my)"/>
    </svg>`,
  );

  return sharp(image)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function makeHero({ source, targets, type }) {
  const background = await sharp(source)
    .rotate()
    .resize(HERO_WIDTH, HERO_HEIGHT, { fit: "cover", position: "attention" })
    .blur(type === "city" ? 14 : 22)
    .modulate({ brightness: type === "city" ? 0.88 : 0.78, saturation: type === "city" ? 0.92 : 0.86 })
    .png()
    .toBuffer();

  const foregroundWidth = type === "city" ? 1120 : 540;
  const foregroundHeight = HERO_HEIGHT;
  const foreground = await softForeground(
    source,
    foregroundWidth,
    foregroundHeight,
    type === "city" ? 0.9 : 0.98,
    type === "city" ? 420 : 430,
    type === "city" ? "bottom" : "center",
  );
  const left = type === "city" ? Math.round((HERO_WIDTH - foregroundWidth) / 2) : 1110;
  const top = Math.round((HERO_HEIGHT - foregroundHeight) / 2);

  await sharp(background)
    .composite([{ input: foreground, left, top }])
    .webp({ quality: 78, effort: 6 })
    .toBuffer()
    .then(async (output) => {
      for (const target of targets) {
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, output);
      }
    });
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
