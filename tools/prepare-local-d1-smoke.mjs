import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(root, "tools", "local-d1-smoke.sql");

const result = spawnSync(
  "npx",
  ["wrangler", "d1", "execute", "events4singles", "--local", "--file", schemaPath, "--yes"],
  {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? "0",
    },
  }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
