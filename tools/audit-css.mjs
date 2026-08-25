import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoots = [
  { dir: "src", extensions: [".ts", ".tsx", ".js", ".jsx", ".mdx", ".html"] },
  { dir: "public", extensions: [".html", ".htm", ".js"] },
];
const dynamicClassSafelist = new Map([
  [
    "public/site.css",
    new Set(["e4s-love-tag--berry", "e4s-love-tag--mint", "e4s-love-tag--plain", "e4s-love-tag--teal"]),
  ],
]);

function walk(dir, extensions) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".next", "node_modules"].includes(entry.name)) return [];
      return walk(fullPath, extensions);
    }
    return extensions.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function getNonAsciiLineSamples(css, limit = 12) {
  return css
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter(({ text }) => [...text].some((char) => char.charCodeAt(0) > 127))
    .slice(0, limit);
}

function getNonAsciiCommentSamples(css, limit = 12) {
  const samples = [];
  const pattern = /\/\*[\s\S]*?\*\//g;
  let match;
  while ((match = pattern.exec(css)) && samples.length < limit) {
    const comment = match[0];
    if ([...comment].some((char) => char.charCodeAt(0) > 127)) {
      samples.push({
        line: lineNumberForIndex(css, match.index),
        text: comment.split(/\r?\n/)[0].slice(0, 160),
      });
    }
  }
  return samples;
}

function countNonAsciiCommentBlocks(css) {
  let count = 0;
  const pattern = /\/\*[\s\S]*?\*\//g;
  let match;
  while ((match = pattern.exec(css))) {
    if ([...match[0]].some((char) => char.charCodeAt(0) > 127)) {
      count += 1;
    }
  }
  return count;
}

function getSelectorBlocks(css) {
  const stripped = stripCssComments(css);
  const blocks = [];
  const pattern = /([^{}@][^{}]*)\{/g;
  let match;
  while ((match = pattern.exec(stripped))) {
    const selector = match[1].trim();
    if (!selector || selector.startsWith("@") || selector.includes(";")) continue;
    blocks.push(selector);
  }
  return blocks;
}

function getClassNames(css) {
  const classNames = new Set();
  const pattern = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
  let match;
  while ((match = pattern.exec(css))) {
    classNames.add(match[1]);
  }
  return [...classNames].sort();
}

function readSourceText() {
  return sourceRoots
    .flatMap(({ dir, extensions }) => walk(path.join(root, dir), new Set(extensions)))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
}

const sourceText = readSourceText();
const cssFiles = walk(path.join(root, "public"), new Set([".css"]))
  .map((file) => path.relative(root, file).replace(/\\/g, "/"))
  .sort();
const report = cssFiles
  .filter((file) => fs.existsSync(path.join(root, file)))
  .map((file) => {
    const css = fs.readFileSync(path.join(root, file), "utf8");
    const selectors = getSelectorBlocks(css)
      .flatMap((selectorList) => selectorList.split(","))
      .map((selector) => selector.trim())
      .filter(Boolean);
    const selectorCounts = new Map();
    for (const selector of selectors) {
      selectorCounts.set(selector, (selectorCounts.get(selector) ?? 0) + 1);
    }
    const duplicates = [...selectorCounts]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const classNames = getClassNames(css);
    const safelist = dynamicClassSafelist.get(file) ?? new Set();
    const unusedCandidates = classNames.filter((name) => !sourceText.includes(name) && !safelist.has(name));
    const nonAsciiLineSamples = getNonAsciiLineSamples(css);
    const nonAsciiCommentSamples = getNonAsciiCommentSamples(css);

    return {
      file,
      lines: css.split(/\r?\n/).length,
      selectors: selectors.length,
      uniqueSelectors: selectorCounts.size,
      duplicateSelectors: duplicates.length,
      importantCount: (css.match(/!important/g) ?? []).length,
      nonAsciiLines: css
        .split(/\r?\n/)
        .filter((line) => [...line].some((char) => char.charCodeAt(0) > 127)).length,
      nonAsciiCommentBlocks: countNonAsciiCommentBlocks(css),
      unusedClassCandidates: unusedCandidates.length,
      topDuplicateSelectors: duplicates.slice(0, 12).map(([selector, count]) => ({ selector, count })),
      sampleNonAsciiLines: nonAsciiLineSamples,
      sampleNonAsciiComments: nonAsciiCommentSamples,
      sampleUnusedClassCandidates: unusedCandidates.slice(0, 24),
    };
  });

const json = JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2);
console.log(process.argv.includes("--json-only") ? JSON.stringify({ report }) : json);
