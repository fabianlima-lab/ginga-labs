# Ginga Labs — Engine

Two engines, one repo:

1. **Analytical engine** — a *belief-revision system* for football. It holds
   falsifiable beliefs about teams (Flamengo + Seleção first), and uses match
   data to **ratify or rectify** them. Every revision records the *mechanism*
   (the a-ha). The belief bank compounds — it gets sharper every match.
2. **Content engine** — turns those a-ha revisions into posts: tactical
   threads, formation/best-XI graphics, pre-match breakdowns. Published under
   the **Ginga Labs** brand on X / Instagram.

The content is backed by real, tracked analysis — which is what makes it fun to
build and worth reading.

> **This is a personal exploration, not a business** — see [`docs/charter.md`](docs/charter.md)
> for goals & non-goals. We leverage existing data; we don't compete, build our
> own intelligence layer, or need to monetize. The win is a complete autonomous
> loop, learning soccer, and posting cool content.

## Status: **design phase**

We are deliberately investing in the system before executing. No engine code
yet — the design lives in `docs/`. Code starts once the design is locked.

```
docs/
  charter.md           ★ why we're building it: goals, non-goals, principles
  arquitetura.md       the layered architecture (+ diagram)
  belief-schema.md     the atom of the context layer: a falsifiable belief
  canon.md             ★ the timeless tier: our understanding of the game
  analysis-model.md    ★ tendencies as causal chains (context→system→player→data→edge)
  tactical-taxonomy.md the dimensions we form beliefs about (the scaffold)
  content-types.md     the post formats (from real reference accounts)
  delivery.md          the output timeline (pre/game/HT/post/MOTM/scores/round)
  data-coverage.md     what data exists per competition (what we consume)
  landscape.md         context: the ecosystem we consume (not compete with)
  tech-stack.md        data sources, rendering, X/IG publishing
```

## The discipline that makes it honest

Data only judges beliefs that were **locked before the match** (no hindsight).
Capture is cheap (soft observations); revision is rigorous (pre-registered
tests). This is the guard against an LLM just rationalizing its priors.
