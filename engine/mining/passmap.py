#!/usr/bin/env python3
"""
Deep match mining for a designed report (StatsBomb open data, historical).
Builds a pass network (avg positions + pass pairs) for the protagonist team and
computes cheat-sheet signals: build-up, flank bias, pressing/where the ball was
lost & won, transition, xG. Writes passmap.json for the renderer + prints findings.
"""
import json, urllib.request, statistics
from collections import defaultdict, Counter

RAW = "https://raw.githubusercontent.com/statsbomb/open-data/master/data"
def get(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent":"ginga"}), timeout=40))

# find Brazil v Belgium, World Cup 2018
comps = get(f"{RAW}/competitions.json")
wc = next(c for c in comps if c["competition_name"]=="FIFA World Cup" and c["season_name"]=="2018")
matches = get(f"{RAW}/matches/{wc['competition_id']}/{wc['season_id']}.json")
m = next(x for x in matches if {"Brazil","Belgium"} <= {x["home_team"]["home_team_name"], x["away_team"]["away_team_name"]})
print(f"match: {m['home_team']['home_team_name']} {m['home_score']}-{m['away_score']} {m['away_team']['away_team_name']} ({m['match_id']})")
ev = get(f"{RAW}/events/{m['match_id']}.json")

TEAM = "Brazil"; OPP = "Belgium"
def norm(loc, period):  # flip 2nd half so play is consistent
    if not loc: return None
    x,y = loc[0], loc[1]
    return [120-x, 80-y] if period==2 else [x,y]

# orient so TEAM attacks toward x=120: check mean x of their shots
shot_x = [norm(e["location"], e["period"])[0] for e in ev if e["type"]["name"]=="Shot" and e["team"]["name"]==TEAM and e.get("location")]
flip = (statistics.mean(shot_x) < 60) if shot_x else False
def L(loc, period):
    p = norm(loc, period)
    if p and flip: p = [120-p[0], 80-p[1]]
    return p

# starting XI for TEAM
sx = next(e for e in ev if e["type"]["name"]=="Starting XI" and e["team"]["name"]==TEAM)
xi = {}  # name -> {pos, num}
for p in sx["tactics"]["lineup"]:
    xi[p["player"]["name"]] = {"pos": p["position"]["name"], "num": p["jersey_number"]}
# first TEAM substitution minute
subs = [e["minute"] for e in ev if e["type"]["name"]=="Substitution" and e["team"]["name"]==TEAM]
cut = min(subs) if subs else 200
print(f"XI locked until first sub at {cut}'")

# pass network among XI (completed passes before cut)
locs = defaultdict(list)      # player -> [positions] (touches)
pair = Counter()              # (a,b) -> count
involve = Counter()
for e in ev:
    if e["type"]["name"]!="Pass" or e["team"]["name"]!=TEAM or e["minute"]>=cut: continue
    passer = e["player"]["name"]
    p = L(e.get("location"), e["period"])
    if p: locs[passer].append(p)
    if "outcome" in e["pass"]: continue   # incomplete
    rec = e["pass"].get("recipient",{}).get("name")
    if passer in xi and rec in xi:
        pair[tuple(sorted((passer,rec)))] += 1
        involve[passer]+=1; involve[rec]+=1
        pe = L(e["pass"].get("end_location"), e["period"])
        if pe: locs[rec].append(pe)

nodes = []
for name,info in xi.items():
    pts = locs[name]
    if not pts: continue
    nodes.append({"name":name, "pos":info["pos"], "num":info["num"],
                  "x":round(statistics.mean(p[0] for p in pts),1),
                  "y":round(statistics.mean(p[1] for p in pts),1),
                  "touches":involve[name]})
edges = [{"a":a,"b":b,"n":n} for (a,b),n in pair.items() if n>=4]

# team stats (full match)
def tstats(team):
    passes=[e for e in ev if e["type"]["name"]=="Pass" and e["team"]["name"]==team]
    cmp=sum(1 for e in passes if "outcome" not in e["pass"])
    shots=[e for e in ev if e["type"]["name"]=="Shot" and e["team"]["name"]==team]
    xg=sum(e["shot"].get("statsbomb_xg",0) for e in shots)
    return {"passes":len(passes),"cmp":round(100*cmp/len(passes),1) if passes else 0,
            "shots":len(shots),"xg":round(xg,2),
            "goals":sum(1 for e in shots if e["shot"].get("outcome",{}).get("name")=="Goal")}
br, be = tstats(TEAM), tstats(OPP)
poss = round(100*br["passes"]/(br["passes"]+be["passes"]),1)

# cheat-sheet signals (TEAM)
team_passes=[e for e in ev if e["type"]["name"]=="Pass" and e["team"]["name"]==TEAM and e.get("location")]
def share(cond):
    n=[e for e in team_passes if cond(L(e["location"],e["period"]))]
    return round(100*len(n)/len(team_passes),1)
left = share(lambda p: p and p[1]<26.7); right = share(lambda p: p and p[1]>53.3)
own_third = share(lambda p: p and p[0]<40); final_third = share(lambda p: p and p[0]>80)
# where OPP won the ball (ball recoveries / interceptions) -> transition origin
opp_wins=[L(e["location"],e["period"]) for e in ev if e["team"]["name"]==OPP and e.get("location")
          and e["type"]["name"] in ("Ball Recovery","Interception")]
opp_win_x = round(statistics.mean(p[0] for p in opp_wins),1) if opp_wins else None
# most involved CB/GK (build-up axis)
buildup = [(n["name"], n["touches"]) for n in nodes if n["pos"] in ("Goalkeeper","Left Center Back","Right Center Back","Center Back")]
buildup.sort(key=lambda t:-t[1])

out = {"match":f"{TEAM} {m['home_score'] if m['home_team']['home_team_name']==TEAM else m['away_score']}-{m['away_score'] if m['home_team']['home_team_name']==TEAM else m['home_score']} {OPP}",
       "team":TEAM,"opp":OPP,"nodes":nodes,"edges":edges,
       "stats":{"poss":poss,"team":br,"opp":be},
       "signals":{"left":left,"right":right,"own_third":own_third,"final_third":final_third,
                  "opp_win_x":opp_win_x,"buildup":buildup}}
json.dump(out, open("passmap.json","w"), indent=2)

print(f"\nPOSSESSION {TEAM} {poss}%  | passes {br['passes']} ({br['cmp']}%) vs {be['passes']} ({be['cmp']}%)")
print(f"xG: {TEAM} {br['xg']} ({br['goals']}g)  vs  {OPP} {be['xg']} ({be['goals']}g)")
print(f"flank bias: left {left}%  right {right}%   | own-third {own_third}%  final-third {final_third}%")
print(f"{OPP} won the ball at avg x={opp_win_x} (0=their goal,120={TEAM} goal)")
print(f"build-up axis (touches): {buildup[:3]}")
print(f"nodes {len(nodes)}  edges {len(edges)}")
