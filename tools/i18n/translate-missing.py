#!/usr/bin/env python3
"""
Fill in the messages.json keys a locale is missing, and nothing else.

Why this exists
---------------
`i18n-translate-chrome.sh` shells out to translate-cli, which flattens the whole
catalog — including `description` text and, fatally, the `placeholders` block —
into translatable records. `placeholders.content` is literally `"$1"` and
`placeholders.example` is a sample value; neither is prose, and translate-cli
cannot map them back afterwards. Two full runs against the real catalog died
this way:

    process failed: request failed: context deadline exceeded
    process failed: the key voicesInHostMenu/placeholders/host.example is not in the input

and — the dangerous part — translate-cli exits 0 after printing those, so the
wrapper's `set -euo pipefail` never fires and the caller is told the run
succeeded while zero files changed.

This script translates only what is prose (`message`, `description`), copies
`placeholders` verbatim from English, validates every `$placeholder$` token
survived, and fails loudly if anything is wrong.

Usage
-----
    OPENAI_API_KEY=... python3 tools/i18n/translate-missing.py [--locale de] [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LOCALES = REPO / "_locales"
# Measured 2026-08-04 on the real catalog: luna at zero reasoning effort is 2.7x
# faster than gpt-5.2 for the same placeholder fidelity, at a third of a cent per
# batch. NOTE: this model rejects reasoning_effort="minimal" — the accepted value
# is "none". Re-check fidelity with --repair --dry-run after changing either.
MODEL = os.environ.get("TRANSLATE_MODEL", "gpt-5.6-luna")
REASONING_EFFORT = os.environ.get("TRANSLATE_REASONING_EFFORT", "none")
BATCH = 12
PLACEHOLDER = re.compile(r"\$[A-Za-z0-9_]+\$")
# Braces are a second substitution syntax used by a few strings ({settingsLink}).
BRACE = re.compile(r"\{[A-Za-z0-9_]+\}")

# Chrome's locale dir names are not all BCP-47; give the model the real language.
LANGUAGE = {
    "ar": "Arabic", "bg": "Bulgarian", "bn": "Bengali", "cs": "Czech", "da": "Danish",
    "de": "German", "el": "Greek", "es": "Spanish", "fi": "Finnish", "fr": "French",
    "he": "Hebrew", "hi": "Hindi", "hr": "Croatian", "hu": "Hungarian",
    "id": "Indonesian", "it": "Italian", "ja": "Japanese", "ko": "Korean",
    "ms": "Malay", "nl": "Dutch", "no": "Norwegian", "pl": "Polish",
    "pt_BR": "Brazilian Portuguese", "pt_PT": "European Portuguese", "ro": "Romanian",
    "ru": "Russian", "sk": "Slovak", "sv": "Swedish", "ta": "Tamil",
    "th": "Thai", "tl": "Tagalog (Filipino)", "tr": "Turkish", "uk": "Ukrainian",
    "vi": "Vietnamese", "zh_CN": "Simplified Chinese", "zh_TW": "Traditional Chinese",
}


def language_for(loc: str) -> str:
    """Fail loudly rather than asking the model to translate into "bg"."""
    if loc not in LANGUAGE:
        raise KeyError(
            f"locale '{loc}' has no language name — add it to LANGUAGE. Sending a bare "
            f"locale code produces silently wrong or English output."
        )
    return LANGUAGE[loc]

SYSTEM = """You are localising a browser extension called "Say, Pi" that adds voice to AI chatbots.

Translate the "message" and "description" fields of each entry into {language}.

Rules, in order of importance:
1. Keep every $placeholder$ token and every {{braced}} token EXACTLY as written, including
   the delimiters. They are substitution points, not words. Reposition them if the target
   language's grammar requires it, but never translate, rename or drop one.
2. Never translate the product name "Say, Pi", or the assistant names Pi, Claude, ChatGPT.
3. "message" is user-visible UI text: match the register of the English — warm, calm, plain,
   sentence case, no exclamation marks. Keep it SHORT; these sit in a narrow settings column.
4. "description" is a note for translators and is never shown to users. Translate it plainly.
5. Counts are written to read correctly at one as well as many, because Chrome i18n has no
   plural forms. Preserve that property.

Return a JSON object with exactly the same keys as the input, each holding "message" and
"description". No commentary, no markdown fence."""


def tokens(text: str) -> set[str]:
    return set(PLACEHOLDER.findall(text)) | set(BRACE.findall(text))


def call(payload: dict, key: str, retries: int = 4) -> str:
    body = json.dumps(payload).encode()
    last = None
    for attempt in range(retries):
        req = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=body,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)["choices"][0]["message"]["content"]
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
            last = e
            time.sleep(2 * (attempt + 1))
    raise RuntimeError(f"API failed after {retries} attempts: {last}")


def strip_fence(s: str) -> str:
    s = s.strip()
    if s.startswith("```"):
        s = re.sub(r"^```[a-zA-Z]*\n", "", s)
        s = re.sub(r"\n```$", "", s)
    return s


def translate_batch(entries: dict, language: str, key: str) -> dict:
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM.format(language=language)},
            {"role": "user", "content": json.dumps(entries, ensure_ascii=False)},
        ],
    }
    if REASONING_EFFORT:
        payload["reasoning_effort"] = REASONING_EFFORT
    out = json.loads(strip_fence(call(payload, key)))
    missing = set(entries) - set(out)
    if missing:
        raise RuntimeError(f"model dropped keys: {sorted(missing)}")
    return out


REPAIR_SYSTEM = """You are repairing one broken localised string in a browser extension.

