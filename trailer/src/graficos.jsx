// Gráficos procedurais do trailer — tudo desenhado em código, zero asset.
// A peça central é a PRANCHETA: o quadro-negro tático onde o lance vive.

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const GIZ = "#e8e3d3";
const LOUSA = "#11271a";

// ── grão de filme + vinheta: assenta tudo na mesma película ─────────
export const Pelicula = () => {
  const frame = useCurrentFrame();
  // o grão "anda" mudando o deslocamento do padrão a cada frame
  const dx = (frame * 47) % 200;
  const dy = (frame * 31) % 200;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.05 }}>
        <filter id="grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        </filter>
        <rect x={-dx} y={-dy} width="220%" height="220%" filter="url(#grao)" />
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ── VU de rádio: barras pulsando como medidor de transmissão AM ─────
export const VuRadio = ({ intensidade = 1, barras = 24 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 90 }}>
      {Array.from({ length: barras }, (_, i) => {
        const h =
          20 +
          Math.abs(Math.sin(frame * 0.31 + i * 1.7) * 0.6 + Math.sin(frame * 0.13 + i * 0.9) * 0.4) *
            70 *
            intensidade;
        return (
          <div
            key={i}
            style={{
              width: 14,
              height: h,
              background: i % 5 === 4 ? "#ffd447" : "#9a937f",
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
};

// ── A PRANCHETA: campo de giz com o lance desenhado ─────────────────
// O ponto (o menino) serpenteia passando pelos X (zagueiros) e chuta.
// `progresso` 0–1 controla o avanço do lance; os X apagam ao serem passados.
export const Prancheta = ({ progresso, opacidade = 1 }) => {
  // trajetória do drible em coordenadas do viewBox 1920×1080
  const PASSOS = [
    [330, 760], // recebe na ponta
    [620, 820], // conduz por fora
    [840, 640], // corta pra dentro (passa o X1)
    [1130, 720], // pedala (passa o X2)
    [1380, 560], // arma o chute
    [1700, 520], // a bola viaja pro gol
  ];
  const ZAGUEIROS = [
    [780, 700, 2 / 5], // apagado quando progresso passa de 2/5
    [1060, 660, 3 / 5],
  ];
  const t = Math.min(1, Math.max(0, progresso)) * (PASSOS.length - 1);
  const i = Math.min(PASSOS.length - 2, Math.floor(t));
  const f = t - i;
  const x = PASSOS[i][0] + (PASSOS[i + 1][0] - PASSOS[i][0]) * f;
  const y = PASSOS[i][1] + (PASSOS[i + 1][1] - PASSOS[i][1]) * f;
  const rastro = PASSOS.slice(0, i + 1)
    .concat([[x, y]])
    .map(([px, py], n) => `${n === 0 ? "M" : "L"} ${px} ${py}`)
    .join(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: LOUSA, opacity: opacidade }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {/* linhas de giz do campo: meio-campo, círculo central, grande área */}
        <g stroke={GIZ} strokeWidth="5" fill="none" opacity="0.35" strokeDasharray="14 10">
          <rect x="60" y="60" width="1800" height="960" rx="8" />
          <line x1="960" y1="60" x2="960" y2="1020" />
          <circle cx="960" cy="540" r="160" />
          <rect x="1620" y="330" width="240" height="420" />
          <rect x="60" y="330" width="240" height="420" />
        </g>
        {/* os zagueiros: X de giz que apagam quando driblados */}
        {ZAGUEIROS.map(([zx, zy, corte], n) => {
          const passado = progresso > corte;
          return (
            <g key={n} stroke="#c66" strokeWidth="10" opacity={passado ? 0.12 : 0.7} strokeLinecap="round">
              <line x1={zx - 32} y1={zy - 32} x2={zx + 32} y2={zy + 32} />
              <line x1={zx - 32} y1={zy + 32} x2={zx + 32} y2={zy - 32} />
            </g>
          );
        })}
        {/* o rastro do drible e o menino (a bolinha de giz amarelo) */}
        <path d={rastro} stroke="#ffd447" strokeWidth="7" fill="none" opacity="0.8" strokeDasharray="2 14" strokeLinecap="round" />
        <circle cx={x} cy={y} r="22" fill="#ffd447" />
        <circle cx={x} cy={y} r="34" fill="none" stroke="#ffd447" strokeWidth="3" opacity="0.4" />
      </svg>
    </AbsoluteFill>
  );
};

// ── placar de transmissão: o chip que ancora o GOL ──────────────────
export const Placar = ({ casa = "ALI", fora = "ATL", golsCasa = 1, golsFora = 0, minuto = 87, aparece = 1 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 26,
      border: "3px solid #9a937f",
      borderRadius: 10,
      padding: "16px 38px",
      fontFamily: "'Courier New', monospace",
      fontWeight: "bold",
      fontSize: 54,
      color: "#f2ead8",
      background: "rgba(13,15,12,0.85)",
      opacity: aparece,
      transform: `translateY(${(1 - aparece) * 30}px)`,
    }}
  >
    <span>{casa}</span>
    <span style={{ color: "#ffd447" }}>{golsCasa} × {golsFora}</span>
    <span>{fora}</span>
    <span style={{ color: "#9a937f", fontSize: 40 }}>{minuto}'</span>
  </div>
);
