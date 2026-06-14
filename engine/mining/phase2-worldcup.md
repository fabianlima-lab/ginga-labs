# Phase 2 — holistic blind read: World Cups 2018 & 2022 (all teams)

From `worldcup_holistic.json`. **ALL teams** in each edition (32, ≥3 matches) —
the holistic view eras require, not one club. Metric vs success = Pearson
correlation of each style metric with xG-difference **across teams**. No
narrative consulted.

## What the numbers show

| corr(style, xG-diff) across teams | 2018 | 2022 |
|---|---|---|
| possession | +0.46 | +0.59 |
| completion | +0.31 | +0.57 |
| directness (long-pass %) | −0.40 | −0.52 |
| pressing (raw, confounded) | −0.06 | −0.18 |

In **both** editions the teams that out-created opponents were the **controlling**
teams — more possession, higher completion, *less* direct. Possession/completion/
directness are facets of one axis (control vs direct). Pressing is weak/negative
(raw counts confounded: teams without the ball press more).

**The signal:** the control→success link **strengthened 2018→2022**.

**Nuance, not determinism:** corr ~0.5, not 1. The very top teams are *balanced*
control (Germany/Brazil/Argentina ~56–59% possession), not maximalists (Spain
73.9% in 2018 was good, not top).

## Honest limits

- 2018 vs 2022 = 4 years — a trend, not a full era arc. Need more editions.
- **Retro ceiling:** 1990 yielded 0 usable teams. StatsBomb's **Pressure and xG
  fields only exist ~2017+** in the data spec → advanced-metric holistic mining is
  really 2018+ (plus recent Euros). Pre-2017 = pass-based metrics only, no xG.

## Next

- Add holistic editions where the spec supports it (Euro 2020/2024, Copa 2024).
- Investigate whether older WCs can yield pass-based (no-xG) era signals.
- This is the right unit (all teams); now extend the time span.
