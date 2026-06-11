// Corte principal (40s, X/Twitter) — roteiro em docs/TRAILER.md.
// Um jogo de texto pede trailer de tipografia cinética: o texto É a imagem.
// Áudio: gerado por IA via ElevenLabs (gerar-audio.mjs) — locução, chiado,
// surdo e torcida ORIGINAL. Mapa segundo a segundo em src/audio.md.

import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Pelicula, Prancheta, VuRadio, Placar } from "./graficos.jsx";

export const FPS = 30;
const s = (seg) => Math.round(seg * FPS);
export const DURACAO_40S = s(40);

// mesmos tokens do teaser: uma identidade só
const COR = {
  fundo: "#0d0f0c",
  papel: "#f2ead8",
  destaque: "#ffd447",
  apagado: "#9a937f",
  perigo: "#c62828",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', monospace";

const Tela = ({ children, style }) => (
  <AbsoluteFill
    style={{
      backgroundColor: COR.fundo,
      justifyContent: "center",
      alignItems: "center",
      padding: 120,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// texto digitando, caractere a caractere — o gancho dos 2 primeiros segundos
const Digitado = ({ texto, comecaEm = 0, porSegundo = 28, tamanho = 72, cor = COR.papel }) => {
  const frame = useCurrentFrame();
  const visiveis = Math.max(0, Math.floor(((frame - comecaEm) / FPS) * porSegundo));
  const mostra = texto.slice(0, visiveis);
  const cursorAceso = Math.floor(frame / (FPS / 2)) % 2 === 0 && visiveis < texto.length + 20;
  return (
    <div style={{ fontFamily: SERIF, fontSize: tamanho, color: cor, textAlign: "center", lineHeight: 1.35, maxWidth: 1500 }}>
      {mostra}
      <span style={{ color: COR.destaque, opacity: cursorAceso ? 1 : 0 }}>▌</span>
    </div>
  );
};

// ── 0–3s · silêncio → chiado de rádio ───────────────────────────────
const Abertura = () => (
  <Tela>
    <Digitado texto="O país do futebol não pode comprar o maior jogo de futebol do mundo." porSegundo={30} />
  </Tela>
);

// ── 3–6s · chiado cresce ────────────────────────────────────────────
const Resposta = () => {
  const frame = useCurrentFrame();
  const escala = spring({ frame, fps: FPS, config: { damping: 14 } });
  return (
    <Tela>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 96,
          color: COR.destaque,
          textAlign: "center",
          transform: `scale(${escala})`,
          fontWeight: "bold",
        }}
      >
        Então fizemos um que nasceu aqui.
      </div>
    </Tela>
  );
};

// ── 6–12s · surdo entra, longe · a ficha do menino ──────────────────
const ATRIBUTOS = [
  ["GINGA", 18, COR.destaque],
  ["MARRA", 16, COR.destaque],
  ["FRIEZA", 8, COR.perigo],
];

const Ficha = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, s(6)], [1, 1.18], { extrapolateRight: "clamp" });
  return (
    <Tela>
      {/* a ficha é amassada: levemente torta, como saiu do bolso do olheiro */}
      <div style={{ transform: `scale(${zoom}) rotate(-1.6deg)` }}>
        <div style={{ fontFamily: MONO, fontSize: 38, color: COR.apagado, marginBottom: 30, textAlign: "center" }}>
          ficha do olheiro · escrita a lápis · 16 anos
        </div>
        <div style={{ border: `3px solid ${COR.apagado}`, borderRadius: 12, padding: "50px 90px" }}>
          {ATRIBUTOS.map(([nome, valor, cor], i) => {
            const aparece = spring({ frame: frame - s(1.2) * i - s(0.5), fps: FPS, config: { damping: 12 } });
            return (
              <div
                key={nome}
                style={{
                  fontFamily: MONO,
                  fontSize: 88,
                  color: cor,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 140,
                  opacity: aparece,
                  transform: `translateX(${(1 - aparece) * 60}px)`,
                  fontWeight: "bold",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: COR.papel }}>{nome}</span>
                <span>{valor}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Tela>
  );
};

// ── 12–20s · locutor tenso, baixo · a narração sobe ─────────────────
const LINHAS_NARRACAO = [
  "Torneio de várzea.",
  "O olheiro jurou que valia a pena.",
  "O menino pega na bola...",
];

const Narracao = () => {
  const frame = useCurrentFrame();
  return (
    <Tela style={{ alignItems: "flex-start" }}>
      {/* a transmissão de rádio respirando no rodapé */}
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 0.55 }}>
        <VuRadio intensidade={interpolate(frame, [0, s(8)], [0.5, 1])} />
      </div>
      <div style={{ borderLeft: `6px solid ${COR.destaque}`, paddingLeft: 60 }}>
        {LINHAS_NARRACAO.map((linha, i) => {
          const aparece = spring({ frame: frame - s(2.2) * i, fps: FPS, config: { damping: 13 } });
          return (
            <div
              key={linha}
              style={{
                fontFamily: SERIF,
                fontSize: 76,
                color: COR.papel,
                opacity: aparece,
                transform: `translateY(${(1 - aparece) * 40}px)`,
                lineHeight: 1.6,
              }}
            >
              {linha}
            </div>
          );
        })}
      </div>
    </Tela>
  );
};

// ── 20–28s · locutor EXPLODE + charanga · corte seco · GOL ──────────
const Lance = () => {
  const frame = useCurrentFrame();
  // três pancadas de texto, cada uma maior — depois 0,5s de PRETO — GOL
  const pancadas = [
    { texto: "PASSOU POR UM...", em: 0, tamanho: 110 },
    { texto: "PASSOU POR DOIS...", em: s(1.6), tamanho: 140 },
    { texto: "BATEEEEU...", em: s(3.2), tamanho: 180 },
  ];
  const inicioSilencio = s(5.05); // a locução do lance tem 5,04s: morre aqui
  const inicioGol = s(5.55);

  // a prancheta acompanha as pancadas: o giz dribla junto com o locutor
  const progresso = interpolate(
    frame,
    [0, s(1.6), s(3.2), inicioSilencio, inicioGol + s(0.4)],
    [0.08, 0.45, 0.62, 0.85, 1],
    { extrapolateRight: "clamp" }
  );

  if (frame >= inicioGol) {
    const tremor = Math.sin(frame * 2.1) * interpolate(frame, [inicioGol, inicioGol + s(1.2)], [14, 0], { extrapolateRight: "clamp" });
    const escala = spring({ frame: frame - inicioGol, fps: FPS, config: { damping: 9, stiffness: 140 } });
    const placarAparece = spring({ frame: frame - inicioGol - s(0.8), fps: FPS, config: { damping: 13 } });
    return (
      <Tela>
        <Prancheta progresso={progresso} opacidade={0.35} />
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: "bold",
            fontSize: 265, // cheio sem cortar o G e o L
            color: COR.destaque,
            transform: `scale(${escala}) translateX(${tremor}px)`,
            letterSpacing: "0.02em",
            textShadow: "0 0 80px rgba(255,212,71,0.45)",
            zIndex: 1,
          }}
        >
          GOOOOOOL
        </div>
        <div style={{ marginTop: 50, zIndex: 1 }}>
          <Placar aparece={placarAparece} />
        </div>
      </Tela>
    );
  }
  if (frame >= inicioSilencio) return <Tela />; // corte seco: preto e nada

  const atual = [...pancadas].reverse().find((p) => frame >= p.em);
  const desde = frame - (atual?.em ?? 0);
  const escala = spring({ frame: desde, fps: FPS, config: { damping: 10, stiffness: 160 } });
  return (
    <Tela>
      <Prancheta progresso={progresso} opacidade={0.5} />
      {atual && (
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: "bold",
            fontSize: atual.tamanho,
            color: COR.papel,
            transform: `scale(${escala})`,
            textAlign: "center",
            textShadow: "0 4px 40px rgba(0,0,0,0.8)",
            zIndex: 1,
          }}
        >
          {atual.texto}
        </div>
      )}
    </Tela>
  );
};

