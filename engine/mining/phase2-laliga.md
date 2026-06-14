# Phase 2 — blind read: La Liga (Barcelona), 2004/05–2020/21

From `laliga_barca_seasons.json` (5 sampled matches/season, Barça vs opponent).
**No narrative consulted** — themes from the numbers only (the blind-inference
discipline; Phase 3 reconciliation comes after).

**Caveats:** n=5/season (noisy, esp. xG) · Barça-only = the Messi dataset, so this
is "Barça vs the field," not a league sweep · "poss" is a pass-share proxy.

## What the numbers show — one regime, with a build, peak, and break

- **Build (2004/05→2008/09):** possession 61.6%→68.3% · completion 78→86 ·
  passing shorter (long-share 21.6%→16.2%).
- **Peak (2008/09→2013/14):** possession 68–72.5% (max 2013/14) · shortest passing
  (long-share ~11–13%) · Barça presses *least* (~100–117, they have the ball) ·
  completion edge over opponents widest (+15 to +23).
- **Break (~2014/15→2015/16):** possession 72.5→63.4 · more direct (long-share
  →16–17%) · Barça's own pressing rises (97→138+) · completion edge **compresses**
  as the field catches up (opp completion 64%→80% by 2020/21; opp pressures peak
  2013/14–2014/15).

## The inferred era (data-defined)

Extreme possession + short passing + completion dominance gave Barça a widening
edge that built 2004→2013 and **peaked ~2010–2013**. After ~2014 the edge
**compressed** — the field's completion rose toward Barça's and opponents pressed
harder. Per `eras.md`, that compression is the era-boundary signature: the thing
that separated them stopped separating them.

## Discovery candidate (flag for Phase 3)

The possession/completion *extreme* peaks in **2013/14 — after the architect-coach
left (2012)**. Test vs the narrative: did the system peak *after* its author, even
as results declined?

## Next

- **Phase 3 + 4:** bring in the tiki-taka narrative; reconcile (confirm / myth /
  discovery).
- Firm up the signal: re-run with more matches/season (cut n=5 noise).
- This is one team's dominance arc; true league-wide era-mining needs full-league
  data (not in StatsBomb open data — a known boundary).
