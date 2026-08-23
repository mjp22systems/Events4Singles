import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDirs = ["src"];

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
  return sourceDirs
    .flatMap((dir) => walk(path.join(root, dir), new Set([".ts", ".tsx", ".js", ".jsx", ".mdx", ".html"])))
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
    const unusedCandidates = classNames.filter((name) => !sourceText.includes(name));

    return {
      file,
      lines: css.split(/\r?\n/).length,
      selectors: selectors.length,
      uniqueSelectors: selectorCounts.size,
      duplicateSelectors: duplicates.length,
      importantCount: (css.match(/!important/g) ?? []).length,
      unusedClassCandidates: unusedCandidates.length,
      topDuplicateSelectors: duplicates.slice(0, 12).map(([selector, count]) => ({ selector, count })),
      sampleUnusedClassCandidates: unusedCandidates.slice(0, 24),
    };
  });

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));
