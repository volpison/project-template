# Stack recipes

Copy-in starting points for the kinds of project built so far. The template itself is language-neutral; a recipe adds what one stack needs. Take the recipe that fits, copy what it names, delete the rest.

| Recipe | For |
|---|---|
| [Tauri + Svelte desktop app](tauri-svelte.md) | A Windows-first desktop app with a TypeScript front end and a Rust shell (Fabulator) |
| [Python desktop tool](python-desktop.md) | A Python tool with a Qt window that changes users' files (RPG Asset Tools) |

The workflow files that go with them live in [`recipes/`](../../recipes/). They are **inactive** there: nothing runs until you copy one into `.github/workflows/`.

## What the recipes share

These held in every project, whatever the language:

- **Pure logic apart from the window.** Rules are plain functions with unit tests and no framework; the window is a thin layer that calls them.
- **Test on the platform users have.** Usually `windows-latest`.
- **Tests run before a release is built.** A release never ships code whose tests fail.
- **The version lives in files listed in `version-files.json`**, changed with one command and checked against the tag.
- **Anything that changes users' files is safe by construction:** a backup first, the change reversible, nothing deleted without being moved aside first.

## What is not in the recipes

The older projects (RPG Asset Tools, the brush prototypes) predate this template. Their *habits* are carried over; their code is not, because it was written for one job each and would need to be rewritten to be reusable. Copy a pattern only when a new project needs it twice.
