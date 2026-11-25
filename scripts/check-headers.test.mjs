// SPDX-FileCopyrightText: 2026 Nick Volpison (aka Nelson Volpiano Neto) and contributors
// SPDX-License-Identifier: MIT

import { test } from "node:test";
import assert from "node:assert/strict";
import { headerProblems, projectProblems } from "./check-headers.mjs";

const OWNER = "SPDX-FileCopyrightText: 2026 someone";
const LICENSE = "SPDX-License-Identifier: MIT";

test("the usual comment styles are accepted", () => {
  for (const text of [
    `# ${OWNER}\n# ${LICENSE}\n`,
    `﻿// ${OWNER}\r\n// ${LICENSE}\r\n`,
    `#!/usr/bin/env python3\n# ${OWNER}\n# ${LICENSE}\n`,
    `/*\n * ${OWNER}\n * ${LICENSE}\n */\n`,
    `/* ${OWNER} */\n/* ${LICENSE} */\n`,
    `<!--\n${OWNER}\n${LICENSE}\n-->\n`,
    `<!-- ${OWNER} -->\n<!-- ${LICENSE} -->\n`,
    `@echo off\nREM ${OWNER}\n:: ${LICENSE}\n`,
    `-- ${OWNER}\n-- ${LICENSE}\n`,
  ]) {
    assert.deepEqual(headerProblems(text, "MIT"), [], text);
  }
});

test("missing, empty, wrong and late headers are reported", () => {
  assert.equal(headerProblems("print(1)\n", "MIT").length, 2);
  assert.deepEqual(headerProblems(`# SPDX-FileCopyrightText:\n# ${LICENSE}\n`, "MIT"), ["no SPDX-FileCopyrightText line"]);
  assert.deepEqual(headerProblems(`# ${OWNER}\n# ${LICENSE}\n`, "GPL-3.0-or-later"), ['licence is "MIT", expected "GPL-3.0-or-later"']);
  assert.equal(headerProblems(`${"\n".repeat(10)}# ${OWNER}\n# ${LICENSE}\n`, "MIT").length, 2);
});

test("a tag inside a string is not a header", () => {
  assert.equal(headerProblems(`a = "${OWNER}"\nb = "${LICENSE}"\n`, "MIT").length, 2);
});

test("only source files that are not exempt are checked", () => {
  const paths = ["README.md", "data.json", "vendor/x.js", "gen.py", "src/a.py"];
  const config = { license: "MIT", exempt: ["vendor/", "gen.py"] };
  assert.deepEqual(projectProblems(paths, config, () => ""), [
    "src/a.py: no SPDX-FileCopyrightText line",
    "src/a.py: no SPDX-License-Identifier line",
  ]);
});
