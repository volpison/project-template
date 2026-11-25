// SPDX-FileCopyrightText: 2026 Nick Volpison (aka Nelson Volpiano Neto) and contributors
// SPDX-License-Identifier: MIT

import { test } from "node:test";
import assert from "node:assert/strict";
import { headerProblems, isSourceFile, projectProblems } from "./check-headers.mjs";

const OWNER = "SPDX-FileCopyrightText: 2026 someone";
const LICENSE = "SPDX-License-Identifier: MIT";

const TAGS = `${OWNER}\n${LICENSE}`;

test("the usual comment styles are accepted", () => {
  for (const [path, text] of [
    ["a.py", `# ${OWNER}\n# ${LICENSE}\n`],
    ["a.js", `\uFEFF// ${OWNER}\r\n// ${LICENSE}\r\n`],
    ["a.py", `#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n\n# ${OWNER}\n# ${LICENSE}\n`],
    ["a.c", `/*\n * ${OWNER}\n * ${LICENSE}\n */\n`],
    ["a.css", `/* ${OWNER} */\n/* ${LICENSE} */\n`],
    ["a.rs", `/* A note */ // ${OWNER}\n// ${LICENSE}\n`],
    ["a.html", `<!DOCTYPE html>\n<!--\n${TAGS}\n-->\n`],
    ["a.svelte", `<!-- ${OWNER} -->\n<!-- ${LICENSE} -->\n`],
    ["a.bat", `@echo off\nREM ${OWNER}\n:: ${LICENSE}\n`],
    ["a.php", `<?php\n// ${OWNER}\n# ${LICENSE}\n`],
    ["a.sql", `-- ${OWNER}\n-- ${LICENSE}\n`],
    ["a.lua", `--[[\n${TAGS}\n]]\n`],
    ["a.ps1", `<#\n${TAGS}\n#>\n`],
  ]) {
    assert.deepEqual(headerProblems(path, text, "MIT"), [], `${path}: ${text}`);
  }
});

test("missing, empty, wrong and late headers are reported", () => {
  assert.equal(headerProblems("a.py", "print(1)\n", "MIT").length, 2);
  assert.deepEqual(headerProblems("a.py", `# SPDX-FileCopyrightText:\n# ${LICENSE}\n`, "MIT"), ["no SPDX-FileCopyrightText line"]);
  assert.deepEqual(headerProblems("a.py", `# ${OWNER}\n# ${LICENSE}\n`, "GPL-3.0-or-later"), ['licence is "MIT", expected "GPL-3.0-or-later"']);
  assert.equal(headerProblems("a.py", `${"\n".repeat(10)}# ${OWNER}\n# ${LICENSE}\n`, "MIT").length, 2);
});

test("tags outside the comment block at the top are not a header", () => {
  for (const [path, text] of [
    ["a.py", `a = "${OWNER}"\nb = "${LICENSE}"\n`],
    ["a.py", `sample = """\n${TAGS}\n"""\n`],
    ["a.py", `"""\n${TAGS}\n"""\n`],
    ["a.py", `x = 1\n# ${OWNER}\n# ${LICENSE}\n`],
    ["a.js", `const s = \`\n// ${OWNER}\n// ${LICENSE}\n\`;\n`],
    ["a.js", `${TAGS}\n`],
    ["a.js", `/* note */ run();\n// ${OWNER}\n// ${LICENSE}\n`],
    ["a.c", `#include <stdio.h>\n// ${OWNER}\n// ${LICENSE}\n`],
  ]) {
    assert.equal(headerProblems(path, text, "MIT").length, 2, `${path}: ${text}`);
  }
});

test("C++ endings are source files, documents and data are not", () => {
  for (const path of ["a.cc", "a.cxx", "a.hh", "a.hxx", "dir.v2/A.CPP"]) assert.ok(isSourceFile(path), path);
  for (const path of ["README.md", "data.json", "LICENSE", "scripts/LICENSE", "sh", "a.constructor"]) assert.ok(!isSourceFile(path), path);
});

test("only source files that are not exempt are checked", () => {
  const paths = ["README.md", "data.json", "vendor/x.js", "gen.py", "src/a.py"];
  const config = { license: "MIT", exempt: ["vendor/", "gen.py"] };
  assert.deepEqual(projectProblems(paths, config, () => ""), [
    "src/a.py: no SPDX-FileCopyrightText line",
    "src/a.py: no SPDX-License-Identifier line",
  ]);
});
