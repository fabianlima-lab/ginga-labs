# Data coverage — best-in-class vs what we have

Closes the data layer: the target, and the honest gap, per competition.

## 1. Best-in-class wishlist (the target)

| Data input | Gold standard | Cost | Free option we use |
|---|---|---|---|
| Fixtures · lineups · events · box stats | Opta / StatsBomb | — | **API-Football** ($0–19/mo) |
| xG · shot maps | StatsBomb / Opta | $$$ | **FBref / Understat / FotMob** |
| **Detailed on-ball event (x,y)** | **StatsBomb / Opta feeds** | $$$$ | none free |
| **Tracking / positional** | **Second Spectrum · SkillCorner · Hawk-Eye** | $$$$ | none free |
| **Physical** (distance, sprints, speed) | Catapult/STATSports · SkillCorner | $$$ | none free |
| Injuries · availability | provider + news | ~free | API-Football + ge.globo |
| Odds · market | bookmaker APIs | free–$ | API-Football |

## 2. What we have today

Legend: ✅ free/strong · 🟡 partial/proxy (free) · 💲 paid-only · 🛠 DIY CV (roboflow) · ⛔ unavailable

| Competition | Fixtures/Lineups | Events | Adv. box | xG/shots | Detailed event (x,y) | Tracking | Physical | Injuries/Odds |
|---|---|---|---|---|---|---|---|---|
| Top-5 leagues ¹ | ✅ | ✅ | ✅ | ✅ FBref/Understat | 💲 Opta/SB | 💲 SkillCorner | 💲 | ✅ |
| Champions League | ✅ | ✅ | ✅ | ✅ FBref/FotMob | 💲 | 💲 | 💲 | ✅ |
| World Cup 2026 | ✅ | ✅ | ✅ | ✅ | 🟡 FIFA EFI | ✅ **FIFA EFI** | ✅ **FIFA EFI** | ✅ |
| Brasileirão A | ✅ | ✅ | ✅ | 🟡 FBref/FotMob | 💲 Footstats/Opta | 🛠 roboflow / 💲 | 🛠 / 💲 | ✅ + news |
| Brasileirão B | ✅ ² | 🟡 | 🟡 | ⛔ sparse ³ | ⛔ / 🛠 | 🛠 roboflow | 🛠 | 🟡 news |

¹ EPL · La Liga · Serie A · Bundesliga · Ligue 1 — identical profile.
² Thinner; verify per season. ³ FotMob sometimes has basic Série B xG.

## Takeaways

1. **Basics solved everywhere.** The entire gap to best-in-class is two layers:
   **detailed event data + tracking/physical** — paid walls everywhere except…
2. **World Cup = the free exception.** FIFA EFI gives tracking + physical free.
   → For **Seleção now, we are ~best-in-class for $0.** Best place to prove the
   engine at full depth (and the subject already chosen).
3. **Série B = the frontier.** Almost nothing free; depth only via DIY CV.
   Painful, but nobody else has it → the moat (the Ginga Labs thesis, quantified).

## Consequence for the belief schema

This grid **is** the map of `test_strength`:
- World Cup beliefs → `strong` (real tracking/physical).
- League/Série A beliefs → mostly `proxy` (aggregates + xG, no event/tracking).
- Série B beliefs → `proxy` or DIY, flagged honestly.

## Phased data adoption

1. **Now:** API-Football (spine) + FIFA EFI (Seleção, full depth). Free.
2. **Brasileirão resumes:** add FBref (Série A xG/advanced).
3. **Calibration anytime:** StatsBomb open data (offline backtest).
4. **R&D / moat:** roboflow CV for the no-feed long tail (Série B, várzea).
