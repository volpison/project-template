# Recipe: Tauri + Svelte desktop app

Taken from Fabulator (Tauri 2, Svelte 5, TypeScript, Vite). Status of this page: written from a project that works; the workflow files in `recipes/` have **not** been run from this template, so run them once in a throwaway repository first.

## Layout

```
src/lib/          pure TypeScript: rules, formats, export. No Svelte, no Tauri. Unit-tested.
src/components/   Svelte components: thin, they call src/lib.
src-tauri/        the Rust shell: file access, dialogs, the saved-file structs.
tests/            one test file per area of src/lib, plain Node tests.
scripts/          version.mjs, check-docs.mjs (from this template).
```

Rule of thumb: if a rule can be written without the screen, it goes in `src/lib` with a test.

## Commands

Put these in `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "check": "svelte-check --tsconfig ./tsconfig.json",
  "test": "node --experimental-strip-types --no-warnings --import ./tests/register.mjs --test \"tests/*.test.ts\"",
  "tauri": "tauri",
  "version:set": "node scripts/version.mjs set",
  "version:check": "node scripts/version.mjs check"
}
```

- Tests use Node's built-in runner with type stripping, so no test framework is installed. A small `tests/register.mjs` loader lets imports omit the `.ts` extension.
- Use the glob `"tests/*.test.ts"`, not a directory: on Node 22 a directory is treated as a module path.
- Keep imports in `src/lib` free of Svelte and Tauri so Node can run them.

## Version files

```json
{
  "files": [
    { "file": "package.json", "kind": "json" },
    { "file": "src-tauri/tauri.conf.json", "kind": "json" },
    { "file": "src-tauri/Cargo.toml", "kind": "toml", "section": "package" }
  ]
}
```

Add the lock files if they carry the project's own version. The installer's file name comes from `tauri.conf.json`, so a tag that disagrees with it must stop the release.

## CI and release

- [`recipes/ci-tauri-svelte.yml`](../../recipes/ci-tauri-svelte.yml): JS tests, front-end build, Rust tests on Windows, an informational type check. Merge its steps into the template's `ci.yml` (keep the `docs` job).
- [`recipes/release-tauri.yml`](../../recipes/release-tauri.yml): on a `v*` tag, check the version, run the tests, build the installer and attach it to a **draft** release. It replaces the template's `release.yml` for a Tauri project.

Cargo and Svelte are slow to build locally and may not be buildable in every environment (for example a Claude session without network). **CI is then the only build check**, so say so in the pull request: "not built here, CI builds it".

## Data format (Rust side)

If the app saves files, the Rust structs and the TypeScript types must agree on the schema version. In Fabulator:

- `CURRENT_SCHEMA_VERSION` (TypeScript) equals `SCHEMA_VERSION` (Rust); a test or a code comment keeps them paired.
- Rust structs keep a `#[serde(flatten)] extra` map so fields from newer versions survive a save.
- A new kind of document stores everything under one key; the Rust side need not model it.
- Older files are migrated on open; newer files are refused with a plain message (see CONVENTIONS §3).

## Known sharp edges

- Windows installers are not code-signed; say in the release notes that SmartScreen may warn.
- `dragDropEnabled: false` in `tauri.conf.json` was needed for in-page drag and drop on Windows.
- Svelte 5 can run old syntax (`on:click`, `export let`); do not mix styles within one component.
