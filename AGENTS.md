<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Events4Singles Source Of Truth

The active app is this `website` repo. The project-local authority is `docs/events4singles-source-of-truth.md`, backed by `project.config.json`.

Read that source-of-truth doc before structural, naming, routing, data, deploy, or Graphify-loop decisions. Do not use retired project briefs as an authority. After modifying source, tests, docs, or governance, run `npm run memory:refresh`.
