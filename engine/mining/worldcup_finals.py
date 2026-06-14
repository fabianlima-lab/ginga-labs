#!/usr/bin/env python3
"""
Holistic World Cup spine, 1930-2022 (structured factual record from Wikipedia's
'List of FIFA World Cup finals'). This is DATA — results, not narrative — so it's
valid for blind inference. Coarse (finals only, no event detail) but holistic and
back to 1930.
"""
import json, statistics

# year, host, winner, runner-up, regulation+ET goals in the final, decided_by
FINALS = [
    (1930,"Uruguay","Uruguay","Argentina",6,"reg"),
    (1934,"Italy","Italy","Czechoslovakia",3,"aet"),
    (1938,"France","Italy","Hungary",6,"reg"),
    (1950,"Brazil","Uruguay","Brazil",3,"reg"),
    (1954,"Switzerland","West Germany","Hungary",5,"reg"),
    (1958,"Sweden","Brazil","Sweden",7,"reg"),
    (1962,"Chile","Brazil","Czechoslovakia",4,"reg"),
    (1966,"England","England","West Germany",6,"aet"),
    (1970,"Mexico","Brazil","Italy",5,"reg"),
    (1974,"West Germany","West Germany","Netherlands",3,"reg"),
    (1978,"Argentina","Argentina","Netherlands",4,"aet"),
    (1982,"Spain","Italy","West Germany",4,"reg"),
    (1986,"Mexico","Argentina","West Germany",5,"reg"),
    (1990,"Italy","West Germany","Argentina",1,"reg"),
    (1994,"USA","Brazil","Italy",0,"pens"),
    (1998,"France","France","Brazil",3,"reg"),
    (2002,"South Korea/Japan","Brazil","Germany",2,"reg"),
    (2006,"Germany","Italy","France",2,"pens"),
    (2010,"South Africa","Spain","Netherlands",1,"aet"),
    (2014,"Brazil","Germany","Argentina",1,"aet"),
    (2018,"Russia","France","Croatia",6,"reg"),
    (2022,"Qatar","Argentina","France",6,"pens"),
]

rows = [dict(year=y, host=h, winner=w, runner_up=r, final_goals=g, decided=d) for y,h,w,r,g,d in FINALS]
json.dump(rows, open("worldcup_finals.json","w"), indent=2)

def avg(a,b):
    g=[g for y,_,_,_,g,_ in FINALS if a<=y<=b]; return round(statistics.mean(g),1)

print("Goals in the final — by period (blind signal):")
for a,b in [(1930,1970),(1974,1986),(1990,2014),(2018,2022)]:
    print(f"  {a}-{b}: avg {avg(a,b)} goals/final  ({[g for y,_,_,_,g,_ in FINALS if a<=y<=b]})")
tight = [y for y,_,_,_,g,d in FINALS if d!='reg' or g<=1]
print(f"\nFinals NOT settled in regulation OR <=1 goal: {tight}")
wins = {}
for _,_,w,_,_,_ in FINALS: wins[w]=wins.get(w,0)+1
print("Titles:", dict(sorted(wins.items(), key=lambda x:-x[1])))
hosts_won = [y for y,h,w,_,_,_ in FINALS if h.split('/')[0]==w or (h=='West Germany' and w=='West Germany')]
print("Host won:", hosts_won)
print(f"\nwrote worldcup_finals.json ({len(rows)} tournaments)")
