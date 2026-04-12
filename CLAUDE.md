# Claude Guidance

Read `AGENTS.md` first. It contains the repo-specific instructions.

Additional repo notes:

- This package is an existing Substack Gateway integration, not a template.
- The main node is programmatic and Effect-based.
- Credentials store the gateway root URL, not `/api/v1`.
- Prefer updating the shared operation catalog and runtime helpers over adding
  one-off logic in individual files.

For code changes, finish by running:

1. `pnpm run test:unit`
2. `pnpm run build`
3. `pnpm run lint`

Use semver-friendly conventional commit titles such as `feat:`, `fix:`,
`docs:`, `refactor:`, `test:`, or `chore:`.

For breaking changes, use `!` in the type or scope, for example
`feat!: ...`, and include `BREAKING CHANGE:` in the body when appropriate.
