# Delivery — the output timeline

**Autonomy (locked):** the human *reviews drafts and approves publishing*;
everything else is the AI. The human may optionally inject ideas from watching
games / reading news. (See `charter.md`.)

Delivery is a **timeline of outputs** driven by the match — and round — clock.

| When | Output | Needs | Status |
|------|--------|-------|--------|
| T–days | **Pre-game** | form, injuries, predicted XI, beliefs to watch | ✅ data exists |
| T–~1h | **Game-day** | confirmed lineups, formations, what-to-watch | ✅ API-Football |
| Half-time | **Intra-game** | LIVE events + stats at HT | ⚠️ live trigger |
| Full-time+ | **Post-game** | full stats, xG, events; FIFA EFI (WC) | ⚠️ EFI parser |
| Full-time+ | **Man of the match** | player data + pick & narrative | ⚠️ method |
| Full-time+ | **Scores by player** | per-player stats | ⚠️ rating model |
| End of round | **Round insights** | ALL games aggregated | ⚠️ aggregation |

## Gaps for these outputs

1. **Live/in-play data + a half-time trigger** (intra-game). API-Football has
   live data, but this is the spikiest op — run reliably *mid-match* — and the
   deep data (EFI) only lands post-match, so HT is box-score-level only.
   → Sequence later.
2. **A player-rating model** (scores + MOTM). Recommend **our own transparent,
   position-aware rating** over a black-box provider number — base 6.0 adjusted
   by goals/xG over-performance, key passes, duels won, defensive actions, docked
   for big chances missed — and it **shows its components**. More honest, more us.
3. **Round-level aggregation** (round insights). Synthesize across a whole round;
   the natural home for **macro/era beliefs** ("full-backs created 40% of this
   round's goals"). More API volume → maybe API-Football Pro ($19).
4. **Richer scheduling** — the clock tracks a *match* timeline AND a *round*
   (games spread Sat/Sun/Mon), plus the live mid-match trigger.
5. **New content templates** — MOTM card, player-scores graphic, round-insights
   report (add to `content-types.md`).
6. **A quality bar** — no automated way yet to judge "grounded vs PhD-fluent".
   For now the human draft-review *is* the quality gate.

## Sequencing

- **Easy wins (data we already have):** pre-game · game-day · post-game · MOTM ·
  scores by player.
- **Higher complexity (new capability):** intra-game (live) · round insights.

Build the easy column first — most of the value, none of the live-ops pain.
