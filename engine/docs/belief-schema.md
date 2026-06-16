# The Belief — atom of the context layer

The context layer is not a notes file; it's a bank of **falsifiable, justified
beliefs** that data ratifies or rectifies. This is the moat.

## Schema (strawman)

```yaml
belief:
  id: fla-433-left-transition
  claim: "Flamengo's 4-3-3 is exposed in defensive transition down the left"
  level: micro | macro                        # team-now, or game/era-wide (see analysis-model.md)
  scope: { team: Flamengo, since: "2026-05 (after Ayrton's injury)" }
  status: open | ratified | rectified | under-review
  confidence: low | medium | high            # belief in the claim
  test: "conceded xG within 8s of loss, left channel, vs league avg"  # operationalized
  test_strength: weak-proxy | strong          # data quality of the test (FBref ≠ tracking)
  evidence:
    - { match: "Fla 2x1 Palmeiras", date: ..., datum: ..., verdict: against }
  mechanism: "WHY it's true/false — the causal explanation (the a-ha)"
  history:
    - { date, from: open, to: rectified, trigger: "match X", aha: "..." }
  origin: agent | you | mixed                 # a belief can be yours; the agent contests it
```

Two fields make or break it:
- **`test`** — without it the belief isn't falsifiable.
- **`mechanism`** — without it you flip a flag and learn nothing.

Every belief is a **causal chain** — context → system → profile → data signature
→ edge — not a bare claim (see `analysis-model.md`). `level: macro` beliefs are
**era theses** ("2026 = era of the full-back") tested against aggregate data;
once an era is settled they graduate into the Canon.

`history` is where the compounding lives — it's the proof the system got smarter.
Note **`confidence` ≠ `test_strength`**: you can be highly confident in a claim
that you can only test with a weak proxy. Keep them separate and honest.

## Lifecycle — entry soft, revision rigorous

1. **Observation** (soft, free): *"looked vulnerable down the left in the 2nd
   half."* Captures intuition, zero friction, no metric.
2. **Belief candidate**: gains a `test` **and is locked before a future match**.
   Only now is it falsifiable.
3. **Tested belief**: data from a match *after the lock* ratifies or rectifies.
4. **Revision**: if rectified, the agent **must** write the new `mechanism`
   (the a-ha). That delta is the content fuel.

**Hard rule:** only data that arrived *after* the lock counts toward
ratify/rectify. Hindsight is forbidden (or flagged "does not count").

**Who operationalizes:** the agent proposes the metric that turns intuition
into a test; **you approve or adjust**. That is your natural override checkpoint.
