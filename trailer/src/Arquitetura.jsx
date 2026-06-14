// System architecture diagram, authored as SVG and rendered to PNG via
// `remotion still`. One-off design artifact — not part of any video.

import { AbsoluteFill } from "remotion";

const C = {
  bg: "#0d0f0c",
  paper: "#f2ead8",
  accent: "#ffd447",
  muted: "#9a937f",
  red: "#e0625a",
  data: "#16323f",
  flow: "#33291a",
  ctx: "#1b3a23",
  agent: "#371d2b",
  deliver: "#262138",
};
const SANS = "Arial, Helvetica, sans-serif";

const Box = ({ x, y, w, h, fill = "none", stroke = C.muted, dash, r = 10 }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash} />
);

const T = ({ x, y, children, size = 22, color = C.paper, weight = "normal", anchor = "start", mono }) => (
  <text x={x} y={y} fontFamily={mono ? "'Courier New', monospace" : SANS} fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor}>
    {children}
  </text>
);

// box with a bold title + muted sub-lines
const Card = ({ x, y, w, h, fill, stroke, title, lines = [], titleColor = C.paper }) => (
  <g>
    <Box x={x} y={y} w={w} h={h} fill={fill} stroke={stroke ?? C.muted} />
    <T x={x + 20} y={y + 34} size={24} weight="bold" color={titleColor}>{title}</T>
    {lines.map((l, i) => (
      <T key={i} x={x + 20} y={y + 64 + i * 26} size={19} color={C.muted}>{l}</T>
    ))}
  </g>
);

const Band = ({ x, y, w, h, label, fill }) => (
  <g>
    <Box x={x} y={y} w={w} h={h} fill={fill} stroke="#2c2f29" r={16} />
    <T x={x + 22} y={y + 30} size={20} weight="bold" color={C.accent}>{label}</T>
  </g>
);

const Arrow = ({ x1, y1, x2, y2, color = C.paper, w = 2.5, dash }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} markerEnd="url(#head)" strokeDasharray={dash} />
);

