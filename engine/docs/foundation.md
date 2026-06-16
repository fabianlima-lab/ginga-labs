# Foundation — the pyramid (and the rule we don't break)

Built bottom-up. A layer may only exist once the layer below it is solid.
Data flows **up**; the writer is the **last** link, fed by files it cannot
invent. This document is the constraint, not a description.

## The no-fabrication contract

> **We do not make up stuff.** Every number in every output traces to a file in
> the warehouse, fetched from a registered source. If the data isn't there, the
> output is **not produced** — we say "we don't have it." A guess is never
> dressed as a fact.

Concretely, and enforceably:

1. **Every number comes from a persisted file.** No stat is ever typed by hand
   into prose or a renderer. If it's on the page, it was *computed by code from a
   fact file*.
2. **Missing data fails loudly.** A failed fetch, a missing field, an empty
   template slot → the pipeline stops. It never falls back to invention.
3. **Mocks are labeled MOCK.** Hypotheticals are allowed only when explicitly
   marked as mock, and may never carry the styling of sourced data.
4. **Attribution firewall.** Data-derived claims are ours ("the numbers say…");
   events/quotes are attributed to the record. We never blur the two.
5. **Provenance is auto-stamped, never hand-written.** Every output's source
   footer is generated from the files it actually consumed.

If any of these can't be satisfied, the honest output is **silence**, not a
plausible-looking report. That is the whole point of the project.

## The pyramid (foundation → apex)

| # | Layer | Guarantees | Forbids |
|---|-------|-----------|---------|
| 0 | **Sources** | a registry of real, *tested-reachable* sources | treating an unproven source as real |
| 1 | **Ingest** | fetch + persist raw, with provenance (url, UTC, sha256) | silent fallback; downstream without a raw file |
| 2 | **Facts** | parsed, typed, each pointing back to its raw file | a fact with no source pointer |
| 3 | **Derive** | metrics computed by code from facts | a hand-typed number |
| 4 | **Insight** | confirmed / myth / discovery (see `insight-method.md`) | a claim that can't cite a Layer-3 number |
| 5 | **Narrate / render** | prose + image-reports; numbers injected from fact files | a renderer reading a stat from prose; an empty slot filled in |
| 6 | **Publish** | a guard blocks ship if any number lacks a trace | publishing un-traceable output |

### The two inversions that make fabrication impossible
- **Data flows up.** The writer is downstream of the data, never its source.
- **Numbers are computed, never typed.** Code derives every figure; the human/LLM
  only interprets what the code produced.

The earlier failure (an invented "Brazil 1–1 Morocco") violated both: the writer
*was* the data source, and the numbers were typed, not computed. This pyramid
removes the path that allowed it.

## Source registry (Layer 0) — status

| Source | Reaches | Tested | Status |
|--------|---------|--------|--------|
| **ESPN public JSON** (`site.api.espn.com`) | WC 2026 fixtures, results, lineups, events, commentary | ✅ HTTP 200, live | **registered** |
| **StatsBomb open data** (github raw) | historical event data (gappy) | ✅ used in `mining/passmap.py` | **registered** |
| **Wikipedia** | coarse historical (scores, finals, golden boot) | ✅ used in the Canon | **registered** |
| **FIFA EFI** (post-match PDFs) | Opta-grade WC metrics — *claimed* | ❌ never actually fetched | **PROBATION — prove or drop** |

> FIFA EFI is on probation precisely because the earlier reports *claimed* it as a
> source without a single fetched file. It is not "registered" until a real PDF
> lands in the warehouse with provenance.
