#!/usr/bin/env python3
"""
Phase 1 (gather) + raw aggregates for inductive era-mining.
Pulls StatsBomb open-data La Liga (= Barcelona's matches, the Messi dataset),
samples N matches per season, and computes neutral per-season metrics for
Barcelona AND their opponents — so the *edge* (Barca - opponent) is visible.

No narrative, no interpretation here — just the numbers. The blind read (Phase 2)
happens on the output table.

Usage: python3 pull_laliga.py [matches_per_season]
"""
import json, sys, urllib.request, statistics
from concurrent.futures import ThreadPoolExecutor

RAW = "https://raw.githubusercontent.com/statsbomb/open-data/master/data"
TEAM = "Barcelona"
N = int(sys.argv[1]) if len(sys.argv) > 1 else 5

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ginga-engine"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def long_share(passes):
    lens = [p["pass"]["length"] for p in passes if "pass" in p and "length" in p["pass"]]
    if not lens: return None, None
    longs = sum(1 for L in lens if L > 30)
    return longs / len(lens), statistics.mean(lens)

def match_metrics(match_id):
    ev = get(f"{RAW}/events/{match_id}.json")
    teams = {}
    for e in ev:
        t = e.get("team", {}).get("name")
        if not t: continue
        d = teams.setdefault(t, {"pass": 0, "pass_ok": 0, "passes": [], "press": 0, "shot": 0, "xg": 0.0, "goal": 0})
        ty = e["type"]["name"]
        if ty == "Pass":
            d["pass"] += 1
            if "outcome" not in e["pass"]:  # no outcome = completed
                d["pass_ok"] += 1
            d["passes"].append(e)
        elif ty == "Pressure":
            d["press"] += 1
        elif ty == "Shot":
            d["shot"] += 1
            d["xg"] += e["shot"].get("statsbomb_xg", 0.0)
            if e["shot"].get("outcome", {}).get("name") == "Goal":
                d["goal"] += 1
    return teams

def reduce_team(d, total_pass):
    ls, avg = long_share(d["passes"])
    return {
        "poss": round(100 * d["pass"] / total_pass, 1) if total_pass else None,  # pass-share proxy
        "pass": d["pass"],
        "cmp": round(100 * d["pass_ok"] / d["pass"], 1) if d["pass"] else None,
        "longsh": round(100 * ls, 1) if ls is not None else None,
        "avglen": round(avg, 1) if avg is not None else None,
        "press": d["press"],
        "shot": d["shot"],
        "xg": round(d["xg"], 2),
        "goal": d["goal"],
    }

def main():
    comps = get(f"{RAW}/competitions.json")
    seasons = sorted({(c["season_id"], c["season_name"]) for c in comps if c["competition_name"] == "La Liga"},
                     key=lambda s: s[1])
    print(f"La Liga seasons in open data: {len(seasons)}")
    rows = []
    for sid, sname in seasons:
        try:
            matches = get(f"{RAW}/matches/11/{sid}.json")
        except Exception as e:
            print(f"  {sname}: matches fetch failed ({e})"); continue
        matches = [m for m in matches if TEAM in (m["home_team"]["home_team_name"], m["away_team"]["away_team_name"])]
        matches.sort(key=lambda m: m["match_date"])
        if not matches: continue
        # evenly sample N across the season
        step = max(1, len(matches) // N)
        sample = matches[::step][:N]
        agg = {"barca": [], "opp": []}
        def work(m):
            try:
                tm = match_metrics(m["match_id"])
            except Exception:
                return None
            opp = next((t for t in tm if t != TEAM), None)
            if TEAM not in tm or opp is None: return None
            total = tm[TEAM]["pass"] + tm[opp]["pass"]
            return reduce_team(tm[TEAM], total), reduce_team(tm[opp], total)
        with ThreadPoolExecutor(max_workers=10) as ex:
            for res in ex.map(work, sample):
                if res:
                    agg["barca"].append(res[0]); agg["opp"].append(res[1])
        if not agg["barca"]: continue
        def mean(side, k):
            vals = [r[k] for r in agg[side] if r[k] is not None]
            return round(statistics.mean(vals), 1) if vals else None
        row = {"season": sname, "n": len(agg["barca"])}
        for k in ["poss", "cmp", "longsh", "avglen", "press", "shot", "xg", "goal"]:
            row[f"b_{k}"] = mean("barca", k)
            row[f"o_{k}"] = mean("opp", k)
        rows.append(row)
        print(f"  {sname}: n={row['n']}  poss {row['b_poss']}v{row['o_poss']}  cmp {row['b_cmp']}v{row['o_cmp']}  "
              f"xg {row['b_xg']}v{row['o_xg']}  press {row['b_press']}v{row['o_press']}  longsh {row['b_longsh']}v{row['o_longsh']}")
    with open("laliga_barca_seasons.json", "w") as f:
        json.dump(rows, f, indent=2)
    print(f"\nwrote laliga_barca_seasons.json ({len(rows)} seasons)")

if __name__ == "__main__":
    main()
