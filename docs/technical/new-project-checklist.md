# New-project checklist

After creating a repository from this template ("Use this template → Create a new repository").

## Make it yours

- [ ] Replace the README with the project's own leaflet: what it is, what you can do, how to run it, links.
- [ ] Fill in [ROADMAP.md](../../ROADMAP.md), above all **What it is not**.
- [ ] Keep the MIT `LICENSE` (set the year), or choose another: replace the file, set `license` in [license-headers.json](../../license-headers.json), and record the decision. The scripts copied from the template stay MIT, headers included: before replacing `LICENSE`, copy it to `scripts/LICENSE`, then list each copied file under `exempt` (`scripts/check-docs.mjs`, `scripts/check-docs.test.mjs`, `scripts/check-headers.mjs`, `scripts/check-headers.test.mjs`, `scripts/version.mjs`, `scripts/version.test.mjs`). Do not exempt the whole folder, so new scripts are still checked. A private project says so.
- [ ] Replace [Getting started](../user-guide/getting-started.md) with the project's first steps.
- [ ] Write [Architecture](architecture.md): layers, folders, how to add a feature.
- [ ] If the project saves its own files, fill in [File format](file-format.md) before the first release; if not, delete that page and its index entry.
- [ ] Fill in [Tests](testing.md) with the real commands.
- [ ] Add the project's own rules to [CLAUDE.md](../../CLAUDE.md) (commands, folders, anything Claude must know).

## Make CI real

- [ ] Pick a [stack recipe](../recipes/README.md) if one fits, and copy its workflow files from `recipes/` into `.github/workflows/` (then delete the `recipes/` folder and `docs/recipes/` pages you do not need, and their index entries).
- [ ] Add the project's test and build jobs to `.github/workflows/ci.yml`, on the platform users really have.
- [ ] On GitHub: **Settings → Branches**, protect `main` (require a pull request and a passing CI run).
- [ ] Check that a pull request shows the CI result before it can be merged.

## Before the first release

- [ ] Version the data format (`schema_version`, `file_type`, `min_reader_version`) if the project saves files.
- [ ] List the files that hold the version in `version-files.json`, so a release is one command and the tag is checked (see [Contributing](../contributing.md#making-a-release)).
- [ ] Keep `CHANGELOG.md` current (a line per user-visible change under *Unreleased*).
- [ ] Edit the issue forms in `.github/ISSUE_TEMPLATE/` to ask what *this* project needs (areas, versions, logs), or delete them for a private project.
- [ ] Say in the docs where users' files are kept, how they are backed up and how to get work back.

## Keep it healthy

- [ ] Every user-visible change updates the user guide in the same pull request.
- [ ] Every decision goes in [the decision log](decisions.md).
