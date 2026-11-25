// SPDX-FileCopyrightText: 2026 Nick Volpison (aka Nelson Volpiano Neto) and contributors
// SPDX-License-Identifier: MIT

// Checks that every source file says who owns it and under which licence. No dependencies (Node 20 or newer; needs git).
//
//   node scripts/check-headers.mjs
//
// The first lines of each source file must hold:
//   SPDX-FileCopyrightText: <year> <owner>
//   SPDX-License-Identifier: <the "license" in license-headers.json>
// Paths in "exempt" are skipped: a file, or a folder ending in "/" (third-party and generated code).
//
// The checking functions are exported and tested in scripts/check-headers.test.mjs.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

/** How many lines from the top may pass before the header must be complete. */
export const HEADER_LINES = 10;

/** File endings that count as source code. Add a language here when a project first uses it. */
export const SOURCE_FILE = /\.(bat|c|cjs|cmd|cpp|cs|css|go|h|hpp|html|java|js|jsx|kt|lua|mjs|php|ps1|py|rb|rs|sh|sql|svelte|swift|ts|tsx|vue)$/i;

// A tag counts at the start of a line, with or without a comment mark, so text inside a string does not.
const tagLine = (tag) => new RegExp(`^\\s*(?:(?://|/\\*+|\\*|#|<!--|--|::|rem\\s)\\s*)?${tag}:[ \\t]*(.*)$`, "im");

/** What is wrong with the header of one file's text (an empty list when nothing is). */
export function headerProblems(text, license) {
  const top = text.replace(/^﻿/, "").split(/\r?\n/).slice(0, HEADER_LINES).join("\n");
  const clean = (match) => (match?.[1] ?? "").replace(/(\*\/|-->)\s*$/, "").trim();
  const owner = clean(top.match(tagLine("SPDX-FileCopyrightText")));
  const found = clean(top.match(tagLine("SPDX-License-Identifier")));
  const problems = [];
  if (!owner) problems.push("no SPDX-FileCopyrightText line");
  if (!found) problems.push("no SPDX-License-Identifier line");
  else if (found !== license) problems.push(`licence is "${found}", expected "${license}"`);
  return problems;
}

export const isExempt = (path, exempt) => exempt.some((e) => (e.endsWith("/") ? path.startsWith(e) : path === e));

/** All problems of the listed files ("src/a.py: no SPDX-License-Identifier line"). */
export function projectProblems(paths, config, readFile) {
  return paths
    .filter((p) => SOURCE_FILE.test(p) && !isExempt(p, config.exempt ?? []))
    .flatMap((p) => headerProblems(readFile(p), config.license).map((problem) => `${p}: ${problem}`));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = resolve(import.meta.dirname, "..");
  const config = JSON.parse(readFileSync(join(root, "license-headers.json"), "utf8"));
  if (!config.license) {
    console.error('license-headers.json needs a "license", for example "MIT".');
    process.exit(1);
  }
  // Tracked files and new ones; whatever .gitignore hides is left out.
  const paths = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter((p) => p && existsSync(join(root, p)));
  const problems = projectProblems(paths, config, (p) => readFileSync(join(root, p), "utf8"));
  if (problems.length) {
    console.error(problems.join("\n"));
    console.error("\nStart each file with the two SPDX lines (see CONVENTIONS.md), or list third-party and generated code under \"exempt\" in license-headers.json.");
    process.exit(1);
  }
  console.log("Source file headers are fine.");
}
