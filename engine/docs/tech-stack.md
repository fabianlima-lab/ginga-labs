# Tech stack

Principle: reuse what we've proven, buy only what we must, keep credentials in
the environment (never in the repo).

## Data layer (①) — a layered strategy

No single source is enough; we layer by purpose.

| Layer | Source | Gives | For |
|-------|--------|-------|-----|
| **Spine** | **API-Football** (api-sports.io) | fixtures, lineups (+ formation grid), events, team & player match stats, xG where covered, standings, injuries, predictions, odds | both competitions; cheap. Free 100 req/day, Pro $19/mo 7.5k/day |
| **Tactical — World Cup** | **FIFA Enhanced Football Intelligence** (fifatrainingcentre.com) | **tracking-grade**, free: ~53-page post-match report per game, 2,000+ metrics — line height, team length, pressure, phases of play, line breaks, sprint data | **Seleção, now.** Lets WC belief-tests be `strong`, not proxies |
| **Tactical — Brasileirão** | **FBref** (StatsBomb) | xG, chance creation, progressive passes — Série A Brasil | domestic depth when it resumes; via scraping |
| **Calibration** | **StatsBomb Open Data** (GitHub, free) | full event data, select comps (incl. past WCs) | backtest/calibrate the belief engine offline |
| **Rich visuals** | **FotMob / Sofascore** (unofficial) | shot maps, heatmaps, momentum, ratings | quick visuals — ToS/scraping caution |
| **Context** | **News RSS** (ge.globo), CBF, clubs | injuries, probable XI, quotes | agent synthesizes |

### Honest boundaries & ingestion notes
- **FIFA EFI is delivered as reports/visuals, not a clean API.** Ingestion =
  an agent task that **reads the PDF/images multimodally** and extracts metrics
  into the context layer (a "FIFA report parser"). World Cup **only**.
- Outside the World Cup we work at FBref/advanced-stats level — strong, but many
  tests are **proxies** (flagged via `test_strength`, see belief-schema).
- **Ingestable vs not** — the test is a *structured, retrievable* representation
  (JSON/CSV/API), or visuals an agent can parse. A *rendered experience* is not:
  - **BBC 3D viewer** (free-camera replays): closed WebGL app; tracking data is
    server-side/licensed, no API/export. Emits pixels, not coordinates → only a
    **human** verification aid for the override.

### Out of scope — building our own tracking
DIY computer-vision tracking from video (e.g. roboflow/sports) is **explicitly
out of scope** per `charter.md`: we *leverage* existing sources, we don't
*manufacture* data. Noted only so the decision is on the record — where a
competition has no good feed, we simply accept the gap rather than build a data
pipeline. (It exists and is interesting; it's just not this project.)

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
