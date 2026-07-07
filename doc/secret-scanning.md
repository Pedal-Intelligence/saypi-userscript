# Secret scanning (gitleaks)

The never-commit-secrets rule (AGENTS.md, "Credentials") is enforced
mechanically by [gitleaks](https://github.com/gitleaks/gitleaks) in CI
(issue #531). This page is the operating manual: what runs, the
clean-baseline discipline, how to run it locally, and what to do when it
fires.

## What runs

`.github/workflows/secret-scan.yaml` — on **every pull request** and on
**pushes to `main`** (plus manual `workflow_dispatch`), with read-only
permissions:

- **PRs** run `gitleaks git` over the PR's commit range
  (`base.sha..head.sha`), so a secret that is added and then removed within
  the same PR still fails the check.
- **Pushes to `main`** run `gitleaks dir .` over the checked-out tree — a
  standing assertion that the baseline stays clean.

The binary is a **pinned release** (not `latest`, not a third-party action):
the workflow downloads the exact `GITLEAKS_VERSION`, verifies the release
tarball against the pinned `GITLEAKS_SHA256`, and only then runs it. We do
not use `gitleaks/gitleaks-action`, which requires a `GITLEAKS_LICENSE` key
for organization-owned repos. All scans run with `--redact` so a detected
secret is never echoed into Actions logs.

A Vitest drift guard (`test/scripts/secret-scan.spec.ts`) asserts the
workflow's triggers, the version/checksum pin, `--redact`, and the config
discipline below — so a quiet weakening edit fails the normal test gate.

**Status: advisory.** The job runs on every PR but is not yet a *required*
check. Promotion to required is a branch-protection change and, per
AGENTS.md, a founder-gated gate change — tracked as the follow-up on #531.

## The clean-baseline discipline

`gitleaks dir . --config .gitleaks.toml` on the tree **must exit 0**. That
invariant is what makes the check meaningful: any finding is a new problem,
never ambient noise to be waved off.

Consequences:

- **No standing suppressions without rationale.** Every `[[allowlists]]`
  entry in `.gitleaks.toml` must carry a comment saying what it matches, why
  it is safe, and how that was verified. (The drift-guard spec enforces the
  comment's existence; review enforces its honesty.)
- **Allowlist entries are as narrow as they can be while staying
  effective.** Prefer an exact known-fake string; scope by rule *and* path
  when an exact string can't work (see the fixture entry below); never
  suppress a whole rule or a whole directory unscoped.
- **Never allowlist anything real.** If the scan fires on a genuine
  credential, allowlisting it is the one forbidden move — see "When the scan
  fires".

### Current allowlist (2 entries)

1. **The scrubbed-fixture placeholder JWT** — PR #541 replaced real captured
   session tokens in the ChatGPT DOM fixtures with one exact fake JWT
   (`{"alg":"none"}` header, `{"sub":"REDACTED","note":"scrubbed-fixture"}`
   payload, literal `SCRUBBED` signature). The exact string is allowlisted;
   a real token would not match it.
2. **`generic-api-key` in `doc/dom/**/*.html`** — recorded third-party host
   pages serialize the host's client-side state, which is full of
   high-entropy *public* values (A/B experiment variant hashes, feature-gate
   ids) sitting next to credential-ish keyword names (one ChatGPT flag is
   literally named `..._leaked_credential_check`). That keyword+entropy
   coincidence is exactly what the generic heuristic fires on, and gitleaks
   surfaces the next overlapping candidate once one is suppressed — so
   exact-string allowlisting is unbounded there. The entry is scoped to that
   one heuristic rule on those paths only; every specific rule (`jwt`,
   vendor API keys, `private-key`, …) still applies to the fixtures, so a
   future capture embedding a real token still fails.

### Fixture hygiene (capture-time redaction — follow-up)

The durable fix for fixture noise is upstream of the scanner: the DOM
capture recorder (`scripts/dom-capture/`) should **redact at capture time**
— strip or placeholder session tokens, cookies, JWTs, email addresses, and
account/org/device identifiers before a fixture is ever written to disk (the
#541 review recommendation). Until that lands, treat any newly recorded
fixture as suspect: run the local scan before committing it, and scrub with
the #541 placeholder convention (`REDACTED` scalars, the `alg:none`
placeholder JWT) rather than adding allowlist entries.

## Running locally

Use the same pinned version as CI (macOS arm64 shown; checksums are in
`gitleaks_<ver>_checksums.txt` on the release page):

```sh
VER=8.30.1
curl -sSfL -O "https://github.com/gitleaks/gitleaks/releases/download/v${VER}/gitleaks_${VER}_darwin_arm64.tar.gz"
curl -sSfL -O "https://github.com/gitleaks/gitleaks/releases/download/v${VER}/gitleaks_${VER}_checksums.txt"
shasum -a 256 -c <(grep darwin_arm64 "gitleaks_${VER}_checksums.txt")
tar xzf "gitleaks_${VER}_darwin_arm64.tar.gz" gitleaks
```

Then, from the repo root:

```sh
./gitleaks dir . --config .gitleaks.toml --no-banner --redact          # tree scan (the baseline invariant)
./gitleaks git . --config .gitleaks.toml --log-opts "main..HEAD"       # scan your branch's commits, like CI does for PRs
```

Don't commit the binary; keep it outside the repo or delete it after use.

### Optional pre-commit hook

To catch a secret before it ever reaches a commit:

```sh
# .git/hooks/pre-commit (chmod +x)
#!/bin/sh
exec gitleaks git . --config .gitleaks.toml --staged --pre-commit --redact --no-banner
```

This is offered, not mandated — CI remains the backstop.

## When the scan fires

1. **Assume it's real until proven fake.** Verify without printing the
   value (check whether it's a placeholder, decode JWT claims only, check
   expiry).
2. **If it's real: rotate first.** The credential is compromised the moment
   it is pushed anywhere (this repo is public) — revoke/rotate it at the
   provider *before* touching the tree, then remove it from the tree.
   History rewrite is optional once the credential is dead; rotation is not.
   Escalate to the founder per AGENTS.md.
3. **If it's verifiably fake:** prefer scrubbing the file over allowlisting;
   if it must stay (e.g. a deliberate placeholder), add the narrowest
   possible allowlist entry with a rationale comment, and make sure the
   drift-guard spec still passes.

## Bumping the pinned gitleaks version

Update together, in one PR: `GITLEAKS_VERSION` + `GITLEAKS_SHA256` in the
workflow (linux_x64 checksum from the release's checksums file), the
assertions in `test/scripts/secret-scan.spec.ts`, and the version in this
doc's local-run snippet. Re-run the local tree scan to confirm the baseline
is still clean under the new ruleset before merging.
