// Renders the architecture diagram (plain SVG → PNG via resvg, no browser).
//   cd engine/diagram && npm install && node render.mjs
// Output: ../docs/arquitetura.png

import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const C = {
  bg: "#0d0f0c", paper: "#f2ead8", accent: "#ffd447", muted: "#9a937f", red: "#e0625a",
  data: "#16323f", flow: "#33291a", ctx: "#1b3a23", agent: "#371d2b", deliver: "#262138",
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const F = "DejaVu Sans, Arial, sans-serif";

const T = ({ x, y, t, size = 22, color = C.paper, weight = "normal", anchor = "start", rotate }) =>
  `<text x="${x}" y="${y}" font-family="${F}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}"${rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : ""}>${esc(t)}</text>`;
const box = ({ x, y, w, h, fill = "none", stroke = C.muted, dash = "", r = 10, sw = 2 }) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const card = ({ x, y, w, h, title, lines = [], titleColor = C.paper, stroke = C.muted, ts = 22 }) =>
  box({ x, y, w, h, fill: "#0d0f0c", stroke }) +
  T({ x: x + 18, y: y + 32, t: title, size: ts, weight: "bold", color: titleColor }) +
  lines.map((l, i) => T({ x: x + 18, y: y + 60 + i * 25, t: l, size: 18, color: C.muted })).join("");
const band = ({ x, y, w, h, label, fill }) =>
  box({ x, y, w, h, fill, stroke: "#2c2f29", r: 16 }) + T({ x: x + 22, y: y + 30, t: label, size: 20, weight: "bold", color: C.accent });
const arrow = ({ x1, y1, x2, y2, color = C.paper, w = 2.5, dash = "", head = "head" }) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${head})"/>`;

const parts = [];
const P = (s) => parts.push(s);

P(T({ x: 60, y: 60, t: "FOOTBALL BELIEF ENGINE", size: 40, weight: "bold", color: C.accent }));
P(T({ x: 60, y: 92, t: "personal exploration · leverage existing sources · learn the game · post cool content (charter.md)", size: 21, color: C.muted }));

// (1) DATA
P(band({ x: 40, y: 120, w: 1480, h: 178, label: "(1) DATA — existing sources, normalized", fill: C.data }));
P(card({ x: 66, y: 162, w: 272, h: 120, title: "API-Football", lines: ["fixtures, lineups,", "events, stats"], ts: 21 }));
P(card({ x: 348, y: 162, w: 272, h: 120, title: "FIFA EFI", lines: ["tracking-grade,", "free (World Cup)"], titleColor: C.accent, ts: 21 }));
P(card({ x: 630, y: 162, w: 272, h: 120, title: "FBref", lines: ["xG, advanced", "(Brasileirao)"], ts: 21 }));
P(card({ x: 912, y: 162, w: 272, h: 120, title: "ge.globo", lines: ["BR match data,", "lineups"], ts: 21 }));
P(card({ x: 1194, y: 162, w: 300, h: 120, title: "Expert accounts", lines: ["qualitative ->", "seed observations"], ts: 21 }));

// (2) WORKFLOWS
P(band({ x: 40, y: 330, w: 1480, h: 150, label: "(2) WORKFLOWS — deterministic, scheduled", fill: C.flow }));
P(card({ x: 66, y: 372, w: 380, h: 92, title: "Ingest & normalize", lines: ["fetch -> clean -> store"] }));
P(card({ x: 530, y: 372, w: 300, h: 92, title: "Pre-match  (cron)", lines: ["week of"], titleColor: C.accent }));
P(card({ x: 850, y: 372, w: 300, h: 92, title: "Matchday  (cron)", lines: ["lineups, result"], titleColor: C.accent }));
P(card({ x: 1170, y: 372, w: 324, h: 92, title: "Post-match  (cron)", lines: ["full stats land"], titleColor: C.accent }));

// (3) CONTEXT LAYER
P(band({ x: 40, y: 512, w: 1480, h: 236, label: "(3) CONTEXT LAYER — the repo · knowledge at 3 timescales", fill: C.ctx }));
P(box({ x: 40, y: 512, w: 1480, h: 236, fill: "none", stroke: C.accent, r: 16, sw: 2.5 }));
P(card({ x: 66, y: 556, w: 430, h: 150, stroke: C.accent, title: "CANON — timeless", lines: ["our understanding of the game:", "schools, eras, causal chains", "(Laranja Mecanica, tiki-taka...)"], titleColor: C.accent }));
P(card({ x: 516, y: 556, w: 360, h: 150, title: "DOSSIERS — seasonal", lines: ["a team's current", "identity & patterns"] }));
P(card({ x: 896, y: 556, w: 600, h: 150, title: "BELIEFS — per match", lines: ["falsifiable tested claims · micro (a team) +", "macro (era theses: 'era of the full-back')", "· Observation Log · History / Learning Ledger"] }));

