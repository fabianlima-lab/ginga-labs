# Tech stack

Principle: reuse what we've proven, buy only what we must, keep credentials in
the environment (never in the repo).

## Data layer (①)

| Source | Gives | Notes |
|--------|-------|-------|
| **API-Football** (api-sports.io) | fixtures, lineups, events, stats, odds — Brasileirão + World Cup + Seleção | best single starting point; free tier (~100 req/day), paid scales |
| **FBref** (StatsBomb-powered) | xG, chance creation, progressive passes — incl. Série A Brasil | richest *accessible* tactical depth; via scraping |
| **News RSS** (ge.globo etc.) | injuries, probable XI, context | agent synthesizes |

Honest boundary: real **positional tracking** (per-player heatmaps) is paid/B2B.
We work at FBref/advanced-stats level — strong and credible, but tests will
often be **proxies** (flagged via `test_strength`, see belief-schema).

## Context layer (③)

This git repo. Belief bank + dossiers as **Markdown/YAML** — readable and
editable by both the agent and you (the override).

## Rendering (content engine)

**Remotion + SVG**, reused from the work in `trailer/` — the tactical-board
renderer (pitch + positioned players) becomes the formation/best-XI graphic
generator. Static graphics for X/IG; the same code can do animated clips later.

## Publishing (⑤)

| Channel | API | Reality check |
|---------|-----|---------------|
| **X (Twitter)** | API v2 | posting (write) needs a **paid tier** for any volume; free tier write is heavily capped. Verify current pricing before committing. **Add X API key to env when ready.** |
| **Instagram** | Graph API | requires a Business/Creator account + a linked Facebook app; supports image/carousel publishing |

## Orchestration / proactivity (②)

Claude Code on the web **scheduled triggers** (cron) drive the clock: pre-match
(week), matchday, post-match. The same proactive pattern this very project was
designed in.

## Credentials (have / need)

- ✅ **ElevenLabs** (audio, if we do video) — works
- ✅ **Google / Gemini** (image gen, billing active) — works
- ⛔ **API-Football** — need a key
- ⛔ **X (Twitter) API** — need a key + decide on tier
- ⛔ **Instagram Graph API** — need a Business account + app
