# Phase 2 — holistic across tournaments (2018–2024) + the historical wall

From `tournaments_holistic.json`. Success = **goal difference** (results — works in
any era, unlike xG). Style = pass-based; xG where the spec allows. Correlations
across all teams per edition. No narrative consulted.

## Task 1 — widen the recent holistic set (5 editions)

corr(style, **GoalDiff**) across teams:

| edition | possession | completion | directness | xGdiff~GD (sanity) |
|---|---|---|---|---|
| WC 2018 | **0.12** | 0.00 | −0.15 | 0.51 |
| WC 2022 | 0.61 | 0.51 | −0.54 | 0.67 |
| Euro 2020 | 0.54 | 0.36 | −0.39 | 0.76 |
| Euro 2024 | 0.55 | 0.51 | −0.37 | 0.61 |
| Copa 2024 | 0.51 | 0.33 | −0.18 | 0.81 |

**Read:** control (possession) moderately predicts **success (~0.5)** in 4 of 5
editions. **WC 2018 is the exception** — control barely correlated with results
(0.12), even though it *did* correlate with xG (chance creation) in the xG-based
run. So 2018: controlling teams *created* more but didn't *convert* to results — a
pragmatic/upset edition. (`xGdiff~GoalDiff` 0.51–0.81 is just the sanity check:
creating more chances wins games.) → Control **helps (~0.5), but isn't destiny**,
and 2018 shows it can fail to translate.

## Task 2 — go back in time: BLOCKED (a real negative result)

Old World Cups in StatsBomb open data are **single-team** — the iconic side's run,
not the tournament:

- 1970: 6 matches, **1 team** (Brazil's run) · 1974: 6 matches, **1 team** (NL)
- 1986: 3 matches, **1 team** · 1990: **1 match** only

Same limitation as La Liga = Barça. **We cannot do holistic era-mining before
2018.** Old data = team studies / exemplars only.

## The big implication (reshapes the plan)

Our **holistic** data spans only **2018–2024 — effectively one era.** So:

- We **can** characterize the **current** era holistically (control-leaning, ~0.5,
  2018 aside).
- We **can** test **future** shifts as new tournaments land — **WC 2026 is live**,
  the next edition to fold in.
- We **cannot** data-derive **past** era boundaries (no holistic history). The past
  is single-team studies + Phase-3 narrative reconciliation, not data-derived eras.

→ **Inductive era-mining is forward-looking** (accumulate tournaments over time);
history is team-studies + narrative.
