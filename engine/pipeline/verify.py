#!/usr/bin/env python3
"""
LAYER 5.5 (verify) — the anti-fabrication gate. Runs AFTER narrate, BEFORE publish.

Two independent checks against the facts file (the source of truth):

  1. TRACE   — for each data-bound value a renderer declares in its manifest,
               re-resolve the source field in the facts and confirm it matches.
  2. LINT    — scan human-written prose; every number must reconcile to a known
               fact value (or be on an explicit allowlist of structural constants).

Any miss → exit non-zero. Publish must not run unless this passes.

Usage:
  python3 verify.py --facts <facts.json> [--manifest <m.json>] [--prose <file>] \
                    [--allow 2026,90]
"""
import argparse, json, re, sys
from pathlib import Path

FLOAT_TOL = 1e-6


def norm_num(tok: str):
    """'53,6' / '53.6%' / '15' -> float, or None if not numeric."""
    t = tok.strip().replace("%", "").replace(",", ".")
    try:
        return float(t)
    except ValueError:
        return None


def collect_known(facts) -> set:
    """Every numeric value that legitimately exists in the facts."""
    known = set()

    def add(v):
        f = norm_num(str(v))
        if f is not None:
            known.add(round(f, 6))

    for t in facts["match"]["teams"]:
        if t.get("score") is not None:
            add(t["score"])
    for ts in facts.get("team_stats", []):
        for v in ts["stats"].values():
            add(v)
    for g in facts.get("goals", []):
        m = g.get("minute")
        if m:
            for piece in re.findall(r"\d+", m):
                add(piece)
    return known


def resolve(facts, path: str):
    """Resolve 'team_stats[0].stats.possessionPct' against the facts dict."""
    cur = facts
    for part in re.findall(r"[^.\[\]]+", path):
        cur = cur[int(part)] if part.isdigit() else cur[part]
    return cur


def check_trace(facts, manifest):
    fails = []
    for e in manifest:
        want = norm_num(str(e["value"]))
        try:
            got = norm_num(str(resolve(facts, e["path"])))
        except (KeyError, IndexError, TypeError):
            fails.append(f"TRACE  '{e.get('label', e['path'])}': path '{e['path']}' not in facts")
            continue
        if want is None or got is None or abs(want - got) > FLOAT_TOL:
            fails.append(f"TRACE  '{e.get('label', e['path'])}': rendered {e['value']} ≠ source {got}")
    return fails


def check_lint(facts, prose: str, allow: set):
    known = collect_known(facts) | {round(a, 6) for a in allow}
    fails = []
    for tok in re.findall(r"\d+[.,]?\d*%?", prose):
        f = norm_num(tok)
        if f is None:
            continue
        if round(f, 6) not in known:
            fails.append(f"LINT   number '{tok}' does not reconcile to any fact")
    return fails


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--facts", required=True)
    ap.add_argument("--manifest")
    ap.add_argument("--prose")
    ap.add_argument("--allow", default="", help="comma-separated structural constants (years, etc.)")
    a = ap.parse_args()

    facts = json.loads(Path(a.facts).read_text())
    allow = {float(x) for x in a.allow.split(",") if x.strip()}
    fails = []

    if a.manifest:
        fails += check_trace(facts, json.loads(Path(a.manifest).read_text()))
    if a.prose:
        fails += check_lint(facts, Path(a.prose).read_text(), allow)

    src = facts["provenance"]
    print(f"VERIFY against {a.facts}")
    print(f"  source: {src['source']}  sha {src['sha256'][:16]}…")
    if fails:
        print(f"\n  ✗ BLOCKED — {len(fails)} unverified value(s):")
        for f in fails:
            print(f"      {f}")
        print("\n  Publish refused. Fix the number or fetch the data.")
        sys.exit(1)
    print("\n  ✓ PASS — every number traces to a fact. Cleared to publish.")


if __name__ == "__main__":
    main()
