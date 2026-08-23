function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineMarkdown(value: string): string {
  return value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function orderedListItems(lines: string[]): { html: string; consumed: number } | null {
  const items: string[] = [];
  let consumed = 0;
  for (const line of lines) {
    const match = line.match(/^\\?\d+[\.)]\s+(.+)$/);
    if (!match) break;
    items.push(`<li>${inlineMarkdown(match[1].trim())}</li>`);
    consumed++;
  }
  if (!items.length) return null;
  return { html: `<ol>${items.join("")}</ol>`, consumed };
}

function unorderedListItems(lines: string[]): { html: string; consumed: number } | null {
  const items: string[] = [];
  let consumed = 0;
  for (const line of lines) {
    const match = line.match(/^[-*]\s+(.+)$/);
    if (!match) break;
    items.push(`<li>${inlineMarkdown(match[1].trim())}</li>`);
    consumed++;
  }
  if (!items.length) return null;
  return { html: `<ul>${items.join("")}</ul>`, consumed };
}

export function eventbriteDescriptionHtml(description: string | null): string {
  if (!description) return "";
  const normalized = escapeHtml(description)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\\([0-9]+[\.)]\s+)/g, "$1");

  const blocks = normalized.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const htmlBlocks: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    for (let index = 0; index < lines.length;) {
      const ordered = orderedListItems(lines.slice(index));
      if (ordered) {
        htmlBlocks.push(ordered.html);
        index += ordered.consumed;
        continue;
      }

      const unordered = unorderedListItems(lines.slice(index));
      if (unordered) {
        htmlBlocks.push(unordered.html);
        index += unordered.consumed;
        continue;
      }

      htmlBlocks.push(`<p>${inlineMarkdown(lines[index])}</p>`);
      index++;
    }
  }

  return htmlBlocks.join("");
}
