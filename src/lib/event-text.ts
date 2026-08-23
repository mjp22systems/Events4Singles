const MARKDOWN_ESCAPE_RE = /\\([\\`*_{}\[\]()#+\-.!?,>])/g;
const MARKDOWN_RULE_RE = /^[\s*_=-]{5,}$/gm;
const MARKDOWN_EMPHASIS_RE = /(\*{1,3}|_{1,3})([^\n*_][^\n]*?[^\n*_])\1/g;

export function cleanEventDescription(value: string | null | undefined): string | null {
  const text = (value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(MARKDOWN_ESCAPE_RE, "$1")
    .replace(MARKDOWN_RULE_RE, "")
    .replace(MARKDOWN_EMPHASIS_RE, "$2")
    .replace(/^[ \t]*[-*+][ \t]+/gm, "")
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
    .replace(/\*{1,3}/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text || null;
}

export function eventDescriptionExcerpt(value: string | null | undefined, limit = 120): string | null {
  const text = cleanEventDescription(value)?.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  if (!text) return null;
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}
