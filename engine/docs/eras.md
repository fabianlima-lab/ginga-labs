# Eras — how we define and discover them

## What an era is (data-driven)

An era is a period during which an **edge** holds: a property **X** (a system, a
player-profile, a mechanism) that systematically separates the best teams from
the rest. In the era, "has X" predicts over-performance.

**Not "what was popular" — what gave an EDGE, until it didn't.** Popularity is
diffusion; an era is about *differential advantage* and its death.

### Holistic, never one team
An era/tendency is a property that separates winners from the field **across many
teams** — so it can only be defined on **holistic, multi-team data**. One club's
data shows *that club's* dominance arc (a **team study**), never an era.

**Confirmed empirically (see `phase2-tournaments.md`):** the only *holistic*
event data we have is **WC 2018 & 2022, Euro 2020 & 2024, Copa 2024** — all
**2018–2024**. Older World Cups in the open data are **single-team** (the iconic
side's run: Brazil '70, Netherlands '74…), same limit as La Liga = Barça.

→ Consequence — **two resolutions:**
- **Fine** (possession, xG, pressing): holistic only **2018–2024**. So fine
  inductive era-mining is **forward-looking** (accumulate tournaments; WC 2026 is
  the next edition).
- **Coarse** (results, goals/game, formations, scorers): the **structured factual
  record is holistic back to 1930** (Wikipedia/RSSSF). We *can* build a 1930→now
  era spine at coarse resolution — and real eras live in it (e.g. World-Cup-final
  goals collapse to 1.4 across 1990–2014, then snap back — see
  `phase2-finals.md`).

**Firewall:** use Wikipedia's *quantitative* record as blind-inference DATA; its
*tactical prose* is received wisdom (Phase 3). Don't mine prose as data.

## Lifecycle — and what ends an era

1. **Innovation** — X appears; early adopters over-perform → the edge opens.
2. **Diffusion** — X spreads; it becomes the mark of the strong.
3. **Saturation** — everyone copies X; it stops differentiating (table stakes).
4. **Disruption** — a counter Y neutralizes/exploits X; the edge dies or flips
   → new era.

An **era boundary = a structural break in the data**: the property that predicted
success stops predicting it (or reverses). That break is the fingerprint of an
innovation. We *discover* eras by finding these regimes + breaks in the data,
then reconcile against received history — instead of inheriting eras from legend.

## Two modes — same 4 phases (canon.md), different entry point

- **DEDUCTIVE (narrative-first):** human supplies a thesis ("era of the
  full-back") → (1) gather data → (2) derive blind → (4) reconcile *against the
  thesis*. Tests a given idea. Used for the **live / future** era.
- **INDUCTIVE (data-first):** mine the data with no thesis → eras emerge as
  stable regimes + breaks → reconcile against received history. Discovers ideas.
  Used for mapping the **past**.

Blind-inference discipline (cite the numbers, resist the known legend) holds in
both. Past eras (settled) → inductive → Canon entries. Current/future era (live)
→ deductive thesis → a macro-belief, tested forward, that graduates into the
Canon once it settles (see analysis-model.md).

## Prerequisite: know how far our data reaches

Data-driven era discovery only works as far back as *rich* data goes. The full
audit is in **`data-reach.md`**; the headline:

| Granularity | Source | Reaches back to |
|-------------|--------|-----------------|
| Event-level (xG, passes, locations) | StatsBomb open data | **La Liga 2004/05–2020/21 continuous**; Men's WC 1958–2022 (retro-coded); UCL 1999+ |
| Event + box, current | API-Football | ~2010 → now |
| Advanced / xG (box) | FBref | ~2017/18 → now |
| Tracking / physical | FIFA EFI | 2022+ (World Cup) |

→ **Correction (post-audit):** even classic World Cups (Brasil '70, Laranja
Mecânica '74) have *event* data via StatsBomb retro-coding — coarser than modern,
no tracking, but real. So those are event-analyzable, not video-only.

→ **Prime inductive-mining ground: La Liga 2004–2021** — 17 continuous seasons in
one elite league, where we can actually watch the winning formula change and find
the breaks. Start the era-mining here.