// (4) AGENT
P(band({ x: 40, y: 780, w: 1480, h: 172, label: "(4) AGENT — non-deterministic · reasons FROM the Canon", fill: C.agent }));
P(card({ x: 66, y: 822, w: 400, h: 112, title: "1 · Observe", lines: ["data + Canon ->", "soft observations"] }));
P(card({ x: 556, y: 822, w: 420, h: 112, title: "2 · Operationalize + LOCK", lines: ["intuition -> metric,", "pre-registered before match"], titleColor: C.accent }));
P(card({ x: 1078, y: 822, w: 416, h: 112, title: "3 · Test & Revise", lines: ["post-lock data ratifies/rectifies", "-> write the mechanism (a-ha)"] }));
P(`<line x1="1028" y1="792" x2="1028" y2="942" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 6"/>`);
P(T({ x: 1028, y: 782, t: "LOCK · matchday — data arrives AFTER lock", size: 17, weight: "bold", color: C.red, anchor: "middle" }));

// (5) DELIVERY
P(band({ x: 40, y: 984, w: 1480, h: 150, label: "(5) DELIVERY", fill: C.deliver }));
P(card({ x: 66, y: 1026, w: 420, h: 92, title: "Briefings -> you", lines: ["pre-week · matchday · post-game"] }));
P(card({ x: 506, y: 1026, w: 640, h: 92, title: "Content -> X / Instagram", lines: ["threads · formation/pitch graphics · moment diagrams · cards"], titleColor: C.accent }));
P(card({ x: 1166, y: 1026, w: 328, h: 92, title: "Publish gate", lines: ["your approval before it goes out"], titleColor: C.red }));

// YOU
P(box({ x: 1545, y: 512, w: 335, h: 440, fill: "#1a1d18", stroke: C.accent, dash: "7 6", r: 16 }));
P(T({ x: 1712, y: 556, t: "YOU", size: 26, weight: "bold", color: C.accent, anchor: "middle" }));
P(T({ x: 1712, y: 584, t: "override · the prompt layer", size: 18, color: C.muted, anchor: "middle" }));
["• curate the Canon", "  (teach it the game)", "• approve the metric", "• inject / contest a belief", "• approve publishing"].forEach((t, i) =>
  P(T({ x: 1585, y: 648 + i * 38, t, size: 19, color: C.paper })));
P(T({ x: 1585, y: 872, t: "autonomous by default;", size: 16, color: C.muted }));
P(T({ x: 1585, y: 896, t: "you step in on disagreement.", size: 16, color: C.muted }));

// flow arrows
[[760, 298, 760, 328], [760, 480, 760, 510], [760, 748, 760, 778], [300, 952, 300, 982]].forEach(([x1, y1, x2, y2]) => P(arrow({ x1, y1, x2, y2 })));
P(arrow({ x1: 466, y1: 878, x2: 554, y2: 878, color: C.accent, head: "headY" }));
P(arrow({ x1: 976, y1: 878, x2: 1076, y2: 878, color: C.accent, head: "headY" }));
P(arrow({ x1: 1543, y1: 760, x2: 980, y2: 845, color: C.accent, dash: "6 5", head: "headY" }));
P(arrow({ x1: 1543, y1: 636, x2: 500, y2: 636, color: C.accent, dash: "6 5", head: "headY" }));
P(arrow({ x1: 896, y1: 600, x2: 500, y2: 600, color: C.accent, w: 2, head: "headY" }));
P(T({ x: 690, y: 592, t: "macro graduates >", size: 15, color: C.accent, anchor: "middle" }));

// learning loop
P(`<path d="M 1078 905 C 24 940, 24 660, 894 642" fill="none" stroke="${C.red}" stroke-width="3.5" marker-end="url(#headRed)"/>`);
P(T({ x: 66, y: 862, t: "LEARNING LOOP — beliefs sharpen every match", size: 22, weight: "bold", color: C.red, rotate: -90 }));

// footer
P(T({ x: 60, y: 1192, t: "Analysis model:", size: 20, weight: "bold", color: C.paper }));
P(T({ x: 250, y: 1192, t: "CONTEXT -> SYSTEM -> PLAYER PROFILE -> DATA SIGNATURE -> EDGE", size: 20, color: C.accent }));
P(T({ x: 1180, y: 1192, t: "· every tendency is a causal chain", size: 20, color: C.muted }));
P(T({ x: 60, y: 1224, t: "Discipline:", size: 20, weight: "bold", color: C.paper }));
P(T({ x: 215, y: 1224, t: "data only judges beliefs LOCKED before the match · the Canon keeps it grounded, the tests keep it honest", size: 20, color: C.muted }));

const defs = `<defs>
  <marker id="head" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${C.paper}"/></marker>
  <marker id="headRed" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${C.red}"/></marker>
  <marker id="headY" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="${C.accent}"/></marker>
</defs>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1320" width="1920" height="1320">
<rect width="1920" height="1320" fill="${C.bg}"/>${defs}${parts.join("\n")}</svg>`;

const png = new Resvg(svg, { fitTo: { mode: "width", value: 1920 }, font: { loadSystemFonts: true } }).render().asPng();
writeFileSync(new URL("../docs/arquitetura.png", import.meta.url), png);
console.log("wrote engine/docs/arquitetura.png");
