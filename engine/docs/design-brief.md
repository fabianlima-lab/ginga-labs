# Ginga Labs — Design Brief (for wireframing in Claude chat)

Build wireframes/visual designs for a football-analysis publication. Honest,
data-first, told through the players. Static site (GitHub Pages). Bilingual EN+PT.
**Aspiration:** BetweenThePosts × The Athletic × The Pudding — editorial, data-rich,
distinctive. **Not** a generic blog. Mobile-first; readers arrive from social.

## Design system
- **Mood:** "soul & science" — dark, literary, confident, credible.
- **Palette:** near-black bg `#0d0f0c`, cream text `#f2ead8`, gold accent `#ffd447`,
  muted `#9a937f`. (Open to a richer palette — propose one.)
- **Type:** a literary serif for headlines/body; a mono for data/labels/stats.
- **Every data visual is self-contained** (title + source + GINGA·LABS mark) so it
  travels as a standalone social image.
- **Bilingual:** every text + every chart label must be localizable (EN/PT swap).

## 1) Landing page
- Wordmark `GINGA·LABS` + minimal nav + **EN/PT toggle**.
- **Hero:** the promise in one bold line + sub-line + a visual hook (a signature
  data-viz motif or a striking pitch/player image). Reads like a masthead.
- **Article feed (the core — currently the weakest, make it strongest):** scannable
  cards with category tag (Canon / Match / Round / Player), headline, one-line dek,
  a thumbnail (often a chart), date, EN·PT. Mixed content types, skim-friendly on phone.
- **"How we work" strip:** 1–2 lines on the method (data first → check the books →
  call out the myths → admit what we don't know).
- **Footer:** "written by a machine, sourced like a journalist, told like a fan."

## 2) Output templates — design each
Format note: most outputs publish as a **thread/scroll** (hook → numbered beats →
close) AND as **standalone share-images**. Each entry below = purpose · content
blocks · hero visual · **data reality** (what we can truthfully build).

| Output | Content blocks | Hero visual | Data reality |
|---|---|---|---|
| **Canon / history article** | hook, the data, the players, the discovery, sources, "what I'm unsure of" | data charts (bar/line) + (for historical matches) **real passmaps/shot maps** | ✅ historical data we have (StatsBomb + Wikipedia) |
| **Pre-game** | stakes, form, key men, what to watch, the question | form strip + **predicted XI on a pitch** | ✅ lineups/form (API-Football) + news |
| **Game-day** | confirmed XI, shape, 3 things to watch | **formation graphic** (both XIs positioned) | ✅ formation + grid (API-Football) |
| **Post-game** | the story, key moment, honest read, **belief filed** | **formation/shape + stat-comparison bars**; shot map *if* coords available | ⚠️ **no live passmap** (needs pass-location data we lack live) |
| **Man of the match** | the pick + why + honest dissent | **player card** (name, rating, the 2–3 stats that won it) | ✅ per-player stats (API-Football) |
| **Scores by player** | XI ratings + the driver of each | **ratings graphic** (transparent: shows components) | ✅ per-player stats |
| **Round insights** | cross-match patterns, tied to the Canon | comparison viz (e.g. goals/game vs history) | ✅ aggregate |

## 3) The honest data ceiling (design around it)
- **Live matches** (WC 2026): formation/shape graphics, stat comparisons, player &
  rating cards, text. **No fabricated pass networks.**
- **Historical / Canon**: full passmaps, pass networks, shot maps, the works
  (StatsBomb event data exists).
- So make the **passmap the "historical deep-dive" template**, and
  **formation + stats the "live match" template**. Never draw data we don't have.

## 4) Good vs avoid
- **Good:** editorial, data-dense-but-organised, self-contained shareable images,
  distinct identity, credible, mobile-first.
- **Avoid:** generic blog template, weak hierarchy, clutter, stock-photo vibe, and —
  above all — **any chart or map built on data we don't actually have.**

## Deliverables hoped for
Desktop + mobile wireframes for: the **landing page**, the **article/thread
template**, and the key share-image templates (**formation graphic**, **player /
rating card**, **data chart**, and a **historical passmap**).
