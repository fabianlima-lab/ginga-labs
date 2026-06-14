# Data reach — how far our sources go (the gating audit)

Defines the window in which we can **derive** eras from data (vs reconcile
narrative + box-score). Sources: StatsBomb open-data `competitions.json`, FBref,
API-Football docs — checked 2026-06.

## By granularity

| Granularity | Source | Reach |
|---|---|---|
| **Event + 360** (freeze-frame) | StatsBomb OD | recent curated: WC 2022 · Euro 2020/24 · La Liga 2020/21 · Bundesliga 2023/24 · Ligue 1 2021–23 · MLS/AFCON 2023 |
| **Event** (no 360) | StatsBomb OD | **La Liga 2004/05–2020/21 (continuous)** · Men's WC 1958, 62, 70, 74, 86, 90, 2018, 22 · UCL 1999/2000 + 2003/04–2017/18 (+ retro 1970–73) · scattered single league seasons |
| **Event + box, current seasons** | API-Football | ~2010 → now (deeper history on paid tiers) |
| **Advanced / xG** (box) | FBref | ~2017/18 → now (EPL+; was StatsBomb → now Opta) |
| **Tracking + physical** | FIFA EFI | 2022 → (World Cup only) |
| **Structured factual** (results, goals, formations, top scorers) | Wikipedia, RSSSF | **1930 → now — holistic (all teams), coarse (no event detail)** |

## Findings

1. **Classic World Cups have EVENT data — but single-team.** StatsBomb's old WC
   data is only the **iconic side's run** (Brasil '70 = 6 matches of Brazil; NL
   '74; etc.), not the tournament — confirmed empirically (1970/74/86 each yield
   1 team; 1990 = 1 match). So Brasil '70 / Laranja '74 are **team studies**, not
   holistic. *Also* retro-coded → coarser, no 360/tracking.
2. **Prime inductive-mining set: La Liga 2004/05–2020/21** — **17 continuous
   seasons** of event data in one elite league. The best place to watch the
   winning formula change over time and detect era boundaries (tiki-taka's rise
   and its disruption).
3. **Current/live data is NOT in StatsBomb OD** (it's curated/historical). For
   the now-season we use API-Football (~2010+) + FIFA EFI (WC 2026) + FBref.
4. **360 / tracking is recent only** (2020+). No deep positional history.
5. **"Rich" is competition-specific, not a date cutoff** — it's *these sets*, not
   "everything after 2010."
6. **Availability ≠ computable metrics.** StatsBomb's **Pressure and xG fields
   exist only ~2017+** in the data spec. So even where old event data exists
   (WC 1990, retro), advanced metrics aren't derivable — confirmed empirically:
   WC 1990 yielded 0 usable teams in the holistic run. Pre-2017 = pass-based
   metrics only (possession, completion, directness), no xG/pressing.
7. **Holistic vs single-team.** La Liga OD = Barça-only (a *team study*).
   Tournaments (World Cups/Euros/Copa) are the holistic, all-teams substrate
   eras actually require.
8. **Two resolutions of "holistic".** *Event-level* holistic data exists only
   2018–2024 (5 tournaments). But the *structured factual* record (results, goals,
   formations, scorers) is **holistic and reaches 1930** — coarse, but real. So we
   can build a 1930→now era spine at coarse resolution, and add fine tactical
   detail only for 2018+.
9. **Quant ≠ narrative (firewall).** On Wikipedia, the *quantitative* record
   (scores, goals, scorers) is DATA for blind inference; the *tactical prose*
   ("catenaccio stifled…") is received wisdom = Phase 3. Never mine the prose as
   data, or the anti-bias discipline collapses.

## Implications for the plan

- **Inductive era-mining → start in La Liga 2004–2021** (continuous event data).
- **Deductive thesis tests** (e.g. era of the full-back) → current data for the
  live claim + historical sets for the "what changed" comparison.
- **Classic legends** (WC '70/'74) → event-analyzable now, with the retro caveat.
