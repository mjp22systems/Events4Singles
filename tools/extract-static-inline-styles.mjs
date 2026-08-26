import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const CSS_TARGETS = {
  site: path.join(ROOT, "public", "site.css"),
  admin: path.join(ROOT, "public", "admin.css"),
  portal: path.join(ROOT, "public", "portal.css"),
};

const SKIP_FILES = new Set([
  path.normalize("src/app/api/contact/route.ts"),
  path.normalize("src/lib/email.ts"),
]);

const unitless = new Set([
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "fontWeight",
  "gridArea",
  "gridRow",
  "gridRowEnd",
  "gridRowSpan",
  "gridRowStart",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnSpan",
  "gridColumnStart",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
]);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!["node_modules", ".next"].includes(entry)) files.push(...walk(full));
    } else if (/\.(tsx|ts)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function ownerFor(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (rel.startsWith("src/app/admin/") || rel.startsWith("src/components/admin/")) {
    return { name: "admin", prefix: "a-inline" };
  }
  if (rel.startsWith("src/app/portal/") || rel.startsWith("src/components/portal/")) {
    return { name: "portal", prefix: "p-inline" };
  }
  return { name: "site", prefix: "e4s-inline" };
}

function kebab(prop) {
  if (prop.startsWith("--")) return prop;
  return prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function splitTopLevel(input) {
  const parts = [];
  let quote = "";
  let depth = 0;
  let start = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const prev = input[i - 1];
    if (quote) {
      if (ch === quote && prev !== "\\") quote = "";
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    if (ch === ")" || ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(input.slice(start, i).trim());
      start = i + 1;
    }
  }
  const tail = input.slice(start).trim();
  if (tail) parts.push(tail);
  return parts;
}

function parseStaticStyle(styleBody) {
  if (!styleBody.trim()) return null;
  if (/[?]|\bundefined\b|\bnull\b|\btrue\b|\bfalse\b|=>|\.\.\./.test(styleBody)) return null;
  const decls = [];
  for (const part of splitTopLevel(styleBody)) {
    const match = part.match(/^["']?([A-Za-z_$][\w$-]*|--[\w-]+)["']?\s*:\s*(.+)$/s);
    if (!match) return null;
    const prop = match[1];
    let raw = match[2].trim();
    if (raw.endsWith(",")) raw = raw.slice(0, -1).trim();
    let value;
    const stringMatch = raw.match(/^(['"`])([\s\S]*)\1$/);
    const numberMatch = raw.match(/^-?\d+(\.\d+)?$/);
    if (stringMatch) {
      value = stringMatch[2];
    } else if (numberMatch) {
      value = unitless.has(prop) || prop.startsWith("--") ? raw : `${raw}px`;
    } else {
      return null;
    }
    decls.push(`${kebab(prop)}: ${value};`);
  }
  return decls;
}

function findStyleBlocks(text) {
  const blocks = [];
  let index = 0;
  while ((index = text.indexOf("style={{", index)) !== -1) {
    let i = index + "style={{".length;
    let depth = 2;
    let quote = "";
    for (; i < text.length; i++) {
      const ch = text[i];
      const prev = text[i - 1];
      if (quote) {
        if (ch === quote && prev !== "\\") quote = "";
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
        continue;
      }
      if (ch === "{") depth++;
      if (ch === "}") depth--;
      if (depth === 0) {
        blocks.push({ start: index, end: i + 1, body: text.slice(index + "style={{".length, i - 1) });
        index = i + 1;
        break;
      }
    }
  }
  return blocks;
}

function addClassToTag(text, styleStart, className) {
  const tagStart = text.lastIndexOf("<", styleStart);
  if (tagStart < 0) return null;
  const beforeStyle = text.slice(tagStart, styleStart);
  const literal = beforeStyle.match(/className=(["'])(.*?)\1/s);
  if (literal) {
    const replaceStart = tagStart + literal.index;
    const replaceEnd = replaceStart + literal[0].length;
    const quote = literal[1];
    const value = literal[2];
    return text.slice(0, replaceStart) + `className=${quote}${value} ${className}${quote}` + text.slice(replaceEnd);
  }
  const expression = beforeStyle.match(/className=\{/s);
  if (expression) return null;
  return text.slice(0, styleStart) + `className="${className}" ` + text.slice(styleStart);
}

const cssAdds = { site: new Map(), admin: new Map(), portal: new Map() };
let converted = 0;
let skipped = 0;

for (const file of walk(SRC)) {
  const rel = path.normalize(path.relative(ROOT, file));
  if (SKIP_FILES.has(rel)) continue;
  let text = readFileSync(file, "utf8");
  const blocks = findStyleBlocks(text).reverse();
  if (!blocks.length) continue;
  const owner = ownerFor(file);
  let changed = false;
  for (const block of blocks) {
    const decls = parseStaticStyle(block.body);
    if (!decls) {
      skipped++;
      continue;
    }
    const hash = createHash("sha1").update(`${owner.name}:${decls.join("")}`).digest("hex").slice(0, 8);
    const className = `${owner.prefix}-${hash}`;
    const withClass = addClassToTag(text, block.start, className);
    if (!withClass) {
      skipped++;
      continue;
    }
    const shift = withClass.length - text.length;
    text = withClass.slice(0, block.start + shift) + withClass.slice(block.end + shift);
    cssAdds[owner.name].set(className, decls);
    converted++;
    changed = true;
  }
  if (changed) writeFileSync(file, text, "utf8");
}

for (const [owner, styles] of Object.entries(cssAdds)) {
  if (!styles.size) continue;
  const cssPath = CSS_TARGETS[owner];
  let css = readFileSync(cssPath, "utf8").trimEnd();
  css += "\n\n/* Extracted static inline styles ---------------------------------------- */\n";
  for (const [className, decls] of styles) {
    css += `.${className} {\n  ${decls.join("\n  ")}\n}\n\n`;
  }
  writeFileSync(cssPath, `${css.trimEnd()}\n`, "utf8");
}

console.log(JSON.stringify({ converted, skipped }, null, 2));
