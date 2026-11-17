# Recipe: Python desktop tool

Taken from RPG Asset Tools (Python, PySide6, unittest) and its habits. Status of this page: the habits come from a project that works; the workflow in `recipes/ci-python.yml` has **not** been run from this template.

## Layout

```
mytool/            the package: pure modules, plus the Qt modules (window, dialogs)
tests/             unittest tests of the pure modules
docs/              this template's docs (user guide, technical)
requirements.txt   the dependencies, pinned loosely (for example PySide6>=6.5)
CHANGELOG.md       user-facing history
Run.bat            starts the app (Windows)
check_dependencies.bat  prints Python and package versions, for bug reports
```

## Habits worth keeping

- **Pure modules apart from Qt.** Everything that decides something is plain Python with no Qt import, tested with `python -m unittest discover -s tests` (stdlib, nothing to install). The Qt modules only show and ask.
- **A fake-Qt stub for tests that touch a little Qt,** and a **real-window smoke test** that opens the actual window, drives it and exits. Pure logic gets a unit test; real Qt behaviour gets a smoke-test step.
- **Changing users' files goes through one function** that makes a backup first, moves files before writing data, rolls back on any failure, and records an Undo. Nothing is deleted: unused files are moved to an `_unused` folder; the tool removes only its own caches.
- **Work on a copy first.** Ask for confirmation before the first change to a project.
- **Refuse when blind.** If a data file cannot be parsed, disable the actions that depend on it rather than guess.
- **Caches carry a version** (`CACHE_VERSION`); bump it whenever what is cached changes shape, so old caches are ignored, not misread.
- **Heavy scans in separate processes,** results cached per file, and a hang watchdog that writes a log users can attach to a bug report.
- **Keep the tool's own files in one hidden folder** inside the user's project (say so, and tell users to exclude it from releases and Git).

## Commands

```
python -m unittest discover -s tests     # unit tests, no Qt needed
python mytool/smoke_test_qt.py           # real-window check (needs a display)
node scripts/check-docs.mjs              # docs links and index
```

## Version files

```json
{
  "files": [
    { "file": "mytool/__init__.py", "kind": "regex", "pattern": "(__version__ = \")([^\"]+)(\")" },
    { "file": "pyproject.toml", "kind": "toml", "section": "project" }
  ]
}
```

Drop the `pyproject.toml` line if the project has none.

## CI

[`recipes/ci-python.yml`](../../recipes/ci-python.yml) runs the unit tests on Windows. The smoke test is left out because it needs a display; run it by hand before a release, and say in the pull request whether you did.

## Changelog

Keep [CHANGELOG.md](../../CHANGELOG.md) in the *Keep a Changelog* shape (`Added`, `Changed`, `Fixed` under `## [x.y.z] - date`, newest first, `Unreleased` on top). Write it for users, not for developers. Under **Known limitations** in the README or manual, say what the tool cannot see.

## Prototypes

Small experiments (for example a brush-engine prototype) do not need all of this. Start with the layout above, keep the engine free of the GUI, and add the rest when the experiment becomes a tool.
