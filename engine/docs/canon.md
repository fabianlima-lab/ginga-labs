# The Canon — our understanding of the game

The slowest, most foundational tier of the context layer. **Not the Belief Bank**
— beliefs are falsifiable and rectified by next week's data; the Canon is durable
(Total Football isn't "rectified" by a Tuesday result). It's the **lens the agent
reasons *from*** — what makes it understand the sport instead of just computing it.

## Why it exists: the anti-"Harvard PhD" cure

An LLM + a stats API produces *fluent nonsense* — computes xG, understands
nothing. The Canon installs a **grounded point of view** instead of the averaged
view-from-nowhere. Five principles:

1. **Exemplars, not definitions.** Concept + canonical instance + why it worked +
   what beats it + lineage + the *feel*. (tiki-taka = Pep's Barça, positional
   superiority & rest-defense, dies vs a disciplined low block, Cruyff→Pep.)
2. **Football-culture register**, not academic — Wilson (*Inverting the Pyramid*),
   Cox, the tactical-analysis community, the expert accounts. The voice matters.
3. **Brazil-weighted, not Eurocentric** — the '70 & '82 sides, the 4-2-2-2,
   *ginga* / *malandragem* as tactical concepts, and **relacionismo vs
   positionism** (Diniz vs Guardiola), the live debate Brazilians actually have.
4. **Anchored to observable data** — each entry says how you'd recognize it in
   the feeds we have, bridging Canon → belief engine.
5. **Curated, small, refined by you** — 50 rich entries beat 5,000 stubs. The
   agent drafts; you correct register & takes. That correction *is* you teaching
   it — the "learn soccer / have fun" part of the charter.

## The synthesis

- Canon alone → a nostalgic pub bore quoting 1974.
- Belief engine alone → the Harvard PhD: computes all, understands nothing.
- **Canon + belief engine → grounded *and* current.** Understands the ideas and
  tests them against what's happening now. That's the goal.

Entries are **causal chains** — context → system → player profile → data
signature → edge, plus relations (see `analysis-model.md`) — not descriptions.
The Canon also receives **settled era-theses**: a macro-belief, once its era is
historical, graduates in here.

## Entry schema (strawman)

```yaml
canon:
  id: laranja-mecanica
  name: "Total Football — Laranja Mecânica"
  era: "Ajax 1971–73 · Netherlands 1974"
  protagonists: [Cruyff, Rinus Michels]
  idea: "collective positional interchange — anyone fills any role; pitch big in
         possession, small without it"
  principles: [high press to compress space, constant rotation, local overloads]
  why_it_worked: "..."
  what_beats_it: "disciplined deep block + direct counter; needs a Cruyff to run it"
  lineage: "Michels → Cruyff → Guardiola (→ tiki-taka)"
  exemplars: ["NED 4-0 ARG, 1974"]
  br_lens: "contrast with Brazil's individual-creative tradition (ginga): system
            vs genius — and how '82 answered it"
  recognize_in_data: "high possession + pressing + rotation (rotation is hard to
                      measure → observe/proxy)"
  register: "how a football person actually talks about it — a quote, the feel"
  origin: agent-drafted | you-curated     # the Canon is human-refined
  # built data-first (see method below):
  data_themes:        # Phase 2 — blind inference, each citing metric evidence
    - "..."
  received_wisdom:    # Phase 3 — what the books/narrative claim
    - "..."
  reconciliation:     # Phase 4 — vs the data AND the blind inference
    confirmed: ["..."]
    myth:      ["..."]      # narrative not supported by the data
    discovery: ["..."]      # data shows what the legend missed → best content
  data_grade: rich | thin  # is true blind inference possible, or video/factual only?
```

Note the relational fields — `lineage`, `what_beats_it`, `br_lens`. Understanding
is structured by *relations between ideas*, not isolated facts.

## How beliefs use it

Beliefs **reference** canon entries (illustrative phrasing): *"a team's build-up
was a positionist 4-3-3, but lacked the relationist combinations (`relacionismo`)
to break a compact mid-block."* The Canon gives the vocabulary and the frame; the
belief is the tested, current read. Rarely, a pattern proven over many matches
may enrich the Canon — but deliberately, never on one result.

## Building it — data first, narrative second (anti-bias)

To dodge *both* failure modes — the PhD who only computes, and the romantic who
only repeats legends — each entry is built in phases:

1. **DATA (blind)** — gather the historical record: match data, stats, lineups,
   results. No narrative yet.
2. **INFERENCE (blind)** — derive themes *purely from that data*, **citing the
   metric evidence**. Resist pattern-matching to the famous story — derive from
   the numbers in front of us, not latent memory of the legend (the same
   anti-confirmation lock as the belief engine, applied to the agent). The human
   can check: is the inference citing data, or just retelling the myth?
3. **NARRATIVE** — only now read the books/analyses (Wilson, Cox, web).
4. **RECONCILE** — for each received claim, does the data **and** the blind
   inference: **CONFIRM** it · show it's **MYTH** (narrative absent from the data)
   · or reveal a **DISCOVERY** (data shows what the legend missed)? Discoveries
   are original insight — and the best content.

### The honest data gradient (where the method actually works)
- **RICH — true blind inference:** tiki-taka / **Pep's Barça** (StatsBomb covers
  Messi's whole career) · **recent World Cups** (StatsBomb open data) · the
  **current era** (FBref + FIFA EFI). **Start here.**
- **THIN — results/lineups/video only:** Laranja Mecânica '74, Brasil '70/'82,
  2006. No event/tracking data → "data-first" = the factual/box record + video,
  reconciliation is qualitative. Don't pretend the numbers exist.

Sources: StatsBomb open data + FBref (historical match data) · Wikipedia (factual
record: squads, formations, results) · books/analyses (Phase 3 only).

**Build order: World Cups first, then double-click teams.** The structured WC
record (results, goals, formations, scorers) is holistic back to **1930**, so the
WC timeline is the Canon's coarse spine; specific sides (Brasil '70, tiki-taka
Barça) are the richer *team-study* double-clicks layered on top. **Firewall:**
Wikipedia's quantitative record = blind-inference DATA; its tactical prose =
received wisdom (Phase 3) — never mine prose as data.

## Seed list (first entries to write)

Laranja Mecânica · Brasil '70 · Brasil '82 (Telê) · Sacchi's Milan · catenaccio ·
Pep's tiki-taka · Klopp's gegenpressing · Diniz's relacionismo · the false 9 ·
the back-three revival · Bielismo · Dunga-era pragmatism (the counter-canon).
