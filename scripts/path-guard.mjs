#!/usr/bin/env node
// path-guard.mjs — CI runner for the path-guard check (issue #530).
//
// Reads changed file paths (newline-separated on stdin, or as argv arguments)
// plus FOUNDER_APPROVED=true|false from the environment, and exits:
//   0 — no founder-gated paths touched, or gated paths approved via the
//       founder-approved label (approved paths are printed);
//   1 — gated paths touched without approval (paths + remedy printed).
//
// Invoked by .github/workflows/path-guard.yaml from a BASE-branch checkout so a
// PR cannot weaken the classifier that judges it. Logic lives in
// scripts/path-guard-lib.mjs (unit-tested in test/scripts/path-guard.spec.ts).

import { evaluatePathGuard } from "./path-guard-lib.mjs";

async function readStdin() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

const input =
  process.argv.length > 2 ? process.argv.slice(2).join("\n") : await readStdin();

const paths = input
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const founderApproved = process.env.FOUNDER_APPROVED === "true";

const { ok, message } = evaluatePathGuard(paths, founderApproved);
console.log(message);
process.exit(ok ? 0 : 1);
