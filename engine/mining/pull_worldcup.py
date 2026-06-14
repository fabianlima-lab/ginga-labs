#!/usr/bin/env python3
"""
Holistic era-mining: a whole World Cup = ALL teams (not one club).
For each edition, computes per-team style metrics across their matches, then
correlates each style metric with success (xG difference) ACROSS teams — i.e.
"what separated the strong teams from the weak in this tournament".
Comparing editions over time = the (data-defined) era shift.

Usage: python3 pull_worldcup.py 2018 2022
"""
import json, sys, urllib.request, statistics
from concurrent.futures import ThreadPoolExecutor

RAW = "https://raw.githubusercontent.com/statsbomb/open-data/master/data"
EDITIONS = sys.argv[1:] or ["2018", "2022"]

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ginga-engine"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def team_match_metrics(ev):
    teams = {}
    for e in ev:
        t = e.get("team", {}).get("name")
        if not t: continue
        d = teams.setdefault(t, {"pass": 0, "ok": 0, "len": [], "press": 0, "xg": 0.0})
        ty = e["type"]["name"]
        if ty == "Pass":
            d["pass"] += 1
            if "outcome" not in e["pass"]: d["ok"] += 1
            if "length" in e["pass"]: d["len"].append(e["pass"]["length"])
        elif ty == "Pressure":
            d["press"] += 1
        elif ty == "Shot":
            d["xg"] += e["shot"].get("statsbomb_xg", 0.0)
    return teams

def pearson(xs, ys):
    n = len(xs)
    if n < 3: return None
    mx, my = statistics.mean(xs), statistics.mean(ys)
    num = sum((x-mx)*(y-my) for x, y in zip(xs, ys))
    dx = sum((x-mx)**2 for x in xs) ** 0.5
    dy = sum((y-my)**2 for y in ys) ** 0.5
    return round(num/(dx*dy), 2) if dx and dy else None

def edition(comp_id, season_id, name):
    matches = get(f"{RAW}/matches/{comp_id}/{season_id}.json")
    def work(m):
        try: return m, team_match_metrics(get(f"{RAW}/events/{m['match_id']}.json"))
        except Exception: return None
    teams = {}  # name -> accumulator
    with ThreadPoolExecutor(max_workers=12) as ex:
        for res in ex.map(work, matches):
            if not res: continue
            m, tm = res
            names = list(tm.keys())
            if len(names) != 2: continue
            for t in names:
                opp = names[0] if names[1] == t else names[1]
                a = teams.setdefault(t, {"poss": [], "cmp": [], "longsh": [], "press": [], "xgdiff": []})
                tot = tm[t]["pass"] + tm[opp]["pass"]
                a["poss"].append(100*tm[t]["pass"]/tot if tot else 0)
                a["cmp"].append(100*tm[t]["ok"]/tm[t]["pass"] if tm[t]["pass"] else 0)
                lens = tm[t]["len"]
                a["longsh"].append(100*sum(1 for L in lens if L > 30)/len(lens) if lens else 0)
                a["press"].append(tm[t]["press"])
                a["xgdiff"].append(tm[t]["xg"] - tm[opp]["xg"])
    rows = {t: {k: round(statistics.mean(v), 1) for k, v in a.items()} for t, a in teams.items() if len(a["poss"]) >= 3}
    # correlate each style metric with success (xgdiff) across teams
    succ = [rows[t]["xgdiff"] for t in rows]
    corr = {k: pearson([rows[t][k] for t in rows], succ) for k in ["poss", "cmp", "longsh", "press"]}
    print(f"\n=== World Cup {name} — {len(rows)} teams (>=3 matches) ===")
    print(f"  corr(style, xG-diff) across teams:  possession {corr['poss']}  completion {corr['cmp']}  "
          f"directness(long%) {corr['longsh']}  pressing {corr['press']}")
    top = sorted(rows, key=lambda t: rows[t]["xgdiff"], reverse=True)[:5]
    for t in top:
        r = rows[t]
        print(f"    {t:<16} xGdiff {r['xgdiff']:+.1f}  poss {r['poss']}  cmp {r['cmp']}  long% {r['longsh']}  press {r['press']}")
    return {"edition": name, "n_teams": len(rows), "corr": corr, "teams": rows}

def main():
    comps = get(f"{RAW}/competitions.json")
    wc = {c["season_name"]: c for c in comps if c["competition_name"] == "FIFA World Cup"}
    out = []
    for name in EDITIONS:
        if name not in wc:
            print(f"  {name}: not in open data"); continue
        out.append(edition(wc[name]["competition_id"], wc[name]["season_id"], name))
    json.dump(out, open("worldcup_holistic.json", "w"), indent=2)
    print(f"\nwrote worldcup_holistic.json ({len(out)} editions)")

if __name__ == "__main__":
    main()
