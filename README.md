# n8n-nodes-substack-new

`n8n-nodes-substack-new` provides a 4-node n8n community package:

- `Substack Gateway`
- `Substack Gateway Following Feed`
- `Substack Gateway Profile Feed`
- `Randomizer`

It integrates n8n with a gateway-backed Substack API and also includes a schedule-based random trigger utility.

> [!IMPORTANT]
> This is an unofficial community node. It is not part of n8n and is not compatible with n8n Cloud-hosted instances, where custom community packages cannot be installed.
>
> To use this package, you need an n8n environment you control, such as a self-hosted deployment, Docker setup, VPS, Railway, or a similar hosting provider.

## Installation

Install the package in the n8n instance where community nodes are enabled:

```bash
npm install n8n-nodes-substack-new
```

Restart n8n after installation.

## Nodes

- `Substack Gateway`
  Main action node for gateway-backed Substack reads and writes across own publication, notes, drafts, posts, and profiles.
- `Substack Gateway Following Feed`
  Polling trigger for the authenticated user's following feed.
- `Substack Gateway Profile Feed`
  Polling trigger for a specific Substack profile feed.
- `Randomizer`
  Trigger node that emits events at random times inside configured schedule windows.

## Credentials

The Substack nodes use the `Substack Gateway` credential with:

- `Gateway URL`
- `Gateway Token`

## Resources

Current resources and operations:

- `Own Publication`
  - `Own Profile`
  - `Own Notes`
  - `Own Posts`
  - `Own Following`
- `Note`
  - `Create`
  - `Get`
  - `Delete`
- `Draft`
  - `Create`
  - `Get`
  - `Get Many`
  - `Update`
  - `Delete`
- `Post`
  - `Get`
  - `Get Comments`
- `Profile`
  - `Get`
  - `Get Notes`
  - `Get Posts`

## Quickstart

1. Install the package and restart n8n.
2. Create a `Substack Gateway` credential for the Substack nodes.
3. Add one of the package nodes to a workflow.
4. For the main action node, try:
   - `Resource: Own Publication`
   - `Operation: Own Profile`

For a simple write flow, use `Substack Gateway` with:

- `Resource: Note`
- `Operation: Create`
- `Content: ...`
- `Attachment: ...` (optional)

For feed polling, use:

- `Substack Gateway Following Feed` to watch your authenticated following feed
- `Substack Gateway Profile Feed` to watch a specific profile's Atom feed

For schedule-based triggering, use:

- `Randomizer` with one or more windows and a target timezone

## Development

Common commands:

```bash
pnpm run build
pnpm run dev
pnpm run lint
pnpm test
pnpm test:unit
pnpm run test:package
```

Notes:

- `pnpm run build` uses `tsup` and copies the n8n static assets into `dist/`
- `pnpm run dev` builds the package, prepares a local dev package, and runs local n8n with watch mode
- `pnpm test` runs the Cucumber feature suite
- `pnpm test:unit` runs the fast source-level TypeScript tests
- `pnpm run test:package` verifies the built `dist/` package

## Documentation

- [Docs Index](/Users/jakubslys/n8n-nodes-substack-new/docs/index.md)
- [Quickstart](/Users/jakubslys/n8n-nodes-substack-new/docs/quickstart.md)
- [n8n Usage](/Users/jakubslys/n8n-nodes-substack-new/docs/n8n-usage.md)
- [Architecture](/Users/jakubslys/n8n-nodes-substack-new/docs/design.md)
- [Testing](/Users/jakubslys/n8n-nodes-substack-new/docs/testing.md)

## Compatibility

This package targets modern n8n releases with community nodes enabled. Verify against the current build and test workflow in this repository.
