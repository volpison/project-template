# Contributing

How changes are made, what CI does and how a release is made. The reasons are in [the conventions](../CONVENTIONS.md#4-workflow-small-checked-boring).

## The workflow

- Work happens on a branch, never directly on `main`. Branch names that Claude creates start with `claude/`.
- Each change is a **pull request** with one topic. The description says what changed, why, and what to check before merging (the pull request template asks for it).
- CI must be green (a ✓ in the pull request) before merging.
- A change that moves code without changing behaviour goes in its own pull request.
- Commit messages say what changed and why, in plain words.

Everyday steps:

```
git checkout -b my-change
git add .
git commit -m "What changed"
git push -u origin my-change
```

then open a pull request on GitHub.

## What CI is

A *workflow* is a recipe in `.github/workflows/` that GitHub runs on its own computers. `ci.yml` runs by itself on every push to `main` and every pull request; open the **Actions** tab to see a green ✓ or a red ✗, and click a red one to read the error. See [Tests](technical/testing.md).

## Making a release

The release steps depend on the project. The shape to aim for:

1. **One command changes the version everywhere** it is written (the project's manifest, lock files, installer settings).
2. Send that change as a pull request and merge it when CI is green.
3. Tag the merged `main` (`v1.2.0`) and push the tag.
4. **A workflow checks that the tag matches the version** and stops if not; then it builds and creates a **draft release** to review and publish.

Number the versions `major.minor.patch`: new features raise the middle number, only fixes raise the last one.

## Keeping the docs healthy

- A user-facing change updates `docs/user-guide/`; a change to how the project is built or to its data format updates `docs/technical/`.
- A new page is added to [the index](index.md). `node scripts/check-docs.mjs` fails if a link or an index entry is broken, and CI runs it.
- The README stays short: what it is, what you can do, how to run it, links.
