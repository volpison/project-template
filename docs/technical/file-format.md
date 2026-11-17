# File format

> A skeleton for projects that save their own files. Delete this page (and its entry in [the index](../index.md)) if the project does not.

The saved data is a promise to users. The rules are in [the conventions](../../CONVENTIONS.md#3-data-and-compatibility); this page records the facts.

## What a file looks like

Describe the file: its extension, its encoding, and a small example. Name every top-level field and say what it holds.

## Compatibility rules

- Every file has `schema_version` (a whole number) and `file_type` (a fixed text that says what the file is).
- `min_reader_version` is the lowest version of the program that can open the file safely.
- A file of another `file_type` is refused with a plain message.
- A file that needs a newer version than the one running is refused with a plain message, unless its `min_reader_version` allows this version to read it; then unknown fields are kept and written back unchanged.
- Unknown fields are never dropped.
- A new kind of document keeps all its data under one key named after it.

## Version history

| Version | What changed |
|---|---|
| 1 | The first format |

Add a row for every change, in the same pull request as its migration and its test.
