# project-template

**Guidelines and the foundation upon which the structure of future projects will be built.**

A starting point for every new repository under this account: the conventions we agreed on (taken from what worked, and what bit us, on [Fabulator](https://github.com/volpison/fabulator)), a documentation skeleton with a link check, a pull request template and a CI workflow. It is language-neutral; each project picks its own language and tools.

## What is inside

| | |
|---|---|
| [CONVENTIONS.md](CONVENTIONS.md) | The rules: structure, documentation, data compatibility, workflow, users, working with Claude |
| [CLAUDE.md](CLAUDE.md) | The short version Claude reads in every session |
| [ROADMAP.md](ROADMAP.md) | Skeleton: what the project is, what it is not, now, next, later |
| [docs/](docs/index.md) | Skeleton for the user guide and the technical docs, with a decision log |
| [scripts/check-docs.mjs](scripts/check-docs.mjs) | Checks that every link and heading link in the docs works and that the index lists every page |
| [scripts/version.mjs](scripts/version.mjs) | Changes the version in every file at once, and checks a release tag against it |
| [.github/](.github) | Pull request template, the CI workflow and the release workflow (draft releases) |

## Start a project from it

1. On GitHub, open this repository's **Settings** and tick **Template repository** (once).
2. For a new project press **Use this template → Create a new repository**.
3. Follow the [new-project checklist](docs/technical/new-project-checklist.md).

## Keep it healthy

```
node --test "scripts/*.test.mjs"   # tests of the scripts
node scripts/check-docs.mjs        # the docs check itself (needs Node 20 or newer)
node scripts/version.mjs show      # the version found in every file listed in version-files.json
```

Both run in CI on every pull request. See [Contributing](docs/contributing.md).
