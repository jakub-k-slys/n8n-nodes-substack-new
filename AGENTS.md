# Substack Gateway n8n Node

## Scope
This repository contains the `n8n-nodes-substack-new` package. It currently ships:

- `Substack Gateway` main action node
- `Substack Gateway Following Feed` polling trigger
- `Substack Gateway Profile Feed` polling trigger
- `Substack Gateway API` credentials

This is not a generic starter anymore. Prefer the patterns already present in
the repository over generic n8n examples.

## Current Architecture

### Main node
The main node entrypoint is `nodes/Gateway/Gateway.node.ts`.

Its shared programmatic runtime lives in `nodes/SubstackGateway/`.

Key structure:

- `description/`
  UI properties, resources, operations, and operation fields
- `domain/`
  typed operation catalog, request/result models, and shared error types
- `runtime/`
  execution pipeline, input decoding, request building, response decoding, and
  serialization
- `schema/`
  Effect schemas for inputs and API responses

The project uses `effect` and `@effect/platform` heavily. New runtime logic
should stay consistent with the existing Effect-based pipeline instead of
falling back to ad hoc imperative parsing.

### Triggers
The polling triggers live in:

- `nodes/FollowingFeed/FollowingFeed.node.ts`
- `nodes/ProfileFeed/ProfileFeed.node.ts`

Shared feed parsing and checkpoint logic lives in `nodes/shared/atom-feed/`.

### Gateway transport
Shared authenticated transport helpers live in `nodes/shared/gateway-transport/`.

Important detail:

- credentials now store the gateway root URL, such as
  `https://my.example`
- code derives:
  - root URL for capability discovery
  - `/api/v1` base URL for API requests

Do not hardcode `/api/v1` into credential defaults or user-facing guidance.

## Working Rules

### Read this first
Before changing code in these areas, load the relevant docs:

| Area | Read first |
|---|---|
| Planning or starting work | `.agents/workflow.md` |
| Any node file under `nodes/` | `.agents/nodes.md`, `.agents/properties.md` |
| Programmatic node runtime | above + `.agents/nodes-programmatic.md` |
| Credentials | `.agents/credentials.md` |
| Node versioning | `.agents/versioning.md` |

### Implementation expectations
- Keep changes typed. Avoid `any` unless there is no reasonable alternative.
- Reuse the existing resource catalog and runtime layers instead of creating
  parallel abstractions.
- Prefer adding shared helpers when multiple nodes need the same behavior.
- Preserve backward compatibility for saved credentials and workflows when
  practical.
- Keep user-facing operation names and descriptions clear in the editor.
- Do not leak secrets into logs, tests, or fixtures.

### Commit messages
Use semver-friendly conventional commit titles:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `refactor: ...`
- `test: ...`
- `chore: ...`

For breaking changes, use conventional commit breaking-change notation:

- `feat!: ...`
- `fix!: ...`

or include a `BREAKING CHANGE:` section in the commit body when needed.

Do not create plain-language commit titles without the prefix, and do not omit
the breaking-change marker when the change is semver-major.

## Repository Layout

### Source
- `credentials/SubstackGatewayApi.credentials.ts`
- `nodes/Gateway/`
- `nodes/FollowingFeed/`
- `nodes/ProfileFeed/`
- `nodes/SubstackGateway/`
- `nodes/shared/atom-feed/`
- `nodes/shared/gateway-transport/`

### Tests
- `test/*.test.ts` for unit tests
- `test/package/package-smoke.test.ts` for built-package smoke coverage
- `test/features/` for Cucumber runtime scenarios

### Scripts
- `scripts/dev.mjs`
- `scripts/prepare-dev-package.mjs`
- `scripts/copy-build-assets.mjs`

## Commands
Use the repo scripts instead of ad hoc commands when possible:

- `pnpm run test:unit`
- `pnpm run build`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run test:package`
- `pnpm run dev`

`pnpm run build` is the authoritative build command here. Although the generic
n8n docs mention `n8n-node build`, this repository currently builds with
`tsup` and a post-build asset copy step.

## Practical Guidance For Common Changes

### Adding or changing an operation
Update:

- `nodes/SubstackGateway/domain/operation.ts`
- `nodes/SubstackGateway/description/`
- `nodes/SubstackGateway/runtime/resources/<resource>/`
- `nodes/SubstackGateway/schema/` if request or response shapes change
- tests covering decode, execution, and JSON output when relevant

### Changing credentials
Update:

- `credentials/SubstackGatewayApi.credentials.ts`
- shared URL handling in `nodes/shared/gateway-transport/` if needed
- tests that depend on URL normalization or metadata

### Changing triggers
Update:

- the relevant `*.node.ts` trigger file
- `nodes/shared/atom-feed/` if parsing or checkpoint behavior changes
- trigger-facing tests

## Verification
For code changes, run at least:

1. `pnpm run test:unit`
2. `pnpm run build`
3. `pnpm run lint`

Run broader tests when the change touches packaging or end-to-end execution:

- `pnpm run test`
- `pnpm run test:package`

## External References
- https://docs.n8n.io/integrations/community-nodes/build-community-nodes/
- https://docs.n8n.io/integrations/creating-nodes/overview/
- https://docs.n8n.io/integrations/creating-nodes/build/reference/
- https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines/
