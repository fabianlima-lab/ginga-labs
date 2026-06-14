#!/usr/bin/env python3
"""
Holistic era-mining across many tournaments + eras.
Success axis = GOAL DIFFERENCE (from results — available in every era, unlike xG).
Style = pass-based metrics (possession, completion, directness) which exist
wherever event data does; xG added only where the spec supports it (~2017+).

Correlates each style metric with goal-diff ACROSS all teams in each edition.
Comparing editions over time = the data-defined era movement.
"""
import json, urllib.request, statistics
from concurrent.futures import ThreadPoolExecutor

RAW = "https://raw.githubusercontent.com/statsbomb/open-data/master/data"
EDITIONS = [
    ("FIFA World Cup", "1970"), ("FIFA World Cup", "1974"), ("FIFA World Cup", "1986"),
    ("FIFA World Cup", "1990"), ("FIFA World Cup", "2018"), ("FIFA World Cup", "2022"),
    ("UEFA Euro", "2020"), ("UEFA Euro", "2024"), ("Copa America", "2024"),
]

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ginga-engine"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def pearson(xs, ys):
    pairs = [(x, y) for x, y in zip(xs, ys) if x is not None and y is not None]
    if len(pairs) < 4: return None
    xs, ys = zip(*pairs)
    mx, my = statistics.mean(xs), statistics.mean(ys)
    dx = sum((x-mx)**2 for x in xs) ** 0.5
    dy = sum((y-my)**2 for y in ys) ** 0.5
    if not dx or not dy: return None
    return round(sum((x-mx)*(y-my) for x, y in zip(xs, ys))/(dx*dy), 2)

def match_team_stats(ev):
    teams = {}
    for e in ev:
        t = e.get("team", {}).get("name")
        if not t: continue
        d = teams.setdefault(t, {"pass": 0, "ok": 0, "len": [], "xg": 0.0, "shots": 0})
        ty = e["type"]["name"]
        if ty == "Pass":
            d["pass"] += 1
            if "outcome" not in e["pass"]: d["ok"] += 1
            if "length" in e.get("pass", {}): d["len"].append(e["pass"]["length"])
        elif ty == "Shot":
            d["shots"] += 1
            d["xg"] += e["shot"].get("statsbomb_xg", 0.0)
    return teams

def edition(comp_id, season_id, name):
    matches = get(f"{RAW}/matches/{comp_id}/{season_id}.json")
    teams, ok, fail, has_xg = {}, 0, 0, False
    def fetch(m):
        try: return m, match_team_stats(get(f"{RAW}/events/{m['match_id']}.json"))
        except Exception: return m, None
    with ThreadPoolExecutor(max_workers=12) as ex:
        results = list(ex.map(fetch, matches))
    for m, st in results:
        hs, as_ = m.get("home_score"), m.get("away_score")
        hn = m["home_team"]["home_team_name"]; an = m["away_team"]["away_team_name"]
        # goal diff from results (always available)
        for tn, gd in ((hn, (hs or 0) - (as_ or 0)), (an, (as_ or 0) - (hs or 0))):
            teams.setdefault(tn, {"gd": [], "poss": [], "cmp": [], "long": [], "xgd": []})["gd"].append(gd)
        if not st:
            fail += 1; continue
        ok += 1
        names = list(st.keys())
        if len(names) != 2: continue
        for t in names:
            opp = names[0] if names[1] == t else names[1]
            a = teams[t] if t in teams else teams.setdefault(t, {"gd": [], "poss": [], "cmp": [], "long": [], "xgd": []})
            tot = st[t]["pass"] + st[opp]["pass"]
            a["poss"].append(100*st[t]["pass"]/tot if tot else None)
            a["cmp"].append(100*st[t]["ok"]/st[t]["pass"] if st[t]["pass"] else None)
            ln = st[t]["len"]; a["long"].append(100*sum(1 for L in ln if L > 30)/len(ln) if ln else None)
            if st[t]["shots"] or st[opp]["shots"]:
                if st[t]["xg"] or st[opp]["xg"]: has_xg = True
                a["xgd"].append(st[t]["xg"] - st[opp]["xg"])
    def m(vals):
        vv = [v for v in vals if v is not None]
        return round(statistics.mean(vv), 1) if vv else None
    rows = {t: {k: m(a[k]) for k in a} for t, a in teams.items() if len(a["gd"]) >= 3}
    if not rows:
        print(f"  {name:<18} matches={len(matches)} events_ok={ok} -> NO usable teams"); return None
    gd = [rows[t]["gd"] for t in rows]
    cor = {k: pearson([rows[t][k] for t in rows], gd) for k in ["poss", "cmp", "long", "xgd"]}
    print(f"  {name:<18} teams={len(rows):>2} events_ok={ok:>2}/{len(matches):<2} xg={'Y' if has_xg else '-'}  "
          f"corr vs GoalDiff:  poss {str(cor['poss']):>5}  cmp {str(cor['cmp']):>5}  "
          f"direct {str(cor['long']):>5}  | xGdiff~GD {str(cor['xgd']):>5}")
    return {"edition": name, "teams": len(rows), "has_xg": has_xg, "corr_vs_goaldiff": cor}

def main():
    comps = get(f"{RAW}/competitions.json")
    idx = {(c["competition_name"], c["season_name"]): c for c in comps}
    print("Holistic correlation of STYLE vs GOAL DIFFERENCE, across all teams per edition:\n")
    out = []
    for cn, sn in EDITIONS:
        c = idx.get((cn, sn))
        if not c: print(f"  {cn} {sn}: not in open data"); continue
        r = edition(c["competition_id"], c["season_id"], f"{cn.split()[0]} {sn}")
        if r: out.append(r)
    json.dump(out, open("tournaments_holistic.json", "w"), indent=2)
    print(f"\nwrote tournaments_holistic.json ({len(out)} editions)")

if __name__ == "__main__":
    main()
