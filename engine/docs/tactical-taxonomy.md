# Tactical taxonomy — what we form beliefs about

Beliefs must be *organized*, not ad hoc. This is the scaffold of dimensions the
agent reasons over every match — adapted from the coaching "what to look for"
framework (ref: @Coachayere). Every belief belongs to one dimension; this keeps
the Belief Bank navigable and the analysis complete (we check all of it, not
just what stood out).

## The dimensions

1. **Build-up play** — how the team progresses from the back: structure,
   numerical setup, route preference (central vs wide), goalkeeper involvement.
2. **Pressing — traps & triggers** — when/where they press, the triggers,
   man- vs zonal, and where the trap leaves space (the classic exploit).
3. **Set pieces** — attacking & defending; routines, zonal/man marking,
   first/second-ball control.
4. **Transition moments** — both ways: counter-attack on regain, and defensive
   transition on loss (rest-defence, counter-press, exposure).
5. **Game-state adjustments** — what changes when winning vs losing
   (risk, line height, substitution patterns).

## How it connects to the engine

- Each dimension is a folder/section in the **Team Dossier**.
- A belief's `claim` lives under one dimension (e.g. transition →
  `fla-433-left-transition`).
- Pre-match, the agent produces a read **per dimension**; post-match it tests
  the locked beliefs in each. Completeness by construction.
- The FIFA EFI metrics map cleanly onto these dimensions (pressure → pressing;
  line height/team length → build-up & transition exposure; phases → all).

## Data → dimension mapping (where each test gets its strength)

| Dimension | Strong test (when available) | Proxy test |
|-----------|------------------------------|------------|
| Build-up | FIFA: line breaks, phases, line height | FBref: progressive passes, pass completion by third |
| Pressing | FIFA: pressure applied, passing-lane closures | API-Football: opponent passes allowed, recoveries height |
| Set pieces | event data: shots/xG from set plays | counts: corners, set-piece goals |
| Transition | FIFA: team length, regain→shot timing | conceded xG within N sec of loss (proxy) |
| Game-state | tracking line height by score | subs + shot share by game state |
