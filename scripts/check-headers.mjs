// SPDX-FileCopyrightText: 2026 Nick Volpison (aka Nelson Volpiano Neto) and contributors
// SPDX-License-Identifier: MIT

// Checks that every source file says who owns it and under which licence. No dependencies (Node 20.11 or newer; needs git).
//
//   node scripts/check-headers.mjs
//
// The comment block at the top of each source file, within its first lines, must hold:
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

// How each kind of source file writes comments. Add a language here when a project first uses it.
const SLASH = { line: [/^\/\//], block: [["/*", "*/"]] };
const HASH = { line: [/^#/] };
const MARKUP = { block: [["<!--", "-->"]] };
const BATCH = { line: [/^::/, /^rem(?=\s|$)/i], before: /^@echo off$/i };
const STYLES = [
  ["c cc cpp cxx h hh hpp hxx cs go java js jsx cjs mjs kt rs swift ts tsx", SLASH],
  ["css", { block: SLASH.block }],
  ["php", { line: [/^\/\//, /^#/], block: SLASH.block, before: /^<\?php$/i }],
  ["py rb sh", HASH],
  ["ps1", { ...HASH, block: [["<#", "#>"]] }],
  ["bat cmd", BATCH],
  ["sql", { line: [/^--/], block: SLASH.block }],
  ["lua", { line: [/^--/], block: [["--[[", "]]"]] }],
  ["html", { ...MARKUP, before: /^<!doctype html>$/i }],
  ["svelte vue", MARKUP],
];
const STYLE_OF = new Map(STYLES.flatMap(([endings, style]) => endings.split(" ").map((e) => [e, style])));
const styleOf = (path) => STYLE_OF.get(path.slice(path.lastIndexOf(".") + 1).toLowerCase());

/** True for the files whose header is checked. */
export const isSourceFile = (path) => path.includes(".") && styleOf(path) !== undefined;

/** The text of the comments at the top of a file, up to the first line of code. */
function topComments(text, style) {
  const found = [];
  let close = null; // set while inside a block comment
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).slice(0, HEADER_LINES);
  for (const [index, line] of lines.entries()) {
    let rest = line.trim();
    if ((index === 0 && rest.startsWith("#!")) || style.before?.test(rest)) continue;
    while (rest) {
      if (close) {
        const end = rest.indexOf(close);
        found.push((end < 0 ? rest : rest.slice(0, end)).replace(/^[\s*]+/, "").trim());
        if (end < 0) break;
        rest = rest.slice(end + close.length).trim();
        close = null;
        continue;
      }
      // Block openers first: "--[[" also starts like a "--" line comment.
      const block = style.block?.find(([open]) => rest.startsWith(open));
      if (block) {
        close = block[1];
        rest = rest.slice(block[0].length);
        continue;
      }
      const mark = style.line?.find((m) => m.test(rest));
      if (!mark) return found; // code: the header is over
      found.push(rest.replace(mark, "").trim());
      break;
    }
  }
  return found;
}

/** What is wrong with the header of one source file (an empty list when nothing is). */
export function headerProblems(path, text, license) {
  const comments = topComments(text, styleOf(path));
  const valueOf = (tag) => comments.find((c) => c.startsWith(`${tag}:`))?.slice(tag.length + 1).trim() ?? "";
  const owner = valueOf("SPDX-FileCopyrightText");
  const found = valueOf("SPDX-License-Identifier");
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
    .filter((p) => isSourceFile(p) && !isExempt(p, config.exempt ?? []))
    .flatMap((p) => headerProblems(p, readFile(p), config.license).map((problem) => `${p}: ${problem}`));
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