// ── 28–34s · coro da torcida (faixa original) · flashes de decisão ──
const DECISOES = [
  "Paga a passagem do menino?",
  "Vende pro empresário?",
  "A mãe dele quer sua opinião.",
];

const Decisoes = () => {
  const frame = useCurrentFrame();
  const porFlash = s(2);
  const i = Math.min(DECISOES.length - 1, Math.floor(frame / porFlash));
  const desde = frame - i * porFlash;
  const opacidade = interpolate(desde, [0, 4, porFlash - 6, porFlash], [0, 1, 1, 0]);
  return (
    <Tela>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 100,
          color: i === DECISOES.length - 1 ? COR.destaque : COR.papel,
          opacity: opacidade,
          textAlign: "center",
          fontStyle: "italic",
          maxWidth: 1500,
          lineHeight: 1.3,
        }}
      >
        {DECISOES[i]}
      </div>
    </Tela>
  );
};

// ── 34–40s · a música corta, só o surdo · o convite ─────────────────
const Convite = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const linhas = ["Jogue o primeiro capítulo.", "Grátis. No navegador. Agora."];
  // o surdo como coração: a URL pulsa
  const pulso = 1 + Math.max(0, Math.sin((frame / FPS) * Math.PI * 1.6)) * 0.03;
  return (
    <Tela>
      {linhas.map((l, i) => {
        const aparece = spring({ frame: frame - s(0.8) * i, fps: FPS, config: { damping: 13 } });
        return (
          <div key={l} style={{ fontFamily: SERIF, fontSize: 86, color: COR.papel, opacity: aparece, lineHeight: 1.5 }}>
            {l}
          </div>
        );
      })}
      <div
        style={{
          fontFamily: MONO,
          fontWeight: "bold",
          fontSize: 82, // URL do Pages é longa; domínio próprio fica pra depois
          color: COR.destaque,
          marginTop: 70,
          transform: `scale(${pulso})`,
        }}
      >
        fabianlima-lab.github.io/ginga-labs
      </div>
    </Tela>
  );
};

