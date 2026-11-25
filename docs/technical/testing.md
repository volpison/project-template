# Tests

> A skeleton. Fill in the project's own commands.

## Running the tests

Write the exact commands, one per line, with what each checks:

```
<run the unit tests>
<run the type check or linter>
<build>
node --test "scripts/*.test.mjs"   # tests of the docs check
node scripts/check-docs.mjs        # links, heading links and the docs index
node scripts/check-headers.mjs     # SPDX lines in source files
```

## What the tests cover

Name the areas and where their tests live. Mirror the source folders. Pure rules get the most tests: they are fast and need nothing else. The thin user interface is checked by the build, by the type check and by running the program.

## What CI does

`.github/workflows/ci.yml` runs on every push to `main` and every pull request. State here which platforms it uses and why. **Test on the platform users really have**: a docs test once failed only on Windows because of backslashes in paths.

## Writing a test

- A new pure rule gets a test in the matching file.
- A change to the data format also gets a migration test: an older file still opens and is repaired.
- Compare paths with forward slashes; never assume the machine's separator.
- A bug fix starts with a test that fails for the bug.