The English source contains substitution tokens written as $token$ or {{token}}. A previous
translation pass corrupted them — translating, transliterating or dropping them — which breaks
substitution at runtime and shows users raw text.

Retranslate the English message into {language}. Every token must appear EXACTLY as in the English,
character for character, including the delimiters. Reposition them if grammar requires; never
translate, rename, transliterate or drop one. Do not translate "Say, Pi", Pi, Claude or ChatGPT.
Match the register of the English.

Return ONLY the translated message as a bare string, no JSON, no quotes, no commentary."""


def repair(en: dict, targets: list[str], key: str, dry: bool) -> int:
    """Re-translate messages whose substitution tokens no longer match English."""
    broken = []
    for loc in targets:
        path = LOCALES / loc / "messages.json"
        if not path.exists():
            continue
        cur = json.loads(path.read_text())
        for k, v in cur.items():
            if k not in en or not isinstance(v, dict):
                continue
            if tokens(en[k].get("message", "")) != tokens(v.get("message", "")):
                broken.append((loc, k))
    if not broken:
        print("No placeholder corruption found.")
        return 0
    print(f"{len(broken)} corrupted string(s):")
    for loc, k in broken:
        print(f"  {loc}/{k}: expected {sorted(tokens(en[k]['message']))}")
    if dry:
        return 0

    failures = 0
    by_loc: dict[str, list[str]] = {}
    for loc, k in broken:
        by_loc.setdefault(loc, []).append(k)
    for loc, keys in by_loc.items():
        path = LOCALES / loc / "messages.json"
        cur = json.loads(path.read_text())
        language = language_for(loc)
        for k in keys:
            payload = {
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": REPAIR_SYSTEM.format(language=language)},
                    {"role": "user", "content": en[k]["message"]},
                ],
            }
            if REASONING_EFFORT:
                payload["reasoning_effort"] = REASONING_EFFORT
            msg = strip_fence(call(payload, key)).strip().strip('"')
            if tokens(msg) != tokens(en[k]["message"]):
                print(f"  ✘ {loc}/{k}: repair still wrong — got {sorted(tokens(msg))}", file=sys.stderr)
                failures += 1
                continue
            cur[k]["message"] = msg
            print(f"  ✓ {loc}/{k}: {msg[:70]}")
        path.write_text(json.dumps({k: cur[k] for k in sorted(cur)}, ensure_ascii=False, indent=2) + "\n")
    return 1 if failures else 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--locale", action="append", help="limit to these locales")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--repair", action="store_true",
                    help="re-translate strings whose $placeholder$ tokens diverge from English")
    args = ap.parse_args()

    key = os.environ.get("OPENAI_API_KEY", "")
    if not key and not args.dry_run:
        print("OPENAI_API_KEY is not set", file=sys.stderr)
        return 1

    en = json.loads((LOCALES / "en" / "messages.json").read_text())
    targets = args.locale or sorted(
        d.name for d in LOCALES.iterdir() if d.is_dir() and d.name != "en"
    )

    if args.repair:
        return repair(en, targets, key, args.dry_run)

    failures = 0
    for loc in targets:
        path = LOCALES / loc / "messages.json"
        if not path.exists():
            print(f"  {loc}: no messages.json, skipping")
            continue
        cur = json.loads(path.read_text())
        missing = [k for k in en if k not in cur]
        if not missing:
            print(f"  {loc}: already complete")
            continue
        language = language_for(loc)
        print(f"  {loc} ({language}): {len(missing)} missing", flush=True)
        if args.dry_run:
            continue

        added = {}
        for i in range(0, len(missing), BATCH):
            chunk = missing[i : i + BATCH]
            src = {
                k: {"message": en[k]["message"], "description": en[k].get("description", "")}
                for k in chunk
            }
            got = translate_batch(src, language, key)
            for k in chunk:
                msg = got[k]["message"]
                want, have = tokens(en[k]["message"]), tokens(msg)
                if want != have:
                    print(
                        f"    ✘ {loc}/{k}: placeholder mismatch — expected {sorted(want)}, got {sorted(have)}",
                        file=sys.stderr,
                    )
                    failures += 1
                    continue
                entry = {"description": got[k].get("description") or en[k].get("description", ""),
                         "message": msg}
                if "placeholders" in en[k]:
                    entry["placeholders"] = en[k]["placeholders"]  # verbatim, never translated
                added[k] = entry
            print(f"    {min(i + BATCH, len(missing))}/{len(missing)}", flush=True)

        # Insert alphabetically so existing lines never move — a reviewable diff.
        merged = dict(cur)
        merged.update(added)
        ordered = {k: merged[k] for k in sorted(merged)}
        path.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n")
        print(f"    wrote {len(added)} keys")

    if failures:
        print(f"\n{failures} placeholder mismatches — NOT clean", file=sys.stderr)
        return 1
    print("\nAll locales complete, every placeholder preserved.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