const som = (arquivo) => staticFile(`audio/${arquivo}`);

export const Trailer = () => (
  <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
    <Sequence from={s(0)} durationInFrames={s(3)}><Abertura /></Sequence>
    <Sequence from={s(3)} durationInFrames={s(3)}><Resposta /></Sequence>
    <Sequence from={s(6)} durationInFrames={s(6)}><Ficha /></Sequence>
    <Sequence from={s(12)} durationInFrames={s(8)}><Narracao /></Sequence>
    <Sequence from={s(20)} durationInFrames={s(8)}><Lance /></Sequence>
    <Sequence from={s(28)} durationInFrames={s(6)}><Decisoes /></Sequence>
    <Sequence from={s(34)} durationInFrames={s(6)}><Convite /></Sequence>

    {/* ── trilha (ElevenLabs, gerar-audio.mjs) ── */}
    {/* 0–6s: silêncio → chiado de rádio subindo */}
    <Sequence from={s(0)} durationInFrames={s(6)}>
      <Audio src={som("sfx-chiado.mp3")} volume={(f) => interpolate(f, [0, s(2), s(6)], [0.05, 0.25, 0.7])} />
    </Sequence>
    {/* 6–12s: surdo entra, longe */}
    <Sequence from={s(6)} durationInFrames={s(6)}>
      <Audio src={som("sfx-surdo-longe.mp3")} volume={0.55} />
    </Sequence>
    {/* 12–20s: locutor tenso + surdo seguindo baixinho */}
    <Sequence from={s(12)} durationInFrames={s(8)}>
      <Audio src={som("locucao-narracao.mp3")} volume={0.95} />
      <Audio src={som("sfx-surdo-longe.mp3")} volume={0.2} />
    </Sequence>
    {/* 20–25.05s: o locutor explode (a locução tem 5,04s: morre no corte seco) */}
    <Sequence from={s(20)} durationInFrames={s(5.05)}>
      <Audio src={som("locucao-lance.mp3")} volume={1} />
    </Sequence>
    {/* 25.05–25.55s: SILÊNCIO ABSOLUTO (nenhuma faixa toca aqui) */}
    {/* 25.55s: GOL + torcida explodindo, segue sob as decisões e corta aos 34s */}
    <Sequence from={s(25.55)} durationInFrames={s(1.9)}>
      <Audio src={som("locucao-gol.mp3")} volume={1} />
    </Sequence>
    <Sequence from={s(25.55)} durationInFrames={s(8.45)}>
      <Audio src={som("sfx-torcida.mp3")} volume={(f) => interpolate(f, [0, s(0.4), s(7.4), s(8.45)], [0.9, 0.75, 0.65, 0])} />
    </Sequence>
    {/* 34–40s: só o surdo, como coração batendo */}
    <Sequence from={s(34)} durationInFrames={s(6)}>
      <Audio src={som("sfx-surdo-coracao.mp3")} volume={0.7} />
    </Sequence>

    {/* grão de filme + vinheta por cima de tudo: uma película só */}
    <Pelicula />
  </AbsoluteFill>
);
