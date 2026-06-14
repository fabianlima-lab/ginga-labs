# Ginga Labs — Engine

Two engines, one repo:

1. **Analytical engine** — a *belief-revision system* for football. It holds
   falsifiable beliefs about teams (Flamengo + Seleção first), and uses match
   data to **ratify or rectify** them. Every revision records the *mechanism*
   (the a-ha). The belief bank compounds — it gets sharper every match.
2. **Content engine** — turns those a-ha revisions into posts: tactical
   threads, formation/best-XI graphics, pre-match breakdowns. Published under
   the **Ginga Labs** brand on X / Instagram.

The content is a *derivative* of real, tracked analysis — substance, not filler.

## Status: **design phase**

We are deliberately investing in the system before executing. No engine code
yet — the design lives in `docs/`. Code starts once the design is locked.

```
docs/
  arquitetura.md       the layered architecture (+ diagram)
  belief-schema.md     the atom of the context layer: a falsifiable belief
  tactical-taxonomy.md the dimensions we form beliefs about (the scaffold)
  content-types.md     the post formats (from real reference accounts)
  tech-stack.md        data sources (layered), rendering, X/IG publishing
```

## The discipline that makes it honest

Data only judges beliefs that were **locked before the match** (no hindsight).
Capture is cheap (soft observations); revision is rigorous (pre-registered
tests). This is the guard against an LLM just rationalizing its priors.
