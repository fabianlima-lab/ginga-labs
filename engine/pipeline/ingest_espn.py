#!/usr/bin/env python3
"""
LAYER 1 (ingest) + LAYER 2 (facts) of the pyramid — ESPN public JSON.

Fetches a real match summary, PERSISTS the raw response with provenance
(url, UTC time, sha256), then parses ONLY the fields that are actually present
into a typed facts file, each section pointing back to the raw source.

Rule (foundation.md): if a field isn't in the raw, it is absent here — never
invented. A failed fetch raises; there is no silent fallback.

Usage:  python3 ingest_espn.py <event_id>
"""
import json, sys, hashlib, urllib.request
from datetime import datetime, timezone
from pathlib import Path

LEAGUE = "fifa.world"
WAREHOUSE = Path(__file__).resolve().parent.parent / "warehouse"
RAW = WAREHOUSE / "raw" / "espn"
FACTS = WAREHOUSE / "facts"


def fetch(event_id: str):
    url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{LEAGUE}/summary?event={event_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "ginga-labs"})
    with urllib.request.urlopen(req, timeout=40) as r:   # raises on HTTP error — fail loud
        status = r.status
        body = r.read()
    return url, status, body


def persist_raw(event_id, url, status, body):
    RAW.mkdir(parents=True, exist_ok=True)
    raw_path = RAW / f"summary-{event_id}.json"
    raw_path.write_bytes(body)
    meta = {
        "source": "espn-public-json",
        "url": url,
        "http_status": status,
        "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
        "sha256": hashlib.sha256(body).hexdigest(),
        "bytes": len(body),
    }
    (RAW / f"summary-{event_id}.meta.json").write_text(json.dumps(meta, indent=2))
    return raw_path, meta


def parse_facts(event_id, raw_path, meta, d):
    """Layer 2 — only what is genuinely present. Every section cites its source."""
    src = {"raw_file": str(raw_path.relative_to(WAREHOUSE.parent)), "sha256": meta["sha256"]}

    comp = d["header"]["competitions"][0]
    teams = []
    for c in comp["competitors"]:
        teams.append({
            "name": c["team"]["displayName"],
            "abbreviation": c["team"].get("abbreviation"),
            "home_away": c["homeAway"],
            "score": int(c["score"]) if c.get("score") not in (None, "") else None,
        })

    match = {
        "event_id": event_id,
        "competition": d["header"].get("league", {}).get("name") or "FIFA World Cup",
        "date_utc": comp.get("date"),
        "status": comp.get("status", {}).get("type", {}).get("description"),
        "venue": comp.get("venue", {}).get("fullName"),
        "teams": teams,
        "source": src,
    }

    # team statistics — straight from boxscore, name/value pairs as ESPN gives them
    team_stats = []
    for bt in d.get("boxscore", {}).get("teams", []):
        stats = {s["name"]: s.get("displayValue") for s in bt.get("statistics", [])}
        team_stats.append({"team": bt["team"]["displayName"], "stats": stats, "source": src})

    # goals — from keyEvents flagged as a goal
    goals = []
    for e in d.get("keyEvents", []):
        if e.get("type", {}).get("text") == "Goal" or e.get("scoringPlay"):
            goals.append({
                "minute": e.get("clock", {}).get("displayValue"),
                "text": e.get("text"),
                "team": (e.get("team") or {}).get("displayName"),
                "source": src,
            })

    facts = {
        "schema": "ginga-facts/espn/v1",
        "provenance": {
            "source": meta["source"], "url": meta["url"],
            "fetched_at_utc": meta["fetched_at_utc"], "sha256": meta["sha256"],
        },
        "match": match,
        "team_stats": team_stats,
        "goals": goals,
        "counts": {
            "team_stats_fields": [len(t["stats"]) for t in team_stats],
            "goals": len(goals),
            "commentary_entries": len(d.get("commentary", [])),
        },
    }
    FACTS.mkdir(parents=True, exist_ok=True)
    out = FACTS / f"espn-{event_id}.json"
    out.write_text(json.dumps(facts, indent=2, ensure_ascii=False))
    return out, facts


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: python3 ingest_espn.py <event_id>")
    event_id = sys.argv[1]
    url, status, body = fetch(event_id)
    raw_path, meta = persist_raw(event_id, url, status, body)
    d = json.loads(body)
    out, facts = parse_facts(event_id, raw_path, meta, d)

    m = facts["match"]
    a, b = m["teams"]
    print(f"INGESTED  {a['name']} {a['score']}–{b['score']} {b['name']}  ({m['status']})")
    print(f"  raw   → {raw_path.relative_to(WAREHOUSE.parent)}  ({meta['bytes']} bytes)")
    print(f"  sha   → {meta['sha256'][:16]}…  fetched {meta['fetched_at_utc']}")
    print(f"  facts → {out.relative_to(WAREHOUSE.parent)}")
    print(f"  goals: {facts['counts']['goals']}  · team-stat fields: {facts['counts']['team_stats_fields']}"
          f"  · commentary: {facts['counts']['commentary_entries']}")
    for g in facts["goals"]:
        print(f"    {g['minute']}  {g['text']}")


if __name__ == "__main__":
    main()
