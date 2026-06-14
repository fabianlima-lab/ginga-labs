#!/usr/bin/env python3
"""
Consolidated holistic World Cup record, 1930-2022 (structured factual DATA).
Sources: Wikipedia 'List of FIFA World Cup finals' + 'FIFA World Cup Golden Boot'.
matches/tournament are format facts. goals/match: only the two sourced extremes
are filled (the full series truncates in the fetcher — NOT reconstructed from
memory, per the sourcing discipline). All quant; formations are Phase-3 narrative.
"""
import json, statistics

# year: (final_goals, top_scorer, ts_country, ts_goals, matches, avg_goals_per_match)
REC = {
 1930:(6,"Stábile","ARG",8,18,None), 1934:(3,"Nejedlý","TCH",5,17,None),
 1938:(6,"Leônidas","BRA",7,18,None), 1950:(3,"Ademir","BRA",9,22,None),
 1954:(5,"Kocsis","HUN",11,26,5.38), 1958:(7,"Fontaine","FRA",13,35,None),
 1962:(4,"6-way tie","-",4,32,None), 1966:(6,"Eusébio","POR",9,32,None),
 1970:(5,"G. Müller","FRG",10,32,None), 1974:(3,"Lato","POL",7,38,None),
 1978:(4,"Kempes","ARG",6,38,None), 1982:(4,"Rossi","ITA",6,52,None),
 1986:(5,"Lineker","ENG",6,52,None), 1990:(1,"Schillaci","ITA",6,52,2.21),
 1994:(0,"Salenko/Stoichkov","-",6,52,None), 1998:(3,"Šuker","CRO",6,64,None),
 2002:(2,"Ronaldo","BRA",8,64,None), 2006:(2,"Klose","GER",5,64,None),
 2010:(1,"T. Müller","GER",5,64,None), 2014:(1,"J. Rodríguez","COL",6,64,None),
 2018:(6,"Kane","ENG",6,64,None), 2022:(6,"Mbappé","FRA",8,64,None),
}

rows = [dict(year=y, final_goals=v[0], top_scorer=v[1], ts_country=v[2],
             ts_goals=v[3], matches=v[4], goals_per_match=v[5]) for y, v in sorted(REC.items())]
json.dump(rows, open("worldcup_record.json", "w"), indent=2)

def m(a, b, idx): return round(statistics.mean([v[idx] for y, v in REC.items() if a <= y <= b]), 1)
print("TOP-SCORER goals (Golden Boot), by period — blind signal:")
for a, b in [(1930,1958),(1962,1974),(1978,1998),(2002,2022)]:
    vals = [v[3] for y, v in sorted(REC.items()) if a <= y <= b]
    print(f"  {a}-{b}: avg {m(a,b,3)}   ({vals})")
print("\nFinals goals, by period (recap):")
for a, b in [(1930,1970),(1974,1986),(1990,2014),(2018,2022)]:
    print(f"  {a}-{b}: avg {m(a,b,0)}")
print("\nSourced goals/match anchors: 1954 = 5.38 (highest ever), 1990 = 2.21 (lowest ever)")
print(f"\nwrote worldcup_record.json ({len(rows)} tournaments)")
