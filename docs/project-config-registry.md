# Events4Singles Project Config Registry

`project.config.json` is the machine-readable source of truth for project-local operational facts.

Use it for:

- canonical repo and project paths
- public domains and legacy domains
- Cloudflare Worker, D1, zone, and Dad API-token environment variable names
- local development port
- generated output folders
- canonical image folder roles
- required project commands
- project memory and Graphify governance

Do not use workstation-level config such as `D:\Config` as the authority for Events4Singles project facts. That folder can describe the machine, but this project must carry its own operational registry inside the repo.

## Update Rule

When a project fact changes:

1. Update `project.config.json`.
2. Update any affected script or doc.
3. Run `npm run config:audit`.
4. Run the relevant build/test/audit.
5. Run `npm run memory:refresh`.

The `memory:refresh` script is intentionally wired to run `config:audit` first. That means the Graphify memory loop will fail early if the project registry and executable scripts drift apart.

## Audit Scope

`npm run config:audit` checks:

- expected source and asset folders exist
- key `package.json` scripts match the registry
- `wrangler.toml` matches the registered Worker and D1 values
- deploy/cache scripts reference the Dad API-token env vars
- source-of-truth docs mention the important project facts
- generated folders remain identified as generated output

Critical drift fails the command. Documentation drift is reported as a warning unless it would make automation unsafe.

## Simple Rule

One registry says where things live.
Scripts read or match that registry.
Docs explain that registry.
Graphify refreshes after the registry still passes.
