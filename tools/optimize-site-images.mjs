import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");
const outputDir = path.join(imagesDir, "optimized");

const jobs = [
  { glob: /^home-city-.+\.jpg$/i, width: 640, height: 960 },
  { glob: /^home-cat-.+\.jpg$/i, width: 720, height: 800 },
];

function outputName(filename) {
  return filename.replace(/\.(jpe?g|png)$/i, ".webp");
}

async function fileSize(file) {
  const stat = await fs.stat(file);
  return stat.size;
}

await fs.mkdir(outputDir, { recursive: true });

const entries = await fs.readdir(imagesDir, { withFileTypes: true });
const images = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => jobs.some((job) => job.glob.test(name)));

let totalBefore = 0;
let totalAfter = 0;

for (const name of images) {
  const job = jobs.find((item) => item.glob.test(name));
  const source = path.join(imagesDir, name);
  const target = path.join(outputDir, outputName(name));
  const before = await fileSize(source);

  await sharp(source)
    .rotate()
    .resize(job.width, job.height, {
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 6 })
    .toFile(target);

  const after = await fileSize(target);
  totalBefore += before;
  totalAfter += after;
  console.log(
    `${name} -> optimized/${path.basename(target)} ` +
      `${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`,
  );
}

console.log(
  `Optimized ${images.length} images: ` +
    `${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ` +
    `${(totalAfter / 1024 / 1024).toFixed(2)}MB`,
);
