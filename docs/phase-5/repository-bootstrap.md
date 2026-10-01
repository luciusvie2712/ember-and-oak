# Repository Bootstrap and Conventions

The repository has one root `pnpm-workspace.yaml` and one root `pnpm-lock.yaml`. Node and pnpm are pinned through `.nvmrc`, `.node-version`, `packageManager`, `engines`, and CI. Turborepo owns the task graph.

Conventions:

- Package names use `@ember-and-oak/*`; TypeScript is strict with unchecked indexed access enabled.
- Shared code crosses app boundaries only through published package exports or the HTTP API.
- ESLint protects frontend boundaries; Oxlint covers API/shared TypeScript; Prettier is check-only in CI.
- Branches should use `codex/` for agent work and a short feature/fix prefix for human work.
- Conventional commit style is recommended; PRs must explain verification, risk, and rollout.
- Protect `main`: require the CI `quality` check, at least one review, resolved conversations, and disallow force-push/deletion.

Generated output, dependencies, reports, logs, and all real `.env*` files are ignored. Example environment files are safe templates only.