export const Arquitetura = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <svg viewBox="0 0 1920 1280" width="100%" height="100%">
      <defs>
        <marker id="head" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
          <path d="M0,0 L12,6 L0,12 z" fill={C.paper} />
        </marker>
      </defs>

      {/* title */}
      <T x={60} y={62} size={40} weight="bold" color={C.accent}>FOOTBALL BELIEF-REVISION ENGINE</T>
      <T x={60} y={94} size={22} color={C.muted}>Flamengo + Seleção first · the context layer compounds every match</T>

      {/* ① DATA */}
      <Band x={40} y={120} w={1480} h={150} label="① DATA LAYER — external, normalized" fill={C.data} />
      <Card x={70} y={158} w={440} h={96} fill="#0d0f0c" title="FBref / advanced stats" lines={["xG, chance creation, passing"]} />
      <Card x={540} y={158} w={440} h={96} fill="#0d0f0c" title="API-Football" lines={["fixtures, lineups, events, odds"]} />
      <Card x={1010} y={158} w={480} h={96} fill="#0d0f0c" title="News RSS (ge.globo…)" lines={["injuries, probable XI"]} />

      {/* ② WORKFLOWS */}
      <Band x={40} y={310} w={1480} h={160} label="② WORKFLOWS — deterministic, scheduled" fill={C.flow} />
      <Card x={70} y={350} w={420} h={100} fill="#0d0f0c" title="Ingest & normalize" lines={["fetch → clean → store"]} />
      <Card x={540} y={350} w={300} h={100} fill="#0d0f0c" title="⏱ Pre-match" lines={["week of the game"]} titleColor={C.accent} />
      <Card x={860} y={350} w={300} h={100} fill="#0d0f0c" title="⏱ Matchday" lines={["lineups, live, result"]} titleColor={C.accent} />
      <Card x={1180} y={350} w={310} h={100} fill="#0d0f0c" title="⏱ Post-match" lines={["full stats land"]} titleColor={C.accent} />

      {/* ③ CONTEXT LAYER — the heart */}
      <Band x={40} y={510} w={1480} h={210} label="③ CONTEXT LAYER — the repo · the heart" fill={C.ctx} />
      <rect x={40} y={510} width={1480} height={210} rx={16} fill="none" stroke={C.accent} strokeWidth={2.5} />
      <Card x={70} y={552} w={340} h={146} fill="#0d0f0c" title="Observation Log" lines={["soft notes", "free capture, no metric"]} />
      <Card x={430} y={552} w={340} h={146} fill="#0d0f0c" stroke={C.accent} title="Belief Bank" lines={["falsifiable claims", "schema + locked tests"]} titleColor={C.accent} />
      <Card x={790} y={552} w={340} h={146} fill="#0d0f0c" title="Team Dossiers" lines={["tactical identity", "players, patterns"]} />
      <Card x={1150} y={552} w={340} h={146} fill="#0d0f0c" title="History / Learning Ledger" lines={["every revision", "+ the a-ha (mechanism)"]} />

      {/* ④ AGENT */}
      <Band x={40} y={760} w={1480} h={190} label="④ AGENT — non-deterministic reasoning" fill={C.agent} />
      <Card x={70} y={800} w={400} h={130} fill="#0d0f0c" title="1 · Observe" lines={["data + watching →", "soft observations"]} />
      <Card x={560} y={800} w={420} h={130} fill="#0d0f0c" title="2 · Operationalize + LOCK" lines={["intuition → metric", "pre-registered before match"]} titleColor={C.accent} />
      <Card x={1080} y={800} w={410} h={130} fill="#0d0f0c" title="3 · Test & Revise" lines={["post-lock data ratifies/", "rectifies → write mechanism"]} />

      {/* lock marker between 2 and 3 */}
      <line x1={1030} y1={770} x2={1030} y2={940} stroke={C.red} strokeWidth={2} strokeDasharray="6 6" />
      <T x={1030} y={760} size={18} weight="bold" color={C.red} anchor="middle">🔒 matchday — data arrives AFTER lock</T>

      {/* ⑤ DELIVERY */}
      <Band x={40} y={990} w={1480} h={150} label="⑤ DELIVERY — downstream consumers" fill={C.deliver} />
      <Card x={70} y={1028} w={620} h={92} fill="#0d0f0c" title="Briefings → you" lines={["pre-week · matchday · post-game"]} />
      <Card x={730} y={1028} w={760} h={92} fill="#0d0f0c" title="Content workflow → tweets / videos" lines={["authored from a-ha revisions — substance, not filler"]} titleColor={C.accent} />

      {/* YOU — override actor (right column) */}
      <Box x={1560} y={510} w={320} h={440} fill="#1a1d18" stroke={C.accent} dash="7 6" r={16} />
      <T x={1720} y={556} size={26} weight="bold" color={C.accent} anchor="middle">YOU</T>
      <T x={1720} y={586} size={19} color={C.muted} anchor="middle">override · the prompt layer</T>
      <T x={1600} y={650} size={19} color={C.paper}>• approve the metric</T>
      <T x={1600} y={684} size={19} color={C.paper}>• inject a belief</T>
      <T x={1600} y={718} size={19} color={C.paper}>• contest with the data</T>
      <T x={1600} y={752} size={19} color={C.paper}>• set the scope</T>
      <T x={1600} y={820} size={17} color={C.muted}>kicks in only when</T>
      <T x={1600} y={844} size={17} color={C.muted}>you disagree — the</T>
      <T x={1600} y={868} size={17} color={C.muted}>rest runs autonomous</T>

      {/* vertical main flow arrows (down the centre) */}
      <Arrow x1={760} y1={270} x2={760} y2={308} />
      <Arrow x1={760} y1={470} x2={760} y2={508} />
      <Arrow x1={760} y1={720} x2={760} y2={758} />
      <Arrow x1={380} y1={950} x2={380} y2={988} />

      {/* agent pipeline arrows */}
      <Arrow x1={470} y1={865} x2={558} y2={865} color={C.accent} />
      <Arrow x1={980} y1={865} x2={1078} y2={865} color={C.accent} />

      {/* YOU → operationalize, YOU → belief bank */}
      <Arrow x1={1558} y1={760} x2={985} y2={820} color={C.accent} dash="6 5" />
      <Arrow x1={1558} y1={620} x2={772} y2={620} color={C.accent} dash="6 5" />

      {/* a-ha revisions → content */}
      <Arrow x1={1285} y1={930} x2={1110} y2={1026} color={C.accent} />

      {/* LEARNING LOOP — big back-edge on the left from Test&Revise up to Belief Bank */}
      <path d="M 1080 880 C 20 900, 20 600, 428 612" fill="none" stroke={C.red} strokeWidth={3.5} markerEnd="url(#headRed)" />
      <marker id="headRed" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
        <path d="M0,0 L12,6 L0,12 z" fill={C.red} />
      </marker>
      <T x={70} y={745} size={22} weight="bold" color={C.red} transform="rotate(-90 70 745)">↻ LEARNING LOOP — beliefs sharpen every match</T>

      {/* footer discipline */}
      <T x={60} y={1192} size={21} weight="bold" color={C.paper}>Discipline:</T>
      <T x={185} y={1192} size={21} color={C.muted}>data only judges beliefs LOCKED before the match (no hindsight)   ·   confidence(belief) ≠ strength(test)   ·   capture cheap, revision rigorous</T>
    </svg>
  </AbsoluteFill>
);
