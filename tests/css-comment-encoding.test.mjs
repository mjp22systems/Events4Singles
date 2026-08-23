import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const output = execFileSync("node", ["tools/audit-css.mjs", "--json-only"], {
  encoding: "utf8",
});
const { report } = JSON.parse(output);

for (const entry of report) {
  assert.equal(
    entry.nonAsciiLines,
    0,
    `${entry.file} has non-ASCII CSS that can display as mojibake`,
  );
  assert.equal(
    entry.nonAsciiCommentBlocks,
    0,
    `${entry.file} has non-ASCII CSS comments that can display as mojibake`,
  );
}
